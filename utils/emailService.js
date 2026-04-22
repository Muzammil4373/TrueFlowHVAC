const nodemailer = require('nodemailer');

// Verify all required env vars are present
const checkConfig = () => {
  const missing = [];
  if (!process.env.EMAIL_USER) missing.push('EMAIL_USER');
  if (!process.env.EMAIL_PASS) missing.push('EMAIL_PASS');
  if (missing.length) {
    console.error('❌ Email config missing:', missing.join(', '));
    return false;
  }
  return true;
};

// Create a fresh transporter each call (avoids stale connections)
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: 587,
    secure: false, // TLS on port 587
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 10000,
    greetingTimeout: 10000,
    socketTimeout: 15000,
  });
};

// Verify SMTP connection (call on server start to catch config issues early)
const verifyEmailConfig = async () => {
  if (!checkConfig()) return;
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email SMTP connection verified successfully');
  } catch (err) {
    console.error('❌ Email SMTP verification failed:', err.message);
    console.error('   Check EMAIL_USER and EMAIL_PASS in your .env file');
  }
};

const sendEmail = async ({ to, subject, html }) => {
  if (!checkConfig()) {
    throw new Error('Email not configured — check EMAIL_USER and EMAIL_PASS in .env');
  }

  if (!to) {
    throw new Error('No recipient email address provided');
  }

  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.BUSINESS_NAME || 'TruFlow HVAC'}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  console.log(`📧 Sending email to: ${to} | Subject: ${subject}`);

  const result = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent to ${to} | MessageId: ${result.messageId}`);
  return result;
};

module.exports = { sendEmail, verifyEmailConfig };
