const express = require('express');
const router = express.Router();
const c = require('../controllers/emergencyController');
router.get('/emergency', c.getEmergencyPage);
router.post('/emergency', c.submitEmergency);
module.exports = router;
