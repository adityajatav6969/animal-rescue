// ============================================
// Education Controller
// ============================================

exports.getEducationPage = (req, res) => {
  res.render('pages/education', { title: 'Animal Education' });
};

exports.getCareGuidePage = (req, res) => {
  res.render('pages/care-guide', { title: 'Animal Care Guide' });
};
