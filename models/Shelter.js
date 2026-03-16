// ============================================
// Shelter Model — Animal shelter directory
// ============================================

const mongoose = require('mongoose');

const shelterSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, maxlength: 200 },
    address: { type: String, trim: true, maxlength: 500 },
    city: { type: String, required: true, trim: true, maxlength: 100 },
    phone: { type: String, trim: true, maxlength: 20 },
    email: { type: String, trim: true, lowercase: true },
    website: { type: String, trim: true },
    latitude: { type: Number, default: null },
    longitude: { type: Number, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Shelter', shelterSchema);
