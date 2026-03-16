// ============================================
// Report Model — Rescue report submitted by users
// ============================================

const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema(
  {
    animalName: {
      type: String,
      required: [true, 'Animal name is required'],
      trim: true,
      maxlength: [100, 'Animal name cannot exceed 100 characters'],
    },
    animalType: {
      type: String,
      required: [true, 'Animal type is required'],
      enum: {
        values: ['dog', 'cat', 'cow', 'bird', 'other'],
        message: '{VALUE} is not a valid animal type',
      },
    },
    description: {
      type: String,
      required: [true, 'Description is required'],
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
    },
    imageUrl: {
      type: String,
      default: null,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    contactNumber: {
      type: String,
      trim: true,
      default: '',
    },
    priority: {
      type: String,
      enum: ['normal', 'urgent'],
      default: 'normal',
    },
    status: {
      type: String,
      enum: ['pending', 'in-progress', 'rescued'],
      default: 'pending',
    },
  },
  {
    timestamps: true, // adds createdAt and updatedAt
  }
);

// Index for search and filtering
reportSchema.index({ animalName: 'text', description: 'text' });
reportSchema.index({ status: 1, animalType: 1 });

module.exports = mongoose.model('Report', reportSchema);
