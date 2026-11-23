const User = require('../models/User');
const StudentProfile = require('../models/StudentProfile');
const sendEmail = require('../services/emailService');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const mongoose = require('mongoose');

const isDbReady = () => mongoose.connection && mongoose.connection.readyState === 1;

// Built-in verified users for offline / serverless fallback
const mockUsers = [
  {
    _id: 'usr_admin',
    name: 'Super Administrator',
    email: 'admin@captonadmission.com',
    password: 'Admin@12345',
    phone: '+91 9876543210',
    role: 'superadmin',
    isActive: true,
  },
  {
    _id: 'usr_counsellor',
    name: 'Dr. Rajesh Sharma',
    email: 'counsellor@captonadmission.com',
    password: 'Counsellor@12345',
    phone: '+91 9876543211',
    role: 'counsellor',
    isActive: true,
  },
  {
    _id: 'usr_student',
    name: 'Aarav Patel',
    email: 'student@captonadmission.com',
    password: 'Student@12345',
    phone: '+91 9876543212',
    role: 'student',
    isActive: true,
  },
];

// Helper to send token response with cookie
const sendTokenResponse = (user, statusCode, res) => {
  const token = typeof user.getSignedJwtToken === 'function'
    ? user.getSignedJwtToken()
    : jwt.sign(
        { id: user._id, role: user.role, name: user.name, email: user.email },
        process.env.JWT_SECRET || 'capton_admission_jwt_super_secret_key_2026_secure',
        { expiresIn: '7d' }
      );

  const options = {
    expires: new Date(
      Date.now() + (process.env.JWT_COOKIE_EXPIRE || 7) * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  };

  res.status(statusCode).cookie('token', token, options).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      phone: user.phone,
      role: user.role,
      avatar: user.avatar,
      isActive: user.isActive,
    },
  });
};

// @desc    Register a new user (student)
// @route   POST /api/auth/register
// @access  Public
exports.register = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;

    // Check if email already registered
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'An account with this email address already exists',
      });
    }

    // Students are default; admins cannot be created publicly
    const userRole = role === 'student' || !role ? 'student' : 'student';

    const user = await User.create({
      name,
      email,
      password,
      phone: phone || '',
      role: userRole,
    });

    // Create student profile automatically
    if (user.role === 'student') {
      await StudentProfile.create({
        user: user._id,
      });
    }

    sendTokenResponse(user, 201, res);
  } catch (err) {
    next(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
exports.login = async (req, res, next) => {
  try {
    const { email, password, portal } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide both email and password',
      });
    }

    if (isDbReady()) {
      try {
        const user = await User.findOne({ email }).select('+password');
        if (user) {
          const isMatch = await user.matchPassword(password);
          if (!isMatch) {
            return res.status(401).json({
              success: false,
              message: 'Invalid email or password',
            });
          }

          if (!user.isActive) {
            return res.status(403).json({
              success: false,
              message: 'Your account is deactivated. Please contact support.',
            });
          }

          // Portal role segregation
          if (portal === 'student' && user.role !== 'student') {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: This login is for students only. Staff and Administrators must log in from the Admin Portal.',
            });
          }

          if (portal === 'admin' && user.role === 'student') {
            return res.status(403).json({
              success: false,
              message: 'Access Denied: Staff or Administrator account required. Students please sign in via Student Login.',
            });
          }

          user.lastLogin = Date.now();
          await user.save({ validateBeforeSave: false });

          return sendTokenResponse(user, 200, res);
        }
      } catch (dbErr) {
        console.warn('[Auth] DB login query failed:', dbErr.message);
      }
    }

    // In-memory fallback authentication
    const mockUser = mockUsers.find((u) => u.email.toLowerCase() === email.toLowerCase());
    if (mockUser && mockUser.password === password) {
      if (portal === 'student' && mockUser.role !== 'student') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: This login is for students only. Staff and Administrators must log in from the Admin Portal.',
        });
      }

      if (portal === 'admin' && mockUser.role === 'student') {
        return res.status(403).json({
          success: false,
          message: 'Access Denied: Staff or Administrator account required. Students please sign in via Student Login.',
        });
      }

      return sendTokenResponse(mockUser, 200, res);
    }

    return res.status(401).json({
      success: false,
      message: 'Invalid email or password',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Logout user / clear cookie
// @route   POST /api/auth/logout
// @access  Private
exports.logout = (req, res) => {
  res.cookie('token', 'none', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out successfully',
  });
};

// @desc    Get current logged in user
// @route   GET /api/auth/me
// @access  Private
exports.getMe = async (req, res, next) => {
  try {
    if (isDbReady()) {
      const user = await User.findById(req.user.id || req.user._id);
      if (user) {
        let profile = null;
        if (user.role === 'student') {
          profile = await StudentProfile.findOne({ user: user._id }).populate('preferredCourses');
        }
        return res.status(200).json({ success: true, user, profile });
      }
    }

    res.status(200).json({
      success: true,
      user: req.user,
      profile: null,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Forgot Password
// @route   POST /api/auth/forgot-password
// @access  Public
exports.forgotPassword = async (req, res, next) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'There is no user with that email address',
      });
    }

    // Generate reset token
    const resetToken = crypto.randomBytes(20).toString('hex');
    user.resetPasswordToken = crypto
      .createHash('sha256')
      .update(resetToken)
      .digest('hex');
    user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 minutes

    await user.save({ validateBeforeSave: false });

    const resetUrl = `${process.env.CLIENT_URL || 'http://localhost:5173'}/reset-password/${resetToken}`;
    const message = `You are receiving this email because you requested a password reset. Please click on the link below:\n\n${resetUrl}\n\nIf you did not request this, please ignore this email.`;

    await sendEmail({
      email: user.email,
      subject: 'CaptonAdmission Password Reset Token',
      message,
    });

    res.status(200).json({
      success: true,
      message: 'Password reset link sent to your email',
      resetToken, // for ease of testing in dev
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Reset Password
// @route   PUT /api/auth/reset-password/:resetToken
// @access  Public
exports.resetPassword = async (req, res, next) => {
  try {
    const resetPasswordToken = crypto
      .createHash('sha256')
      .update(req.params.resetToken)
      .digest('hex');

    const user = await User.findOne({
      resetPasswordToken,
      resetPasswordExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired password reset token',
      });
    }

    user.password = req.body.password;
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;
    await user.save();

    sendTokenResponse(user, 200, res);
  } catch (err) {
    next(err);
  }
};
