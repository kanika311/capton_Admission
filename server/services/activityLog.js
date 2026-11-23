const AdminActivityLog = require('../models/AdminActivityLog');

const logAdminActivity = async ({ adminId, action, targetModel, targetId, details, req }) => {
  try {
    const ip = req ? req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '' : '';
    await AdminActivityLog.create({
      admin: adminId,
      action,
      targetModel,
      targetId: String(targetId || ''),
      details: details || {},
      ip,
    });
  } catch (err) {
    console.error('Failed to log admin activity:', err.message);
  }
};

module.exports = logAdminActivity;
