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

function formatReference(id) {
  if (!id) return "CM-NEW";
  return `CM-${String(id).padStart(5, "0")}`;
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

/**
 * Build branded HTML and text for Customer Thank You Email
 */
function buildCustomerThankYouEmail({ id, name, email, phone, subject: userSubject, message }) {
  const safeName = escapeHtml(name);
  const firstName = escapeHtml(name.trim().split(" ")[0] || "there");
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : "";
  const safePhoneDigits = phone ? String(phone).replace(/\D/g, "") : "";
  const safeSubject = userSubject ? escapeHtml(userSubject) : "General Inquiry";
  const safeMessage = escapeHtml(message);
  const ref = formatReference(id);

  const mailSubject = "Thank you for contacting Hariputhran Enterprises";
  const preheader = "We have received your message.";

  const text =
    `Hi ${name.trim().split(" ")[0] || "there"},\n\n` +
    `Thank you for contacting us. We have received your message and our team will get back to you within 24 hours.\n\n` +
    `MESSAGE SUMMARY\n` +
    `Reference: ${ref}\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    (phone ? `Phone: +91 ${phone}\n` : "") +
    (userSubject ? `Subject: ${userSubject}\n` : "") +
    `Message: ${message}\n\n` +
    `Need to add something? Simply reply to this email.\n\n` +
    `This is an automated confirmation. If you did not send this message, you can ignore this email.\n\n` +
    `Hariputhran Enterprises`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${mailSubject}</title>
  <style>
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .stack-row { display: block !important; width: 100% !important; }
      .stack-label { display: block !important; width: 100% !important; padding: 4px 0 2px 0 !important; font-size: 11px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; color: #64748b !important; }
      .stack-value { display: block !important; width: 100% !important; padding: 0 0 10px 0 !important; font-size: 14px !important; color: #082342 !important; word-break: break-word !important; overflow-wrap: anywhere !important; }
      .card-pad { padding: 24px 16px !important; }
      .hdr-pad { padding: 22px 18px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preheader preview text -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f4f7fb;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f7fb;table-layout:fixed;">
    <tr>
      <td align="center" style="padding:24px 12px;background:#f4f7fb;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 6px 20px rgba(8,35,66,0.06);table-layout:fixed;">
          
          <!-- Brand Header -->
          <tr>
            <td class="hdr-pad" style="background:#082342;padding:26px 30px;border-bottom:3px solid #f97316;text-align:left;">
              <div style="color:#f97316;font-size:11.5px;letter-spacing:1.5px;font-weight:bold;text-transform:uppercase;line-height:1.4;">
                HARIPUTHRAN ENTERPRISES
              </div>
              <div style="color:#ffffff;font-size:22px;font-weight:bold;line-height:1.3;margin-top:6px;letter-spacing:-0.3px;">
                Message Received <span style="white-space:nowrap;color:#38bdf8;font-size:15px;font-weight:bold;">• ${ref}</span>
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td class="card-pad" style="padding:28px 30px;line-height:1.6;font-size:14px;color:#334155;text-align:left;">
              <p style="margin:0 0 12px;font-size:15px;color:#082342;font-weight:bold;">
                Hi ${firstName},
              </p>
              <p style="margin:0 0 20px;color:#334155;font-size:14px;line-height:1.6;">
                Thank you for contacting us. We have received your message and our team will get back to you within 24 hours.
              </p>

              <!-- Summary Card -->
              <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0284c7;border-radius:8px;padding:16px 18px;margin:20px 0;">
                <div style="font-size:11px;font-weight:bold;color:#0284c7;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                  MESSAGE SUMMARY
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;font-size:13px;">
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Reference:</td>
                    <td class="stack-value" style="padding:5px 0;font-weight:bold;color:#082342;font-family:monospace;white-space:nowrap;">${ref}</td>
                  </tr>
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Subject:</td>
                    <td class="stack-value" style="padding:5px 0;font-weight:600;color:#0f172a;word-break:break-word;overflow-wrap:anywhere;">${safeSubject}</td>
                  </tr>
                  ${
                    safePhone
                      ? `<tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Phone:</td>
                    <td class="stack-value" style="padding:5px 0;color:#0f172a;"><a href="tel:+91${safePhoneDigits}" style="color:#082342;font-weight:bold;text-decoration:none;white-space:nowrap;">+91 ${safePhone}</a></td>
                  </tr>`
                      : ""
                  }
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:6px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Message:</td>
                    <td class="stack-value" style="padding:6px 0 5px;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;color:#334155;">${safeMessage}</td>
                  </tr>
                </table>
              </div>

              <p style="color:#475569;font-size:13px;margin:20px 0 0;line-height:1.5;">
                Need to add something? Simply reply to this email.
              </p>

              <hr style="border:none;border-top:1px solid #e2e8f0;margin:22px 0 16px;">
              <p style="font-size:11.5px;color:#94a3b8;margin:0;line-height:1.5;">
                This is an automated confirmation. If you did not send this message, you can ignore this email.
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;

  return { subject: mailSubject, text, html };
}

/**
 * Build Admin Notification Email
 */
function buildAdminAlertEmail({ id, name, email, phone, subject: userSubject, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safePhone = phone ? escapeHtml(phone) : "Not provided";
  const safePhoneDigits = phone ? String(phone).replace(/\D/g, "") : "";
  const safeSubject = userSubject ? escapeHtml(userSubject) : "General Inquiry";
  const safeMessage = escapeHtml(message);
  const ref = formatReference(id);
  const receivedIST = formatDateIST();

  const subject = `[New Contact Message] ${ref} from ${name}`;
  const preheader = `New contact message from ${safeName} - ${ref}`;

  const text =
    `NEW CONTACT MESSAGE\n\n` +
    `Reference: ${ref}\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone ? "+91 " + phone : "Not provided"}\n` +
    `Subject: ${userSubject || "General Inquiry"}\n\n` +
    `Message:\n${message}\n\n` +
    `Log into the admin portal to manage this message.`;

  const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="color-scheme" content="light">
  <meta name="supported-color-schemes" content="light">
  <title>${subject}</title>
  <style>
    body, table, td, p, a, li, blockquote { -webkit-text-size-adjust: 100%; -ms-text-size-adjust: 100%; }
    table, td { mso-table-lspace: 0pt; mso-table-rspace: 0pt; }
    img { -ms-interpolation-mode: bicubic; border: 0; height: auto; line-height: 100%; outline: none; text-decoration: none; }
    @media only screen and (max-width: 480px) {
      .stack-row { display: block !important; width: 100% !important; }
      .stack-label { display: block !important; width: 100% !important; padding: 4px 0 2px 0 !important; font-size: 11px !important; text-transform: uppercase !important; letter-spacing: 0.5px !important; color: #64748b !important; }
      .stack-value { display: block !important; width: 100% !important; padding: 0 0 10px 0 !important; font-size: 14px !important; color: #082342 !important; word-break: break-word !important; overflow-wrap: anywhere !important; }
      .card-pad { padding: 24px 16px !important; }
      .hdr-pad { padding: 22px 18px !important; }
    }
  </style>
</head>
<body style="margin:0;padding:0;background-color:#f4f7fb;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <!-- Preheader preview text -->
  <div style="display:none;max-height:0;overflow:hidden;mso-hide:all;font-size:1px;line-height:1px;color:#f4f7fb;">
    ${preheader}
  </div>

  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background:#f4f7fb;table-layout:fixed;">
    <tr>
      <td align="center" style="padding:24px 12px;background:#f4f7fb;">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width:560px;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 6px 20px rgba(8,35,66,0.06);table-layout:fixed;">
          
          <!-- Brand Header -->
          <tr>
            <td class="hdr-pad" style="background:#082342;padding:26px 30px;border-bottom:3px solid #f97316;text-align:left;">
              <div style="color:#f97316;font-size:11.5px;letter-spacing:1.5px;font-weight:bold;text-transform:uppercase;line-height:1.4;">
                HARIPUTHRAN ENTERPRISES
              </div>
              <div style="display:inline-block;background:rgba(249,115,22,0.15);border:1px solid rgba(249,115,22,0.4);color:#f97316;font-size:10px;font-weight:bold;letter-spacing:1px;padding:2px 8px;border-radius:999px;text-transform:uppercase;margin-top:6px;">
                ADMIN ALERT
              </div>
              <div style="color:#ffffff;font-size:22px;font-weight:bold;line-height:1.3;margin-top:6px;letter-spacing:-0.3px;">
                New Contact Message <span style="white-space:nowrap;color:#38bdf8;font-size:15px;font-weight:bold;">• ${ref}</span>
              </div>
            </td>
          </tr>

          <!-- Main Body -->
          <tr>
            <td class="card-pad" style="padding:28px 30px;font-size:14px;line-height:1.6;color:#334155;text-align:left;">
              <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #f97316;border-radius:8px;padding:16px 18px;margin-bottom:18px;">
                <div style="font-size:11px;font-weight:bold;color:#f97316;text-transform:uppercase;letter-spacing:1px;margin-bottom:10px;">
                  MESSAGE DETAILS
                </div>
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="border-collapse:collapse;table-layout:fixed;font-size:13px;">
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Reference:</td>
                    <td class="stack-value" style="padding:5px 0;font-weight:bold;color:#082342;font-family:monospace;white-space:nowrap;">${ref}</td>
                  </tr>
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Received:</td>
                    <td class="stack-value" style="padding:5px 0;color:#334155;font-size:12.5px;">${receivedIST}</td>
                  </tr>
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Name:</td>
                    <td class="stack-value" style="padding:5px 0;font-weight:600;color:#0f172a;word-break:break-word;overflow-wrap:anywhere;">${safeName}</td>
                  </tr>
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Email:</td>
                    <td class="stack-value" style="padding:5px 0;word-break:break-word;overflow-wrap:anywhere;"><a href="mailto:${safeEmail}" style="color:#0284c7;text-decoration:none;word-break:break-all;">${safeEmail}</a></td>
                  </tr>
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Phone:</td>
                    <td class="stack-value" style="padding:5px 0;">${phone ? `<a href="tel:+91${safePhoneDigits}" style="color:#082342;font-weight:bold;text-decoration:none;white-space:nowrap;">+91 ${safePhone}</a>` : "Not provided"}</td>
                  </tr>
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:5px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Subject:</td>
                    <td class="stack-value" style="padding:5px 0;color:#0f172a;font-weight:600;word-break:break-word;overflow-wrap:anywhere;">${safeSubject}</td>
                  </tr>
                  <tr class="stack-row">
                    <td class="stack-label" style="padding:6px 12px 5px 0;color:#64748b;width:110px;vertical-align:top;">Message:</td>
                    <td class="stack-value" style="padding:6px 0 5px;white-space:pre-wrap;word-break:break-word;overflow-wrap:anywhere;color:#334155;">${safeMessage}</td>
                  </tr>
                </table>
              </div>

              <p style="font-size:12px;color:#64748b;margin:0;line-height:1.5;">
                Received via the Hariputhran Enterprises website - Contact page.
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
 * Send customer thank you email
 */
async function sendCustomerThankYouEmail(payload) {
  const { subject, text, html } = buildCustomerThankYouEmail(payload);

  if (process.env.MAIL_DRY_RUN === "true") {
    console.log(`[mailer dry-run] subject: ${subject}`);
    return { dryRun: true };
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: payload.email,
    subject,
    text,
    html,
  };

  if (process.env.ADMIN_NOTIFY_EMAIL && process.env.ADMIN_NOTIFY_EMAIL.trim()) {
    mailOptions.replyTo = process.env.ADMIN_NOTIFY_EMAIL.trim();
  }

  return transporter.sendMail(mailOptions);
}

/**
 * Send admin alert email
 */
async function sendAdminNotificationEmail(payload) {
  const adminEmail = process.env.ADMIN_NOTIFY_EMAIL ? process.env.ADMIN_NOTIFY_EMAIL.trim() : null;
  if (!adminEmail) {
    return { skipped: true };
  }

  const { subject, text, html } = buildAdminAlertEmail(payload);

  if (process.env.MAIL_DRY_RUN === "true") {
    console.log(`[mailer dry-run] subject: ${subject}`);
    return { dryRun: true };
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: process.env.MAIL_FROM,
    to: adminEmail,
    subject,
    text,
    html,
  };

  if (payload.email && typeof payload.email === "string" && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(payload.email.trim())) {
    mailOptions.replyTo = payload.email.trim();
  }

  return transporter.sendMail(mailOptions);
}

module.exports = {
  createTransporter,
  escapeHtml,
  formatReference,
  buildCustomerThankYouEmail,
  buildAdminAlertEmail,
  sendCustomerThankYouEmail,
  sendAdminNotificationEmail,
};
