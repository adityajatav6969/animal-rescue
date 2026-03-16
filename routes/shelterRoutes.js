const express = require('express');
const router = express.Router();
const c = require('../controllers/shelterController');
router.get('/shelters', c.getSheltersPage);
router.get('/api/shelters', c.getSheltersAPI);
module.exports = router;
