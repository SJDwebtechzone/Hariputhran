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
  return `SR-${String(id).padStart(5, "0")}`;
}

/**
 * Build branded HTML and text for Customer Confirmation Email
 */
function buildCustomerConfirmationEmail({ id, serviceName, name, email, phone, message }) {
  const safeName = escapeHtml(name);
  const firstName = escapeHtml(name.trim().split(" ")[0] || "there");
  const safeServiceName = escapeHtml(serviceName);
  const safePhone = escapeHtml(phone);
  const safeMessage = message ? escapeHtml(message) : "";
  const ref = formatReference(id);

  const subject = `Thank you for choosing ${serviceName} | Hariputhran Enterprises`;

  const text =
    `Hi ${name.trim().split(" ")[0] || "there"},\n\n` +
    `Thank you for choosing ${serviceName}. We have received your request and our team will contact you shortly on +91 ${phone}.\n\n` +
    `REQUEST SUMMARY\n` +
    `Reference: ${ref}\n` +
    `Service: ${serviceName}\n` +
    `Name: ${name}\n` +
    `Mobile: +91 ${phone}\n` +
    (message ? `Message: ${message}\n\n` : `\n`) +
    `Need to add something? Simply reply to this email.\n\n` +
    `This is an automated confirmation. If you did not make this request, you can ignore this email.\n\n` +
    `Hariputhran Enterprises`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;-webkit-font-smoothing:antialiased;">
  <div style="background:#f4f7fb;padding:32px 16px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background:#082342;padding:26px 32px;text-align:left;">
        <div style="color:#f97316;font-size:11px;letter-spacing:2px;font-weight:bold;text-transform:uppercase;">HARIPUTHRAN ENTERPRISES</div>
        <div style="color:#ffffff;font-size:22px;font-weight:bold;margin-top:6px;letter-spacing:-0.5px;">Service Request Received</div>
      </div>

      <!-- Main Body -->
      <div style="padding:32px;color:#1e293b;font-size:14px;line-height:1.6;">
        <p style="margin-top:0;font-size:15px;color:#082342;font-weight:bold;">Hi ${firstName},</p>
        <p style="color:#334155;">
          Thank you for choosing <strong>${safeServiceName}</strong>. We have received your request and our team will contact you shortly on <strong>+91 ${safePhone}</strong>.
        </p>

        <!-- Summary Box -->
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #0284c7;border-radius:8px;padding:18px 20px;margin:24px 0;">
          <div style="font-size:11px;font-weight:bold;color:#64748b;text-transform:uppercase;letter-spacing:1px;margin-bottom:12px;">Request Summary</div>
          <table style="width:100%;font-size:13px;color:#1e293b;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;color:#64748b;width:110px;vertical-align:top;">Reference:</td>
              <td style="padding:4px 0;font-weight:bold;color:#082342;">${ref}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Service:</td>
              <td style="padding:4px 0;font-weight:600;">${safeServiceName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Name:</td>
              <td style="padding:4px 0;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Mobile:</td>
              <td style="padding:4px 0;">+91 ${safePhone}</td>
            </tr>
            ${
              safeMessage
                ? `<tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Message:</td>
              <td style="padding:4px 0;white-space:pre-wrap;color:#475569;">${safeMessage}</td>
            </tr>`
                : ""
            }
          </table>
        </div>

        <p style="color:#475569;font-size:13px;margin-bottom:24px;">
          Need to add something? Simply reply to this email.
        </p>

        <hr style="border:none;border-top:1px solid #e2e8f0;margin:24px 0;">
        <p style="font-size:11.5px;color:#94a3b8;margin-bottom:0;line-height:1.5;">
          This is an automated confirmation. If you did not make this request, you can ignore this email.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Build branded HTML and text for Admin Alert Email
 */
function buildAdminAlertEmail({ id, serviceName, name, email, phone, message }) {
  const safeName = escapeHtml(name);
  const safeEmail = escapeHtml(email);
  const safeServiceName = escapeHtml(serviceName);
  const safePhone = escapeHtml(phone);
  const safeMessage = message ? escapeHtml(message) : "";
  const ref = formatReference(id);

  const subject = `[New Request ${ref}] ${serviceName} - ${name}`;

  const text =
    `New service request received from website:\n\n` +
    `Reference: ${ref}\n` +
    `Customer: ${name}\n` +
    `Email: ${email}\n` +
    `Phone: +91 ${phone}\n` +
    `Service: ${serviceName}\n` +
    (message ? `Message:\n${message}\n\n` : `\n`) +
    `Log into the admin portal to manage this request.`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <title>${escapeHtml(subject)}</title>
</head>
<body style="margin:0;padding:0;background:#f4f7fb;font-family:Arial,Helvetica,sans-serif;">
  <div style="background:#f4f7fb;padding:32px 16px;">
    <div style="max-width:520px;margin:0 auto;background:#ffffff;border-radius:16px;overflow:hidden;border:1px solid #e2e8f0;box-shadow:0 10px 25px rgba(0,0,0,0.05);">
      
      <!-- Header -->
      <div style="background:#082342;padding:24px 32px;text-align:left;">
        <div style="color:#f97316;font-size:11px;letter-spacing:2px;font-weight:bold;text-transform:uppercase;">HARIPUTHRAN ADMIN ALERT</div>
        <div style="color:#ffffff;font-size:20px;font-weight:bold;margin-top:6px;">New Service Request • ${ref}</div>
      </div>

      <!-- Main Body -->
      <div style="padding:28px 32px;color:#1e293b;font-size:14px;line-height:1.6;">
        <div style="background:#f8fafc;border:1px solid #e2e8f0;border-left:4px solid #f97316;border-radius:8px;padding:18px 20px;margin-bottom:20px;">
          <table style="width:100%;font-size:13px;color:#1e293b;border-collapse:collapse;">
            <tr>
              <td style="padding:4px 0;color:#64748b;width:100px;vertical-align:top;">Service:</td>
              <td style="padding:4px 0;font-weight:bold;color:#082342;">${safeServiceName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Customer:</td>
              <td style="padding:4px 0;font-weight:600;">${safeName}</td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Email:</td>
              <td style="padding:4px 0;"><a href="mailto:${safeEmail}" style="color:#0284c7;text-decoration:none;">${safeEmail}</a></td>
            </tr>
            <tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Mobile:</td>
              <td style="padding:4px 0;"><a href="tel:+91${safePhone}" style="color:#082342;font-weight:bold;text-decoration:none;">+91 ${safePhone}</a></td>
            </tr>
            ${
              safeMessage
                ? `<tr>
              <td style="padding:4px 0;color:#64748b;vertical-align:top;">Message:</td>
              <td style="padding:4px 0;white-space:pre-wrap;color:#334155;">${safeMessage}</td>
            </tr>`
                : ""
            }
          </table>
        </div>

        <p style="font-size:12px;color:#64748b;margin-bottom:0;">
          Received via Hariputhran Enterprises website public services overview.
        </p>
      </div>

    </div>
  </div>
</body>
</html>`;

  return { subject, text, html };
}

/**
 * Send the customer confirmation email
 */
async function sendCustomerConfirmationEmail(payload) {
  if (process.env.MAIL_DRY_RUN === "true") {
    console.log("dry run: mail not sent");
    return { dryRun: true };
  }

  const { subject, text, html } = buildCustomerConfirmationEmail(payload);
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
 * Send admin alert email to process.env.ADMIN_NOTIFY_EMAIL
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
  buildCustomerConfirmationEmail,
  buildAdminAlertEmail,
  sendCustomerConfirmationEmail,
  sendAdminNotificationEmail,
};
