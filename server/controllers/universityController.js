const University = require('../models/University');
const CourseUniversity = require('../models/CourseUniversity');
const slugify = require('slugify');
const mongoose = require('mongoose');
const mockStore = require('../utils/mockStore');

const isDbReady = () => mongoose.connection && mongoose.connection.readyState === 1;

// @desc    Get all universities with filtering, sorting, pagination
// @route   GET /api/universities
// @access  Public
exports.getUniversities = async (req, res, next) => {
  try {
    if (isDbReady()) {
      const {
        search,
        state,
        city,
        universityType,
        accreditation,
        featured,
        sort,
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

      if (universities && universities.length > 0) {
        return res.status(200).json({
          success: true,
          total,
          page: Number(page),
          pages: Math.ceil(total / Number(limit)),
          data: universities,
        });
      }
    }
  } catch (err) {
    console.warn('[Universities] DB query failed, using mockStore fallback:', err.message);
  }

  // Fallback to built-in verified universities
  const fallback = mockStore.getUniversities(req.query);
  res.status(200).json({
    success: true,
    total: fallback.length,
    page: 1,
    pages: 1,
    data: fallback,
  });
};

// @desc    Get single university by slug
// @route   GET /api/universities/slug/:slug
// @access  Public
exports.getUniversityBySlug = async (req, res, next) => {
  try {
    if (isDbReady()) {
      const university = await University.findOne({
        slug: req.params.slug,
        isPublished: true,
      });

      if (university) {
        const coursesOffered = await CourseUniversity.find({
          university: university._id,
          isPublished: true,
        }).populate({
          path: 'course',
          populate: { path: 'category', select: 'name icon slug' },
        });

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

        return res.status(200).json({
          success: true,
          data: {
            ...university.toObject(),
            coursesOffered,
            similarUniversities,
          },
        });
      }
    }
  } catch (err) {
    console.warn('[UniversityBySlug] DB query failed, using mockStore fallback:', err.message);
  }

  const university = mockStore.getUniversityBySlug(req.params.slug);
  if (!university) {
    return res.status(404).json({ success: false, message: 'University not found' });
  }

  res.status(200).json({
    success: true,
    data: {
      ...university,
      coursesOffered: [],
      similarUniversities: mockStore.getUniversities().filter((u) => u._id !== university._id).slice(0, 4),
    },
  });
};

// @desc    Get university by ID
// @route   GET /api/universities/:id
// @access  Public
exports.getUniversityById = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isDbReady() && mongoose.Types.ObjectId.isValid(id)) {
      const university = await University.findById(id);
      if (university) {
        return res.status(200).json({ success: true, data: university });
      }
    }
    const mock = mockStore.getUniversityById(id);
    if (mock) {
      return res.status(200).json({ success: true, data: mock });
    }
    res.status(404).json({ success: false, message: 'University not found' });
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
    if (isDbReady()) {
      const university = await University.create({ ...req.body, slug });
      return res.status(201).json({ success: true, data: university });
    }
    const newUni = mockStore.updateUniversity(`uni_${Date.now()}`, { ...req.body, slug });
    res.status(201).json({ success: true, data: newUni });
  } catch (err) {
    next(err);
  }
};

// @desc    Update university
// @route   PUT /api/universities/:id
// @access  Private (Admin)
exports.updateUniversity = async (req, res, next) => {
  try {
    const { id } = req.params;
    let updatedUni = null;

    if (isDbReady()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        updatedUni = await University.findByIdAndUpdate(id, req.body, {
          new: true,
          runValidators: true,
        });
      } else {
        const mockItem = mockStore.getUniversityById(id);
        const slug = slugify(req.body.name || (mockItem ? mockItem.name : id), { lower: true, strict: true });
        updatedUni = await University.findOneAndUpdate(
          { $or: [{ slug }, { name: req.body.name }] },
          { ...req.body, slug },
          { new: true, upsert: true, runValidators: true }
        );
      }
    }

    const mockUpdated = mockStore.updateUniversity(id, req.body);
    res.status(200).json({ success: true, data: updatedUni || mockUpdated });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete university
// @route   DELETE /api/universities/:id
// @access  Private (Admin)
exports.deleteUniversity = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (isDbReady()) {
      if (mongoose.Types.ObjectId.isValid(id)) {
        await University.findByIdAndDelete(id);
        await CourseUniversity.deleteMany({ university: id });
      } else {
        const mockItem = mockStore.getUniversityById(id);
        if (mockItem) {
          await University.findOneAndDelete({ slug: mockItem.slug });
        }
      }
    }
    mockStore.deleteUniversity(id);
    res.status(200).json({ success: true, message: 'University deleted successfully' });
  } catch (err) {
    next(err);
  }
};
