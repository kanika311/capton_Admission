const mongoose = require('mongoose');

const AdminActivityLogSchema = new mongoose.Schema(
  {
    admin: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    action: {
      type: String,
      required: true, // e.g. "CREATE_COURSE", "UPDATE_APPLICATION_STATUS"
    },
    targetModel: {
      type: String,
      required: true, // e.g. "Course", "Application", "University"
    },
    targetId: {
      type: String,
    },
    details: {
      type: mongoose.Schema.Types.Mixed,
      default: {},
    },
    ip: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

AdminActivityLogSchema.index({ admin: 1, action: 1, createdAt: -1 });

module.exports = mongoose.model('AdminActivityLog', AdminActivityLogSchema);
