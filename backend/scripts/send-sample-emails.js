/**
 * Manual test script to generate and preview or send sample emails for all templates.
 * 
 * Usage:
 *   node backend/scripts/send-sample-emails.js           # Dry-run inspection (default)
 *   node backend/scripts/send-sample-emails.js --send    # Sends samples with [SAMPLE] subject to SMTP_USER
 */

const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });

const serviceRequestMailer = require("../src/utils/serviceRequestMailer");
const contactMailer = require("../src/utils/contactMailer");
const mailer = require("../src/utils/mailer");

const isSendMode = process.argv.includes("--send");
const targetRecipient = process.env.SMTP_USER;

const sampleData = {
  serviceRequest: {
    id: 1042,
    serviceName: "Underground Drainage & Sewer Line Works (Deep Trenching)",
    name: "Dr. K. Ananthapadmanabhan & Associates",
    email: "an.example.long.email.address.2005@very-long-domain-name-example.co.in",
    phone: "+91 98401 23456",
    message:
      "We require comprehensive turnkey excavation, chamber construction, and municipal line connection for a commercial development in Velachery. Site inspection needed urgently.",
  },
  contact: {
    id: 885,
    name: "Santhosh Chandrasekaran (Infrastructure Division)",
    email: "santhoshchandra2005@gmail.com",
    phone: "+91 98765 43210",
    subject: "Urgent Inquiry Regarding Rainwater Harvesting & Stormwater Drainage System",
    message:
      "Hello Team Hariputhran,\n\nWe need a formal proposal and technical estimate for stormwater drainage trenching and rainwater harvesting pits for an industrial warehouse layout near Ambattur.\n\nPlease share the earliest available site engineer visit schedule.\n\nRegards,\nSanthosh",
  },
  auth: {
    userEmail: "santhoshchandra2005@gmail.com",
    oldEmail: "admin.previous.operations@hariputhranenterprises.com",
    newEmail: "an.example.long.email.address.2005@very-long-domain-name-example.co.in",
    resetLink: "https://hariputhranenterprises.com/admin/reset-password?token=a8f93bc10294e771bfa829104c810d94f71a02938472910bc01928472910fedc",
  },
};

function generateAllSamples() {
  const samples = [];

  // 1. Service Request - Customer Confirmation
  const srCust = serviceRequestMailer.buildCustomerConfirmationEmail(sampleData.serviceRequest);
  samples.push({
    category: "Service Request",
    name: "Customer Confirmation",
    subject: srCust.subject,
    text: srCust.text,
    html: srCust.html,
    defaultTo: sampleData.serviceRequest.email,
  });

  // 2. Service Request - Admin Alert
  const srAdmin = serviceRequestMailer.buildAdminAlertEmail(sampleData.serviceRequest);
  samples.push({
    category: "Service Request",
    name: "Admin Alert",
    subject: srAdmin.subject,
    text: srAdmin.text,
    html: srAdmin.html,
    defaultTo: targetRecipient,
  });

  // 3. Contact - Customer Thank You
  const ctCust = contactMailer.buildCustomerThankYouEmail(sampleData.contact);
  samples.push({
    category: "Contact",
    name: "Customer Thank You",
    subject: ctCust.subject,
    text: ctCust.text,
    html: ctCust.html,
    defaultTo: sampleData.contact.email,
  });

  // 4. Contact - Admin Alert
  const ctAdmin = contactMailer.buildAdminAlertEmail(sampleData.contact);
  samples.push({
    category: "Contact",
    name: "Admin Alert",
    subject: ctAdmin.subject,
    text: ctAdmin.text,
    html: ctAdmin.html,
    defaultTo: targetRecipient,
  });

  // 5. Auth - Password Reset
  const authReset = mailer.buildPasswordResetEmail(sampleData.auth.userEmail, sampleData.auth.resetLink);
  samples.push({
    category: "Auth & Security",
    name: "Password Reset",
    subject: authReset.subject,
    text: authReset.text,
    html: authReset.html,
    defaultTo: sampleData.auth.userEmail,
  });

  // 6. Auth - Password Changed
  const authChanged = mailer.buildPasswordChangedEmail(sampleData.auth.userEmail);
  samples.push({
    category: "Auth & Security",
    name: "Password Changed Notice",
    subject: authChanged.subject,
    text: authChanged.text,
    html: authChanged.html,
    defaultTo: sampleData.auth.userEmail,
  });

  // 7. Auth - Email Changed Notice
  const authEmailChange = mailer.buildEmailChangedNoticeEmail(sampleData.auth.oldEmail, sampleData.auth.newEmail);
  samples.push({
    category: "Auth & Security",
    name: "Email Changed Notice",
    subject: authEmailChange.subject,
    text: authEmailChange.text,
    html: authEmailChange.html,
    defaultTo: sampleData.auth.oldEmail,
  });

  // 8. Auth - New Email Welcome
  const authNewEmail = mailer.buildNewEmailWelcomeEmail(sampleData.auth.newEmail);
  samples.push({
    category: "Auth & Security",
    name: "New Email Welcome",
    subject: authNewEmail.subject,
    text: authNewEmail.text,
    html: authNewEmail.html,
    defaultTo: sampleData.auth.newEmail,
  });

  return samples;
}

