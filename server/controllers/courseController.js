const Course = require('../models/Course');
const CourseCategory = require('../models/CourseCategory');
const CourseUniversity = require('../models/CourseUniversity');
const slugify = require('slugify');

// @desc    Get all course categories
// @route   GET /api/course-categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    const categories = await CourseCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
    res.status(200).json({
      success: true,
      count: categories.length,
      data: categories,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create course category
// @route   POST /api/course-categories
// @access  Private (Admin)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, icon, description, order } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    const category = await CourseCategory.create({
      name,
      slug,
      icon,
      description,
      order: order || 0,
    });
    res.status(201).json({ success: true, data: category });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all courses with filtering & pagination
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    const { search, category, level, featured, page = 1, limit = 50 } = req.query;
    const query = { isPublished: true };

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { specializations: { $regex: search, $options: 'i' } },
        { overview: { $regex: search, $options: 'i' } },
      ];
    }

    if (category) {
      if (category.match(/^[0-9a-fA-F]{24}$/)) {
        query.category = category;
      } else {
        const cat = await CourseCategory.findOne({ slug: category });
        if (cat) query.category = cat._id;
      }
    }

    if (level) {
      query.level = level;
    }

    if (featured === 'true') {
      query.isFeatured = true;
    }

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Course.countDocuments(query);
    const courses = await Course.find(query)
      .populate('category', 'name slug icon')
      .sort({ isFeatured: -1, name: 1 })
      .skip(skip)
      .limit(Number(limit));

    res.status(200).json({
      success: true,
      total,
      page: Number(page),
      pages: Math.ceil(total / Number(limit)),
      data: courses,
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
exports.getCourseBySlug = async (req, res, next) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug, isPublished: true }).populate(
      'category',
      'name slug icon'
    );

    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }

    // Find universities offering this course
    const courseUnis = await CourseUniversity.find({ course: course._id, isPublished: true })
      .populate('university')
      .sort({ totalFees: 1 });

    // Related courses in same category
    const relatedCourses = await Course.find({
      category: course.category._id,
      _id: { $ne: course._id },
      isPublished: true,
    })
      .limit(4)
      .select('name slug duration level averageFeeRange image');

    res.status(200).json({
      success: true,
      data: {
        ...course.toObject(),
        universities: courseUnis,
        relatedCourses,
      },
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res, next) => {
  try {
    const course = await Course.findById(req.params.id).populate('category', 'name slug icon');
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// @desc    Create course
// @route   POST /api/courses
// @access  Private (Admin)
exports.createCourse = async (req, res, next) => {
  try {
    const { name } = req.body;
    let slug = req.body.slug;
    if (!slug) {
      slug = slugify(name, { lower: true, strict: true });
    }
    const course = await Course.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    res.status(200).json({ success: true, data: course });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const course = await Course.findByIdAndDelete(req.params.id);
    if (!course) {
      return res.status(404).json({ success: false, message: 'Course not found' });
    }
    // Also remove any mappings for this course
    await CourseUniversity.deleteMany({ course: req.params.id });
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};
