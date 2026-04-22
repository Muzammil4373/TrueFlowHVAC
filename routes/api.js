const express = require('express');
const router = express.Router();
const rateLimit = require('express-rate-limit');

const { login, getMe } = require('../controllers/authController');
const { createTicket, trackTicket, getTickets, updateTicket, getStats } = require('../controllers/ticketController');
const { protect } = require('../middleware/auth');

// Rate limiting for contact form
const contactLimiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many requests. Try again in 15 minutes.' } });
const loginLimiter  = rateLimit({ windowMs: 15 * 60 * 1000, max: 10, message: { success: false, message: 'Too many login attempts.' } });

// Auth routes
router.post('/auth/login', loginLimiter, login);
router.get('/auth/me', protect, getMe);

// Public routes
router.post('/contact', contactLimiter, createTicket);
router.get('/tickets/track/:ticketId', trackTicket);

// Protected admin routes
router.get('/admin/stats',      protect, getStats);
router.get('/admin/tickets',    protect, getTickets);
router.patch('/admin/tickets/:id', protect, updateTicket);

module.exports = router;
