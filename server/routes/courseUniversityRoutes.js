const express = require('express');
const router = express.Router();
const {
  getCourseUniversities,
  getCourseUniversityById,
  createCourseUniversity,
  updateCourseUniversity,
  deleteCourseUniversity,
} = require('../controllers/courseUniversityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getCourseUniversities);
router.get('/:id', getCourseUniversityById);
router.post('/', protect, authorize('admin', 'superadmin'), createCourseUniversity);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateCourseUniversity);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteCourseUniversity);

module.exports = router;
