// ============================================
// Auth Controller — Admin login / logout
// ============================================

const User = require('../models/User');

/**
 * GET /admin/login — Show login page
 */
exports.loginPage = (req, res) => {
  if (req.session.adminId) {
    return res.redirect('/admin/dashboard');
  }
  res.render('admin/login', { title: 'Admin Login', error: null });
};

/**
 * POST /admin/login — Authenticate admin
 */
exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Please provide both username and password.',
      });
    }

    // Find admin by username
    const admin = await User.findOne({ username: username.trim() });
    if (!admin) {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Invalid credentials.',
      });
    }

    // Compare passwords
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) {
      return res.render('admin/login', {
        title: 'Admin Login',
        error: 'Invalid credentials.',
      });
    }

    // Set session
    req.session.adminId = admin._id;
    req.session.adminUsername = admin.username;

    // Redirect to return URL or dashboard
    const returnTo = req.session.returnTo || '/admin/dashboard';
    delete req.session.returnTo;
    return res.redirect(returnTo);
  } catch (error) {
    console.error('❌ Login error:', error);
    res.render('admin/login', {
      title: 'Admin Login',
      error: 'An error occurred. Please try again.',
    });
  }
};

/**
 * GET /admin/logout — Destroy session
 */
exports.logout = (req, res) => {
  req.session.destroy((err) => {
    if (err) console.error('❌ Logout error:', err);
    res.redirect('/admin/login');
  });
};
