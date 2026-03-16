// ============================================
// Report Controller — Handle rescue report CRUD
// ============================================

const Report = require('../models/Report');
const path = require('path');
const fs = require('fs');

/**
 * GET /report — Show the report submission form
 */
exports.getReportForm = (req, res) => {
  res.render('pages/report', {
    title: 'Report an Animal',
    success: null,
    error: null,
  });
};

/**
 * POST /report — Create a new rescue report
 */
exports.createReport = async (req, res) => {
  try {
    const { animalName, animalType, description, latitude, longitude, contactNumber, priority } = req.body;

    // Sanitize inputs
    const sanitized = {
      animalName: animalName?.trim().substring(0, 100),
      animalType: animalType?.trim().toLowerCase(),
      description: description?.trim().substring(0, 2000),
      contactNumber: contactNumber?.trim().substring(0, 20),
      priority: priority === 'urgent' ? 'urgent' : 'normal',
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
    };

    // Handle uploaded image
    let imageUrl = null;
    if (req.file) {
      imageUrl = `/uploads/${req.file.filename}`;

      // Optional: compress image using sharp
      try {
        const sharp = require('sharp');
        const inputPath = req.file.path;
        const outputFilename = `compressed-${req.file.filename}`;
        const outputPath = path.join(path.dirname(inputPath), outputFilename);

        await sharp(inputPath)
          .resize(1200, 1200, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 80 })
          .toFile(outputPath);

        // Remove original, update URL
        fs.unlinkSync(inputPath);
        imageUrl = `/uploads/${outputFilename}`;
      } catch (sharpErr) {
        console.warn('⚠️  Image compression skipped:', sharpErr.message);
        // Keep original if sharp fails
      }
    }

    // Create report in DB
    const report = await Report.create({
      ...sanitized,
      imageUrl,
    });

    res.render('pages/success', {
      title: 'Report Submitted',
      report,
    });
  } catch (error) {
    console.error('❌ Error creating report:', error);
    res.render('pages/report', {
      title: 'Report an Animal',
      success: null,
      error: error.message || 'Failed to submit report. Please try again.',
    });
  }
};

/**
 * GET /api/reports — REST API endpoint for fetching reports
 */
exports.getReportsAPI = async (req, res) => {
  try {
    const { status, type, search, page = 1, limit = 20 } = req.query;
    const filter = {};

    if (status && status !== 'all') filter.status = status;
    if (type && type !== 'all') filter.animalType = type;
    if (search) {
      filter.$or = [
        { animalName: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } },
      ];
    }

    const reports = await Report.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));

    const total = await Report.countDocuments(filter);

    res.json({
      success: true,
      data: reports,
      pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
