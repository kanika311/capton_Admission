const app = require('../server/app');
const { connectDB } = require('../server/config/db');

// Cache database connection across serverless invocations
let isConnected = false;

module.exports = async (req, res) => {
  if (!isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.error('[Vercel Serverless] MongoDB connection error:', err);
    }
  }
  return app(req, res);
};
