// ============================================
// Seed Script — Create default admin account
// ============================================
// Run: npm run seed

require('dotenv').config();
const dns = require('dns');
dns.setServers(['8.8.8.8', '8.8.4.4']);
const mongoose = require('mongoose');
const User = require('../models/User');

const ADMIN_USERNAME = 'admin';
const ADMIN_EMAIL = 'admin@animalrescue.org';
const ADMIN_PASSWORD = 'admin123';

async function seed() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('✅ Connected to MongoDB');

    // Check if admin already exists
    const existing = await User.findOne({ username: ADMIN_USERNAME });
    if (existing) {
      console.log('ℹ️  Admin account already exists. Skipping.');
    } else {
      await User.create({
        username: ADMIN_USERNAME,
        email: ADMIN_EMAIL,
        password: ADMIN_PASSWORD,
      });
      console.log(`✅ Admin created — username: ${ADMIN_USERNAME}  |  password: ${ADMIN_PASSWORD}`);
    }

    await mongoose.disconnect();
    console.log('✅ Done.');
    process.exit(0);
  } catch (error) {
    console.error('❌ Seed error:', error.message);
    process.exit(1);
  }
}

seed();
