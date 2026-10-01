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
  });
}

async function sendMail({ to, subject, text, html }) {
  const transporter = createTransporter();
  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to,
    subject,
    text,
    html,
  });
}

async function sendPasswordResetEmail(to, resetLink) {
  const subject = "Reset your Hariputhran Admin Portal password";

  const text =
    `We received a request to reset your admin portal password.\n\n` +
    `Open this link to choose a new password (valid for 15 minutes):\n${resetLink}\n\n` +
    `If you did not request this, you can safely ignore this email.`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f7fb;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      <div style="background:#082342;padding:24px 32px;">
        <div style="color:#f97316;font-size:12px;letter-spacing:2px;font-weight:bold;">HARIPUTHRAN ENTERPRISES</div>
        <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;">Admin Portal</div>
      </div>
      <div style="padding:32px;color:#1e293b;font-size:15px;line-height:1.6;">
        <h2 style="margin:0 0 12px;color:#082342;">Reset your password</h2>
        <p>We received a request to reset the password for your admin account.
           Click the button below to choose a new password.</p>
        <p style="text-align:center;margin:28px 0;">
          <a href="${resetLink}"
             style="background:#f97316;color:#ffffff;text-decoration:none;font-weight:bold;
                    padding:14px 28px;border-radius:10px;display:inline-block;box-shadow:0 4px 12px rgba(249,115,22,0.3);">
            Reset Password
          </a>
        </p>
        <p style="font-size:13px;color:#64748b;">This link is valid for <b>15 minutes</b> and can be used only once.</p>
        <p style="font-size:13px;color:#64748b;">If the button does not work, copy and paste this link into your browser:<br>
           <span style="word-break:break-all;color:#0284c7;">${resetLink}</span></p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="font-size:12px;color:#94a3b8;">If you did not request this, you can safely ignore this email. Your password will not change.</p>
      </div>
    </div>
  </div>`;

  return sendMail({ to, subject, text, html });
}

async function sendPasswordChangedEmail(to) {
  const changeTime = new Date().toUTCString();
  const subject = "Security Alert: Password Changed — Hariputhran Admin Portal";

  const text =
    `Your Hariputhran Admin Portal password was successfully changed at ${changeTime}.\n\n` +
    `If you made this change, you can safely disregard this notice.\n\n` +
    `If you did NOT make this change, please contact support or administration immediately.`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f7fb;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      <div style="background:#082342;padding:24px 32px;">
        <div style="color:#f97316;font-size:12px;letter-spacing:2px;font-weight:bold;">HARIPUTHRAN ENTERPRISES</div>
        <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;">Admin Portal</div>
      </div>
      <div style="padding:32px;color:#1e293b;font-size:15px;line-height:1.6;">
        <h2 style="margin:0 0 12px;color:#082342;">Password Changed Successfully</h2>
        <p>The password for your administrator account <b>(${to})</b> was updated on <b>${changeTime}</b>.</p>
        <div style="background:#f8fafc;border-left:4px solid #0284c7;padding:14px;border-radius:6px;margin:20px 0;font-size:14px;color:#334155;">
          If you performed this action, no further steps are required.
        </div>
        <p style="font-size:13px;color:#ef4444;font-weight:bold;">
          If you did NOT make this change, please contact administration immediately to secure your account.
        </p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="font-size:12px;color:#94a3b8;">Hariputhran Enterprises Infrastructure & Civil Contractors</p>
      </div>
    </div>
  </div>`;

  return sendMail({ to, subject, text, html });
}

async function sendEmailChangedNotice(oldEmail, newEmail) {
  const changeTime = new Date().toUTCString();
  const subject = "Security Alert: Admin Email Address Changed";

  const text =
    `Your Hariputhran Admin Portal account email was changed from ${oldEmail} to ${newEmail} on ${changeTime}.\n\n` +
    `If you did not authorize this change, please contact administration immediately.`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f7fb;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      <div style="background:#082342;padding:24px 32px;">
        <div style="color:#f97316;font-size:12px;letter-spacing:2px;font-weight:bold;">HARIPUTHRAN ENTERPRISES</div>
        <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;">Admin Portal</div>
      </div>
      <div style="padding:32px;color:#1e293b;font-size:15px;line-height:1.6;">
        <h2 style="margin:0 0 12px;color:#082342;">Account Email Updated</h2>
        <p>The primary email for your administrator account was updated from <b>${oldEmail}</b> to <b>${newEmail}</b> on ${changeTime}.</p>
        <div style="background:#fef2f2;border-left:4px solid #ef4444;padding:14px;border-radius:6px;margin:20px 0;font-size:14px;color:#991b1b;">
          If you did not request this update, someone may have accessed your account. Please contact technical support immediately.
        </div>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="font-size:12px;color:#94a3b8;">Hariputhran Enterprises Infrastructure & Civil Contractors</p>
      </div>
    </div>
  </div>`;

  return sendMail({ to: oldEmail, subject, text, html });
}

async function sendNewEmailWelcome(newEmail) {
  const subject = "Welcome to your updated Hariputhran Admin Account";

  const text =
    `Your Hariputhran Admin Portal account is now associated with this email address (${newEmail}).\n\n` +
    `You can now use this email address to sign in to the admin portal.`;

  const html = `
  <div style="font-family:Arial,Helvetica,sans-serif;background:#f4f7fb;padding:32px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      <div style="background:#082342;padding:24px 32px;">
        <div style="color:#f97316;font-size:12px;letter-spacing:2px;font-weight:bold;">HARIPUTHRAN ENTERPRISES</div>
        <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;">Admin Portal</div>
      </div>
      <div style="padding:32px;color:#1e293b;font-size:15px;line-height:1.6;">
        <h2 style="margin:0 0 12px;color:#082342;">New Email Confirmed</h2>
        <p>This email address <b>(${newEmail})</b> is now set as the primary login for your Hariputhran Admin Portal account.</p>
        <p>You can use this email to log in and receive operational notifications.</p>
        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="font-size:12px;color:#94a3b8;">Hariputhran Enterprises Infrastructure & Civil Contractors</p>
      </div>
    </div>
  </div>`;

  return sendMail({ to: newEmail, subject, text, html });
}

module.exports = {
  sendMail,
  sendPasswordResetEmail,
  sendPasswordChangedEmail,
  sendEmailChangedNotice,
  sendNewEmailWelcome,
};