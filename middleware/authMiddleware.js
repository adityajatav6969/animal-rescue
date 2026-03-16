// ============================================
// Auth Middleware — Protect admin routes
// ============================================

/**
 * Checks if the user is logged in as admin.
 * If not, redirects to the admin login page.
 */
const isAdmin = (req, res, next) => {
  if (req.session && req.session.adminId) {
    return next();
  }
  req.session.returnTo = req.originalUrl;
  return res.redirect('/admin/login');
};

module.exports = { isAdmin };
