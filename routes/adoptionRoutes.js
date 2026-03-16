const express = require('express');
const router = express.Router();
const c = require('../controllers/adoptionController');
router.get('/adopt', c.getAdoptionPage);
router.get('/adopt/:id', c.getAnimalProfile);
router.post('/adopt/:id/request', c.submitAdoptionRequest);
module.exports = router;
