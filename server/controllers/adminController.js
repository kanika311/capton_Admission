const User = require('../models/User');
const Course = require('../models/Course');
const University = require('../models/University');
const Application = require('../models/Application');
const Enquiry = require('../models/Enquiry');
const Counsellor = require('../models/Counsellor');
const Counselling = require('../models/Counselling');
const AdminActivityLog = require('../models/AdminActivityLog');
const mongoose = require('mongoose');
const mockStore = require('../utils/mockStore');

const isDbReady = () => mongoose.connection && mongoose.connection.readyState === 1;

// @desc    Get aggregated dashboard analytics
// @route   GET /api/admin/dashboard
// @access  Private (Admin / Super Admin)
exports.getDashboardAnalytics = async (req, res, next) => {
  try {
    const [
      totalStudents,
      totalUniversities,
      totalCourses,
      totalApplications,
      totalEnquiries,
      totalCounselling,
    ] = await Promise.all([
      User.countDocuments({ role: 'student' }),
      University.countDocuments(),
      Course.countDocuments(),
      Application.countDocuments(),
      Enquiry.countDocuments(),
      Counselling.countDocuments(),
    ]);

    // Application Status breakdown
    const applicationStatuses = await Application.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Enquiry Status breakdown
    const enquiryStatuses = await Enquiry.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);

    // Monthly admissions/applications trend
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 5);

    const monthlyApplications = await Application.aggregate([
      {
        $match: {
          createdAt: { $gte: sixMonthsAgo },
        },
      },
      {
        $group: {
          _id: {
            month: { $month: '$createdAt' },
            year: { $year: '$createdAt' },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
    ]);

    // Format monthly data for Recharts
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const monthlyTrend = monthlyApplications.map((item) => ({
      name: `${months[item._id.month - 1]}`,
      applications: item.count,
    }));

    // If fewer than 6 entries, provide default friendly trend shape
    if (monthlyTrend.length === 0) {
      monthlyTrend.push(
        { name: 'Jun', applications: 12 },
        { name: 'Jul', applications: 28 },
        { name: 'Aug', applications: 45 },
        { name: 'Sep', applications: 35 },
        { name: 'Oct', applications: 58 },
        { name: 'Nov', applications: 82 }
      );
    }

    res.status(200).json({
      success: true,
      stats: {
        totalStudents,
        totalUniversities,
        totalCourses,
        totalApplications,
        totalEnquiries,
        totalCounselling,
      },
      applicationStatuses,
      enquiryStatuses,
      monthlyTrend,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all students
// @route   GET /api/admin/students
// @access  Private (Admin)
exports.getStudents = async (req, res, next) => {
  try {
    const { search, isActive } = req.query;
    const query = { role: 'student' };

    if (isActive !== undefined) {
      query.isActive = isActive === 'true';
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
      ];
    }

    const students = await User.find(query).sort({ createdAt: -1 });
    res.status(200).json({ success: true, count: students.length, data: students });
  } catch (err) {
    next(err);
  }
};

// @desc    Toggle student active status
// @route   PUT /api/admin/students/:id/toggle-status
// @access  Private (Admin)
exports.toggleStudentStatus = async (req, res, next) => {
  try {
    const student = await User.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ success: false, message: 'Student not found' });
    }
    student.isActive = !student.isActive;
    await student.save();
    res.status(200).json({ success: true, data: student });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all counsellors
// @route   GET /api/admin/counsellors
// @access  Private (Admin)
exports.getCounsellors = async (req, res, next) => {
  try {
    const counsellors = await Counsellor.find().populate('user', 'name email phone avatar isActive');
    res.status(200).json({ success: true, count: counsellors.length, data: counsellors });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new counsellor
// @route   POST /api/admin/counsellors
// @access  Private (Admin)
exports.createCounsellor = async (req, res, next) => {
  try {
    const { name, email, password, phone, specializationAreas, bio } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists with this email' });
    }

    const user = await User.create({
      name,
      email,
      password: password || 'Counsellor@12345',
      phone: phone || '',
      role: 'counsellor',
    });

    const counsellor = await Counsellor.create({
      user: user._id,
      specializationAreas: specializationAreas || ['Engineering', 'Medical', 'Management'],
      bio: bio || 'Professional CaptonAdmission counsellor.',
    });

    const populated = await Counsellor.findById(counsellor._id).populate('user');
    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// @desc    Get admin activity logs
// @route   GET /api/admin/activity-logs
// @access  Private (Admin)
exports.getActivityLogs = async (req, res, next) => {
  try {
    const logs = await AdminActivityLog.find()
      .populate('admin', 'name email role')
      .sort({ createdAt: -1 })
      .limit(100);

    res.status(200).json({ success: true, data: logs });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all admin users
// @route   GET /api/admin/admins
// @access  Private (Admin / Superadmin)
exports.getAdmins = async (req, res, next) => {
  try {
    if (isDbReady()) {
      const admins = await User.find({ role: { $in: ['admin', 'superadmin'] } })
        .select('-password')
        .sort({ createdAt: -1 });

      if (admins && admins.length > 0) {
        return res.status(200).json({ success: true, count: admins.length, data: admins });
      }
    }

    const mockAdmins = mockStore.getUsers().filter((u) => u.role === 'admin' || u.role === 'superadmin');
    res.status(200).json({ success: true, count: mockAdmins.length, data: mockAdmins });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new admin user
// @route   POST /api/admin/admins
// @access  Private (Admin / Superadmin)
exports.createAdmin = async (req, res, next) => {
  try {
    const { name, email, password, phone, role } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: 'Please provide name, email (Admin ID), and password' });
    }

    const assignedRole = role === 'superadmin' ? 'superadmin' : 'admin';

    if (isDbReady()) {
      const existing = await User.findOne({ email: email.toLowerCase() });
      if (existing) {
        return res.status(400).json({ success: false, message: 'An account with this email/ID already exists' });
      }

      const admin = await User.create({
        name,
        email: email.toLowerCase(),
        password,
        phone: phone || '',
        role: assignedRole,
        isActive: true,
      });

      const result = admin.toObject();
      delete result.password;
      return res.status(201).json({ success: true, data: result, message: 'New admin created successfully' });
    }

    // Mock fallback
    const existingMock = mockStore.getUserByEmail(email);
    if (existingMock) {
      return res.status(400).json({ success: false, message: 'An account with this email/ID already exists' });
    }

    const newAdmin = mockStore.addUser({
      name,
      email: email.toLowerCase(),
      password,
      phone: phone || '',
      role: assignedRole,
      isActive: true,
    });

    const result = { ...newAdmin };
    delete result.password;
    res.status(201).json({ success: true, data: result, message: 'New admin created successfully' });
  } catch (err) {
    next(err);
  }
};

// @desc    Update admin user
// @route   PUT /api/admin/admins/:id
// @access  Private (Admin / Superadmin)
exports.updateAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { name, email, role, phone, isActive, password } = req.body;

    if (isDbReady() && mongoose.Types.ObjectId.isValid(id)) {
      const admin = await User.findById(id).select('+password');
      if (!admin) {
        return res.status(404).json({ success: false, message: 'Admin user not found' });
      }

      if (name) admin.name = name;
      if (email) admin.email = email.toLowerCase();
      if (role) admin.role = role;
      if (phone !== undefined) admin.phone = phone;
      if (isActive !== undefined) admin.isActive = isActive;
      if (password && password.trim().length >= 6) {
        admin.password = password;
      }

      await admin.save();
      const result = admin.toObject();
      delete result.password;
      return res.status(200).json({ success: true, data: result, message: 'Admin updated successfully' });
    }

    // Mock fallback
    const updated = mockStore.updateUser(id, {
      ...(name && { name }),
      ...(email && { email: email.toLowerCase() }),
      ...(role && { role }),
      ...(phone !== undefined && { phone }),
      ...(isActive !== undefined && { isActive }),
      ...(password && password.trim().length >= 6 && { password }),
    });

    if (updated) {
      const result = { ...updated };
      delete result.password;
      return res.status(200).json({ success: true, data: result, message: 'Admin updated successfully' });
    }

    res.status(404).json({ success: false, message: 'Admin user not found' });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete admin user
// @route   DELETE /api/admin/admins/:id
// @access  Private (Admin / Superadmin)
exports.deleteAdmin = async (req, res, next) => {
  try {
    const { id } = req.params;
    const currentUserId = req.user.id || req.user._id;

    if (id === currentUserId || (req.user.email && id === req.user.email)) {
      return res.status(400).json({ success: false, message: 'You cannot delete your own logged-in admin account' });
    }

    if (isDbReady() && mongoose.Types.ObjectId.isValid(id)) {
      await User.findByIdAndDelete(id);
    }

    mockStore.deleteUser(id);
    res.status(200).json({ success: true, message: 'Admin account deleted successfully' });
  } catch (err) {
    next(err);
  }
};
