const mongoose = require('mongoose');

let mongodInstance = null;

// Never buffer commands when disconnected so requests never hang
mongoose.set('bufferCommands', false);

const connectDB = async () => {
  // If already connected in serverless/cached runtime, reuse existing connection
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const uri = process.env.MONGO_URI;

  // On Vercel without MONGO_URI, use built-in mockStore directly without hanging
  if (isServerless && !uri) {
    console.log('[Database] Vercel serverless runtime without MONGO_URI. Using instant mockStore fallback.');
    return null;
  }

  const targetUri = uri || 'mongodb://127.0.0.1:27017/captonadmission';

  try {
    const conn = await mongoose.connect(targetUri, {
      serverSelectionTimeoutMS: 2500,
      connectTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);

    // If connected to empty database, auto-seed initial data
    try {
      const CourseCategory = require('../models/CourseCategory');
      const count = await CourseCategory.countDocuments();
      if (count === 0) {
        console.log('[Database] Database is empty. Auto-seeding initial courses and universities...');
        const seedData = require('../utils/seed');
        await seedData();
      }
    } catch (seedErr) {
      console.warn('[Database] Auto-seed check skipped:', seedErr.message);
    }

    return conn;
  } catch (primaryErr) {
    console.warn(`[Database] Primary MongoDB connection failed (${primaryErr.message}).`);

    // In Serverless, never attempt MongoMemoryServer
    if (isServerless) {
      console.log('[Database] Falling back to instant mockStore in serverless environment.');
      return null;
    }

    // Local development fallback only
    try {
      console.log('[Database] Initializing In-Memory MongoDB Server for local development fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory MongoDB successfully: ${memUri}`);

      // Auto seed in-memory DB
      const seedData = require('../utils/seed');
      await seedData();
      return conn;
    } catch (memErr) {
      console.error('[Database] Failed to initialize in-memory database:', memErr.message);
      return null;
    }
  }
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, closeDB };
