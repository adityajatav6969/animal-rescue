// ============================================
// Medical Controller
// ============================================

const MedicalRecord = require('../models/MedicalRecord');

exports.getMedicalRecords = async (req, res) => {
  try {
    const filter = {};
    if (req.query.search) {
      filter.$or = [
        { animalName: { $regex: req.query.search, $options: 'i' } },
        { animalId: { $regex: req.query.search, $options: 'i' } },
      ];
    }
    const records = await MedicalRecord.find(filter).sort({ treatmentDate: -1 });
    res.render('pages/medical-records', { title: 'Medical Records', records, search: req.query.search || '' });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load medical records.' });
  }
};

exports.addMedicalRecord = async (req, res) => {
  try {
    const { animalId, animalName, treatment, medications, vetName, treatmentDate, notes } = req.body;
    await MedicalRecord.create({
      animalId: animalId?.trim(),
      animalName: animalName?.trim(),
      treatment: treatment?.trim(),
      medications: medications?.trim(),
      vetName: vetName?.trim(),
      treatmentDate: treatmentDate || Date.now(),
      notes: notes?.trim(),
    });
    res.redirect('/medical-records');
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: error.message });
  }
};
