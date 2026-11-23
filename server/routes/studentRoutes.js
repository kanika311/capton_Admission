const express = require('express');
const router = express.Router();
const {
  getStudentProfile,
  updateStudentProfile,
  updateEducation,
  uploadDocument,
  deleteDocument,
  getShortlists,
  addShortlist,
  removeShortlist,
  getNotifications,
  markNotificationRead,
} = require('../controllers/studentController');
const { protect, authorize } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.get('/profile', getStudentProfile);
router.put('/profile', updateStudentProfile);
router.put('/education', updateEducation);

router.post('/documents', upload.single('file'), uploadDocument);
router.delete('/documents/:docId', deleteDocument);

router.get('/shortlists', getShortlists);
router.post('/shortlists', addShortlist);
router.delete('/shortlists/:id', removeShortlist);

router.get('/notifications', getNotifications);
router.put('/notifications/:id/read', markNotificationRead);

module.exports = router;
