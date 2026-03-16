// ============================================
// Page Routes — Static public pages
// ============================================

const express = require('express');
const router = express.Router();
const Report = require('../models/Report');

// Home page with live stats
router.get('/', async (req, res) => {
  try {
    const [total, rescued, active] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: 'rescued' }),
      Report.countDocuments({ status: { $in: ['pending', 'in-progress'] } }),
    ]);

    res.render('pages/home', {
      title: 'Animal Rescue Platform',
      stats: { total, rescued, active },
    });
  } catch (error) {
    res.render('pages/home', {
      title: 'Animal Rescue Platform',
      stats: { total: 0, rescued: 0, active: 0 },
    });
  }
});

// About page
router.get('/about', (req, res) => {
  res.render('pages/about', { title: 'About Us' });
});

// Contact page
router.get('/contact', (req, res) => {
  res.render('pages/contact', { title: 'Contact Us' });
});

// How It Works page
router.get('/how-it-works', (req, res) => {
  res.render('pages/howitworks', { title: 'How It Works' });
});

module.exports = router;
