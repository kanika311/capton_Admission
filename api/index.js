const app = require('../server/app');
const { connectDB } = require('../server/config/db');

module.exports = async (req, res) => {
  if (process.env.MONGO_URI) {
    // Non-blocking DB connection check: race with 350ms
    // If DB is warm, it connects immediately. If cold or slow, proceeds to app without blocking!
    try {
      await Promise.race([
        connectDB(),
        new Promise((resolve) => setTimeout(resolve, 350)),
      ]);
    } catch (err) {
      console.warn('[Vercel Serverless] DB connection non-blocking warning:', err.message);
    }
  }
  return app(req, res);
};
