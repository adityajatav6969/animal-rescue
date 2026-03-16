// ============================================
// Statistics Controller — Handles advanced rescue statistics and charts
// ============================================

const Report = require('../models/Report');

exports.getStatisticsPage = async (req, res) => {
  try {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

    // ── 1. Top Level Metrics ────────────────────────────────────────────────
    
    // Total Reports
    const totalReports = await Report.countDocuments();

    // Total Rescued Animals
    const totalRescued = await Report.countDocuments({ status: 'rescued' });

    // Rescue Success Rate
    const successRate = totalReports > 0 ? ((totalRescued / totalReports) * 100).toFixed(1) : 0;

    // Animals Rescued This Month
    const rescuedThisMonth = await Report.countDocuments({
      status: 'rescued',
      createdAt: { $gte: startOfMonth }
    });

    // Most Common Animal Type
    const commonAnimalData = await Report.aggregate([
      { $group: { _id: '$animalType', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 }
    ]);
    const commonAnimalType = commonAnimalData.length > 0 ? (commonAnimalData[0]._id.charAt(0).toUpperCase() + commonAnimalData[0]._id.slice(1)) : 'N/A';

    // ── 2. Chart Data ───────────────────────────────────────────────────────

    // Rescue Trend Chart (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(now.getDate() - 30);
    
    const rescueTrendRaw = await Report.aggregate([
      { $match: { createdAt: { $gte: thirtyDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    // Format for Chart.js
    const rescueTrend = {
      labels: rescueTrendRaw.map(d => d._id),
      data: rescueTrendRaw.map(d => d.count),
    };

    // Animal Type Distribution
    const animalDistributionRaw = await Report.aggregate([
      { $group: { _id: '$animalType', count: { $sum: 1 } } }
    ]);
    const animalDistribution = {
      labels: animalDistributionRaw.map(d => d._id.charAt(0).toUpperCase() + d._id.slice(1)),
      data: animalDistributionRaw.map(d => d.count),
    };

    // Rescue Status Chart
    const rescueStatusRaw = await Report.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } }
    ]);
    const rescueStatus = {
      labels: rescueStatusRaw.map(d => d._id.replace('-', ' ').replace(/\b\w/g, c => c.toUpperCase())),
      data: rescueStatusRaw.map(d => d.count),
    };

    // Monthly Rescue Activity (last 12 months)
    const twelveMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 11, 1);
    
    const monthlyRescuesRaw = await Report.aggregate([
      { $match: { status: 'rescued', createdAt: { $gte: twelveMonthsAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    const monthlyRescues = {
      labels: monthlyRescuesRaw.map(d => d._id),
      data: monthlyRescuesRaw.map(d => d.count),
    };

    // ── 3. Render Page ───────────────────────────────────────────────────────

    res.render('pages/statistics', {
      title: 'Statistics Dashboard',
      data: {
        totalReports,
        totalRescued,
        successRate,
        rescuedThisMonth,
        commonAnimalType,
        charts: {
          rescueTrend: JSON.stringify(rescueTrend),
          animalDistribution: JSON.stringify(animalDistribution),
          rescueStatus: JSON.stringify(rescueStatus),
          monthlyRescues: JSON.stringify(monthlyRescues),
        }
      }
    });

  } catch (error) {
    console.error('Error fetching statistics:', error);
    res.status(500).render('pages/error', {
      title: 'Error',
      message: 'Failed to load statistics dashboard data.'
    });
  }
};
