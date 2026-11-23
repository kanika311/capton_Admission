const mongoose = require('mongoose');

const ShortlistSchema = new mongoose.Schema(
  {
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
    },
    courseUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseUniversity',
    },
  },
  { timestamps: true }
);

ShortlistSchema.index({ student: 1, university: 1, course: 1 }, { unique: true });

module.exports = mongoose.model('Shortlist', ShortlistSchema);
