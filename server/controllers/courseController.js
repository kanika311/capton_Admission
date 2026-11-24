const Course = require('../models/Course');
const CourseCategory = require('../models/CourseCategory');
const CourseUniversity = require('../models/CourseUniversity');
const slugify = require('slugify');
const mongoose = require('mongoose');
const mockStore = require('../utils/mockStore');

const isDbReady = () => mongoose.connection && mongoose.connection.readyState === 1;

// @desc    Get all course categories
// @route   GET /api/course-categories
// @access  Public
exports.getCategories = async (req, res, next) => {
  try {
    if (isDbReady()) {
      const categories = await CourseCategory.find({ isActive: true }).sort({ order: 1, name: 1 });
      if (categories && categories.length > 0) {
        return res.status(200).json({
          success: true,
          count: categories.length,
          data: categories,
        });
      }
    }
  } catch (err) {
    console.warn('[Categories] DB query failed, using mockStore fallback:', err.message);
  }

  // Fallback to built-in verified categories
  const fallback = mockStore.getCategories();
  res.status(200).json({
    success: true,
    count: fallback.length,
    data: fallback,
  });
};

// @desc    Create course category
// @route   POST /api/course-categories
// @access  Private (Admin)
exports.createCategory = async (req, res, next) => {
  try {
    const { name, icon, description, order } = req.body;
    const slug = slugify(name, { lower: true, strict: true });
    if (isDbReady()) {
      const category = await CourseCategory.create({
        name,
        slug,
        icon,
        description,
        order: order || 0,
      });
      return res.status(201).json({ success: true, data: category });
    }
    res.status(201).json({ success: true, data: { name, slug, icon, description, order: order || 0 } });
  } catch (err) {
    next(err);
  }
};

// @desc    Get all courses with filtering & pagination
// @route   GET /api/courses
// @access  Public
exports.getCourses = async (req, res, next) => {
  try {
    if (isDbReady()) {
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

      if (courses && courses.length > 0) {
        return res.status(200).json({
          success: true,
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          data: courses,
        });
      }
    }
  } catch (err) {
    console.warn('[Courses] DB query failed, using mockStore fallback:', err.message);
  }

  // Fallback to built-in verified courses
  const fallback = mockStore.getCourses(req.query);
  res.status(200).json({
    success: true,
    total: fallback.length,
    page: 1,
    pages: 1,
    data: fallback,
  });
};

// @desc    Get single course by slug
// @route   GET /api/courses/slug/:slug
// @access  Public
exports.getCourseBySlug = async (req, res, next) => {
  try {
    if (isDbReady()) {
      const course = await Course.findOne({ slug: req.params.slug, isPublished: true }).populate(
        'category',
        'name slug icon'
      );

      if (course) {
        const courseUnis = await CourseUniversity.find({ course: course._id, isPublished: true })
          .populate('university')
          .sort({ totalFees: 1 });

        const relatedCourses = await Course.find({
          category: course.category._id,
          _id: { $ne: course._id },
          isPublished: true,
        })
          .limit(4)
          .select('name slug duration level averageFeeRange image');

        return res.status(200).json({
          success: true,
          data: {
            ...course.toObject(),
            universities: courseUnis,
            relatedCourses,
          },
        });
      }
    }
  } catch (err) {
    console.warn('[CourseBySlug] DB query failed, using mockStore fallback:', err.message);
  }

  const course = mockStore.getCourseBySlug(req.params.slug);
  if (!course) {
    return res.status(404).json({ success: false, message: 'Course not found' });
  }

  const mappings = mockStore.getMappings(course._id);
  const universities = mappings.map((m) => ({
    _id: m._id,
    university: m.university,
    specialization: m.specialization,
    duration: m.duration,
    eligibility: m.eligibility,
    totalFees: m.totalFees,
    applicationFees: m.applicationFees,
    admissionStatus: m.admissionStatus,
    placementInfo: m.placementInfo,
  }));

  res.status(200).json({
    success: true,
    data: {
      ...course,
      universities,
      relatedCourses: mockStore.getCourses().filter((c) => c._id !== course._id).slice(0, 4),
    },
  });
};

// @desc    Get course by ID
// @route   GET /api/courses/:id
// @access  Public
exports.getCourseById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isDbReady() && mongoose.Types.ObjectId.isValid(id)) {
      const course = await Course.findById(id).populate('category', 'name slug icon');
      if (course) {
        return res.status(200).json({ success: true, data: course });
      }
    }
    const mock = mockStore.getCourseById(id);
    if (mock) {
      return res.status(200).json({ success: true, data: mock });
    }
    res.status(404).json({ success: false, message: 'Course not found' });
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
    if (isDbReady()) {
      const course = await Course.create({ ...req.body, slug });
      return res.status(201).json({ success: true, data: course });
    }
    const newCourse = mockStore.updateCourse(`course_${Date.now()}`, { ...req.body, slug });
    res.status(201).json({ success: true, data: newCourse });
  } catch (err) {
    next(err);
  }
};

// @desc    Update course
// @route   PUT /api/courses/:id
// @access  Private (Admin)
exports.updateCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedCourse = null;

    if (isDbReady()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        updatedCourse = await Course.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
      } else {
        // Handle mock string IDs like 'course_1' by matching slug or upserting
        const mockItem = mockStore.getCourseById(id);
        const slug = slugify(req.body.name || (mockItem ? mockItem.name : id), { lower: true, strict: true });
        updatedCourse = await Course.findOneAndUpdate(
          { $or: [{ slug }, { name: req.body.name }] },
          { ...req.body, slug },
          { new: true, upsert: true, runValidators: true }
        );
      }
    }

    // Always keep mock store updated
    const mockUpdated = mockStore.updateCourse(id, req.body);
    res.status(200).json({ success: true, data: updatedCourse || mockUpdated });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete course
// @route   DELETE /api/courses/:id
// @access  Private (Admin)
exports.deleteCourse = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isDbReady()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await Course.findByIdAndDelete(id);
        await CourseUniversity.deleteMany({ course: id });
      } else {
        const mockItem = mockStore.getCourseById(id);
        if (mockItem) {
          const deleted = await Course.findOneAndDelete({ slug: mockItem.slug });
          if (deleted) {
            await CourseUniversity.deleteMany({ course: deleted._id });
          }
        }
      }
    }
    mockStore.deleteCourse(id);
    res.status(200).json({ success: true, message: 'Course deleted successfully' });
  } catch (err) {
    next(err);
  }
};
