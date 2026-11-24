const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');
const path = require('path');
const rateLimit = require('express-rate-limit');
const errorHandler = require('./middleware/error');

// Import Route handlers
const authRoutes = require('./routes/authRoutes');
const courseRoutes = require('./routes/courseRoutes');
const universityRoutes = require('./routes/universityRoutes');
const courseUniversityRoutes = require('./routes/courseUniversityRoutes');
const studentRoutes = require('./routes/studentRoutes');
const applicationRoutes = require('./routes/applicationRoutes');
const enquiryRoutes = require('./routes/enquiryRoutes');
const adminRoutes = require('./routes/adminRoutes');
const contentRoutes = require('./routes/contentRoutes');

const app = express();

// Security HTTP headers
app.use(
  helmet({
    crossOriginResourcePolicy: false,
  })
);

// CORS configuration
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'http://127.0.0.1:5173',
  process.env.CLIENT_URL,
].filter(Boolean);

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, true); // Permissive in dev/local environment
      }
    },
    credentials: true,
  })
);

// Rate Limiter
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 mins
  max: 500, // limit each IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    message: 'Too many requests from this IP, please try again after 15 minutes',
  },
});
app.use('/api', apiLimiter);

// Body parsers & cookies
app.use(express.json({ limit: '15mb' }));
app.use(express.urlencoded({ extended: true, limit: '15mb' }));
app.use(cookieParser());

// Development logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Serve uploaded static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Edge caching for public read requests (courses, universities, content)
app.use('/api', (req, res, next) => {
  if (req.method === 'GET' && !req.headers.authorization && !req.cookies?.token) {
    // Cache public catalog reads on Vercel Edge for 5 minutes, stale-while-revalidate for 10 minutes
    res.set('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=600');
  }
  next();
});

// Mount API routes
app.use('/api/auth', authRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/universities', universityRoutes);
app.use('/api/course-universities', courseUniversityRoutes);
app.use('/api/students', studentRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/enquiries', enquiryRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', contentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'CaptonAdmission API is online and operational',
    timestamp: new Date().toISOString(),
  });
});

// Centralized error handling
app.use(errorHandler);

module.exports = app;
