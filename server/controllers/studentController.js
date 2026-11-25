const StudentProfile = require('../models/StudentProfile');
const User = require('../models/User');
const Shortlist = require('../models/Shortlist');
const Application = require('../models/Application');
const Notification = require('../models/Notification');
const mongoose = require('mongoose');

const isDbReady = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-memory student profiles cache for mock / serverless runtime
const mockStudentProfiles = new Map();

// @desc    Get current student's profile & education
// @route   GET /api/students/profile
// @access  Private (Student)
exports.getStudentProfile = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;

    if (isDbReady()) {
      try {
        let profile = await StudentProfile.findOne({ user: userId }).populate(
          'preferredCourses',
          'name slug level duration'
        );

        if (!profile) {
          profile = await StudentProfile.create({ user: userId });
        }

        return res.status(200).json({
          success: true,
          data: profile,
        });
      } catch (dbErr) {
        console.warn('[StudentProfile] DB query notice:', dbErr.message);
      }
    }

    let mockProfile = mockStudentProfiles.get(String(userId));
    if (!mockProfile) {
      mockProfile = {
        _id: `profile_${userId}`,
        user: userId,
        preferredCourses: [],
        preferredSpecializations: [],
        preferredLocations: [],
        documents: [],
      };
      mockStudentProfiles.set(String(userId), mockProfile);
    }

    res.status(200).json({
      success: true,
      data: mockProfile,
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
    const userId = req.user._id || req.user.id;
    const { name, phone, dob, gender, address, city, state, pincode, preferredCourses, preferredSpecializations, preferredLocations } = req.body;

    if (isDbReady()) {
      try {
        // Update basic user fields
        if (name || phone) {
          await User.findByIdAndUpdate(userId, {
            ...(name && { name }),
            ...(phone && { phone }),
          });
        }

        const profile = await StudentProfile.findOneAndUpdate(
          { user: userId },
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

        return res.status(200).json({
          success: true,
          data: profile,
        });
      } catch (dbErr) {
        console.warn('[Update StudentProfile] DB error:', dbErr.message);
      }
    }

    let mockProfile = mockStudentProfiles.get(String(userId)) || { user: userId, documents: [] };
    mockProfile = {
      ...mockProfile,
      dob,
      gender,
      address,
      city,
      state,
      pincode,
      preferredCourses: preferredCourses || [],
      preferredSpecializations: preferredSpecializations || [],
      preferredLocations: preferredLocations || [],
    };
    mockStudentProfiles.set(String(userId), mockProfile);

    res.status(200).json({
      success: true,
      data: mockProfile,
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
    const userId = req.user._id || req.user.id;
    const { tenthQualification, twelfthQualification, graduationDetails } = req.body;

    if (isDbReady()) {
      try {
        const profile = await StudentProfile.findOneAndUpdate(
          { user: userId },
          {
            tenthQualification,
            twelfthQualification,
            graduationDetails,
          },
          { new: true, upsert: true }
        );

        return res.status(200).json({
          success: true,
          data: profile,
        });
      } catch (dbErr) {
        console.warn('[Update Education] DB error:', dbErr.message);
      }
    }

    let mockProfile = mockStudentProfiles.get(String(userId)) || { user: userId };
    mockProfile = {
      ...mockProfile,
      tenthQualification,
      twelfthQualification,
      graduationDetails,
    };
    mockStudentProfiles.set(String(userId), mockProfile);

    res.status(200).json({
      success: true,
      data: mockProfile,
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
    const userId = req.user._id || req.user.id;
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'Please upload a file' });
    }

    const { docType } = req.body;
    if (!docType) {
      return res.status(400).json({ success: false, message: 'Please specify document type' });
    }

    const fileUrl = `/uploads/${req.file.filename}`;
    const newDoc = {
      _id: `doc_${Date.now()}`,
      docType,
      name: req.file.originalname,
      url: fileUrl,
      status: 'Pending',
    };

    if (isDbReady()) {
      try {
        const profile = await StudentProfile.findOneAndUpdate(
          { user: userId },
          { $push: { documents: newDoc } },
          { new: true, upsert: true }
        );

        return res.status(201).json({
          success: true,
          data: profile.documents,
        });
      } catch (dbErr) {
        console.warn('[Upload Document] DB error:', dbErr.message);
      }
    }

    let mockProfile = mockStudentProfiles.get(String(userId)) || { user: userId, documents: [] };
    mockProfile.documents = [...(mockProfile.documents || []), newDoc];
    mockStudentProfiles.set(String(userId), mockProfile);

    res.status(201).json({
      success: true,
      data: mockProfile.documents,
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
    const userId = req.user._id || req.user.id;
    if (isDbReady()) {
      try {
        const profile = await StudentProfile.findOneAndUpdate(
          { user: userId },
          { $pull: { documents: { _id: req.params.docId } } },
          { new: true }
        );

        return res.status(200).json({
          success: true,
          data: profile?.documents || [],
        });
      } catch (dbErr) {
        console.warn('[Delete Document] DB error:', dbErr.message);
      }
    }

    let mockProfile = mockStudentProfiles.get(String(userId)) || { user: userId, documents: [] };
    mockProfile.documents = (mockProfile.documents || []).filter((d) => String(d._id) !== String(req.params.docId));
    mockStudentProfiles.set(String(userId), mockProfile);

    res.status(200).json({
      success: true,
      data: mockProfile.documents,
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
    const userId = req.user._id || req.user.id;
    if (isDbReady()) {
      try {
        const shortlists = await Shortlist.find({ student: userId })
          .populate('university')
          .populate('course')
          .populate('courseUniversity')
          .sort({ createdAt: -1 });

        return res.status(200).json({
          success: true,
          count: shortlists.length,
          data: shortlists,
        });
      } catch (dbErr) {
        console.warn('[Shortlists] DB error:', dbErr.message);
      }
    }

    res.status(200).json({
      success: true,
      count: 0,
      data: [],
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
    const userId = req.user._id || req.user.id;
    const { universityId, courseId, courseUniversityId } = req.body;

    if (isDbReady()) {
      try {
        const existing = await Shortlist.findOne({
          student: userId,
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
          student: userId,
          university: universityId,
          course: courseId,
          courseUniversity: courseUniversityId,
        });

        const populated = await Shortlist.findById(item._id)
          .populate('university')
          .populate('course')
          .populate('courseUniversity');

        return res.status(201).json({
          success: true,
          data: populated,
        });
      } catch (dbErr) {
        console.warn('[Add Shortlist] DB error:', dbErr.message);
      }
    }

    res.status(201).json({
      success: true,
      data: {
        _id: `shortlist_${Date.now()}`,
        student: userId,
        university: universityId,
        course: courseId,
        courseUniversity: courseUniversityId,
      },
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
    const userId = req.user._id || req.user.id;
    if (isDbReady()) {
      try {
        await Shortlist.findOneAndDelete({
          _id: req.params.id,
          student: userId,
        });
      } catch (dbErr) {
        console.warn('[Remove Shortlist] DB error:', dbErr.message);
      }
    }

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
    const userId = req.user._id || req.user.id;
    if (isDbReady()) {
      try {
        const notifications = await Notification.find({ recipient: userId }).sort({
          createdAt: -1,
        });
        return res.status(200).json({ success: true, data: notifications });
      } catch (dbErr) {
        console.warn('[Notifications] DB error:', dbErr.message);
      }
    }

    res.status(200).json({
      success: true,
      data: [
        {
          _id: 'notif_welcome',
          title: 'Welcome to CaptonAdmission',
          message: 'Your account has been setup. Start discovering courses and universities.',
          createdAt: new Date().toISOString(),
          isRead: false,
        },
      ],
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Mark notification as read
// @route   PUT /api/students/notifications/:id/read
// @access  Private (Student)
exports.markNotificationRead = async (req, res, next) => {
  try {
    const userId = req.user._id || req.user.id;
    if (isDbReady()) {
      try {
        await Notification.findOneAndUpdate(
          { _id: req.params.id, recipient: userId },
          { isRead: true }
        );
      } catch (dbErr) {
        console.warn('[Mark Notification] DB error:', dbErr.message);
      }
    }

    res.status(200).json({ success: true, message: 'Notification marked as read' });
  } catch (err) {
    next(err);
  }
};
