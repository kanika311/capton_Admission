const mongoose = require('mongoose');

const CourseUniversitySchema = new mongoose.Schema(
  {
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      required: true,
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      required: true,
    },
    specialization: {
      type: String,
      default: 'General',
      trim: true,
    },
    duration: {
      type: String,
      required: true,
    },
    eligibility: {
      type: String,
      required: true,
    },
    totalFees: {
      type: Number,
      required: true,
    },
    applicationFees: {
      type: Number,
      default: 1000,
    },
    admissionMode: {
      type: String,
      enum: ['Online', 'Offline', 'Hybrid'],
      default: 'Offline',
    },
    admissionStatus: {
      type: String,
      enum: ['Open', 'Upcoming', 'Closed'],
      default: 'Open',
    },
    placementInfo: {
      averagePackage: { type: String, default: '' },
      highestPackage: { type: String, default: '' },
      placementPercent: { type: String, default: '' },
    },
    isPublished: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

CourseUniversitySchema.index({ course: 1, university: 1 }, { unique: true });
CourseUniversitySchema.index({ totalFees: 1, admissionStatus: 1 });

module.exports = mongoose.model('CourseUniversity', CourseUniversitySchema);
