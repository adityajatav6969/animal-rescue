// ============================================
// Animal Rescue Platform — Main Server
// ============================================

require('dotenv').config();
const express = require('express');
const path = require('path');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const connectDB = require('./config/database');

// Initialize Express
const app = express();
const PORT = process.env.PORT || 3000;

// ── Connect to MongoDB ──────────────────────
connectDB();

// ── View Engine ─────────────────────────────
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// ── Body Parsers ────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── Static Files ────────────────────────────
app.use(express.static(path.join(__dirname, 'public')));

// ── Session Configuration ───────────────────
app.use(
  session({
    secret: process.env.SESSION_SECRET || 'fallback-secret',
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: process.env.MONGO_URI,
      collectionName: 'sessions',
      ttl: 24 * 60 * 60, // 1 day
    }),
    cookie: {
      maxAge: 24 * 60 * 60 * 1000, // 1 day
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
    },
  })
);

// ── Language Middleware ──────────────────────
const translations = require('./config/translations');

app.use((req, res, next) => {
  // Read language from query param, cookie, or default to 'en'
  let lang = req.query.lang || req.session.lang || 'en';
  if (!translations[lang]) lang = 'en';

  // Persist choice in session
  if (req.query.lang) req.session.lang = lang;

  res.locals.t = translations[lang];
  res.locals.lang = lang;
  res.locals.admin = req.session.adminId || null;
  res.locals.currentPath = req.path;
  next();
});

// ── Routes ──────────────────────────────────
const pageRoutes = require('./routes/pageRoutes');
const reportRoutes = require('./routes/reportRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const statisticsRoutes = require('./routes/statistics');
const volunteerRoutes = require('./routes/volunteerRoutes');
const emergencyRoutes = require('./routes/emergencyRoutes');
const storiesRoutes = require('./routes/storiesRoutes');
const adoptionRoutes = require('./routes/adoptionRoutes');
const donationRoutes = require('./routes/donationRoutes');
const shelterRoutes = require('./routes/shelterRoutes');
const communityRoutes = require('./routes/communityRoutes');
const medicalRoutes = require('./routes/medicalRoutes');
const helplineRoutes = require('./routes/helplineRoutes');
const educationRoutes = require('./routes/educationRoutes');

app.use('/', pageRoutes);
app.use('/', reportRoutes);
app.use('/admin', authRoutes);
app.use('/admin', adminRoutes);
app.use('/', statisticsRoutes);
app.use('/', volunteerRoutes);
app.use('/', emergencyRoutes);
app.use('/', storiesRoutes);
app.use('/', adoptionRoutes);
app.use('/', donationRoutes);
app.use('/', shelterRoutes);
app.use('/', communityRoutes);
app.use('/', medicalRoutes);
app.use('/', helplineRoutes);
app.use('/', educationRoutes);

// ── 404 Handler ─────────────────────────────
app.use((req, res) => {
  res.status(404).render('pages/404', { title: 'Page Not Found' });
});

// ── Global Error Handler ────────────────────
app.use((err, req, res, next) => {
  console.error('❌ Server Error:', err.stack);
  res.status(500).render('pages/error', {
    title: 'Server Error',
    message: process.env.NODE_ENV === 'development' ? err.message : 'Something went wrong.',
  });
});

// ── Start Server ────────────────────────────
app.listen(PORT, () => {
  console.log(`\n🐾 Animal Rescue Platform running at http://localhost:${PORT}\n`);
});
