const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, trim: true },
  excerpt:     { type: String, required: true },
  content:     { type: String, required: true },
  category:    { type: String, enum: ['AC', 'Heating', 'Maintenance', 'Air Quality', 'Tips', 'News'], default: 'Tips' },
  tags:        [String],
  metaTitle:   { type: String },
  metaDesc:    { type: String },
  published:   { type: Boolean, default: false },
  coverImage:  { type: String },
  readTime:    { type: Number, default: 5 },
  author:      { type: String, default: 'TruFlow Team' },
}, { timestamps: true });

module.exports = mongoose.model('Blog', blogSchema);
