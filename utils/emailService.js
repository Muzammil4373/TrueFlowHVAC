const nodemailer = require("nodemailer");

const checkConfig = () => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.error(
      "❌ Missing EMAIL_USER or EMAIL_PASS in environment variables"
    );
    return false;
  }

  return true;
};

const createTransporter = () => {
  return nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const verifyEmailConfig = async () => {
  if (!checkConfig()) return;

  try {
    const transporter = createTransporter();

    await transporter.verify();

    console.log("✅ Gmail SMTP verified successfully");
  } catch (err) {
    console.error("❌ Gmail SMTP verification failed:", err.message);
  }
};

const sendEmail = async ({ to, subject, html }) => {
  if (!checkConfig()) {
    throw new Error("Email configuration missing");
  }

  if (!to) {
    throw new Error("Recipient email is required");
  }

  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"${process.env.BUSINESS_NAME || "TruFlow HVAC"}" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      html,
    };

    console.log(`📧 Sending email → ${to}`);

    const result = await transporter.sendMail(mailOptions);

    console.log(
      `✅ Email sent → ${to} | MessageId: ${result.messageId}`
    );

    return result;
  } catch (err) {
    console.error(`❌ Failed to send email → ${to}`, err.message);
    throw err;
  }
};

module.exports = {
  sendEmail,
  verifyEmailConfig,
};