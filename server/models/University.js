const mongoose = require('mongoose');

const UniversitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide university name'],
      trim: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },
    logo: {
      type: String,
      default: '',
    },
    coverImage: {
      type: String,
      default: '',
    },
    gallery: [
      {
        type: String,
      },
    ],
    location: {
      address: { type: String, default: '' },
      city: { type: String, required: true },
      state: { type: String, required: true },
      country: { type: String, default: 'India' },
      pinCode: { type: String, default: '' },
    },
    universityType: {
      type: String,
      enum: ['Government', 'Private', 'Deemed', 'Autonomous'],
      required: true,
    },
    establishedYear: {
      type: Number,
    },
    accreditation: [
      {
        type: String, // e.g. NAAC A++, NBA, UGC, AICTE, NIRF
      },
    ],
    website: {
      type: String,
      default: '',
    },
    brochure: {
      type: String,
      default: '',
    },
    brochureUrl: {
      type: String,
      default: '',
    },
    contactInfo: {
      email: { type: String, default: '' },
      phone: { type: String, default: '' },
      helpline: { type: String, default: '' },
    },
    about: {
      type: String,
      required: true,
    },
    facilities: [
      {
        type: String, // e.g. Hostel, Library, Wi-Fi, Sports Complex, Labs, Auditorium
      },
    ],
    scholarships: [
      {
        type: String,
      },
    ],
    admissionProcess: {
      type: String,
      default: '',
    },
    placementOverview: {
      averagePackage: { type: String, default: '₹ 6.5 LPA' },
      highestPackage: { type: String, default: '₹ 45 LPA' },
      topRecruiters: [{ type: String }],
      placementRate: { type: String, default: '92%' },
    },
    rating: {
      type: Number,
      default: 4.5,
      min: 1,
      max: 5,
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

UniversitySchema.index({ slug: 1, 'location.state': 1, 'location.city': 1, universityType: 1 });

module.exports = mongoose.model('University', UniversitySchema);
