const mongoose = require('mongoose');

const CounsellorSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    specializationAreas: [
      {
        type: String, // e.g. "Engineering", "Medical", "Study Abroad", "MBA"
      },
    ],
    assignedLeadsCount: {
      type: Number,
      default: 0,
    },
    maxCapacity: {
      type: Number,
      default: 50,
    },
    rating: {
      type: Number,
      default: 4.8,
    },
    bio: {
      type: String,
      default: 'Senior Education Counsellor with extensive guidance experience.',
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Counsellor', CounsellorSchema);
