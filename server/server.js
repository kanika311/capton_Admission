require('dotenv').config();
const app = require('./app');
const { connectDB } = require('./config/db');

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect Database
    await connectDB();

    // Check if initial seed is needed (e.g. fresh in-memory database)
    const Course = require('./models/Course');
    const courseCount = await Course.countDocuments();
    if (courseCount === 0) {
      console.log('[CaptonAdmission Server] Fresh database detected. Auto-seeding initial data...');
      const seedData = require('./utils/seed');
      await seedData();
    }

    const server = app.listen(PORT, () => {
      console.log(`[CaptonAdmission Server] Running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
      console.log(`[CaptonAdmission Server] Local API URL: http://localhost:${PORT}/api`);
    });

    // Handle Unhandled Promise Rejections
    process.on('unhandledRejection', (err) => {
      console.error(`Unhandled Rejection Error: ${err.message}`);
    });
  } catch (err) {
    console.error('Fatal Server Startup Error:', err.message);
    process.exit(1);
  }
};

startServer();
