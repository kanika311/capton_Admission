const mongoose = require('mongoose');

const ApplicationSchema = new mongoose.Schema(
  {
    applicationNumber: {
      type: String,
      unique: true,
      required: true,
    },
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
      required: true,
    },
    courseUniversity: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'CourseUniversity',
    },
    specialization: {
      type: String,
      default: 'General',
    },
    status: {
      type: String,
      enum: [
        'Submitted',
        'Under Review',
        'Counselling Scheduled',
        'Documents Pending',
        'Shortlisted',
        'Approved',
        'Rejected',
        'Admission Confirmed',
      ],
      default: 'Submitted',
    },
    documents: [
      {
        docType: String,
        name: String,
        url: String,
      },
    ],
    counsellorAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    remarks: [
      {
        note: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: { type: Date, default: Date.now },
      },
    ],
    timeline: [
      {
        status: String,
        date: { type: Date, default: Date.now },
        comment: String,
      },
    ],
  },
  { timestamps: true }
);

ApplicationSchema.index({ applicationNumber: 1, student: 1, status: 1 });

module.exports = mongoose.model('Application', ApplicationSchema);
