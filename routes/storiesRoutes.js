const express = require('express');
const router = express.Router();
const c = require('../controllers/storiesController');
router.get('/rescue-stories', c.getStories);
router.get('/rescue-stories/:id', c.getStoryDetail);
module.exports = router;
