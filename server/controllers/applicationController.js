const Application = require('../models/Application');
const Notification = require('../models/Notification');
const logAdminActivity = require('../services/activityLog');

// @desc    Submit new admission application
// @route   POST /api/applications
// @access  Private (Student)
exports.submitApplication = async (req, res, next) => {
  try {
    const { universityId, courseId, courseUniversityId, specialization, documents } = req.body;

    const count = await Application.countDocuments();
    const applicationNumber = `CA-${new Date().getFullYear()}-${String(count + 1001).padStart(5, '0')}`;

    const application = await Application.create({
      applicationNumber,
      student: req.user._id,
      university: universityId,
      course: courseId,
      courseUniversity: courseUniversityId,
      specialization: specialization || 'General',
      documents: documents || [],
      status: 'Submitted',
      timeline: [
        {
          status: 'Submitted',
          date: new Date(),
          comment: 'Application submitted successfully by student.',
        },
      ],
    });

    // Create notification for student
    await Notification.create({
      recipient: req.user._id,
      title: 'Application Submitted',
      message: `Your application ${applicationNumber} has been received and is under initial review.`,
      type: 'Application',
      link: `/student/applications`,
    });

    const populated = await Application.findById(application._id)
      .populate('university', 'name logo location')
      .populate('course', 'name slug level duration')
      .populate('courseUniversity');

    res.status(201).json({
      success: true,
      data: populated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get user's applications (Student) or all applications (Admin/Counsellor)
// @route   GET /api/applications
// @access  Private
exports.getApplications = async (req, res, next) => {
  try {
    const query = {};

    // If student, only their applications
    if (req.user.role === 'student') {
      query.student = req.user._id;
    } else if (req.user.role === 'counsellor') {
      // Counsellor sees assigned applications or unassigned
      query.$or = [{ counsellorAssigned: req.user._id }, { counsellorAssigned: null }];
    }

    if (req.query.status && req.query.status !== 'All') {
      query.status = req.query.status;
    }

    if (req.query.search) {
      query.$or = [
        { applicationNumber: { $regex: req.query.search, $options: 'i' } },
        { specialization: { $regex: req.query.search, $options: 'i' } },
      ];
    }

    const applications = await Application.find(query)
      .populate('student', 'name email phone avatar')
      .populate('university', 'name logo location universityType')
      .populate('course', 'name slug level duration')
      .populate('counsellorAssigned', 'name email')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: applications.length,
      data: applications,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single application by ID
// @route   GET /api/applications/:id
// @access  Private
exports.getApplicationById = async (req, res, next) => {
  try {
    const application = await Application.findById(req.params.id)
      .populate('student', 'name email phone avatar')
      .populate('university')
      .populate('course')
      .populate('courseUniversity')
      .populate('counsellorAssigned', 'name email phone')
      .populate('remarks.addedBy', 'name role');

    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    // Role verification: Student can only view their own
    if (
      req.user.role === 'student' &&
      application.student._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

// @desc    Update application status (Admin/Counsellor)
// @route   PUT /api/applications/:id/status
// @access  Private (Admin / Counsellor)
exports.updateApplicationStatus = async (req, res, next) => {
  try {
    const { status, comment } = req.body;

    const application = await Application.findById(req.params.id);
    if (!application) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    application.status = status;
    application.timeline.push({
      status,
      date: new Date(),
      comment: comment || `Status updated to ${status}`,
    });

    await application.save();

    // Notify student
    await Notification.create({
      recipient: application.student,
      title: 'Application Status Updated',
      message: `Your application ${application.applicationNumber} status is now: ${status}.`,
      type: 'Application',
      link: `/student/applications`,
    });

    logAdminActivity({
      adminId: req.user._id,
      action: 'UPDATE_APPLICATION_STATUS',
      targetModel: 'Application',
      targetId: application._id,
      details: { status, comment },
      req,
    });

    res.status(200).json({
      success: true,
      data: application,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign counsellor to application
// @route   PUT /api/applications/:id/assign
// @access  Private (Admin)
exports.assignCounsellor = async (req, res, next) => {
  try {
    const { counsellorId } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      { counsellorAssigned: counsellorId },
      { new: true }
    ).populate('counsellorAssigned', 'name email');

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};

// @desc    Add remark to application
// @route   POST /api/applications/:id/remarks
// @access  Private (Admin / Counsellor)
exports.addRemark = async (req, res, next) => {
  try {
    const { note } = req.body;
    const application = await Application.findByIdAndUpdate(
      req.params.id,
      {
        $push: {
          remarks: {
            note,
            addedBy: req.user._id,
            date: new Date(),
          },
        },
      },
      { new: true }
    ).populate('remarks.addedBy', 'name role');

    res.status(200).json({ success: true, data: application });
  } catch (err) {
    next(err);
  }
};
