const crypto = require("crypto");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const {
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendEmailChangedNotice,
  sendNewEmailWelcome,
} = require("../utils/mailer");

// Helper: Password strength validator
function validatePasswordStrength(password) {
  if (!password || typeof password !== "string") {
    return { isValid: false, message: "Password is required." };
  }

  const missing = [];
  if (password.length < 8) {
    missing.push("at least 8 characters");
  }
  if (!/[A-Z]/.test(password)) {
    missing.push("at least one uppercase letter");
  }
  if (!/[a-z]/.test(password)) {
    missing.push("at least one lowercase letter");
  }
  if (!/[0-9]/.test(password)) {
    missing.push("at least one number");
  }
  if (!/[!@#$%^&*(),.?":{}|<>_\-+=[\]\\\/]/.test(password)) {
    missing.push("at least one special character (!@#$%^&*...)");
  }

  if (missing.length > 0) {
    return {
      isValid: false,
      message: `Password must contain ${missing.join(", ")}.`,
    };
  }

  return { isValid: true };
}

// Helper: Email format validator
function isValidEmail(email) {
  return typeof email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());
}

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: "Email and password are required" });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query("SELECT * FROM admins WHERE email = $1", [normalizedEmail]);
    if (result.rows.length === 0) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      success: true,
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.error("Login error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// GET /api/auth/me (Protected)
const me = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, created_at, updated_at FROM admins WHERE id = $1",
      [req.user.id]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin not found" });
    }

    const admin = result.rows[0];
    return res.json({
      success: true,
      user: {
        id: admin.id,
        name: admin.username,
        email: admin.email,
      },
    });
  } catch (err) {
    console.error("Get me error:", err.message);
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

// POST /api/auth/forgot-password
const forgotPassword = async (req, res) => {
  const genericMessage =
    "If an account exists for that email, a password reset link has been sent.";

  try {
    const { email } = req.body;
    if (!email || !isValidEmail(email)) {
      // Return 200 generic message to prevent email format probing
      return res.json({ success: true, message: genericMessage });
    }

    const normalizedEmail = email.trim().toLowerCase();
    const result = await pool.query(
      "SELECT id, username, email FROM admins WHERE email = $1",
      [normalizedEmail]
    );

    if (result.rows.length > 0) {
      const admin = result.rows[0];

      // Clean up / invalidate previous unused reset tokens for this admin
      await pool.query(
        "DELETE FROM password_resets WHERE admin_id = $1",
        [admin.id]
      );

      // Generate secure 32-byte hex token and its SHA-256 hash
      const rawToken = crypto.randomBytes(32).toString("hex");
      const tokenHash = crypto.createHash("sha256").update(rawToken).digest("hex");

      // Insert reset record expiring in 15 minutes
      await pool.query(
        "INSERT INTO password_resets (admin_id, token_hash, expires_at) VALUES ($1, $2, NOW() + INTERVAL '15 minutes')",
        [admin.id, tokenHash]
      );

      // Construct frontend reset link
      const frontendBaseUrl = (process.env.FRONTEND_URL || "https://hariputhranenterprises.com").replace(/\/+$/, "");
      const resetLink = `${frontendBaseUrl}/reset-password?token=${rawToken}`;

      // Dispatch branded reset email
      try {
        await sendPasswordResetEmail(admin.email, resetLink);
      } catch (mailErr) {
        console.error("Mailer sendPasswordResetEmail error:", mailErr.message);
        // Do not leak email failure to client
      }
    }

    return res.json({ success: true, message: genericMessage });
  } catch (err) {
    console.error("forgotPassword error:", err.message);
    // Generic response to avoid revealing internal errors
    return res.json({ success: true, message: genericMessage });
  }
};

// POST /api/auth/reset-password
const resetPassword = async (req, res) => {
  const client = await pool.connect();

  try {
    const { token, newPassword, confirmPassword } = req.body;

    if (!token || typeof token !== "string") {
      return res.status(400).json({
        success: false,
        message: "Reset token is required.",
      });
    }

    if (!newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide both new password and confirmation.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.isValid) {
      return res.status(400).json({
        success: false,
        message: strength.message,
      });
    }

    // Compute SHA-256 hash of provided token
    const tokenHash = crypto.createHash("sha256").update(token).digest("hex");

    // Look for active valid reset token
    const tokenQuery = await client.query(
      `SELECT pr.id, pr.admin_id, pr.expires_at, a.email, a.username 
       FROM password_resets pr
       JOIN admins a ON a.id = pr.admin_id
       WHERE pr.token_hash = $1 AND pr.used_at IS NULL AND pr.expires_at > NOW()`,
      [tokenHash]
    );

    if (tokenQuery.rows.length === 0) {
      return res.status(400).json({
        success: false,
        message: "This reset link is invalid or has expired. Please request a new one.",
      });
    }

    const resetRow = tokenQuery.rows[0];

    // Begin database transaction
    await client.query("BEGIN");

    // Hash new password with bcrypt 12 rounds
    const newHash = await bcrypt.hash(newPassword, 12);

    // Update admin password hash and updated_at
    await client.query(
      "UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [newHash, resetRow.admin_id]
    );

    // Mark current reset token as used
    await client.query(
      "UPDATE password_resets SET used_at = NOW() WHERE id = $1",
      [resetRow.id]
    );

    // Invalidate all other reset rows for this admin
    await client.query(
      "DELETE FROM password_resets WHERE admin_id = $1 AND id != $2",
      [resetRow.admin_id, resetRow.id]
    );

    await client.query("COMMIT");

    // Send security notification email
    try {
      await sendPasswordChangedEmail(resetRow.email);
    } catch (mailErr) {
      console.error("Mailer sendPasswordChangedEmail error:", mailErr.message);
    }

    return res.json({
      success: true,
      message: "Password reset successful. You can now sign in.",
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("resetPassword error:", err.message);
    return res.status(500).json({ success: false, message: "Server error during password reset." });
  } finally {
    client.release();
  }
};

// PUT /api/auth/change-password (Protected)
const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword, confirmPassword } = req.body;

    if (!currentPassword || !newPassword || !confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "Please provide current password, new password, and confirmation.",
      });
    }

    if (newPassword !== confirmPassword) {
      return res.status(400).json({
        success: false,
        message: "New password and confirm password do not match.",
      });
    }

    if (newPassword === currentPassword) {
      return res.status(400).json({
        success: false,
        message: "New password cannot be the same as your current password.",
      });
    }

    const strength = validatePasswordStrength(newPassword);
    if (!strength.isValid) {
      return res.status(400).json({
        success: false,
        message: strength.message,
      });
    }

    // Retrieve admin from database
    const adminQuery = await pool.query(
      "SELECT id, username, email, password_hash FROM admins WHERE id = $1",
      [req.user.id]
    );

    if (adminQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin account not found." });
    }

    const admin = adminQuery.rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    // Hash new password with 12 rounds
    const newHash = await bcrypt.hash(newPassword, 12);

    await pool.query(
      "UPDATE admins SET password_hash = $1, updated_at = NOW() WHERE id = $2",
      [newHash, admin.id]
    );

    // Send confirmation email
    try {
      await sendPasswordChangedEmail(admin.email);
    } catch (mailErr) {
      console.error("Mailer sendPasswordChangedEmail error:", mailErr.message);
    }

    return res.json({
      success: true,
      message: "Password updated successfully.",
    });
  } catch (err) {
    console.error("changePassword error:", err.message);
    return res.status(500).json({ success: false, message: "Server error while changing password." });
  }
};

