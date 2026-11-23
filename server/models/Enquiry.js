const mongoose = require('mongoose');

const EnquirySchema = new mongoose.Schema(
  {
    enquiryNumber: {
      type: String,
      unique: true,
      required: true,
    },
    student: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    name: {
      type: String,
      required: [true, 'Please provide student name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please provide email'],
      lowercase: true,
      trim: true,
    },
    phone: {
      type: String,
      required: [true, 'Please provide phone number'],
      trim: true,
    },
    course: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Course',
      default: null,
    },
    courseName: {
      type: String,
      default: '',
    },
    specialization: {
      type: String,
      default: '',
    },
    university: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'University',
      default: null,
    },
    universityName: {
      type: String,
      default: '',
    },
    state: { type: String, default: '' },
    city: { type: String, default: '' },
    qualification: { type: String, default: '' },
    message: { type: String, default: '' },
    status: {
      type: String,
      enum: [
        'New',
        'Contacted',
        'Interested',
        'Counselling Scheduled',
        'Follow-up Required',
        'Converted',
        'Not Interested',
      ],
      default: 'New',
    },
    counsellorAssigned: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    followUpNotes: [
      {
        note: String,
        addedBy: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User',
        },
        date: { type: Date, default: Date.now },
        nextFollowUpDate: { type: Date },
      },
    ],
  },
  { timestamps: true }
);

EnquirySchema.index({ enquiryNumber: 1, email: 1, phone: 1, status: 1 });

module.exports = mongoose.model('Enquiry', EnquirySchema);
