require("dotenv").config();
const {
  createTransporter,
  buildCustomerConfirmationEmail,
} = require("./src/utils/serviceRequestMailer");

async function testSampleEmail() {
  const recipient = process.env.SMTP_USER;
  if (!recipient) {
    console.error("Error: process.env.SMTP_USER is not defined in .env");
    process.exit(1);
  }

  console.log(`Sending sample thank-you email to ${recipient}...`);

  try {
    const payload = {
      id: 123,
      serviceName: "Underground Utility Construction",
      name: "Santhosh Kumar",
      email: recipient,
      phone: "9876543210",
      message: "Looking for quote on 500m sewer pipeline and 4 manholes in Chennai.",
    };

    const { subject, text, html } = buildCustomerConfirmationEmail(payload);
    const transporter = createTransporter();

    const result = await transporter.sendMail({
      from: process.env.MAIL_FROM,
      to: recipient,
      subject: subject + " [Manual Test]",
      text,
      html,
    });

    console.log("sent");
    console.log("Message ID:", result.messageId);
  } catch (err) {
    console.error("Failed to send sample email:", err.message);
  }
}

testSampleEmail();
