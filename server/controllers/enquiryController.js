const Enquiry = require('../models/Enquiry');
const Notification = require('../models/Notification');
const logAdminActivity = require('../services/activityLog');
const mongoose = require('mongoose');

const isDbReady = () => mongoose.connection && mongoose.connection.readyState === 1;

// @desc    Submit new admission enquiry
// @route   POST /api/enquiries
// @access  Public
exports.createEnquiry = async (req, res, next) => {
  try {
    const {
      name,
      email,
      phone,
      course,
      courseName,
      specialization,
      university,
      universityName,
      state,
      city,
      qualification,
      interestedInAbroad,
      interestedInOnline,
      message,
    } = req.body;

    const enquiryNumber = `ENQ-${new Date().getFullYear()}-${Math.floor(10000 + Math.random() * 90000)}`;

    if (isDbReady()) {
      try {
        const enquiry = await Enquiry.create({
          enquiryNumber,
          student: req.user ? req.user._id : null,
          name,
          email,
          phone,
          course: course || null,
          courseName: courseName || '',
          specialization: specialization || '',
          university: university || null,
          universityName: universityName || '',
          state: state || '',
          city: city || '',
          qualification: qualification || '',
          interestedInAbroad: Boolean(interestedInAbroad),
          interestedInOnline: Boolean(interestedInOnline),
          message: message || '',
        });

        return res.status(201).json({
          success: true,
          message: 'Enquiry submitted successfully! A senior academic counsellor will contact you within 24 hours.',
          data: enquiry,
        });
      } catch (dbErr) {
        console.warn('[Enquiry] DB save failed:', dbErr.message);
      }
    }

    // In-memory response fallback
    console.log('[Enquiry Received]:', { name, email, phone, courseName, city });
    res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! A senior academic counsellor will contact you within 24 hours.',
      data: { enquiryNumber, name, email, phone, courseName, city, status: 'New' },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all enquiries / leads
// @route   GET /api/enquiries
// @access  Private (Admin / Counsellor)
exports.getEnquiries = async (req, res, next) => {
  try {
    const { status, search, counsellorId } = req.query;
    const query = {};

    if (status && status !== 'All') {
      query.status = status;
    }

    if (counsellorId) {
      query.counsellorAssigned = counsellorId;
    }

    if (req.user.role === 'counsellor') {
      query.$or = [{ counsellorAssigned: req.user._id }, { counsellorAssigned: null }];
    }

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
        { phone: { $regex: search, $options: 'i' } },
        { enquiryNumber: { $regex: search, $options: 'i' } },
      ];
    }

    const enquiries = await Enquiry.find(query)
      .populate('counsellorAssigned', 'name email phone')
      .populate('course', 'name slug')
      .populate('university', 'name logo')
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: enquiries.length,
      data: enquiries,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single enquiry
// @route   GET /api/enquiries/:id
// @access  Private (Admin / Counsellor)
exports.getEnquiryById = async (req, res, next) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id)
      .populate('counsellorAssigned', 'name email phone')
      .populate('course')
      .populate('university')
      .populate('followUpNotes.addedBy', 'name role');

    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    res.status(200).json({ success: true, data: enquiry });
  } catch (err) {
    next(err);
  }
};

// @desc    Update enquiry status
// @route   PUT /api/enquiries/:id/status
// @access  Private (Admin / Counsellor)
exports.updateEnquiryStatus = async (req, res, next) => {
  try {
    const { status, note, nextFollowUpDate } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);
    if (!enquiry) {
      return res.status(404).json({ success: false, message: 'Enquiry not found' });
    }

    enquiry.status = status;
    if (note) {
      enquiry.followUpNotes.push({
        note,
        addedBy: req.user._id,
        date: new Date(),
        nextFollowUpDate: nextFollowUpDate || null,
      });
    }

    await enquiry.save();

    res.status(200).json({
      success: true,
      data: enquiry,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign counsellor to enquiry
// @route   PUT /api/enquiries/:id/assign
// @access  Private (Admin)
exports.assignEnquiryCounsellor = async (req, res, next) => {
  try {
    const { counsellorId } = req.body;
    const enquiry = await Enquiry.findByIdAndUpdate(
      req.params.id,
      { counsellorAssigned: counsellorId },
      { new: true }
    ).populate('counsellorAssigned', 'name email');

    res.status(200).json({ success: true, data: enquiry });
  } catch (err) {
    next(err);
  }
};
