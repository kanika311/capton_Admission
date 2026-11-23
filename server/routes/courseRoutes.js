const express = require('express');
const router = express.Router();
const {
  getCourses,
  getCourseBySlug,
  getCourseById,
  createCourse,
  updateCourse,
  deleteCourse,
  getCategories,
  createCategory,
} = require('../controllers/courseController');
const { protect, authorize } = require('../middleware/auth');

// Categories
router.get('/categories', getCategories);
router.post('/categories', protect, authorize('admin', 'superadmin'), createCategory);

// Courses
router.get('/', getCourses);
router.get('/slug/:slug', getCourseBySlug);
router.get('/:id', getCourseById);
router.post('/', protect, authorize('admin', 'superadmin'), createCourse);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateCourse);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCourse);

module.exports = router;
