const mongoose = require('mongoose');

const ScholarshipSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide scholarship title'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    provider: {
      type: String,
      required: true,
    },
    amountOrBenefit: {
      type: String,
      required: true, // e.g. "Up to 100% Tuition Fee Waiver" or "₹ 50,000 / year"
    },
    eligibility: {
      type: String,
      required: true,
    },
    deadline: {
      type: String,
      default: 'Rolling Admissions',
    },
    description: {
      type: String,
      default: '',
    },
    applicationLink: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Scholarship', ScholarshipSchema);
