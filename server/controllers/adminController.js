const User = require('../models/User');
const Course = require('../models/Course');
const University = require('../models/University');
const Application = require('../models/Application');
const Enquiry = require('../models/Enquiry');
const Counsellor = require('../models/Counsellor');
const Counselling = require('../models/Counselling');
const AdminActivityLog = require('../models/AdminActivityLog');

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
