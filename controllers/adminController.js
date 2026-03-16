// ============================================
// Admin Controller — Dashboard, reports, map
// ============================================

const Report = require('../models/Report');

/**
 * GET /admin/dashboard — Analytics overview
 */
exports.dashboard = async (req, res) => {
  try {
    const [total, pending, inProgress, rescued, urgent] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ status: 'in-progress' }),
      Report.countDocuments({ status: 'rescued' }),
      Report.countDocuments({ priority: 'urgent' }),
    ]);

    // Recent reports (last 5)
    const recentReports = await Report.find().sort({ createdAt: -1 }).limit(5);

    res.render('admin/dashboard', {
      title: 'Admin Dashboard',
      stats: { total, pending, inProgress, rescued, urgent },
      recentReports,
    });
  } catch (error) {
    console.error('❌ Dashboard error:', error);
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load dashboard.' });
  }
};

/**
 * GET /admin/reports — View all reports with search & filters
 */
exports.viewReports = async (req, res) => {
  try {
    const { search, status, type, page = 1 } = req.query;
    const limit = 12;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.animalType = type;
    if (search) {
      filter.$or = [
        { animalName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const total = await Report.countDocuments(filter);
    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit);

    const pages = Math.ceil(total / limit);

    res.render('admin/reports', {
      title: 'Manage Reports',
      reports,
      pagination: { page: parseInt(page), pages, total },
      filters: { search: search || '', status: status || 'all', type: type || 'all' },
    });
  } catch (error) {
    console.error('❌ View reports error:', error);
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load reports.' });
  }
};

/**
 * POST /admin/reports/:id/status — Update report status
 */
exports.updateStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'in-progress', 'rescued'];

    if (!validStatuses.includes(status)) {
      return res.status(400).json({ success: false, message: 'Invalid status.' });
    }

    const report = await Report.findByIdAndUpdate(req.params.id, { status }, { new: true });
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    // If request expects JSON (AJAX), return JSON
    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.json({ success: true, report });
    }
    res.redirect('/admin/reports');
  } catch (error) {
    console.error('❌ Update status error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * DELETE /admin/reports/:id — Delete a report
 */
exports.deleteReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) {
      return res.status(404).json({ success: false, message: 'Report not found.' });
    }

    // Delete uploaded image if exists
    if (report.imageUrl) {
      const fs = require('fs');
      const path = require('path');
      const imagePath = path.join(__dirname, '..', 'public', report.imageUrl);
      if (fs.existsSync(imagePath)) {
        fs.unlinkSync(imagePath);
      }
    }

    await Report.findByIdAndDelete(req.params.id);

    if (req.xhr || req.headers.accept?.includes('json')) {
      return res.json({ success: true, message: 'Report deleted.' });
    }
    res.redirect('/admin/reports');
  } catch (error) {
    console.error('❌ Delete report error:', error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /admin/map — Map view page
 */
exports.mapView = async (req, res) => {
  try {
    res.render('admin/map', { title: 'Rescue Map' });
  } catch (error) {
    console.error('❌ Map view error:', error);
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load map.' });
  }
};

/**
 * GET /admin/api/map-data — JSON endpoint for map markers
 */
exports.getMapData = async (req, res) => {
  try {
    const reports = await Report.find({
      latitude: { $ne: null },
      longitude: { $ne: null },
    }).select('animalName animalType description imageUrl latitude longitude status priority createdAt');

    res.json({ success: true, data: reports });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

/**
 * GET /admin/api/stats — JSON endpoint for live stats
 */
exports.getStats = async (req, res) => {
  try {
    const [total, pending, inProgress, rescued, urgent] = await Promise.all([
      Report.countDocuments(),
      Report.countDocuments({ status: 'pending' }),
      Report.countDocuments({ status: 'in-progress' }),
      Report.countDocuments({ status: 'rescued' }),
      Report.countDocuments({ priority: 'urgent' }),
    ]);

    res.json({ success: true, stats: { total, pending, inProgress, rescued, urgent } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
