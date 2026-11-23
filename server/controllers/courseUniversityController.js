const CourseUniversity = require('../models/CourseUniversity');
const University = require('../models/University');
const Course = require('../models/Course');
const mongoose = require('mongoose');
const mockStore = require('../utils/mockStore');

const isDbReady = () => mongoose.connection && mongoose.connection.readyState === 1;

// @desc    Get course-university mappings (Panel 2 matching universities)
// @route   GET /api/course-universities
// @access  Public
exports.getCourseUniversities = async (req, res, next) => {
  try {
    const {
      courseId,
      universityId,
      specialization,
      state,
      city,
      universityType,
      admissionStatus,
      admissionMode,
      minFee,
      maxFee,
      sort,
    } = req.query;

    if (isDbReady()) {
      try {
        const query = { isPublished: true };

        if (courseId) query.course = courseId;
        if (universityId) query.university = universityId;
        if (specialization && specialization !== 'All') query.specialization = specialization;
        if (admissionStatus && admissionStatus !== 'All') query.admissionStatus = admissionStatus;
        if (admissionMode && admissionMode !== 'All') query.admissionMode = admissionMode;

        if (minFee || maxFee) {
          query.totalFees = {};
          if (minFee) query.totalFees.$gte = Number(minFee);
          if (maxFee) query.totalFees.$lte = Number(maxFee);
        }

        let sortObj = { totalFees: 1 };
        if (sort === 'fee_high') sortObj = { totalFees: -1 };
        if (sort === 'fee_low') sortObj = { totalFees: 1 };
        if (sort === 'newest') sortObj = { createdAt: -1 };

        let results = await CourseUniversity.find(query)
          .populate('course')
          .populate('university')
          .sort(sortObj);

        if (state && state !== 'All') {
          results = results.filter(
            (item) => item.university && item.university.location?.state?.toLowerCase() === state.toLowerCase()
          );
        }

        if (city && city !== 'All') {
          results = results.filter(
            (item) => item.university && item.university.location?.city?.toLowerCase() === city.toLowerCase()
          );
        }

        if (universityType && universityType !== 'All') {
          results = results.filter(
            (item) => item.university && item.university.universityType === universityType
          );
        }

        if (sort === 'popularity') {
          results = results.sort(
            (a, b) => (b.university?.rating || 0) - (a.university?.rating || 0)
          );
        } else if (sort === 'alpha') {
          results = results.sort((a, b) =>
            (a.university?.name || '').localeCompare(b.university?.name || '')
          );
        }

        if (results && results.length > 0) {
          return res.status(200).json({
            success: true,
            count: results.length,
            data: results,
          });
        }
      } catch (dbErr) {
        console.warn('[CourseUniversities] DB query failed:', dbErr.message);
      }
    }

    // Mock mappings fallback
    let fallback = mockStore.getMappings(courseId);
    if (universityType && universityType !== 'All') {
      fallback = fallback.filter((m) => m.university?.universityType === universityType);
    }
    res.status(200).json({
      success: true,
      count: fallback.length,
      data: fallback,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single CourseUniversity mapping
// @route   GET /api/course-universities/:id
// @access  Public
exports.getCourseUniversityById = async (req, res, next) => {
  try {
    const item = await CourseUniversity.findById(req.params.id)
      .populate('course')
      .populate('university');

    if (!item) {
      return res.status(404).json({ success: false, message: 'Mapping not found' });
    }

    res.status(200).json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
};

// @desc    Create course-university mapping
// @route   POST /api/course-universities
// @access  Private (Admin)
exports.createCourseUniversity = async (req, res, next) => {
  try {
    const {
      course,
      university,
      specialization,
      duration,
      eligibility,
      totalFees,
      applicationFees,
      admissionMode,
      admissionStatus,
      placementInfo,
    } = req.body;

    const existing = await CourseUniversity.findOne({ course, university });
    if (existing) {
      return res.status(400).json({
        success: false,
        message: 'This course is already mapped to the selected university',
      });
    }

    const mapping = await CourseUniversity.create({
      course,
      university,
      specialization: specialization || 'General',
      duration,
      eligibility,
      totalFees,
      applicationFees: applicationFees || 1000,
      admissionMode: admissionMode || 'Offline',
      admissionStatus: admissionStatus || 'Open',
      placementInfo: placementInfo || {},
    });

    const populated = await CourseUniversity.findById(mapping._id)
      .populate('course')
      .populate('university');

    res.status(201).json({ success: true, data: populated });
  } catch (err) {
    next(err);
  }
};

// @desc    Update course-university mapping
// @route   PUT /api/course-universities/:id
// @access  Private (Admin)
exports.updateCourseUniversity = async (req, res, next) => {
  try {
    const mapping = await CourseUniversity.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    })
      .populate('course')
      .populate('university');

    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Mapping not found' });
    }

    res.status(200).json({ success: true, data: mapping });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete course-university mapping
// @route   DELETE /api/course-universities/:id
// @access  Private (Admin)
exports.deleteCourseUniversity = async (req, res, next) => {
  try {
    const mapping = await CourseUniversity.findByIdAndDelete(req.params.id);
    if (!mapping) {
      return res.status(404).json({ success: false, message: 'Mapping not found' });
    }
    res.status(200).json({ success: true, message: 'Mapping deleted successfully' });
  } catch (err) {
    next(err);
  }
};
