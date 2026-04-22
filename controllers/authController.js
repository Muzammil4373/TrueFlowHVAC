const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// POST /api/auth/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ success: false, message: 'Email and password required.' });

    const admin = await Admin.findOne({ email: email.toLowerCase() });
    if (!admin || !(await admin.comparePassword(password)))
      return res.status(401).json({ success: false, message: 'Invalid credentials.' });

    admin.lastLogin = new Date();
    await admin.save({ validateBeforeSave: false });

    const token = signToken(admin._id);
    res.json({ success: true, token, admin: { id: admin._id, email: admin.email, name: admin.name, role: admin.role } });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/auth/me
const getMe = async (req, res) => {
  res.json({ success: true, admin: req.admin });
};

// Seed admin on startup (idempotent)
const seedAdmin = async () => {
  try {
    const exists = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
    if (!exists) {
      await Admin.create({ email: process.env.ADMIN_EMAIL, password: process.env.ADMIN_PASSWORD, name: 'Admin' });
      console.log(`✅ Admin seeded: ${process.env.ADMIN_EMAIL}`);
    }
  } catch (err) {
    console.error('Admin seed error:', err.message);
  }
};

module.exports = { login, getMe, seedAdmin };
