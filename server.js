require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const { verifyEmailConfig } = require('./utils/emailService');

const app = express();

// Safe startup
(async () => {
  try {
    await connectDB();
    await seedAdmin();
    await verifyEmailConfig();
    console.log("Startup tasks completed");
  } catch (err) {
    console.error("Startup error:", err);
  }
})();

app.use(cors({
  origin: [
   '*'
  ],
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

app.use('/api', require('./routes/api'));

app.get('/', (req, res) => {
  res.send("API root working");
});

app.get('/health', (_req, res) =>
  res.json({ status: 'OK', service: 'API' })
);

app.use((_req, res) =>
  res.status(404).json({ success: false, message: 'Route not found.' })
);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({ success: false, message: 'Server error.' });
});

// ✅ IMPORTANT
module.exports = app;