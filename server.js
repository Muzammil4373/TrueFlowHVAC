require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const { verifyEmailConfig } = require('./utils/emailService');

const app = express();

// ── Trust proxy — REQUIRED on Render/Vercel/any reverse proxy ──
// Without this, express-rate-limit throws ERR_ERL_UNEXPECTED_X_FORWARDED_FOR
app.set('trust proxy', 1);

// Connect DB then seed admin
connectDB().then(seedAdmin);

// Verify email config on startup
verifyEmailConfig();

// Strip trailing slash from FRONTEND_URL if present
const rawOrigin = process.env.FRONTEND_URL || 'http://localhost:3000';
const cleanOrigin = rawOrigin.replace(/\/$/, '');

const allowedOrigins = [
  cleanOrigin,
  'https://truflowhvac.com',
  'https://www.truflowhvac.com',
  'http://localhost:3000',
  'http://localhost:3001',
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      console.warn(`⚠️  CORS blocked: ${origin}`);
      callback(null, true); // allow all for now
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

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
  console.log(`   TRUST PROXY  : enabled`);
  console.log(`   CORS ORIGIN  : ${cleanOrigin}`);
  console.log(`   EMAIL_USER   : ${process.env.EMAIL_USER   || '❌ NOT SET'}`);
  console.log(`   EMAIL_PASS   : ${process.env.EMAIL_PASS   ? '✅ SET'     : '❌ NOT SET'}`);
  console.log(`   EMAIL_PORT   : ${process.env.EMAIL_PORT   || '587'}`);
  console.log(`   BUSINESS_EMAIL: ${process.env.BUSINESS_EMAIL || '❌ NOT SET'}`);
});