const University = require('../models/University');
const CourseUniversity = require('../models/CourseUniversity');
const slugify = require('slugify');

// @desc    Get all universities with filtering, sorting, pagination
// @route   GET /api/universities
// @access  Public
exports.getUniversities = async (req, res, next) => {
  try {
    const {
      search,
      state,
      city,
      universityType,
      accreditation,
      featured,
      sort,
      minFee,
      maxFee,
      page = 1,
      limit = 20,
    } = req.query;

    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { 'location.city': { $regex: search, $options: 'i' } },
        { 'location.state': { $regex: search, $options: 'i' } },
      ];
    }

    if (state) query['location.state'] = { $regex: new RegExp(`^${state}$`, 'i') };
    if (city) query['location.city'] = { $regex: new RegExp(`^${city}$`, 'i') };
    if (universityType) query.universityType = universityType;
    if (accreditation) query.accreditation = { $in: [accreditation] };
    if (featured === 'true') query.isFeatured = true;

    let sortObj = { isFeatured: -1, rating: -1 };
    if (sort === 'rating') sortObj = { rating: -1 };
    if (sort === 'name_asc') sortObj = { name: 1 };
    if (sort === 'name_desc') sortObj = { name: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await University.countDocuments(query);
    const universities = await University.find(query)
      .sort(sortObj)
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: universities,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single university by slug
// @route   GET /api/universities/slug/:slug
// @access  Public
exports.getUniversityBySlug = async (req, res, next) => {
  try {
    const university = await University.findOne({
      slug: req.params.slug,
      isPublished: true,
    });

    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }

    // Courses offered by this university
    const coursesOffered = await CourseUniversity.find({
      university: university._id,
      isPublished: true,
    }).populate({
      path: 'course',
      populate: { path: 'category', select: 'name icon slug' },
    });

    // Similar universities in same state or type
    const similarUniversities = await University.find({
      _id: { $ne: university._id },
      $or: [
        { 'location.state': university.location.state },
        { universityType: university.universityType },
      ],
      isPublished: true,
    })
      .limit(4)
      .select('name slug logo location universityType rating coverImage');

    res.status(200).json({
      success: true,
      data: {
        ...university.toObject(),
        coursesOffered,
        similarUniversities,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get university by ID
// @route   GET /api/universities/:id
// @access  Public
exports.getUniversityById = async (req, res, next) => {
  try {
    const university = await University.findById(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    res.status(200).json({ success: true, data: university });
  } catch (err) {
    next(err);
  }
};

// @desc    Create university
// @route   POST /api/universities
// @access  Private (Admin)
exports.createUniversity = async (req, res, next) => {
  try {
    const { name } = req.body;
    let slug = req.body.slug;
    if (!slug) {
      slug = slugify(name, { lower: true, strict: true });
    }
    const university = await University.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: university });
  } catch (err) {
    next(err);
  }
};

// @desc    Update university
// @route   PUT /api/universities/:id
// @access  Private (Admin)
exports.updateUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    res.status(200).json({ success: true, data: university });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete university
// @route   DELETE /api/universities/:id
// @access  Private (Admin)
exports.deleteUniversity = async (req, res, next) => {
  try {
    const university = await University.findByIdAndDelete(req.params.id);
    if (!university) {
      return res.status(404).json({ success: false, message: 'University not found' });
    }
    // Also remove mappings
    await CourseUniversity.deleteMany({ university: req.params.id });
    res.status(200).json({ success: true, message: 'University deleted successfully' });
  } catch (err) {
    next(err);
  }
};
