const mongoose = require('mongoose');

const ComparisonSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    guestId: {
      type: String,
      default: null,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    universities: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'University',
      },
    ],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Comparison', ComparisonSchema);
