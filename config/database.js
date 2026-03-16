// ============================================
// Database Connection — MongoDB Atlas via Mongoose
// ============================================

const dns = require('dns');
// Force Google DNS — fixes SRV resolution issues on some networks
dns.setServers(['8.8.8.8', '8.8.4.4']);

const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`❌ MongoDB Connection Error: ${error.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
