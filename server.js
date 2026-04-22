require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const { verifyEmailConfig } = require('./utils/emailService');

const app = express();

// Connect DB then seed admin
connectDB().then(seedAdmin);

// Verify email config on startup so you know immediately if it's broken
verifyEmailConfig();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL || 'http://localhost:3000',
    'http://localhost:3001',
  ],
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Request logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.use('/api', require('./routes/api'));
app.get('/health', (_req, res) => res.json({ status: 'OK', service: 'TruFlow HVAC API' }));
app.use((_req, res) => res.status(404).json({ success: false, message: 'Route not found.' }));
app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error.' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`\n🚀 TruFlow API running on port ${PORT}`);
  console.log(`   EMAIL_USER  : ${process.env.EMAIL_USER  || '❌ NOT SET'}`);
  console.log(`   EMAIL_PASS  : ${process.env.EMAIL_PASS  ? '✅ SET' : '❌ NOT SET'}`);
  console.log(`   BUSINESS_EMAIL: ${process.env.BUSINESS_EMAIL || '❌ NOT SET'}`);
  console.log(`   ADMIN_EMAIL : ${process.env.ADMIN_EMAIL || '❌ NOT SET'}`);
});
