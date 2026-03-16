// ============================================
// Medical Record Model — Track animal medical history
// ============================================

const mongoose = require('mongoose');

const medicalRecordSchema = new mongoose.Schema(
  {
    animalId: { type: String, required: true, trim: true },
    animalName: { type: String, trim: true, maxlength: 100 },
    treatment: { type: String, required: true, trim: true, maxlength: 500 },
    medications: { type: String, trim: true, maxlength: 500 },
    vetName: { type: String, trim: true, maxlength: 100 },
    treatmentDate: { type: Date, default: Date.now },
    notes: { type: String, trim: true, maxlength: 2000 },
  },
  { timestamps: true }
);

module.exports = mongoose.model('MedicalRecord', medicalRecordSchema);
