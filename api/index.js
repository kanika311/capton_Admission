const app = require('../server/app');
const { connectDB } = require('../server/config/db');

// Cache database connection across serverless invocations
let isConnected = false;

module.exports = async (req, res) => {
  if (process.env.MONGO_URI && !isConnected) {
    try {
      await connectDB();
      isConnected = true;
    } catch (err) {
      console.warn('[Vercel Serverless] MongoDB connection warning:', err.message);
    }
  }
  return app(req, res);
};
