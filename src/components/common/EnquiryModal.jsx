import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  X,
  User,
  Mail,
  Phone,
  GraduationCap,
  MapPin,
  CheckCircle2,
  Sparkles,
  ArrowRight,
} from 'lucide-react';
import { closeEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import api from '../../services/api';
import toast from 'react-hot-toast';

const popularCourses = [
  'B.Tech Computer Science & AI',
  'B.Tech (Other Engineering Branches)',
  'MBBS / Medical Degrees',
  'B.Sc Nursing / Healthcare',
  'BBA / Bachelor of Business',
  'MBA / Master of Business',
  'BCA / Computer Applications',
  'MCA / Master of Computers',
  'BA LLB / Integrated 5-Yr Law',
  'B.Pharmacy / Healthcare',
  'Design & Architecture',
  'Other Degree Programs',
];

const topCities = [
  'Delhi NCR (New Delhi, Noida, Gurgaon)',
  'Bangalore (Bengaluru)',
  'Mumbai / Navi Mumbai',
  'Pune',
  'Hyderabad',
  'Chennai',
  'Kolkata',
  'Ahmedabad',
  'Jaipur',
  'Lucknow / Kanpur',
  'Chandigarh / Mohali',
  'Patna / Ranchi',
  'Indore / Bhopal',
  'Other City',
];

const EnquiryModal = () => {
  const dispatch = useDispatch();
  const { isOpen, prefillCourse, prefillUniversity, prefillSpecialization } = useSelector(
    (state) => state.enquiryModal
  );
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    courseName: '',
    city: '',
    interestedInAbroad: false,
    interestedInOnline: false,
    specialization: '',
  });

  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [enquiryId, setEnquiryId] = useState('');

  useEffect(() => {
    if (user) {
      setFormData((prev) => ({
        ...prev,
        name: user.name || prev.name,
        email: user.email || prev.email,
        phone: user.phone || prev.phone,
      }));
    }
    if (prefillCourse?.name) {
      setFormData((prev) => ({ ...prev, courseName: prefillCourse.name }));
    }
    if (prefillSpecialization) {
      setFormData((prev) => ({ ...prev, specialization: prefillSpecialization }));
    }
  }, [user, prefillCourse, prefillSpecialization]);

  const handleClose = () => {
    setSubmitted(false);
    dispatch(closeEnquiryModal());
  };

  // Close on Escape key press and prevent background page scroll
  useEffect(() => {
    if (!isOpen) return;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        handleClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      toast.error('Please enter your full name');
      return;
    }
    if (!formData.email.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!formData.phone.trim()) {
      toast.error('Please enter your mobile number');
      return;
    }

    try {
      setSubmitting(true);
      const payload = {
        name: formData.name.trim(),
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        courseName: formData.courseName || prefillCourse?.name || 'General Course Enquiry',
        city: formData.city || 'India',
        interestedInAbroad: formData.interestedInAbroad,
        interestedInOnline: formData.interestedInOnline,
        universityName: prefillUniversity?.name || '',
        specialization: formData.specialization || prefillSpecialization || '',
      };

      const res = await api.post('/enquiries', payload);
      setEnquiryId(res.data.data?.enquiryNumber || 'ENQ-2026-SUCCESS');
      setSubmitted(true);
      toast.success('Your enquiry has been received!');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit enquiry. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      onClick={handleClose}
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-sm flex items-start sm:items-center justify-center p-3 sm:p-5 py-6 sm:py-10 animate-fadeIn"
    >
      <div
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-2xl sm:rounded-3xl max-w-4xl w-full shadow-2xl border border-slate-100 overflow-hidden relative animate-scaleUp my-auto"
      >
        {/* Prominent Close Button at Top Right (Always visible & tap-friendly) */}
        <button
          onClick={handleClose}
          type="button"
          aria-label="Close"
          className="absolute top-3.5 right-3.5 sm:top-4 sm:right-4 z-30 w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-100 hover:bg-slate-200 active:bg-slate-300 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors shadow-sm cursor-pointer"
        >
          <X className="w-4 h-4 stroke-[2.5]" />
        </button>

        {submitted ? (
          /* Submission Success State */
          <div className="p-8 sm:p-12 text-center max-w-lg mx-auto">
            <div className="w-16 h-16 rounded-full bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-5 border border-emerald-100">
              <CheckCircle2 className="w-9 h-9" />
            </div>
            <span className="text-xs font-bold uppercase tracking-widest text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
              Application Enquiry Registered
            </span>
            <h3 className="text-2xl font-black text-slate-900 mt-3">Thank You!</h3>
            <p className="text-sm text-slate-600 mt-2">
              Your inquiry reference number is{' '}
              <strong className="text-brand-royal font-mono font-bold">{enquiryId}</strong>.
            </p>
            <p className="text-xs text-slate-500 mt-2 leading-relaxed">
              Our expert educational counsellor will call or WhatsApp you shortly to share genuine fee structures, eligibility, and scholarship options.
            </p>
            <button
              onClick={handleClose}
              className="mt-6 px-8 py-3 bg-brand-royal text-white font-bold rounded-xl text-xs uppercase tracking-wider hover:bg-brand-navy shadow-md transition-all cursor-pointer"
            >
              Continue Exploring
            </button>
          </div>
        ) : (
          /* 2-Column Clean Modal - Identical to Reference */
          <div className="grid grid-cols-1 lg:grid-cols-12 min-h-0 lg:min-h-[580px]">
            {/* Left Column (5 cols): Friendly Illustration & Dream College Tag (Hidden on mobile for fast, clean experience) */}
            <div className="hidden lg:flex lg:col-span-5 bg-gradient-to-b from-slate-50 to-blue-50/40 p-6 sm:p-8 flex-col justify-between border-b lg:border-b-0 lg:border-r border-slate-100">
              <div className="flex items-center gap-2">
                <img
                  src="/logo.png"
                  alt="CaptonAdmission"
                  className="w-8 h-8 rounded-full bg-white p-0.5 shadow-sm"
                />
                <span className="font-extrabold text-sm tracking-tight text-brand-navy">
                  Capton<span className="text-brand-gold">Admission</span>
                </span>
              </div>

              {/* Vector Illustration */}
              <div className="my-auto py-6 flex flex-col items-center text-center">
                <div className="w-48 h-44 sm:w-56 sm:h-52 relative flex items-center justify-center">
                  <svg
                    viewBox="0 0 240 200"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-full h-full drop-shadow-sm"
                  >
                    {/* Desk Surface */}
                    <path
                      d="M20 160H220"
                      stroke="#CBD5E1"
                      strokeWidth="3"
                      strokeLinecap="round"
                    />
                    {/* Tablet / Screen */}
                    <rect
                      x="70"
                      y="95"
                      width="60"
                      height="45"
                      rx="4"
                      fill="#FFFFFF"
                      stroke="#1E293B"
                      strokeWidth="2.5"
                    />
                    <path
                      d="M80 115L95 105L115 122"
                      stroke="#E5A900"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                    <circle cx="118" cy="108" r="3" fill="#1746A2" />
                    {/* Art frame on wall */}
                    <rect
                      x="65"
                      y="40"
                      width="42"
                      height="30"
                      rx="3"
                      fill="#FFF1F2"
                      stroke="#E11D48"
                      strokeWidth="1.8"
                    />
                    <path
                      d="M72 62L80 50L92 62M88 62L95 54L102 62"
                      stroke="#E11D48"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    />
                    {/* Hair */}
                    <path
                      d="M142 55C138 48 148 40 156 42C165 44 172 50 170 58C174 61 176 68 171 73C167 77 160 76 156 74C152 75 146 72 144 67C140 64 140 59 142 55Z"
                      fill="#1E293B"
                    />
                    {/* Face */}
                    <path
                      d="M148 64C148 64 153 72 160 70C164 68 165 62 165 62"
                      fill="#FDE68A"
                    />
                    {/* Body */}
                    <path
                      d="M135 140L142 95C144 86 154 84 163 86L176 96L185 140H135Z"
                      fill="#FFFFFF"
                      stroke="#1E293B"
                      strokeWidth="2.2"
                    />
                    {/* Arm drawing with stylus */}
                    <path
                      d="M162 95L138 114L118 112"
                      stroke="#1E293B"
                      strokeWidth="2.2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M118 112L112 110"
                      stroke="#E11D48"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    {/* Little decorative stars */}
                    <path
                      d="M50 48L52 52L56 54L52 56L50 60L48 56L44 54L48 52L50 48Z"
                      fill="#E5A900"
                    />
                    <path
                      d="M185 36L186 39L189 40L186 41L185 44L184 41L181 40L184 39L185 36Z"
                      fill="#1746A2"
                    />
                  </svg>
                </div>

                <h4 className="text-lg sm:text-xl font-black text-slate-900 tracking-tight mt-2">
                  Ready to find your dream college
                </h4>
                <p className="text-xs text-slate-500 mt-1.5 leading-relaxed max-w-[260px]">
                  Fill in the basic details. Our verified counsellor will get in touch with you.
                </p>
              </div>

              <div className="flex items-center justify-center gap-1.5 text-[11px] text-slate-400 font-medium">
                <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
                <span>100% Free & Confidential Advice</span>
              </div>
            </div>

            {/* Right Column (7 cols): The Crystal Clear Form */}
            <div className="lg:col-span-7 p-5 sm:p-8 flex flex-col justify-between">
              <div>
                {/* Mobile-only Header Bar with Logo */}
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100 lg:hidden pr-10">
                  <div className="flex items-center gap-2">
                    <img
                      src="/logo.png"
                      alt="CaptonAdmission"
                      className="w-7 h-7 rounded-full bg-white p-0.5 shadow-sm"
                    />
                    <span className="font-extrabold text-sm tracking-tight text-brand-navy">
                      Capton<span className="text-brand-gold">Admission</span>
                    </span>
                  </div>
                  <div className="flex items-center gap-1 text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-100">
                    <Sparkles className="w-3 h-3 text-brand-gold" />
                    <span>100% Free</span>
                  </div>
                </div>

                {/* Form Heading matching SelectYourUniversity reference */}
                <div className="pr-8 sm:pr-10">
                  <span className="text-[11px] font-black uppercase tracking-wider text-brand-royal block mb-0.5">
                    GET STARTED
                  </span>
                  <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                    Welcome to CaptonAdmission
                  </h3>
                  <p className="text-xs text-slate-500 mt-1">
                    We need basic details first to continue.
                  </p>
                </div>

                <form onSubmit={handleSubmit} className="mt-4 sm:mt-5 space-y-3 sm:space-y-3.5">
                  {/* Full Name */}
                  <div>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <User className="w-4 h-4" />
                      </div>
                      <input
                        type="text"
                        required
                        placeholder="Name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                      />
                    </div>
                  </div>

                  {/* Email */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      ENTER EMAIL ADDRESS
                    </label>
                    <div className="relative">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                        <Mail className="w-4 h-4" />
                      </div>
                      <input
                        type="email"
                        required
                        placeholder="Email Address"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        className="w-full pl-10 pr-4 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                      />
                    </div>
                  </div>

                  {/* Mobile Number with Country Code */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      MOBILE NUMBER *
                    </label>
                    <div className="flex gap-2">
                      <div className="w-20 px-3 py-2.5 bg-slate-50 border border-slate-200/90 rounded-xl text-xs font-bold text-slate-700 flex items-center justify-between shrink-0">
                        <span>+91</span>
                        <span className="text-slate-400 text-[10px]">▼</span>
                      </div>
                      <input
                        type="tel"
                        required
                        placeholder="Enter your mobile number"
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        className="flex-1 px-4 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                      />
                    </div>
                  </div>

                  {/* Course Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      SELECT A COURSE *
                    </label>
                    <select
                      value={formData.courseName}
                      onChange={(e) => setFormData({ ...formData, courseName: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                    >
                      <option value="">Course</option>
                      {popularCourses.map((c, i) => (
                        <option key={i} value={c}>
                          {c}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* City Dropdown */}
                  <div>
                    <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                      SELECT YOUR CITY *
                    </label>
                    <select
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50/80 hover:bg-slate-50 focus:bg-white border border-slate-200/90 rounded-xl text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
                    >
                      <option value="">City</option>
                      {topCities.map((city, i) => (
                        <option key={i} value={city}>
                          {city}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Radio Questions */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* Interested in Abroad */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        ARE YOU INTERESTED IN ABROAD? *
                      </span>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pt-0.5">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="abroad"
                            checked={formData.interestedInAbroad === true}
                            onChange={() => setFormData({ ...formData, interestedInAbroad: true })}
                            className="text-brand-royal focus:ring-brand-royal"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="abroad"
                            checked={formData.interestedInAbroad === false}
                            onChange={() => setFormData({ ...formData, interestedInAbroad: false })}
                            className="text-brand-royal focus:ring-brand-royal"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>

                    {/* Interested in Online Course */}
                    <div className="space-y-1">
                      <span className="block text-[10px] font-bold text-slate-600 uppercase tracking-wider">
                        INTERESTED IN ONLINE COURSE? *
                      </span>
                      <div className="flex items-center gap-4 text-xs font-medium text-slate-700 pt-0.5">
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="online"
                            checked={formData.interestedInOnline === true}
                            onChange={() => setFormData({ ...formData, interestedInOnline: true })}
                            className="text-brand-royal focus:ring-brand-royal"
                          />
                          <span>Yes</span>
                        </label>
                        <label className="flex items-center gap-1.5 cursor-pointer">
                          <input
                            type="radio"
                            name="online"
                            checked={formData.interestedInOnline === false}
                            onChange={() => setFormData({ ...formData, interestedInOnline: false })}
                            className="text-brand-royal focus:ring-brand-royal"
                          />
                          <span>No</span>
                        </label>
                      </div>
                    </div>
                  </div>

                  {/* Submit Button */}
                  <div className="pt-2">
                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-3 bg-brand-royal hover:bg-brand-navy active:scale-[0.99] text-white font-bold rounded-xl text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer"
                    >
                      <span>{submitting ? 'Submitting Details...' : 'Submit'}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnquiryModal;