// PUT /api/auth/change-email (Protected)
const changeEmail = async (req, res) => {
  try {
    const { newEmail, currentPassword } = req.body;

    if (!newEmail || !currentPassword) {
      return res.status(400).json({
        success: false,
        message: "New email and current password are required.",
      });
    }

    if (!isValidEmail(newEmail)) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address.",
      });
    }

    const normalizedNewEmail = newEmail.trim().toLowerCase();

    // Retrieve admin
    const adminQuery = await pool.query(
      "SELECT id, username, email, password_hash FROM admins WHERE id = $1",
      [req.user.id]
    );

    if (adminQuery.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Admin account not found." });
    }

    const admin = adminQuery.rows[0];

    // Verify current password
    const isMatch = await bcrypt.compare(currentPassword, admin.password_hash);
    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect.",
      });
    }

    if (normalizedNewEmail === admin.email.toLowerCase()) {
      return res.status(400).json({
        success: false,
        message: "New email cannot be the same as your current email.",
      });
    }

    // Check if new email is already used by another account
    const emailCheck = await pool.query(
      "SELECT id FROM admins WHERE email = $1 AND id != $2",
      [normalizedNewEmail, admin.id]
    );

    if (emailCheck.rows.length > 0) {
      return res.status(409).json({
        success: false,
        message: "This email is already in use by another account.",
      });
    }

    const oldEmail = admin.email;

    // Update email in DB
    await pool.query(
      "UPDATE admins SET email = $1, updated_at = NOW() WHERE id = $2",
      [normalizedNewEmail, admin.id]
    );

    // Send notifications to old and new emails
    try {
      await sendEmailChangedNotice(oldEmail, normalizedNewEmail);
      await sendNewEmailWelcome(normalizedNewEmail);
    } catch (mailErr) {
      console.error("Mailer change-email notification error:", mailErr.message);
    }

    // Issue refreshed JWT token
    const newToken = jwt.sign(
      { id: admin.id, email: normalizedNewEmail },
      process.env.JWT_SECRET,
      { expiresIn: "8h" }
    );

    return res.json({
      success: true,
      message: "Email updated successfully.",
      token: newToken,
      user: {
        id: admin.id,
        name: admin.username,
        email: normalizedNewEmail,
      },
    });
  } catch (err) {
    console.error("changeEmail error:", err.message);
    return res.status(500).json({ success: false, message: "Server error while changing email." });
  }
};

module.exports = {
  login,
  me,
  forgotPassword,
  resetPassword,
  changePassword,
  changeEmail,
  validatePasswordStrength,
};
