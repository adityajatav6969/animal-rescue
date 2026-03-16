const express = require('express');
const router = express.Router();
const c = require('../controllers/educationController');
router.get('/education', c.getEducationPage);
router.get('/care-guide', c.getCareGuidePage);
module.exports = router;
