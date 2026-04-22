const { v4: uuidv4 } = require('uuid');
const Ticket = require('../models/Ticket');
const { sendEmail } = require('../utils/emailService');
const { userEmailHTML, adminEmailHTML } = require('../utils/emailTemplates');

const genId = () => `HVAC-${uuidv4().replace(/-/g,'').toUpperCase().slice(0,6)}`;

// POST /api/contact
const createTicket = async (req, res) => {
  try {
    const { name, email, phone, serviceType, city, message } = req.body;

    if (!name || !email || !phone || !message) {
      return res.status(400).json({
        success: false,
        message: 'Name, email, phone, and message are required.',
      });
    }

    const ticketId = genId();
    const priority = serviceType === 'Emergency' ? 'Emergency' : 'Medium';

    // Save ticket to MongoDB
    const ticket = await Ticket.create({
      ticketId, name, email, phone,
      serviceType: serviceType || 'Other',
      city, message, priority,
    });

    console.log(`🎫 Ticket created: ${ticketId} | From: ${name} <${email}>`);

    // Respond to client immediately (don't make them wait for emails)
    res.status(201).json({
      success: true,
      ticketId,
      message: 'Your request has been submitted!',
    });

    // ── Send emails AFTER responding ──
    // Admin email — most important, send this first
    const adminEmail = process.env.BUSINESS_EMAIL || process.env.ADMIN_EMAIL;

    if (!adminEmail) {
      console.error('❌ No admin email set — add BUSINESS_EMAIL to your .env');
    } else {
      try {
        await sendEmail({
          to: adminEmail,
          subject: `🔔 ${priority === 'Emergency' ? '🚨 EMERGENCY — ' : ''}New Service Request – ${ticketId}`,
          html: adminEmailHTML({
            name, email, phone,
            serviceType: serviceType || 'Other',
            city, message, ticketId, priority,
          }),
        });
      } catch (err) {
        console.error(`❌ Admin email FAILED to ${adminEmail}:`, err.message);
      }
    }

    // User confirmation email
    try {
      await sendEmail({
        to: email,
        subject: `✅ Request Received – Ticket #${ticketId} | TruFlow HVAC`,
        html: userEmailHTML({
          name, ticketId,
          serviceType: serviceType || 'General',
          message,
        }),
      });
    } catch (err) {
      console.error(`❌ User email FAILED to ${email}:`, err.message);
    }

  } catch (err) {
    console.error('❌ createTicket error:', err);
    res.status(500).json({ success: false, message: 'Server error. Please try again.' });
  }
};

// GET /api/tickets/track/:ticketId (public)
const trackTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findOne({ ticketId: req.params.ticketId }).select('-adminNotes');
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });
    res.json({ success: true, ticket });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/admin/tickets (protected)
const getTickets = async (req, res) => {
  try {
    const { status, priority, search, page = 1, limit = 20, sort = '-createdAt' } = req.query;
    const filter = {};
    if (status)   filter.status   = status;
    if (priority) filter.priority = priority;
    if (search)   filter.$or = [
      { name:     new RegExp(search, 'i') },
      { email:    new RegExp(search, 'i') },
      { ticketId: new RegExp(search, 'i') },
    ];
    const tickets = await Ticket.find(filter).sort(sort).skip((page - 1) * limit).limit(+limit);
    const total   = await Ticket.countDocuments(filter);
    res.json({ success: true, tickets, total, page: +page, pages: Math.ceil(total / limit) });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// PATCH /api/admin/tickets/:id (protected)
const updateTicket = async (req, res) => {
  try {
    const { status, adminNotes, priority } = req.body;
    const update = {};
    if (status)     { update.status = status; if (status === 'Completed') update.resolvedAt = new Date(); }
    if (adminNotes) update.adminNotes = adminNotes;
    if (priority)   update.priority = priority;
    const ticket = await Ticket.findByIdAndUpdate(req.params.id, update, { new: true });
    if (!ticket) return res.status(404).json({ success: false, message: 'Ticket not found.' });
    res.json({ success: true, ticket });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

// GET /api/admin/stats (protected)
const getStats = async (req, res) => {
  try {
    const [total, pending, inProgress, completed, emergency] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'Pending' }),
      Ticket.countDocuments({ status: 'In Progress' }),
      Ticket.countDocuments({ status: 'Completed' }),
      Ticket.countDocuments({ priority: 'Emergency' }),
    ]);
    const week = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const weeklyNew = await Ticket.countDocuments({ createdAt: { $gte: week } });
    res.json({ success: true, stats: { total, pending, inProgress, completed, emergency, weeklyNew } });
  } catch {
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

module.exports = { createTicket, trackTicket, getTickets, updateTicket, getStats };
