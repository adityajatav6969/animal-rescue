// ============================================
// Auth Routes — Admin login / logout
// ============================================

const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Login page
router.get('/login', authController.loginPage);

// Login action
router.post('/login', authController.login);

// Logout
router.get('/logout', authController.logout);

module.exports = router;
