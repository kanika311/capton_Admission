const Application = require('../models/Application');
const Notification = require('../models/Notification');
const logAdminActivity = require('../services/activityLog');
const mongoose = require('mongoose');

const isDbReady = () => mongoose.connection && mongoose.connection.readyState === 1;

// In-memory applications store for serverless/offline resilience
const mockApplications = [
  {
    _id: 'app_mock_1',
    applicationNumber: 'CA-2026-01001',
    student: { _id: 'mock_student_1', name: 'Kanika Aggarwal', email: 'aggarwalkanika676@gmail.com' },
    university: { _id: 'u1', name: 'Massachusetts Institute of Technology', location: { city: 'Cambridge', country: 'United States' } },
    course: { _id: 'c1', name: 'B.Tech Computer Science & Engineering', level: 'Undergraduate', duration: '4 Years' },
    specialization: 'Artificial Intelligence',
    status: 'Submitted',
    timeline: [
      { status: 'Submitted', date: new Date(), comment: 'Application submitted successfully.' },
    ],
    createdAt: new Date().toISOString(),
  },
];

// @desc    Submit new admission application
// @route   POST /api/applications
// @access  Private (Student)
exports.submitApplication = async (req, res, next) => {
  try {
    const { universityId, courseId, courseUniversityId, specialization, documents } = req.body;
    const userId = req.user._id || req.user.id;

    if (isDbReady()) {
      try {
        const count = await Application.countDocuments();
        const applicationNumber = `CA-${new Date().getFullYear()}-${String(count + 1001).padStart(5, '0')}`;

        const application = await Application.create({
          applicationNumber,
          student: userId,
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
        try {
          await Notification.create({
            recipient: userId,
            title: 'Application Submitted',
            message: `Your application ${applicationNumber} has been received and is under initial review.`,
            type: 'Application',
            link: `/student/applications`,
          });
        } catch {}

        const populated = await Application.findById(application._id)
          .populate('university', 'name logo location')
          .populate('course', 'name slug level duration')
          .populate('courseUniversity');

        return res.status(201).json({
          success: true,
          data: populated,
        });
      } catch (dbErr) {
        console.warn('[Submit Application] DB error, using mock:', dbErr.message);
      }
    }

    const applicationNumber = `CA-${new Date().getFullYear()}-${String(mockApplications.length + 1001).padStart(5, '0')}`;
    const newMockApp = {
      _id: `app_${Date.now()}`,
      applicationNumber,
      student: req.user,
      university: { _id: universityId, name: 'Selected University' },
      course: { _id: courseId, name: 'Selected Degree' },
      specialization: specialization || 'General',
      documents: documents || [],
      status: 'Submitted',
      timeline: [{ status: 'Submitted', date: new Date(), comment: 'Application submitted successfully.' }],
      createdAt: new Date().toISOString(),
    };
    mockApplications.unshift(newMockApp);

    res.status(201).json({
      success: true,
      data: newMockApp,
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
    const userId = req.user._id || req.user.id;

    if (isDbReady()) {
      try {
        const query = {};

        // If student, only their applications
        if (req.user.role === 'student') {
          query.student = userId;
        } else if (req.user.role === 'counsellor') {
          // Counsellor sees assigned applications or unassigned
          query.$or = [{ counsellorAssigned: userId }, { counsellorAssigned: null }];
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

        return res.status(200).json({
          success: true,
          count: applications.length,
          data: applications,
        });
      } catch (dbErr) {
        console.warn('[Get Applications] DB query error, using fallback:', dbErr.message);
      }
    }

    let apps = [...mockApplications];
    if (req.user.role === 'student') {
      apps = apps.filter((a) => String(a.student?._id || a.student) === String(userId));
    }
    if (req.query.status && req.query.status !== 'All') {
      apps = apps.filter((a) => a.status === req.query.status);
    }

    res.status(200).json({
      success: true,
      count: apps.length,
      data: apps,
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
    const userId = req.user._id || req.user.id;

    if (isDbReady()) {
      try {
        const application = await Application.findById(req.params.id)
          .populate('student', 'name email phone avatar')
          .populate('university')
          .populate('course')
          .populate('courseUniversity')
          .populate('counsellorAssigned', 'name email phone')
          .populate('remarks.addedBy', 'name role');

        if (application) {
          // Role verification: Student can only view their own
          if (
            req.user.role === 'student' &&
            application.student?._id?.toString() !== userId.toString()
          ) {
            return res.status(403).json({ success: false, message: 'Unauthorized' });
          }

          return res.status(200).json({ success: true, data: application });
        }
      } catch (dbErr) {
        console.warn('[ApplicationById] DB error:', dbErr.message);
      }
    }

    const mockApp = mockApplications.find((a) => String(a._id) === String(req.params.id));
    if (!mockApp) {
      return res.status(404).json({ success: false, message: 'Application not found' });
    }

    res.status(200).json({ success: true, data: mockApp });
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

    if (isDbReady()) {
      try {
        const application = await Application.findById(req.params.id);
        if (application) {
          application.status = status;
          application.timeline.push({
            status,
            date: new Date(),
            comment: comment || `Status updated to ${status}`,
          });

          await application.save();

          try {
            await Notification.create({
              recipient: application.student,
              title: 'Application Status Updated',
              message: `Your application ${application.applicationNumber} status is now: ${status}.`,
              type: 'Application',
              link: `/student/applications`,
            });
          } catch {}

          return res.status(200).json({
            success: true,
            data: application,
          });
        }
      } catch (dbErr) {
        console.warn('[Update Status] DB error:', dbErr.message);
      }
    }

    const mockApp = mockApplications.find((a) => String(a._id) === String(req.params.id));
    if (mockApp) {
      mockApp.status = status;
      mockApp.timeline.push({ status, date: new Date(), comment: comment || `Status updated to ${status}` });
      return res.status(200).json({ success: true, data: mockApp });
    }

    res.status(404).json({ success: false, message: 'Application not found' });
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
    if (isDbReady()) {
      try {
        const application = await Application.findByIdAndUpdate(
          req.params.id,
          { counsellorAssigned: counsellorId },
          { new: true }
        ).populate('counsellorAssigned', 'name email');

        if (application) return res.status(200).json({ success: true, data: application });
      } catch (dbErr) {
        console.warn('[Assign Counsellor] DB error:', dbErr.message);
      }
    }

    res.status(200).json({ success: true, data: { _id: req.params.id, counsellorAssigned: counsellorId } });
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
    const userId = req.user._id || req.user.id;

    if (isDbReady()) {
      try {
        const application = await Application.findByIdAndUpdate(
          req.params.id,
          {
            $push: {
              remarks: {
                note,
                addedBy: userId,
                date: new Date(),
              },
            },
          },
          { new: true }
        ).populate('remarks.addedBy', 'name role');

        if (application) return res.status(200).json({ success: true, data: application });
      } catch (dbErr) {
        console.warn('[Add Remark] DB error:', dbErr.message);
      }
    }

    res.status(200).json({ success: true, data: { _id: req.params.id, note } });
  } catch (err) {
    next(err);
  }
};
