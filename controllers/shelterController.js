// ============================================
// Shelter Controller
// ============================================

const Shelter = require('../models/Shelter');

exports.getSheltersPage = async (req, res) => {
  try {
    const filter = {};
    if (req.query.city) filter.city = { $regex: req.query.city, $options: 'i' };
    const shelters = await Shelter.find(filter).sort({ name: 1 });
    res.render('pages/shelters', { title: 'Animal Shelters', shelters, currentCity: req.query.city || '' });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load shelters.' });
  }
};

exports.getSheltersAPI = async (req, res) => {
  try {
    const shelters = await Shelter.find({
      latitude: { $ne: null },
      longitude: { $ne: null },
    });
    res.json({ success: true, data: shelters });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
