const express = require('express');
const router = express.Router();
const c = require('../controllers/volunteerController');
router.get('/volunteer', c.getVolunteerPage);
router.post('/volunteer', c.registerVolunteer);
module.exports = router;
