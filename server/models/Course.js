const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide course name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseCategory',
      required: true,
    },
    level: {
      type: String,
      enum: ['Undergraduate', 'Postgraduate', 'Diploma', 'Doctoral', 'Certificate'],
      required: true,
    },
    duration: {
      type: String,
      required: true, // e.g. "4 Years", "2 Years", "3 Years"
    },
    eligibility: {
      type: String,
      required: true, // e.g. "10+2 with PCM minimum 50%"
    },
    admissionRequirements: {
      type: String,
      default: '',
    },
    specializations: [
      {
        type: String,
        trim: true,
      },
    ],
    overview: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      default: '',
    },
    syllabus: [
      {
        semester: { type: String },
        topics: [{ type: String }],
      },
    ],
    careerOpportunities: [
      {
        type: String,
      },
    ],
    averageFeeRange: {
      min: { type: Number, default: 50000 },
      max: { type: Number, default: 400000 },
      currency: { type: String, default: 'INR' },
    },
    entranceExams: [
      {
        type: String,
      },
    ],
    jobOpportunities: [
      {
        type: String,
      },
    ],
    image: {
      type: String,
      default: '',
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
    isFeatured: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

CourseSchema.index({ slug: 1, category: 1, level: 1 });

module.exports = mongoose.model('Course', CourseSchema);
