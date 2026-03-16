const express = require('express');
const router = express.Router();
const c = require('../controllers/medicalController');
router.get('/medical-records', c.getMedicalRecords);
router.post('/medical-records', c.addMedicalRecord);
module.exports = router;
