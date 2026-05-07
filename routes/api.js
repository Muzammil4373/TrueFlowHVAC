const express = require('express');
const router  = express.Router();
const rateLimit = require('express-rate-limit');

const { login, getMe }                            = require('../controllers/authController');
const { createTicket, trackTicket, getTickets,
        updateTicket, getStats }                  = require('../controllers/ticketController');
const { protect }                                 = require('../middleware/auth');

// Rate limiters — validate: false avoids the X-Forwarded-For error on Render
const contactLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many requests. Try again in 15 minutes.' },
});

const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  validate: { xForwardedForHeader: false },
  message: { success: false, message: 'Too many login attempts.' },
});

// Auth
router.post('/auth/login', loginLimiter, login);
router.get('/auth/me',     protect,      getMe);

// Public
router.post('/contact',                    contactLimiter, createTicket);
router.get('/tickets/track/:ticketId',                     trackTicket);

// Admin (protected)
router.get('/admin/stats',         protect, getStats);
router.get('/admin/tickets',       protect, getTickets);
router.patch('/admin/tickets/:id', protect, updateTicket);

module.exports = router;