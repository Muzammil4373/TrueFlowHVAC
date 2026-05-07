const nodemailer = require('nodemailer');

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

const createTransporter = () => {
  const port = parseInt(process.env.EMAIL_PORT) || 465;
  const secure = port === 465; // true for 465 (SSL), false for 587 (TLS)

  return nodemailer.createTransport({
    host:   process.env.EMAIL_HOST || 'smtp.gmail.com',
    port,
    secure, // 465 = SSL, 587 = STARTTLS
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false,
    },
    connectionTimeout: 15000,
    greetingTimeout:   15000,
    socketTimeout:     20000,
  });
};

const verifyEmailConfig = async () => {
  if (!checkConfig()) return;
  try {
    const transporter = createTransporter();
    await transporter.verify();
    console.log('✅ Email SMTP connection verified successfully');
  } catch (err) {
    console.error('❌ Email SMTP verification failed:', err.message);
    console.error('   Fix: Check EMAIL_USER, EMAIL_PASS, and set EMAIL_PORT=465 on Render');
  }
};

const sendEmail = async ({ to, subject, html }) => {
  if (!checkConfig()) {
    throw new Error('Email not configured — check EMAIL_USER and EMAIL_PASS in env vars');
  }
  if (!to) throw new Error('No recipient email address provided');

  const transporter = createTransporter();

  const mailOptions = {
    from: `"${process.env.BUSINESS_NAME || 'TruFlow HVAC'}" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  };

  console.log(`📧 Sending email → ${to}`);
  const result = await transporter.sendMail(mailOptions);
  console.log(`✅ Email sent → ${to} | MessageId: ${result.messageId}`);
  return result;
};

module.exports = { sendEmail, verifyEmailConfig };