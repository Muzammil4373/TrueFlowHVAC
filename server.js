require('dotenv').config();

const express = require('express');
const cors = require('cors');

const connectDB = require('./config/db');
const { seedAdmin } = require('./controllers/authController');
const { verifyEmailConfig } = require('./utils/emailService');

const app = express();

/* -------------------- MIDDLEWARE -------------------- */

app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: true,
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Logger
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()} ${req.method} ${req.path}`);
  next();
});

/* -------------------- ROUTES -------------------- */

// Health check
app.get('/', (req, res) => {
  res.send("API is running 🚀");
});

app.get('/health', (_req, res) => {
  res.json({ status: 'OK', service: 'API' });
});

// API routes
app.use('/api', require('./routes/api'));

/* -------------------- ERROR HANDLING -------------------- */

// 404 handler
app.use((_req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found.'
  });
});

// Global error handler
app.use((err, _req, res, _next) => {
  console.error("❌ Error:", err);
  res.status(500).json({
    success: false,
    message: 'Server error.'
  });
});

/* -------------------- SERVER START -------------------- */

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect DB
    await connectDB();

    // Seed admin (optional)
    await seedAdmin();

    // Verify email config (optional but useful)
    await verifyEmailConfig();

    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on port ${PORT}`);
      console.log(`🌐 URL: http://localhost:${PORT}`);
      console.log(`📧 EMAIL_USER: ${process.env.EMAIL_USER ? 'SET' : 'NOT SET'}`);
      console.log(`🗄️  DB: Connected`);
    });

  } catch (error) {
    console.error("❌ Failed to start server:", error.message);
    process.exit(1);
  }
};

startServer();