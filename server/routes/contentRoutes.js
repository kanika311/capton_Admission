const express = require('express');
const router = express.Router();
const {
  getServices,
  getServiceBySlug,
  createService,
  updateService,
  deleteService,
  getExams,
  getExamBySlug,
  createExam,
  getBlogs,
  getBlogBySlug,
  createBlog,
  getTestimonials,
  getFAQs,
  submitContact,
  getContactMessages,
  getCMS,
  updateCMS,
  globalSearch,
} = require('../controllers/contentController');
const { protect, authorize } = require('../middleware/auth');

// Services
router.get('/services', getServices);
router.get('/services/slug/:slug', getServiceBySlug);
router.post('/services', protect, authorize('admin', 'superadmin'), createService);
router.put('/services/:id', protect, authorize('admin', 'superadmin'), updateService);
router.delete('/services/:id', protect, authorize('admin', 'superadmin'), deleteService);

// Exams
router.get('/exams', getExams);
router.get('/exams/slug/:slug', getExamBySlug);
router.post('/exams', protect, authorize('admin', 'superadmin'), createExam);

// Blogs
router.get('/blogs', getBlogs);
router.get('/blogs/slug/:slug', getBlogBySlug);
router.post('/blogs', protect, authorize('admin', 'superadmin'), createBlog);

// Testimonials & FAQs
router.get('/testimonials', getTestimonials);
router.get('/faqs', getFAQs);

// Contact
router.post('/contact', submitContact);
router.get('/contact', protect, authorize('admin', 'superadmin'), getContactMessages);

// CMS
router.get('/cms', getCMS);
router.put('/cms', protect, authorize('admin', 'superadmin'), updateCMS);

// Global Search
router.get('/search', globalSearch);

module.exports = router;
