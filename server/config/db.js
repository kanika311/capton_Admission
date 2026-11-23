const mongoose = require('mongoose');

let mongodInstance = null;

const connectDB = async () => {
  // If already connected in serverless/cached runtime, reuse existing connection
  if (mongoose.connection && mongoose.connection.readyState >= 1) {
    return mongoose.connection;
  }

  const uri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/captonadmission';

  try {
    // Attempt standard connection first with a short timeout to prevent long hanging
    const conn = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
    return conn;
  } catch (primaryErr) {
    console.warn(`[Database] Primary MongoDB connection failed (${primaryErr.message}).`);

    // In-memory fallback if local mongod is not installed or running
    try {
      console.log('[Database] Initializing In-Memory MongoDB Server for development fallback...');
      const { MongoMemoryServer } = require('mongodb-memory-server');
      mongodInstance = await MongoMemoryServer.create();
      const memUri = mongodInstance.getUri();
      const conn = await mongoose.connect(memUri);
      console.log(`[Database] Connected to In-Memory MongoDB successfully: ${memUri}`);
      return conn;
    } catch (memErr) {
      console.error('[Database] Failed to initialize in-memory database:', memErr.message);
      throw primaryErr;
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
