const mongoose = require('mongoose');

const DocumentSubSchema = new mongoose.Schema({
  docType: {
    type: String,
    enum: ['Class 10 Marksheet', 'Class 12 Marksheet', 'Graduation Marksheet', 'Identity Proof', 'Photograph', 'Other Documents'],
    required: true,
  },
  name: { type: String, required: true },
  url: { type: String, required: true },
  status: {
    type: String,
    enum: ['Pending', 'Verified', 'Rejected'],
    default: 'Pending',
  },
  uploadDate: { type: Date, default: Date.now },
});

const StudentProfileSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      unique: true,
    },
    dob: { type: Date },
    gender: {
      type: String,
      enum: ['Male', 'Female', 'Other', 'Prefer not to say'],
    },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },
    
    tenthQualification: {
      board: { type: String, default: '' },
      school: { type: String, default: '' },
      percentage: { type: Number, default: 0 },
      year: { type: Number, default: null },
    },
    twelfthQualification: {
      stream: { type: String, default: '' },
      board: { type: String, default: '' },
      school: { type: String, default: '' },
      percentage: { type: Number, default: 0 },
      year: { type: Number, default: null },
    },
    graduationDetails: {
      degree: { type: String, default: '' },
      university: { type: String, default: '' },
      percentage: { type: Number, default: 0 },
      year: { type: Number, default: null },
    },

    preferredCourses: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
      },
    ],
    preferredSpecializations: [{ type: String }],
    preferredLocations: [{ type: String }],

    documents: [DocumentSubSchema],
  },
  { timestamps: true }
);

// Virtual for calculating profile completion percentage
StudentProfileSchema.virtual('completionPercentage').get(function () {
  let score = 20; // Basic user account registered
  if (this.dob && this.gender) score += 15;
  if (this.city && this.state) score += 15;
  if (this.tenthQualification && this.tenthQualification.percentage > 0) score += 15;
  if (this.twelfthQualification && this.twelfthQualification.percentage > 0) score += 15;
  if (this.documents && this.documents.length > 0) score += 20;
  return Math.min(score, 100);
});

StudentProfileSchema.set('toObject', { virtuals: true });
StudentProfileSchema.set('toJSON', { virtuals: true });

module.exports = mongoose.model('StudentProfile', StudentProfileSchema);
