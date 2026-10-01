require("dotenv").config();
const { sendPasswordResetEmail } = require("./src/utils/mailer");

(async () => {
  try {
    const to = process.env.SMTP_USER; // sends the test to yourself
    const link = `${process.env.FRONTEND_URL}/reset-password?token=TEST123`;
    const info = await sendPasswordResetEmail(to, link);
    console.log("Email sent successfully:", info.messageId);
    console.log("Check the inbox of:", to);
  } catch (err) {
    console.error("Email failed:", err.message);
  }
})();