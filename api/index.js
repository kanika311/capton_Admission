const app = require('../server/app');
const { connectDB } = require('../server/config/db');

// Initiate DB connection in background without blocking serverless function cold starts
if (process.env.MONGO_URI) {
  connectDB().catch((err) => {
    console.warn('[Vercel Serverless] DB background connection notice:', err.message);
  });
}

// Export the Express app directly so Vercel Serverless runtime natively manages response lifecycle
module.exports = app;
