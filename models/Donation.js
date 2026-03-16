// ============================================
// Donation Model — Track donations
// ============================================

const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema(
  {
    donorName: { type: String, required: true, trim: true, maxlength: 100 },
    email: { type: String, trim: true, lowercase: true },
    amount: { type: Number, required: true, min: 1 },
    message: { type: String, trim: true, maxlength: 500 },
    paymentStatus: {
      type: String,
      enum: ['completed', 'pending', 'failed'],
      default: 'completed',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Donation', donationSchema);