async function run() {
  const samples = generateAllSamples();

  console.log("================================================================================");
  console.log("HARIPUTHRAN ENTERPRISES — EMAIL TEMPLATE VERIFICATION");
  console.log(`Mode: ${isSendMode ? "SEND (LIVE TRANSMISSION)" : "DRY RUN (INSPECTION ONLY)"}`);
  console.log(`Total Templates Generated: ${samples.length}`);
  console.log("================================================================================\n");

  for (let i = 0; i < samples.length; i++) {
    const s = samples[i];
    const htmlSizeKB = (Buffer.byteLength(s.html, "utf8") / 1024).toFixed(2);
    const hasViewport = s.html.includes("meta name=\"viewport\"");
    const hasDoctype = s.html.includes("<!DOCTYPE html>");
    const hasOverflowWrap = s.html.includes("overflow-wrap:anywhere") || s.html.includes("word-break:break-word");

    console.log(`[${i + 1}/${samples.length}] [${s.category}] ${s.name}`);
    console.log(`   Subject:   ${s.subject}`);
    console.log(`   Size:      ${htmlSizeKB} KB (Target < 100 KB)`);
    console.log(`   Checks:    DOCTYPE: ${hasDoctype ? "✓" : "✗"} | Viewport: ${hasViewport ? "✓" : "✗"} | Wrap Protection: ${hasOverflowWrap ? "✓" : "✗"}`);
    
    if (isSendMode) {
      if (!targetRecipient) {
        console.error("   Error: SMTP_USER is not configured in .env. Cannot send.");
        continue;
      }
      try {
        console.log(`   Action:    Sending sample to ${targetRecipient}...`);
        await mailer.sendMail({
          to: targetRecipient,
          subject: `[SAMPLE] ${s.subject}`,
          text: s.text,
          html: s.html,
        });
        console.log("   Status:    Sent successfully.");
      } catch (err) {
        console.error(`   Status:    Failed to send: ${err.message}`);
      }
    } else {
      console.log(`   Preview:   ${s.text.split("\n")[0]}`);
    }
    console.log("");
  }

  console.log("================================================================================");
  if (!isSendMode) {
    console.log("Dry run complete. All templates generated and validated successfully.");
    console.log("To send live sample emails to SMTP_USER, rerun with: node backend/scripts/send-sample-emails.js --send");
  } else {
    console.log("Live sample transmission complete.");
  }
  console.log("================================================================================");
}

run().catch((err) => {
  console.error("Fatal error running sample email script:", err);
  process.exit(1);
});
