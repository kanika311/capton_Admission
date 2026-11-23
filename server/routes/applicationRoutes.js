const express = require('express');
const router = express.Router();
const {
  submitApplication,
  getApplications,
  getApplicationById,
  updateApplicationStatus,
  assignCounsellor,
  addRemark,
} = require('../controllers/applicationController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);

router.post('/', authorize('student'), submitApplication);
router.get('/', getApplications);
router.get('/:id', getApplicationById);
router.put('/:id/status', authorize('admin', 'counsellor', 'superadmin'), updateApplicationStatus);
router.put('/:id/assign', authorize('admin', 'superadmin'), assignCounsellor);
router.post('/:id/remarks', authorize('admin', 'counsellor', 'superadmin'), addRemark);

module.exports = router;
