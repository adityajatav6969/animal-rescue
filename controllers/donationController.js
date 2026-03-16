// ============================================
// Donation Controller
// ============================================

const Donation = require('../models/Donation');
const Report = require('../models/Report');

exports.getDonatePage = async (req, res) => {
  try {
    const totalDonations = await Donation.aggregate([
      { $match: { paymentStatus: 'completed' } },
      { $group: { _id: null, total: { $sum: '$amount' } } },
    ]);
    const totalRescued = await Report.countDocuments({ status: 'rescued' });
    const donorCount = await Donation.countDocuments({ paymentStatus: 'completed' });

    res.render('pages/donate', {
      title: 'Support Our Mission',
      stats: {
        totalDonations: totalDonations[0]?.total || 0,
        totalRescued,
        donorCount,
      },
      success: req.query.success || null,
      error: null,
    });
  } catch (error) {
    res.status(500).render('pages/error', { title: 'Error', message: 'Failed to load donation page.' });
  }
};

exports.processDonation = async (req, res) => {
  try {
    const { donorName, email, amount, message } = req.body;
    await Donation.create({
      donorName: donorName?.trim(),
      email: email?.trim().toLowerCase(),
      amount: parseFloat(amount),
      message: message?.trim(),
      paymentStatus: 'completed', // Simulated
    });
    res.redirect('/donate?success=Thank you for your generous donation!');
  } catch (error) {
    res.render('pages/donate', { title: 'Support Our Mission', stats: { totalDonations: 0, totalRescued: 0, donorCount: 0 }, success: null, error: error.message });
  }
};
