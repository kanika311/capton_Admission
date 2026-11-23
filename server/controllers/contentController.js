const Service = require('../models/Service');
const Exam = require('../models/Exam');
const Scholarship = require('../models/Scholarship');
const Blog = require('../models/Blog');
const FAQ = require('../models/FAQ');
const Testimonial = require('../models/Testimonial');
const ContactMessage = require('../models/ContactMessage');
const CMS = require('../models/CMS');
const slugify = require('slugify');

// SERVICES
exports.getServices = async (req, res, next) => {
  try {
    const services = await Service.find({ isPublished: true }).sort({ order: 1 });
    res.status(200).json({ success: true, count: services.length, data: services });
  } catch (err) {
    next(err);
  }
};

exports.getServiceBySlug = async (req, res, next) => {
  try {
    const service = await Service.findOne({ slug: req.params.slug, isPublished: true });
    if (!service) return res.status(404).json({ success: false, message: 'Service not found' });
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

exports.createService = async (req, res, next) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const service = await Service.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

exports.updateService = async (req, res, next) => {
  try {
    const service = await Service.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.status(200).json({ success: true, data: service });
  } catch (err) {
    next(err);
  }
};

exports.deleteService = async (req, res, next) => {
  try {
    await Service.findByIdAndDelete(req.params.id);
    res.status(200).json({ success: true, message: 'Service deleted' });
  } catch (err) {
    next(err);
  }
};

// EXAMS
exports.getExams = async (req, res, next) => {
  try {
    const { stream, search } = req.query;
    const query = { isPublished: true };
    if (stream && stream !== 'All') query.stream = stream;
    if (search) query.name = { $regex: search, $options: 'i' };

    const exams = await Exam.find(query).sort({ name: 1 });
    res.status(200).json({ success: true, count: exams.length, data: exams });
  } catch (err) {
    next(err);
  }
};

exports.getExamBySlug = async (req, res, next) => {
  try {
    const exam = await Exam.findOne({ slug: req.params.slug, isPublished: true });
    if (!exam) return res.status(404).json({ success: false, message: 'Exam not found' });
    res.status(200).json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

exports.createExam = async (req, res, next) => {
  try {
    const slug = slugify(req.body.name, { lower: true, strict: true });
    const exam = await Exam.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: exam });
  } catch (err) {
    next(err);
  }
};

// BLOGS
exports.getBlogs = async (req, res, next) => {
  try {
    const { category, search, page = 1, limit = 10 } = req.query;
    const query = { isPublished: true };
    if (category && category !== 'All') query.category = category;
    if (search) query.title = { $regex: search, $options: 'i' };

    const skip = (Number(page) - 1) * Number(limit);
    const total = await Blog.countDocuments(query);
    const blogs = await Blog.find(query).sort({ createdAt: -1 }).skip(skip).limit(Number(limit));

    res.status(200).json({ success: true, total, data: blogs });
  } catch (err) {
    next(err);
  }
};

exports.getBlogBySlug = async (req, res, next) => {
  try {
    const blog = await Blog.findOneAndUpdate(
      { slug: req.params.slug, isPublished: true },
      { $inc: { views: 1 } },
      { new: true }
    );
    if (!blog) return res.status(404).json({ success: false, message: 'Blog not found' });
    res.status(200).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

exports.createBlog = async (req, res, next) => {
  try {
    const slug = slugify(req.body.title, { lower: true, strict: true });
    const blog = await Blog.create({ ...req.body, slug });
    res.status(201).json({ success: true, data: blog });
  } catch (err) {
    next(err);
  }
};

// TESTIMONIALS & FAQS
exports.getTestimonials = async (req, res, next) => {
  try {
    const testimonials = await Testimonial.find({ isPublished: true }).sort({ rating: -1 });
    res.status(200).json({ success: true, data: testimonials });
  } catch (err) {
    next(err);
  }
};

exports.getFAQs = async (req, res, next) => {
  try {
    const { category } = req.query;
    const query = { isPublished: true };
    if (category) query.category = category;
    const faqs = await FAQ.find(query).sort({ order: 1 });
    res.status(200).json({ success: true, data: faqs });
  } catch (err) {
    next(err);
  }
};

// CONTACT MESSAGES
exports.submitContact = async (req, res, next) => {
  try {
    const message = await ContactMessage.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Thank you for reaching out! We will contact you soon.',
      data: message,
    });
  } catch (err) {
    next(err);
  }
};

exports.getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: messages });
  } catch (err) {
    next(err);
  }
};

// CMS SETTINGS
exports.getCMS = async (req, res, next) => {
  try {
    let cms = await CMS.findOne({ key: 'homepage_settings' })
      .populate('popularCourses', 'name slug level duration image averageFeeRange')
      .populate('featuredUniversities', 'name slug logo coverImage location universityType rating');

    if (!cms) {
      cms = await CMS.create({ key: 'homepage_settings' });
    }
    res.status(200).json({ success: true, data: cms });
  } catch (err) {
    next(err);
  }
};

exports.updateCMS = async (req, res, next) => {
  try {
    const cms = await CMS.findOneAndUpdate(
      { key: 'homepage_settings' },
      req.body,
      { new: true, upsert: true }
    );
    res.status(200).json({ success: true, data: cms });
  } catch (err) {
    next(err);
  }
};

// GLOBAL SEARCH
exports.globalSearch = async (req, res, next) => {
  try {
    const { q } = req.query;
    if (!q || q.trim() === '') {
      return res.status(200).json({ success: true, data: { courses: [], universities: [], exams: [] } });
    }

    const regex = { $regex: q.trim(), $options: 'i' };

    const [courses, universities, exams] = await Promise.all([
      Course.find({ isPublished: true, $or: [{ name: regex }, { specializations: regex }] })
        .limit(6)
        .select('name slug level duration'),
      University.find({ isPublished: true, $or: [{ name: regex }, { 'location.city': regex }, { 'location.state': regex }] })
        .limit(6)
        .select('name slug logo location universityType'),
      Exam.find({ isPublished: true, $or: [{ name: regex }, { stream: regex }] })
        .limit(4)
        .select('name slug stream conductingBody'),
    ]);

    res.status(200).json({
      success: true,
      data: { courses, universities, exams },
    });
  } catch (err) {
    next(err);
  }
};
