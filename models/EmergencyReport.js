// ============================================
// Emergency Report Model — Critical animal injuries
// ============================================

const mongoose = require('mongoose');

const emergencyReportSchema = new mongoose.Schema(
  {
    animalType: {
      type: String,
      required: true,
      enum: ['dog', 'cat', 'cow', 'bird', 'other'],
    },
    description: { type: String, required: true, trim: true, maxlength: 2000 },
    imageUrl: { type: String, default: null },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
    severity: {
      type: String,
      enum: ['normal', 'urgent', 'critical'],
      default: 'urgent',
    },
    status: {
      type: String,
      enum: ['pending', 'responding', 'resolved'],
      default: 'pending',
    },
    contactNumber: { type: String, trim: true, default: '' },
  },
  { timestamps: true }
);

module.exports = mongoose.model('EmergencyReport', emergencyReportSchema);
