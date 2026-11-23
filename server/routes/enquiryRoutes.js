const express = require('express');
const router = express.Router();
const {
  createEnquiry,
  getEnquiries,
  getEnquiryById,
  updateEnquiryStatus,
  assignEnquiryCounsellor,
} = require('../controllers/enquiryController');
const { protect, authorize } = require('../middleware/auth');

// Public enquiry submission
router.post('/', createEnquiry);

// Admin & counsellor endpoints
router.get('/', protect, authorize('admin', 'counsellor', 'superadmin'), getEnquiries);
router.get('/:id', protect, authorize('admin', 'counsellor', 'superadmin'), getEnquiryById);
router.put('/:id/status', protect, authorize('admin', 'counsellor', 'superadmin'), updateEnquiryStatus);
router.put('/:id/assign', protect, authorize('admin', 'superadmin'), assignEnquiryCounsellor);

module.exports = router;
