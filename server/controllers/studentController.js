const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Shortlist = require('../models/Shortlist');
const Application = require('../models/Application');
const Notification = require('../models/Notification');

// @desc    Get current student's profile & education
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getStudentProfile = async (req, res, next) => {
  try {
    let profile = await StudentProfile.findOne({ user: req.user._id }).populate(
      'preferredCourses',
      'name slug level duration'
    );

    if (!profile) {
      profile = await StudentProfile.create({ user: req.user._id });
    }

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update student profile details
// @route   PUT /api/students/profile
// @access  Private (Student)
exports.updateStudentProfile = async (req, res, next) => {
  try {
    const { name, phone, dob, gender, address, city, state, pincode, preferredCourses, preferredSpecializations, preferredLocations } = req.body;

    // Update basic user fields
    if (name || phone) {
      await User.findByIdAndUpdate(req.user._id, {
        ...(name && { name }),
        ...(phone && { phone }),
      });
    }

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        dob,
        gender,
        address,
        city,
        state,
        pincode,
        preferredCourses,
        preferredSpecializations,
        preferredLocations,
      },
      { new: true, upsert: true, runValidators: true }
    ).populate('preferredCourses', 'name slug level');

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update student education details
// @route   PUT /api/students/education
// @access  Private (Student)
exports.updateEducation = async (req, res, next) => {
  try {
    const { tenthQualification, twelfthQualification, graduationDetails } = req.body;

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      {
        tenthQualification,
        twelfthQualification,
        graduationDetails,
      },
      { new: true, upsert: true }
    );

    res.status(200).json({
      success: true,
      data: profile,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Upload student document
// @route   POST /api/students/documents
// @access  Private (Student)
exports.uploadDocument = async (req, res, next) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { docType } = req.body;
    if (!docType) {
      return res.status(400).json({ success: false, message: 'Please specify document type' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const newDoc = {
      docType,
      name: req.file.originalname,
      url: fileUrl,
      status: 'Pending',
    };

    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $push: { documents: newDoc } },
      { new: true, upsert: true }
    );

    res.status(201).json({
      success: true,
      data: profile.documents,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete student document
// @route   DELETE /api/students/documents/:docId
// @access  Private (Student)
exports.deleteDocument = async (req, res, next) => {
  try {
    const profile = await StudentProfile.findOneAndUpdate(
      { user: req.user._id },
      { $pull: { documents: { _id: req.params.docId } } },
      { new: true }
    );

    res.status(200).json({
      success: true,
      data: profile.documents,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get student shortlists
// @route   GET /api/students/shortlists
// @access  Private (Student)
exports.getShortlists = async (req, res, next) => {
  try {
    const shortlists = await Shortlist.find({ student: req.user._id })
      .populate('university')
      .populate('course')
      .populate('courseUniversity')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: shortlists.length,
      data: shortlists,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Add university/course to shortlist
// @route   POST /api/students/shortlists
// @access  Private (Student)
exports.addShortlist = async (req, res, next) => {
  try {
    const { universityId, courseId, courseUniversityId } = req.body;

    const existing = await Shortlist.findOne({
      student: req.user._id,
      university: universityId,
      course: courseId,
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This university course is already in your shortlist',
      });
    }

    const item = await Shortlist.create({
      student: req.user._id,
      university: universityId,
      course: courseId,
      courseUniversity: courseUniversityId,
    });

    const populated = await Shortlist.findById(item._id)
      .populate('university')
      .populate('course')
      .populate('courseUniversity');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Remove from shortlist
// @route   DELETE /api/students/shortlists/:id
// @access  Private (Student)
exports.removeShortlist = async (req, res, next) => {
  try {
    await Shortlist.findOneAndDelete({
      _id: req.params.id,
      student: req.user._id,
    });

    res.status(200).json({
      success: true,
      message: 'Removed from shortlist',
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get student notifications
// @route   GET /api/students/notifications
// @access  Private (Student)
exports.getNotifications = async (req, res, next) => {
  try {
    const notifications = await Notification.find({ recipient: req.user._id }).sort({
      createdAt: -1,
    });
    res.status(200).json({ success: true, data: notifications });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/students/notifications/:id/read
// @access  Private (Student)
exports.markNotificationRead = async (req, res, next) => {
  try {
    await Notification.findOneAndUpdate(
      { _id: req.params.id, recipient: req.user._id },
      { isRead: true }
    );
    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
};
