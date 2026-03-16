// ============================================
// Emergency Controller
// ============================================

const EmergencyReport = require('../models/EmergencyReport');

exports.getEmergencyPage = (req, res) => {
  res.render('pages/emergency', { title: 'Emergency Rescue', success: null, error: null });
};

exports.submitEmergency = async (req, res) => {
  try {
    const { animalType, description, latitude, longitude, severity, contactNumber } = req.body;
    await EmergencyReport.create({
      animalType,
      description: description?.trim(),
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      severity: severity || 'urgent',
      contactNumber: contactNumber?.trim(),
    });
    res.render('pages/emergency', { title: 'Emergency Rescue', success: 'Emergency report submitted! Help is on the way.', error: null });
  } catch (error) {
    res.render('pages/emergency', { title: 'Emergency Rescue', success: null, error: error.message });
  }
};
