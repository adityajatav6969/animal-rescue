// ============================================
// Report Routes — Submit rescue reports
// ============================================

const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const reportController = require('../controllers/reportController');

// Show report form
router.get('/report', reportController.getReportForm);

// Submit report (with optional image upload)
router.post('/report', upload.single('animalPhoto'), reportController.createReport);

// REST API — Get reports (public)
router.get('/api/reports', reportController.getReportsAPI);

module.exports = router;
