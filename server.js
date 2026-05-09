require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const { verifyEmailConfig } = require('./utils/emailService');

const app = express();

app.set('trust proxy', 1);

connectDB().then(seedAdmin);
verifyEmailConfig();

const rawOrigin = process.env.FRONTEND_URL || 'https://truflowhvac.com';
const cleanOrigin = rawOrigin.replace(/\/$/, '');

app.use(cors({
  origin: [
    cleanOrigin,
    'https://truflowhvac.com',
    'https://www.truflowhvac.com',
    'http://localhost:3000',
    'http://localhost:3001',
  ],
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

app.get('/health', (_req, res) =>
  res.json({ status: 'OK', service: 'TruFlow HVAC API' })
);

app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found.' })
);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error.' });
});

// Only listen when running locally (not on Vercel)
if (process.env.NODE_ENV !== 'production') {
  const PORT = process.env.PORT || 5000;
  app.listen(PORT, () => {
    console.log(`\n🚀 TruFlow API running on port ${PORT}`);
    console.log(`   EMAIL_USER    : ${process.env.EMAIL_USER    || '❌ NOT SET'}`);
    console.log(`   BUSINESS_EMAIL: ${process.env.BUSINESS_EMAIL || '❌ NOT SET'}`);
  });
}

module.exports = app;