const express = require('express');
const router = express.Router();
const {
  getDashboardAnalytics,
  getStudents,
  toggleStudentStatus,
  getCounsellors,
  createCounsellor,
  getActivityLogs,
  getAdmins,
  createAdmin,
  updateAdmin,
  deleteAdmin,
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

// Admin user and security management
router.get('/admins', getAdmins);
router.post('/admins', createAdmin);
router.put('/admins/:id', updateAdmin);
router.delete('/admins/:id', deleteAdmin);

module.exports = router;
