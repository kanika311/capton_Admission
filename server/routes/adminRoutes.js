const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getStudents,
  toggleStudentStatus,
  getCounsellors,
  createCounsellor,
  getActivityLogs,
} = require('../controllers/adminController');
const { protect, authorize } = require('../middleware/auth');

router.use(protect);
router.use(authorize('admin', 'superadmin'));

router.get('/dashboard', getDashboardAnalytics);
router.get('/students', getStudents);
router.put('/students/:id/toggle-status', toggleStudentStatus);
router.get('/counsellors', getCounsellors);
router.post('/counsellors', createCounsellor);
router.get('/activity-logs', getActivityLogs);

module.exports = router;
