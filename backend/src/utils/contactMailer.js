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
  return `CM-${String(id).padStart(5, "0")}`;
}

/**
 * Build branded HTML and text for Customer Thank You Email
 */
function buildCustomerThankYouEmail({ id, name, email, phone, subject: userSubject, message }) {
  const safeName = escapeHtml(name);
  const firstName = escapeHtml(name.trim().split(" ")[0] || "there");
  const safePhone = phone ? escapeHtml(phone) : "";
  const safeSubject = userSubject ? escapeHtml(userSubject) : "General Inquiry";
  const safeMessage = escapeHtml(message);
  const ref = formatReference(id);

  const mailSubject = "Thank you for contacting Hariputhran Enterprises";

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

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${mailSubject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:#1e293b;-webkit-text-size-adjust:100%;">
  <div style="background-color:#f1f5f9;padding:24px 12px;">
    <div style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 12px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
      
      <!-- Brand Header -->
      <div style="background-color:#082342;padding:24px 24px 20px;text-align:left;border-bottom:3px solid #f97316;">
        <div style="font-size:10.5px;font-weight:800;letter-spacing:2px;color:#f97316;text-transform:uppercase;font-family:monospace;margin-bottom:6px;">
          HARIPUTHRAN ENTERPRISES
        </div>
        <h1 style="color:#ffffff;font-size:20px;margin:0;font-weight:700;line-height:1.2;">
          Message Received
        </h1>
      </div>

      <!-- Main Body -->
      <div style="padding:24px 24px 20px;line-height:1.6;font-size:14px;color:#334155;">
        <p style="margin-top:0;font-size:15px;color:#0f172a;">
          Hi <strong>${firstName}</strong>,
        </p>
        <p style="margin-bottom:20px;color:#475569;">
          Thank you for contacting us. We have received your message and our team will get back to you within 24 hours.
        </p>

        <!-- Summary Card -->
        <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0284c7;border-radius:6px;padding:16px;margin:20px 0;">
          <div style="font-size:11px;font-weight:700;letter-spacing:1px;color:#0284c7;text-transform:uppercase;margin-bottom:10px;font-family:monospace;">
            MESSAGE SUMMARY
          </div>
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr>
              <td style="padding:4px 0;color:#64748b;width:100px;vertical-align:top;">Reference:</td>
              <td style="padding:4px 0;font-family:monospace;font-weight:700;color:#082342;">${ref}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Subject:</td>
              <td style="padding:4px 0;color:#0f172a;font-weight:600;">${safeSubject}</td>
            </tr>
            ${
              safePhone
                ? `<tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Phone:</td>
              <td style="padding:4px 0;color:#0f172a;">+91 ${safePhone}</td>
            </tr>`
                : ""
            }
            <tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Message:</td>
              <td style="padding:4px 0;white-space:pre-wrap;color:#334155;">${safeMessage}</td>
            </tr>
          </table>
        </div>

        <p style="font-size:13px;color:#475569;margin-top:20px;margin-bottom:0;">
          Need to add something? Simply reply to this email.
        </p>
      </div>

      <!-- Footer -->
      <div style="background-color:#f8fafc;border-top:1px solid #e2e8f0;padding:16px 24px;font-size:11.5px;color:#64748b;text-align:left;">
        <p style="margin:0 0 6px 0;">
          This is an automated confirmation. If you did not send this message, you can ignore this email.
        </p>
        <p style="margin:0;color:#94a3b8;font-size:11px;">
          &copy; ${new Date().getFullYear()} Hariputhran Enterprises &bull; Underground Infrastructure & Civil Engineering Contractors
        </p>
      </div>

    </div>
  </div>
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
  const safeSubject = userSubject ? escapeHtml(userSubject) : "General Inquiry";
  const safeMessage = escapeHtml(message);
  const ref = formatReference(id);

  const subject = `[New Contact Message] ${ref} from ${name}`;

  const text =
    `NEW CONTACT MESSAGE\n\n` +
    `Reference: ${ref}\n` +
    `Name: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: ${phone ? "+91 " + phone : "Not provided"}\n` +
    `Subject: ${userSubject || "General Inquiry"}\n\n` +
    `Message:\n${message}\n\n` +
    `Log into the admin portal to manage this message.`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${subject}</title>
</head>
<body style="margin:0;padding:0;background-color:#f1f5f9;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
  <div style="background-color:#f1f5f9;padding:24px 12px;">
    <div style="max-width:520px;margin:0 auto;background-color:#ffffff;border-radius:12px;overflow:hidden;border:1px solid #e2e8f0;">
      
      <div style="background-color:#082342;padding:20px 24px;border-bottom:3px solid #f97316;">
        <div style="font-size:11px;font-weight:bold;letter-spacing:1.5px;color:#f97316;font-family:monospace;text-transform:uppercase;">
          HARIPUTHRAN ENTERPRISES &bull; ADMIN ALERT
        </div>
        <h2 style="color:#ffffff;font-size:18px;margin:4px 0 0 0;">
          New Contact Message
        </h2>
      </div>

      <div style="padding:24px;font-size:14px;color:#334155;">
        <div style="background-color:#f8fafc;border:1px solid #e2e8f0;border-radius:8px;padding:16px;margin-bottom:16px;">
          <table style="width:100%;border-collapse:collapse;font-size:13px;">
            <tr>
              <td style="padding:4px 0;color:#64748b;width:90px;">Reference:</td>
              <td style="padding:4px 0;font-family:monospace;font-weight:700;color:#082342;">${ref}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;">Name:</td>
              <td style="padding:4px 0;font-weight:600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;">Email:</td>
              <td style="padding:4px 0;"><a href="mailto:${safeEmail}" style="color:#0284c7;text-decoration:none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;">Phone:</td>
              <td style="padding:4px 0;">${phone ? `<a href="tel:+91${safePhone}" style="color:#082342;font-weight:bold;text-decoration:none;">+91 ${safePhone}</a>` : "Not provided"}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;">Subject:</td>
              <td style="padding:4px 0;color:#0f172a;font-weight:600;">${safeSubject}</td>
            </tr>
            <tr>
              <td style="padding:6px 0 2px;color:#64748b;vertical-align:top;">Message:</td>
              <td style="padding:6px 0 2px;white-space:pre-wrap;color:#334155;">${safeMessage}</td>
            </tr>
          </table>
        </div>

        <p style="font-size:12px;color:#64748b;margin-bottom:0;">
          Received via Hariputhran Enterprises website contact form.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Send customer thank you email
 */
async function sendCustomerThankYouEmail(payload) {
  if (process.env.MAIL_DRY_RUN === "true") {
    console.log("dry run: mail not sent");
    return { dryRun: true };
  }

  const { subject, text, html } = buildCustomerThankYouEmail(payload);
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

  if (process.env.MAIL_DRY_RUN === "true") {
    console.log("dry run: mail not sent");
    return { dryRun: true };
  }

  const { subject, text, html } = buildAdminAlertEmail(payload);
  const transporter = createTransporter();

  return transporter.sendMail({
    from: process.env.MAIL_FROM,
    to: adminEmail,
    replyTo: payload.email,
    subject,
    text,
    html,
  });
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
