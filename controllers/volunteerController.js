// ============================================
// Volunteer Controller
// ============================================

const Volunteer = require('../models/Volunteer');

exports.getVolunteerPage = (req, res) => {
  res.render('pages/volunteer', { title: 'Become a Volunteer', success: null, error: null });
};

exports.registerVolunteer = async (req, res) => {
  try {
    const { name, phone, email, city, availability, experience } = req.body;
    await Volunteer.create({
      name: name?.trim(),
      phone: phone?.trim(),
      email: email?.trim().toLowerCase(),
      city: city?.trim(),
      availability,
      experience: experience?.trim(),
    });
    res.render('pages/volunteer', { title: 'Become a Volunteer', success: 'Thank you for volunteering! We will contact you soon.', error: null });
  } catch (error) {
    res.render('pages/volunteer', { title: 'Become a Volunteer', success: null, error: error.message });
  }
};

exports.adminVolunteers = async (req, res) => {
  try {
    const volunteers = await Volunteer.find().sort({ createdAt: -1 });
    res.render('admin/volunteers', { title: 'Manage Volunteers', volunteers });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load volunteers.' });
  }
};

exports.updateVolunteerStatus = async (req, res) => {
  try {
    await Volunteer.findByIdAndUpdate(req.params.id, { status: req.body.status });
    res.redirect('/admin/volunteers');
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: error.message });
  }
};
