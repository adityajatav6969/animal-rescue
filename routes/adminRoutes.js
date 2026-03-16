// ============================================
// Admin Routes — Protected dashboard routes
// ============================================

const express = require('express');
const router = express.Router();
const { isAdmin } = require('../middleware/authMiddleware');
const adminController = require('../controllers/adminController');

// All routes below require admin login
router.use(isAdmin);

// Dashboard
router.get('/dashboard', adminController.dashboard);

// Reports management
router.get('/reports', adminController.viewReports);

// Update report status
router.post('/reports/:id/status', adminController.updateStatus);

// Delete report
router.post('/reports/:id/delete', adminController.deleteReport);

// Map view
router.get('/map', adminController.mapView);

// API endpoints (JSON)
router.get('/api/map-data', adminController.getMapData);
router.get('/api/stats', adminController.getStats);

// Volunteer management
const volunteerController = require('../controllers/volunteerController');
router.get('/volunteers', volunteerController.adminVolunteers);
router.post('/volunteers/:id/status', volunteerController.updateVolunteerStatus);

module.exports = router;
