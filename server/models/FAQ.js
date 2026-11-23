const mongoose = require('mongoose');

const FAQSchema = new mongoose.Schema(
  {
    category: {
      type: String,
      enum: ['General', 'Admission', 'Courses', 'Universities', 'Fees', 'Scholarship'],
      default: 'General',
    },
    question: {
      type: String,
      required: true,
      trim: true,
    },
    answer: {
      type: String,
      required: true,
    },
    order: {
      type: Number,
      default: 0,
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('FAQ', FAQSchema);
