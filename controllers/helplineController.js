// ============================================
// Helpline Controller
// ============================================

exports.getHelplinePage = (req, res) => {
  res.render('pages/helpline', { title: 'Animal Helplines' });
};
