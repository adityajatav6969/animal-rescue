const express = require('express');
const router = express.Router();
const c = require('../controllers/helplineController');
router.get('/helpline', c.getHelplinePage);
module.exports = router;
