const express = require('express');
const router = express.Router();
const {
  getUniversities,
  getUniversityBySlug,
  getUniversityById,
  createUniversity,
  updateUniversity,
  deleteUniversity,
} = require('../controllers/universityController');
const { protect, authorize } = require('../middleware/auth');

router.get('/', getUniversities);
router.get('/slug/:slug', getUniversityBySlug);
router.get('/:id', getUniversityById);
router.post('/', protect, authorize('admin', 'superadmin'), createUniversity);
router.put('/:id', protect, authorize('admin', 'superadmin'), updateUniversity);
router.delete('/:id', protect, authorize('admin', 'superadmin'), deleteUniversity);

module.exports = router;
