const Enquiry = require('../models/Enquiry');
const Notification = require('../models/Notification');
const logAdminActivity = require('../services/activityLog');
const mongoose = require('mongoose');
const mockStore = require('../utils/mockStore');

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

    let savedEnquiry = null;

    if (isDbReady()) {
      try {
        savedEnquiry = await Enquiry.create({
          enquiryNumber,
          student: req.user ? req.user._id : null,
          name,
          email,
          phone,
          course: (course && mongoose.Types.ObjectId.isValid(course)) ? course : null,
          courseName: courseName || '',
          specialization: specialization || '',
          university: (university && mongoose.Types.ObjectId.isValid(university)) ? university : null,
          universityName: universityName || '',
          state: state || '',
          city: city || '',
          qualification: qualification || '',
          interestedInAbroad: Boolean(interestedInAbroad),
          interestedInOnline: Boolean(interestedInOnline),
          message: message || '',
          status: 'New',
        });
      } catch (dbErr) {
        console.warn('[Enquiry] DB save failed:', dbErr.message);
      }
    }

    // Always record in mockStore so enquiries are immediately visible in all modes
    const mockEnquiry = mockStore.addEnquiry({
      enquiryNumber,
      name,
      email,
      phone,
      courseName,
      specialization,
      universityName,
      state,
      city,
      qualification,
      interestedInAbroad: Boolean(interestedInAbroad),
      interestedInOnline: Boolean(interestedInOnline),
      message: message || '',
      status: 'New',
      createdAt: new Date().toISOString(),
    });

    return res.status(201).json({
      success: true,
      message: 'Enquiry submitted successfully! A senior academic counsellor will contact you within 24 hours.',
      data: savedEnquiry || mockEnquiry,
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
    let enquiries = [];

    if (isDbReady()) {
      try {
        const query = {};

        if (status && status !== 'All') {
          query.status = status;
        }

        if (counsellorId && mongoose.Types.ObjectId.isValid(counsellorId)) {
          query.counsellorAssigned = counsellorId;
        }

        if (req.user && req.user.role === 'counsellor') {
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

        enquiries = await Enquiry.find(query)
          .populate('counsellorAssigned', 'name email phone')
          .populate('course', 'name slug')
          .populate('university', 'name logo')
          .sort({ createdAt: -1 });
      } catch (dbErr) {
        console.warn('[Enquiries] DB query failed:', dbErr.message);
      }
    }

    // Merge with in-memory mock store
    const mockList = mockStore.getEnquiries(req.query);
    const existingNums = new Set(enquiries.map((e) => e.enquiryNumber));
    const merged = [...enquiries];
    for (const m of mockList) {
      if (!existingNums.has(m.enquiryNumber)) {
        merged.unshift(m);
      }
    }

    res.status(200).json({
      success: true,
      count: merged.length,
      data: merged,
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
    const { id } = req.params;
    if (isDbReady() && mongoose.Types.ObjectId.isValid(id)) {
      const enquiry = await Enquiry.findById(id)
        .populate('counsellorAssigned', 'name email phone')
        .populate('course')
        .populate('university')
        .populate('followUpNotes.addedBy', 'name role');

      if (enquiry) {
        return res.status(200).json({ success: true, data: enquiry });
      }
    }

    const mockItem = mockStore.getEnquiries().find((e) => e._id === id || e.enquiryNumber === id);
    if (mockItem) {
      return res.status(200).json({ success: true, data: mockItem });
    }

    res.status(404).json({ success: false, message: 'Enquiry not found' });
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
    const { id } = req.params;
    let enquiry = null;

    if (isDbReady() && mongoose.Types.ObjectId.isValid(id)) {
      enquiry = await Enquiry.findById(id);
      if (enquiry) {
        enquiry.status = status;
        if (nextFollowUpDate) enquiry.nextFollowUpDate = nextFollowUpDate;
        if (note) {
          enquiry.followUpNotes.push({
            note,
            addedBy: req.user ? req.user._id : null,
            date: new Date(),
          });
        }
        await enquiry.save();
      }
    }

    const mockUpdated = mockStore.updateEnquiryStatus(id, status, note);
    res.status(200).json({
      success: true,
      message: 'Lead status updated successfully',
      data: enquiry || mockUpdated,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Assign enquiry to counsellor
// @route   PUT /api/enquiries/:id/assign
// @access  Private (Admin)
exports.assignCounsellor = async (req, res, next) => {
  try {
    const { counsellorId } = req.body;
    const { id } = req.params;

    if (isDbReady() && mongoose.Types.ObjectId.isValid(id)) {
      const enquiry = await Enquiry.findById(id);
      if (!enquiry) {
        return res.status(404).json({ success: false, message: 'Enquiry not found' });
      }
      enquiry.counsellorAssigned = counsellorId;
      await enquiry.save();
      return res.status(200).json({ success: true, message: 'Counsellor assigned successfully', data: enquiry });
    }

    const mockItem = mockStore.getEnquiries().find((e) => e._id === id || e.enquiryNumber === id);
    if (mockItem) {
      mockItem.counsellorAssigned = counsellorId;
      return res.status(200).json({ success: true, message: 'Counsellor assigned successfully', data: mockItem });
    }

    res.status(404).json({ success: false, message: 'Enquiry not found' });
  } catch (err) {
    next(err);
  }
};

exports.assignEnquiryCounsellor = exports.assignCounsellor;
