const mongoose = require('mongoose');

const ticketSchema = new mongoose.Schema({
  ticketId: { type: String, required: true, unique: true },
  name:     { type: String, required: true, trim: true },
  email:    { type: String, required: true, trim: true, lowercase: true },
  phone:    { type: String, required: true, trim: true },
  serviceType: {
    type: String,
    enum: ['AC', 'Heating', 'Installation', 'Maintenance', 'Air Quality', 'Emergency', 'Other'],
    default: 'Other',
  },
  city:    { type: String, trim: true },
  message: { type: String, required: true, trim: true },
  status:  {
    type: String,
    enum: ['Pending', 'In Progress', 'Completed', 'Cancelled'],
    default: 'Pending',
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Emergency'],
    default: 'Medium',
  },
  adminNotes: { type: String },
  resolvedAt: { type: Date },
  source:  { type: String, default: 'website' },
}, { timestamps: true });

ticketSchema.pre('save', function (next) {
  if (this.serviceType === 'Emergency') this.priority = 'Emergency';
  next();
});

module.exports = mongoose.model('Ticket', ticketSchema);
