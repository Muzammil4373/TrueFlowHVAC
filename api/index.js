require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('../config/db');
const { seedAdmin } = require('../controllers/authController');
const { verifyEmailConfig } = require('../utils/emailService');

const app = express();

app.set('trust proxy', 1);

// Connect DB (cached for serverless)
let isConnected = false;
const connect = async () => {
  if (!isConnected) {
    await connectDB();
    await seedAdmin();
    verifyEmailConfig();
    isConnected = true;
  }
};

const rawOrigin = process.env.FRONTEND_URL || 'https://truflowhvac.com';
const cleanOrigin = rawOrigin.replace(/\/$/, '');

app.use(cors({
  origin: [
    cleanOrigin,
    'https://truflowhvac.com',
    'https://www.truflowhvac.com',
    'http://localhost:3000',
  ],
  credentials: true,
  methods: ['GET', 'POST', 'PATCH', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.options('*', cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api', async (req, res, next) => {
  await connect();
  next();
}, require('../routes/api'));

app.get('/health', (_req, res) =>
  res.json({ status: 'OK', service: 'TruFlow HVAC API' })
);

app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found.' })
);

module.exports = app;