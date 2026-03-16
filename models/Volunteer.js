// ============================================
// Volunteer Model — Rescue volunteer registration
// ============================================

const mongoose = require('mongoose');

const volunteerSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, required: true, trim: true, maxlength: 20 },
    email: { type: String, required: true, trim: true, lowercase: true },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    availability: {
      type: String,
      enum: ['weekdays', 'weekends', 'anytime', 'evenings'],
      default: 'anytime',
    },
    experience: { type: String, trim: true, maxlength: 2000 },
    status: {
      type: String,
      enum: ['active', 'inactive', 'pending'],
      default: 'pending',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Volunteer', volunteerSchema);
