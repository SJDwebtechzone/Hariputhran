const nodemailer = require("nodemailer");

function createTransporter() {
  const port = Number(process.env.SMTP_PORT) || 587;

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port,
    secure: port === 465, // 465 = SSL, 587 = STARTTLS
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
}

function escapeHtml(str) {
  if (str === null || str === undefined) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function formatDateIST(date = new Date()) {
  const d = date instanceof Date ? date : new Date(date);
  return (
    d.toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    }) + " IST"
  );
}

async function sendMail({ to, subject, text, html, replyTo }) {
  if (process.env.MAIL_DRY_RUN === "true") {
    console.log(`[mailer dry-run] subject: ${subject}`);
    return { dryRun: true, messageId: "dry-run-" + Date.now() };
  }
  const transporter = createTransporter();
  const mailOptions = {
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
  };
  if (replyTo && typeof replyTo === "string" && replyTo.trim()) {
    mailOptions.replyTo = replyTo.trim();
  }
  return transporter.sendMail(mailOptions);
}

/**
 * Build HTML and plain text for Password Reset Email
 */
function buildPasswordResetEmail(to, resetLink) {
  const safeTo = escapeHtml(to);
  const safeResetLink = escapeHtml(resetLink);
  const subject = "Reset your Hariputhran Admin Portal password";
  const preheader = "We received a request to reset your admin portal password.";

  const text =
    `We received a request to reset your admin portal password.\n\n` +
    `Account: ${to}\n` +
    `Open this link to choose a new password (valid for 15 minutes):\n${resetLink}\n\n` +
    `If you did not request this, you can safely ignore this email. Your password will not change.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-cell {
        padding: 24px 16px !important;
      }
      .header-cell {
        padding: 20px 16px !important;
      }
      .btn-link {
        display: block !important;
        width: 100% !important;
        box-sizing: border-box !important;
        text-align: center !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;-webkit-font-smoothing:antialiased;">
  <!-- Hidden Preheader -->
  <div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${preheader} &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;width:100%;margin:0;padding:24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 6px 18px rgba(15,23,42,0.06);table-layout:fixed;">
          <!-- Header -->
          <tr>
            <td class="header-cell" style="background-color:#082342;padding:26px 28px;border-bottom:3px solid #f97316;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="color:#f97316;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">HARIPUTHRAN ENTERPRISES</div>
                    <div style="color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;margin:0;">Admin Security</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-cell" style="padding:28px 28px 32px;font-size:14px;line-height:1.6;color:#334155;">
              <h2 style="margin:0 0 14px;color:#082342;font-size:18px;font-weight:700;">Reset Your Password</h2>
              
              <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.6;">
                We received a request to reset the password for your administrator account (<b style="color:#082342;word-break:break-word;overflow-wrap:anywhere;">${safeTo}</b>). Click the button below to choose a new password.
              </p>

              <!-- Bulletproof Button -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="margin:24px 0;">
                <tr>
                  <td align="center">
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0">
                      <tr>
                        <td align="center" style="border-radius:8px;background-color:#f97316;">
                          <a href="${safeResetLink}" target="_blank" class="btn-link" style="font-size:15px;font-weight:700;color:#ffffff;text-decoration:none;padding:14px 28px;border-radius:8px;background-color:#f97316;border:1px solid #f97316;display:inline-block;box-shadow:0 3px 8px rgba(249,115,22,0.35);">
                            Reset Password
                          </a>
                        </td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Notice Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f8fafc;border-left:4px solid #0284c7;border-radius:6px;margin:20px 0;">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;line-height:1.5;color:#334155;">
                    <strong style="color:#082342;">Time Sensitive:</strong> This password reset link is valid for <strong>15 minutes</strong> and can be used only once.
                  </td>
                </tr>
              </table>

              <p style="margin:20px 0 8px;font-size:13px;color:#64748b;line-height:1.5;">
                If the button above does not work, copy and paste this link into your browser:
              </p>
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:6px;padding:10px 12px;font-size:12px;line-height:1.4;word-break:break-all;overflow-wrap:anywhere;color:#0284c7;">
                <a href="${safeResetLink}" style="color:#0284c7;text-decoration:underline;">${safeResetLink}</a>
              </div>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 20px;">

              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                If you did not request a password reset, you can safely ignore this email. Your password will not change.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
                Hariputhran Enterprises Infrastructure &amp; Civil Contractors &bull; Admin Security
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Build HTML and plain text for Password Changed Alert Email
 */
function buildPasswordChangedEmail(to) {
  const safeTo = escapeHtml(to);
  const changeTime = formatDateIST(new Date());
  const subject = "Security Alert: Password Changed \u2014 Hariputhran Admin Portal";
  const preheader = "Security notice: Your Hariputhran Admin Portal password has been updated.";

  const text =
    `Your Hariputhran Admin Portal password was successfully changed on ${changeTime}.\n\n` +
    `Account: ${to}\n\n` +
    `If you made this change, you can safely disregard this notice.\n\n` +
    `If you did NOT make this change, please contact administration immediately.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-cell {
        padding: 24px 16px !important;
      }
      .header-cell {
        padding: 20px 16px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;-webkit-font-smoothing:antialiased;">
  <!-- Hidden Preheader -->
  <div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${preheader} &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;width:100%;margin:0;padding:24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 6px 18px rgba(15,23,42,0.06);table-layout:fixed;">
          <!-- Header -->
          <tr>
            <td class="header-cell" style="background-color:#082342;padding:26px 28px;border-bottom:3px solid #f97316;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="color:#f97316;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">HARIPUTHRAN ENTERPRISES</div>
                    <div style="color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;margin:0;">Security Alert</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-cell" style="padding:28px 28px 32px;font-size:14px;line-height:1.6;color:#334155;">
              <h2 style="margin:0 0 14px;color:#082342;font-size:18px;font-weight:700;">Password Changed Successfully</h2>
              
              <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.6;">
                The password for your administrator account (<b style="color:#082342;word-break:break-word;overflow-wrap:anywhere;">${safeTo}</b>) was successfully changed on <strong style="color:#082342;">${changeTime}</strong>.
              </p>

              <!-- Info Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f0fdf4;border-left:4px solid #16a34a;border-radius:6px;margin:20px 0;">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;line-height:1.5;color:#166534;">
                    If you performed this action, no further steps are required.
                  </td>
                </tr>
              </table>

              <!-- Warning Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fef2f2;border-left:4px solid #ef4444;border-radius:6px;margin:20px 0;">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;line-height:1.5;color:#991b1b;font-weight:600;">
                    If you did NOT make this change, please contact administration immediately to secure your account.
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 20px;">

              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                This automated security notification was sent by Hariputhran Enterprises Admin Portal.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
                Hariputhran Enterprises Infrastructure &amp; Civil Contractors &bull; Admin Security
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Build HTML and plain text for Email Changed Notice (sent to old email)
 */
function buildEmailChangedNoticeEmail(oldEmail, newEmail) {
  const safeOldEmail = escapeHtml(oldEmail);
  const safeNewEmail = escapeHtml(newEmail);
  const changeTime = formatDateIST(new Date());
  const subject = "Security Alert: Admin Email Address Changed";
  const preheader = "Security notice: Your Hariputhran Admin Portal email address has been changed.";

  const text =
    `Your Hariputhran Admin Portal account email was changed from ${oldEmail} to ${newEmail} on ${changeTime}.\n\n` +
    `If you did not authorize this change, please contact administration immediately.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-cell {
        padding: 24px 16px !important;
      }
      .header-cell {
        padding: 20px 16px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;-webkit-font-smoothing:antialiased;">
  <!-- Hidden Preheader -->
  <div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${preheader} &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;width:100%;margin:0;padding:24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 6px 18px rgba(15,23,42,0.06);table-layout:fixed;">
          <!-- Header -->
          <tr>
            <td class="header-cell" style="background-color:#082342;padding:26px 28px;border-bottom:3px solid #f97316;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="color:#f97316;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">HARIPUTHRAN ENTERPRISES</div>
                    <div style="color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;margin:0;">Security Alert</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-cell" style="padding:28px 28px 32px;font-size:14px;line-height:1.6;color:#334155;">
              <h2 style="margin:0 0 14px;color:#082342;font-size:18px;font-weight:700;">Account Email Updated</h2>
              
              <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.6;">
                The primary email for your administrator account was updated from <b style="color:#082342;word-break:break-word;overflow-wrap:anywhere;">${safeOldEmail}</b> to <b style="color:#082342;word-break:break-word;overflow-wrap:anywhere;">${safeNewEmail}</b> on <strong style="color:#082342;">${changeTime}</strong>.
              </p>

              <!-- Warning Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#fef2f2;border-left:4px solid #ef4444;border-radius:6px;margin:20px 0;">
                <tr>
                  <td style="padding:12px 16px;font-size:13px;line-height:1.5;color:#991b1b;font-weight:600;">
                    If you did not request this update, someone may have accessed your account. Please contact technical support or administration immediately.
                  </td>
                </tr>
              </table>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 20px;">

              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                This security notice was sent to the previously registered address to protect your account.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
                Hariputhran Enterprises Infrastructure &amp; Civil Contractors &bull; Admin Security
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Build HTML and plain text for New Email Welcome (sent to new email)
 */
function buildNewEmailWelcomeEmail(newEmail) {
  const safeNewEmail = escapeHtml(newEmail);
  const subject = "Welcome to your updated Hariputhran Admin Account";
  const preheader = "Your Hariputhran Admin Portal account is now associated with this email address.";

  const text =
    `Your Hariputhran Admin Portal account is now associated with this email address (${newEmail}).\n\n` +
    `You can now use this email address to sign in to the admin portal and receive operational alerts.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${escapeHtml(subject)}</title>
  <style type="text/css">
    body, table, td, p, a, li, blockquote {
      -webkit-text-size-adjust: 100%;
      -ms-text-size-adjust: 100%;
    }
    table, td {
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      -ms-interpolation-mode: bicubic;
      border: 0;
      outline: none;
      text-decoration: none;
    }
    @media only screen and (max-width: 480px) {
      .email-container {
        width: 100% !important;
        max-width: 100% !important;
      }
      .content-cell {
        padding: 24px 16px !important;
      }
      .header-cell {
        padding: 20px 16px !important;
      }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;-webkit-font-smoothing:antialiased;">
  <!-- Hidden Preheader -->
  <div style="display:none;font-size:1px;color:#f1f5f9;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;mso-hide:all;">
    ${preheader} &#847; &zwnj; &nbsp; &#8199; &shy;
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color:#f1f5f9;width:100%;margin:0;padding:24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Card Container -->
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" class="email-container" style="max-width:560px;background-color:#ffffff;border-radius:14px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 6px 18px rgba(15,23,42,0.06);table-layout:fixed;">
          <!-- Header -->
          <tr>
            <td class="header-cell" style="background-color:#082342;padding:26px 28px;border-bottom:3px solid #f97316;">
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%">
                <tr>
                  <td>
                    <div style="color:#f97316;font-size:11px;font-weight:700;letter-spacing:1.5px;text-transform:uppercase;margin-bottom:6px;">HARIPUTHRAN ENTERPRISES</div>
                    <div style="color:#ffffff;font-size:20px;font-weight:700;line-height:1.3;margin:0;">Admin Portal</div>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Content -->
          <tr>
            <td class="content-cell" style="padding:28px 28px 32px;font-size:14px;line-height:1.6;color:#334155;">
              <h2 style="margin:0 0 14px;color:#082342;font-size:18px;font-weight:700;">New Email Confirmed</h2>
              
              <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.6;">
                This email address (<b style="color:#082342;word-break:break-word;overflow-wrap:anywhere;">${safeNewEmail}</b>) is now registered as the primary login for your Hariputhran Admin Portal account.
              </p>

              <p style="margin:0 0 16px;color:#334155;font-size:14px;line-height:1.6;">
                You can now use this email address to sign in, receive lead notifications, and manage portal administrative settings.
              </p>

              <!-- Divider -->
              <hr style="border:none;border-top:1px solid #e2e8f0;margin:28px 0 20px;">

              <p style="margin:0;font-size:12px;color:#94a3b8;line-height:1.5;">
                Hariputhran Enterprises Infrastructure &amp; Civil Contractors &bull; Admin Support
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;text-align:center;">
              <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">
                Hariputhran Enterprises Infrastructure &amp; Civil Contractors &bull; Admin Security
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject, text, html };
}

async function sendPasswordResetEmail(to, resetLink) {
  const { subject, text, html } = buildPasswordResetEmail(to, resetLink);
  return sendMail({ to, subject, text, html });
}

async function sendPasswordChangedEmail(to) {
  const { subject, text, html } = buildPasswordChangedEmail(to);
  return sendMail({ to, subject, text, html });
}

async function sendEmailChangedNotice(oldEmail, newEmail) {
  const { subject, text, html } = buildEmailChangedNoticeEmail(oldEmail, newEmail);
  return sendMail({ to: oldEmail, subject, text, html });
}

async function sendNewEmailWelcome(newEmail) {
  const { subject, text, html } = buildNewEmailWelcomeEmail(newEmail);
  return sendMail({ to: newEmail, subject, text, html });
}

module.exports = {
  sendMail,
  buildPasswordResetEmail,
  buildPasswordChangedEmail,
  buildEmailChangedNoticeEmail,
  buildNewEmailWelcomeEmail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendEmailChangedNotice,
  sendNewEmailWelcome,
};