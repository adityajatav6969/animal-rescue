// ============================================
// Statistics Routes
// ============================================

const express = require('express');
const router = express.Router();
const statisticsController = require('../controllers/statisticsController');

// GET /statistics
router.get('/statistics', statisticsController.getStatisticsPage);

module.exports = router;
