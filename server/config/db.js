const mongoose = require('mongoose');

let mongodInstance = null;
let connectionPromise = null;
let lastFailureTime = 0;
const FAILURE_COOLDOWN_MS = 30000; // 30s backoff if connection fails

// Never buffer commands when disconnected so requests never hang
mongoose.set('bufferCommands', false);

/**
 * Automatically sanitizes MongoDB URIs, fixing common user typos
 * such as appending '/<dbname>' after query parameters:
 * "...?replicaSet=atlas-xxx/captonadmission" -> ".../captonadmission?replicaSet=atlas-xxx"
 */
const sanitizeMongoUri = (rawUri) => {
  if (!rawUri) return rawUri;
  let uri = rawUri.trim();
  const rsMatch = uri.match(/[?&]replicaSet=([a-zA-Z0-9_-]+)\/([a-zA-Z0-9_-]+)/);
  if (rsMatch) {
    const rs = rsMatch[1];
    const db = rsMatch[2];
    uri = uri.replace(`replicaSet=${rs}/${db}`, `replicaSet=${rs}`);
    uri = uri.replace(/\/[a-zA-Z0-9_-]+\?/, `/${db}?`);
  }
  return uri;
};

const connectDB = async () => {
  // If already connected in serverless/cached runtime, reuse existing connection
  if (mongoose.connection && mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  // If a connection is already in flight, reuse the same promise to prevent parallel attempts
  if (connectionPromise) {
    return connectionPromise;
  }

  const isServerless = !!(process.env.VERCEL || process.env.AWS_LAMBDA_FUNCTION_NAME);
  const uri = process.env.MONGO_URI;

  // On Vercel without MONGO_URI, use built-in mockStore directly without hanging
  if (isServerless && !uri) {
    return null;
  }

  // Circuit breaker: skip attempt if connection failed recently
  if (Date.now() - lastFailureTime < FAILURE_COOLDOWN_MS) {
    return null;
  }

  const targetUri = sanitizeMongoUri(uri) || 'mongodb://127.0.0.1:27017/captonadmission';

  connectionPromise = (async () => {
    try {
      const conn = await mongoose.connect(targetUri, {
        serverSelectionTimeoutMS: 1500,
        connectTimeoutMS: 1500,
        maxPoolSize: 10,
      });
      console.log(`[Database] MongoDB Connected: ${conn.connection.host}/${conn.connection.name}`);
      lastFailureTime = 0;

      // Check if empty in the background
      setTimeout(async () => {
        try {
          const CourseCategory = require('../models/CourseCategory');
          const count = await CourseCategory.countDocuments();
          if (count === 0) {
            console.log('[Database] Database is empty. Auto-seeding initial courses and universities...');
            const seedData = require('../utils/seed');
            await seedData();
          }
        } catch {
          // ignore background check errors
        }
      }, 100);

      return conn;
    } catch (primaryErr) {
      console.warn(`[Database] Primary MongoDB connection failed (${primaryErr.message}).`);
      lastFailureTime = Date.now();
      connectionPromise = null;

      // In Serverless, never attempt MongoMemoryServer
      if (isServerless) {
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
  })();

  return connectionPromise;
};

const closeDB = async () => {
  await mongoose.disconnect();
  if (mongodInstance) {
    await mongodInstance.stop();
  }
};

module.exports = { connectDB, closeDB, sanitizeMongoUri };
