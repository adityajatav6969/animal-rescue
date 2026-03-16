// ============================================
// Rescue Story Model — Admin-created rescue stories
// ============================================

const mongoose = require('mongoose');

const rescueStorySchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, maxlength: 200 },
    description: { type: String, required: true, trim: true, maxlength: 5000 },
    animalType: {
      type: String,
      enum: ['dog', 'cat', 'cow', 'bird', 'other'],
      default: 'other',
    },
    beforePhoto: { type: String, default: null },
    afterPhoto: { type: String, default: null },
    location: { type: String, trim: true, maxlength: 200 },
    rescueDate: { type: Date, default: Date.now },
  },
  { timestamps: true }
);

module.exports = mongoose.model('RescueStory', rescueStorySchema);
