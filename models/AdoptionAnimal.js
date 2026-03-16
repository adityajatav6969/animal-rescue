// ============================================
// Adoption Animal Model — Animals available for adoption
// ============================================

const mongoose = require('mongoose');

const adoptionAnimalSchema = new mongoose.Schema(
  {
    animalName: { type: String, required: true, trim: true, maxlength: 100 },
    animalType: {
      type: String,
      required: true,
      enum: ['dog', 'cat', 'bird', 'other'],
    },
    age: { type: String, trim: true, maxlength: 50 },
    description: { type: String, trim: true, maxlength: 2000 },
    photo: { type: String, default: null },
    healthStatus: {
      type: String,
      enum: ['healthy', 'recovering', 'needs-care'],
      default: 'healthy',
    },
    location: { type: String, trim: true, maxlength: 200 },
    adopted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.model('AdoptionAnimal', adoptionAnimalSchema);
