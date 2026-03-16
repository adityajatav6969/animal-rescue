const express = require('express');
const router = express.Router();
const c = require('../controllers/communityController');
router.get('/community', c.getCommunityPage);
router.post('/community', c.createPost);
router.post('/community/:id/comment', c.addComment);
router.post('/community/:id/delete', c.deletePost);
module.exports = router;
