const express = require('express');
const router = express.Router();
const c = require('../controllers/donationController');
router.get('/donate', c.getDonatePage);
router.post('/donate', c.processDonation);
module.exports = router;
