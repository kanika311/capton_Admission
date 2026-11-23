import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Search,
  ArrowRight,
  GraduationCap,
  Building2,
  Compass,
  CheckCircle,
  Award,
  BookOpen,
  Users,
  ShieldCheck,
  PhoneCall,
  Sparkles,
  ChevronRight,
  Star,
  Clock,
  MapPin,
  Cpu,
  Terminal,
  Briefcase,
  Stethoscope,
  Atom,
  BadgePercent,
  Scale,
  Pill,
  HeartPulse,
  Palette,
  Sprout,
  Utensils,
} from 'lucide-react';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import api from '../../services/api';

const categoryIcons = {
  'Engineering': Cpu,
  'Computer Applications': Terminal,
  'Management': Briefcase,
  'Medical': Stethoscope,
  'Science': Atom,
  'Commerce': BadgePercent,
  'Law': Scale,
  'Pharmacy': Pill,
  'Nursing': HeartPulse,
  'Design': Palette,
  'Arts and Humanities': BookOpen,
  'Education': GraduationCap,
  'Agriculture': Sprout,
  'Hotel Management': Utensils,
};

const HomePage = () => {
  const [categories, setCategories] = useState([]);
  const [featuredCourses, setFeaturedCourses] = useState([]);
  const [topUniversities, setTopUniversities] = useState([]);
  const [services, setServices] = useState([]);
  const [exams, setExams] = useState([]);
  const [testimonials, setTestimonials] = useState([]);
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [cmsData, setCmsData] = useState({
    heroHeading: 'Find Your Dream Course & Discover Your Perfect University',
    heroVideoUrl:
      'https://assets.mixkit.co/videos/preview/mixkit-students-walking-in-a-university-campus-43387-large.mp4',
    heroDescription:
      'Explore top courses, compare universities, understand admission opportunities, and get personalized guidance with CaptonAdmission.',
  });

  // Search hero inputs
  const [courseQuery, setCourseQuery] = useState('');
  const [uniQuery, setUniQuery] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Auto popup trigger after 3.5 seconds on first visit
  useEffect(() => {
    const timer = setTimeout(() => {
      const alreadyShown = sessionStorage.getItem('enquiry_popup_shown');
      if (!alreadyShown) {
        dispatch(openEnquiryModal({}));
        sessionStorage.setItem('enquiry_popup_shown', 'true');
      }
    }, 3500);
    return () => clearTimeout(timer);
  }, [dispatch]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [catRes, courseRes, uniRes, servRes, examRes, testRes, blogRes, cmsRes] =
          await Promise.all([
            api.get('/courses/categories'),
            api.get('/courses?featured=true&limit=6'),
            api.get('/universities?featured=true&limit=6'),
            api.get('/services'),
            api.get('/exams'),
            api.get('/testimonials'),
            api.get('/blogs?limit=3'),
            api.get('/cms').catch(() => ({ data: { data: null } })),
          ]);

        setCategories(catRes.data.data || []);
        setFeaturedCourses(courseRes.data.data || []);
        setTopUniversities(uniRes.data.data || []);
        setServices((servRes.data.data || []).slice(0, 6));
        setExams((examRes.data.data || []).slice(0, 6));
        setTestimonials(testRes.data.data || []);
        setBlogs(blogRes.data.data || []);
        if (cmsRes.data?.data) {
          setCmsData(cmsRes.data.data);
        }
      } catch (err) {
        console.error('Error loading homepage data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (courseQuery) {
      navigate(`/courses?search=${encodeURIComponent(courseQuery)}`);
    } else if (uniQuery) {
      navigate(`/universities?search=${encodeURIComponent(uniQuery)}`);
    } else {
      navigate('/courses');
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* SECTION 1: CRYSTAL CLEAR HERO SECTION */}
      <section className="relative py-16 sm:py-24 lg:py-28 overflow-hidden flex items-center justify-center border-b border-slate-100">
        {/* Background Ambient Video with Crystal-Clear Light Overlay */}
        <div className="absolute inset-0 overflow-hidden z-0">
          {cmsData.heroVideoUrl && (
            <video
              key={cmsData.heroVideoUrl}
              autoPlay
              loop
              muted
              playsInline
              className="w-full h-full object-cover"
            >
              <source src={cmsData.heroVideoUrl} type="video/mp4" />
            </video>
          )}
          {/* Luminous light frosted wash for maximum readability & crystal clarity */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/85 to-white/95 backdrop-blur-[2px]" />
        </div>

        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center">
          {/* Crystal Clear High-Contrast Headline (1 Line on Desktop) */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-tight text-center md:whitespace-nowrap max-w-5xl mx-auto">
            {cmsData.heroHeading ? (
              <span>{cmsData.heroHeading}</span>
            ) : (
              <>
                Find Your Dream Course <span className="text-brand-royal">in India</span>
              </>
            )}
          </h1>

          {/* Clean, Gentle Subtitle */}
          <p className="text-slate-600 text-sm sm:text-base leading-relaxed max-w-2xl mx-auto mt-3 font-normal">
            One platform to apply to 10,000+ esteemed colleges/universities in India & Abroad.
          </p>

          {/* Floating Minimalist Search Bar with Arrow Button */}
          <form
            onSubmit={handleHeroSearch}
            className="mt-8 max-w-2xl mx-auto bg-white rounded-full p-2 border border-slate-200/90 shadow-xl flex items-center gap-3 pl-5 pr-2 focus-within:ring-2 focus-within:ring-brand-royal/20 focus-within:border-brand-royal transition-all"
          >
            <Search className="w-5 h-5 text-slate-400 shrink-0" />
            <input
              type="text"
              placeholder="Search for Colleges, Exams, Courses and More.."
              value={courseQuery}
              onChange={(e) => setCourseQuery(e.target.value)}
              className="flex-1 bg-transparent text-sm font-semibold text-slate-800 placeholder-slate-400 focus:outline-none"
            />
            <button
              type="submit"
              aria-label="Search"
              className="w-11 h-11 rounded-full bg-brand-royal hover:bg-brand-navy text-white flex items-center justify-center shrink-0 shadow-md transition-all group"
            >
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </form>

          {/* TOP LINKS PILLS (Identical to reference screenshot) */}
          <div className="mt-7">
            <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase block mb-2.5">
              TOP LINKS
            </span>
            <div className="flex flex-wrap items-center justify-center gap-2 max-w-3xl mx-auto">
              {[
                { label: 'B.Tech', slug: 'engineering' },
                { label: 'MBBS', slug: 'medical' },
                { label: 'B.Sc (Nursing)', slug: 'medical' },
                { label: 'BCA', slug: 'computer-applications' },
                { label: 'MBA', slug: 'management' },
                { label: 'BA LLB', slug: 'law' },
                { label: 'B.Pharmacy', slug: 'pharmacy' },
                { label: 'BAMS', slug: 'medical' },
              ].map((link, idx) => (
                <Link
                  key={idx}
                  to={`/courses?category=${link.slug}`}
                  className="px-4 py-1.5 rounded-full border border-slate-200/90 bg-white/90 hover:bg-white hover:border-brand-royal text-slate-700 hover:text-brand-royal text-xs font-semibold shadow-xs transition-all"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Connect CTA & Free Advice Badge */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <button
              onClick={() => dispatch(openEnquiryModal({}))}
              className="px-6 py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-black rounded-full text-xs uppercase tracking-wider shadow-sm hover:shadow transition-all flex items-center gap-2"
            >
              <span>Get Free Counselling</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Partner Universities Strip (Clean minimal logos) */}
          <div className="mt-12 pt-8 border-t border-slate-200/60 max-w-4xl mx-auto">
            <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-4">
              Partnered with 20+ Accredited Universities
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-70 hover:opacity-100 transition-opacity">
              {[
                'Delhi Technological University',
                'Vellore Institute of Technology',
                'BITS Pilani',
                'Symbiosis International',
                'Amity University',
                'Bennett University',
                'NLSIU Bangalore',
              ].map((uni, idx) => (
                <span
                  key={idx}
                  className="text-xs font-bold tracking-tight text-slate-600 hover:text-brand-royal transition-colors uppercase"
                >
                  {uni}
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: POPULAR COURSE CATEGORIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
            Browse By Stream
          </span>
          <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
            Popular Course Categories
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Select your academic discipline to explore degrees, eligibility, career outcomes, and accredited universities.
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-5">
          {categories.map((cat) => {
            const IconComponent = categoryIcons[cat.name] || GraduationCap;
            return (
              <div
                key={cat._id}
                className="bg-white p-5 rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-brand-light group-hover:bg-brand-royal text-brand-royal group-hover:text-white flex items-center justify-center transition-colors mb-4">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-brand-darkText group-hover:text-brand-royal transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">
                    {cat.description || 'Undergraduate and postgraduate degrees.'}
                  </p>
                </div>

                <Link
                  to={`/courses?category=${cat.slug}`}
                  className="mt-4 pt-3 border-t border-slate-100 text-xs font-semibold text-brand-royal group-hover:text-brand-navy flex items-center justify-between"
                >
                  <span>Explore Courses</span>
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            );
          })}
        </div>
      </section>

      {/* SECTION 3: FEATURED COURSES */}
      <section className="py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
                High Demand Degrees
              </span>
              <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
                Featured Courses
              </h2>
              <p className="text-slate-600 text-sm mt-2">
                Top recognized undergraduate and postgraduate degrees with strong career placements.
              </p>
            </div>
            <Link
              to="/courses"
              className="mt-4 md:mt-0 text-sm font-bold text-brand-royal hover:text-brand-navy flex items-center gap-1 group"
            >
              <span>View All 30+ Courses</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {featuredCourses.map((course) => (
              <div
                key={course._id}
                className="bg-brand-light rounded-2xl border border-brand-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
              >
                <div className="p-6">
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-blue-100 text-brand-royal">
                      {course.level}
                    </span>
                    <span className="text-xs text-slate-500 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {course.duration}
                    </span>
                  </div>

                  <h3 className="font-bold text-lg text-brand-navy line-clamp-2 leading-snug">
                    {course.name}
                  </h3>

                  <p className="text-xs text-slate-600 mt-2 line-clamp-2">
                    {course.overview}
                  </p>

                  <div className="mt-4 pt-3 border-t border-slate-200/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-slate-500">Eligibility:</span>
                      <span className="font-semibold text-brand-darkText truncate max-w-[190px]">
                        {course.eligibility}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-slate-600">
                      <span className="font-medium text-slate-500">Avg Fee Range:</span>
                      <span className="font-bold text-brand-navy">
                        ₹ {(course.averageFeeRange?.min / 1000).toFixed(0)}k - {(course.averageFeeRange?.max / 1000).toFixed(0)}k / yr
                      </span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-white border-t border-brand-border flex items-center gap-2">
                  <Link
                    to={`/courses/${course.slug}`}
                    className="flex-1 text-center py-2 bg-brand-light hover:bg-slate-200 text-brand-royal font-bold text-xs rounded-lg transition-colors"
                  >
                    Course Details
                  </Link>
                  <Link
                    to={`/courses?selectCourse=${course.slug}`}
                    className="flex-1 text-center py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    Explore Colleges
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 4: TOP UNIVERSITIES */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
              Accredited Campuses
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
              Top Universities & Colleges
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Explore leading government and private universities with verified NIRF and NAAC accreditations.
            </p>
          </div>
          <Link
            to="/universities"
            className="mt-4 md:mt-0 text-sm font-bold text-brand-royal hover:text-brand-navy flex items-center gap-1 group"
          >
            <span>View All 20+ Universities</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
          {topUniversities.map((uni) => (
            <div
              key={uni._id}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between"
            >
              {/* Cover Image banner */}
              <div className="relative h-44 overflow-hidden">
                <img
                  src={uni.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=300&fit=crop'}
                  alt={uni.name}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-3 left-3">
                  <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-brand-navy/90 text-white backdrop-blur-sm">
                    {uni.universityType}
                  </span>
                </div>
                <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-md text-xs font-bold text-amber-600 shadow-sm">
                  <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                  <span>{uni.rating || 4.5}</span>
                </div>
              </div>

              {/* Body */}
              <div className="p-6">
                <h3 className="font-bold text-base text-brand-navy line-clamp-1">
                  {uni.name}
                </h3>
                <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                  <span>{uni.location?.city}, {uni.location?.state}</span>
                </p>

                <div className="mt-4 flex flex-wrap gap-1.5">
                  {(uni.accreditation || []).slice(0, 3).map((acc, i) => (
                    <span
                      key={i}
                      className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700"
                    >
                      {acc}
                    </span>
                  ))}
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-slate-400 block text-[11px]">Avg Package</span>
                    <strong className="text-emerald-700 font-bold">
                      {uni.placementOverview?.averagePackage || 'Verified'}
                    </strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[11px]">Highest Package</span>
                    <strong className="text-brand-navy font-bold">
                      {uni.placementOverview?.highestPackage || 'Verified'}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Action */}
              <div className="p-4 bg-slate-50 border-t border-brand-border flex items-center justify-between">
                <Link
                  to={`/universities/${uni.slug}`}
                  className="w-full text-center py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-lg transition-colors"
                >
                  View University Profile &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: OUR SERVICES */}
      <section className="py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
              Admission Assistance
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
              Comprehensive Admission Services
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              From course selection and psychometric counselling to scholarship guidance and loan processing.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service._id}
                className="p-6 rounded-2xl border border-brand-border bg-brand-light hover:bg-white hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-royal flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                    <Compass className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-base text-brand-navy">
                    {service.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-2 line-clamp-3 leading-relaxed">
                    {service.shortDescription}
                  </p>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-200 flex items-center justify-between">
                  <Link
                    to={`/services/${service.slug}`}
                    className="text-xs font-bold text-brand-royal hover:underline"
                  >
                    Learn More
                  </Link>
                  <button
                    onClick={() => dispatch(openEnquiryModal({}))}
                    className="text-xs font-bold text-brand-navy bg-brand-gold hover:bg-brand-goldHover px-3 py-1.5 rounded-lg"
                  >
                    Enquire Now
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="text-center mt-10">
            <Link
              to="/services"
              className="inline-flex items-center gap-2 text-sm font-bold text-brand-royal hover:underline"
            >
              <span>Explore all 12 admission assistance services</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* SECTION 6: WHY CHOOSE CAPTONADMISSION? */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
            Our Promise
          </span>
          <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
            Why Choose CaptonAdmission?
          </h2>
          <p className="text-slate-600 text-sm mt-2">
            Built on integrity, transparency, and data-backed student guidance.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-royal flex items-center justify-center shrink-0">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-brand-navy">Personalized Counselling</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                One-on-one sessions with senior counsellors matched to your strengths, goals, and family budget.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-brand-gold flex items-center justify-center shrink-0">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-brand-navy">University Comparison</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Objective side-by-side benchmarking of universities across ROI, faculty, and placement packages.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-brand-navy">Admission Assistance</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Step-by-step guidance through institutional counseling, cutoff ranks, and seat confirmation.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-brand-navy">Application Support</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Error-free documentation review, SOP assistance, and deadline tracking for zero rejection risks.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-brand-navy">Scholarship Guidance</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Direct access to university merit scholarships, defense concessions, and state education grants.
              </p>
            </div>
          </div>

          <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-navy flex items-center justify-center shrink-0">
              <PhoneCall className="w-6 h-6" />
            </div>
            <div>
              <h4 className="font-bold text-base text-brand-navy">Dedicated Counsellors</h4>
              <p className="text-xs text-slate-600 mt-1.5 leading-relaxed">
                Direct WhatsApp and call support throughout your entire journey until you arrive on campus.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 7: HOW IT WORKS (FOUR-STEP JOURNEY) */}
      <section className="py-20 bg-gradient-to-br from-brand-navy to-brand-royal text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-gold bg-white/10 px-3 py-1 rounded-full border border-white/20">
              Simple 4-Step Process
            </span>
            <h2 className="text-3xl font-extrabold mt-3">
              How CaptonAdmission Works
            </h2>
            <p className="text-slate-200 text-sm mt-2">
              Your streamlined pathway from course discovery to official university enrollment.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 relative">
              <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy font-extrabold flex items-center justify-center text-base mb-4 shadow">
                1
              </div>
              <h4 className="font-bold text-lg text-white">Choose Your Course</h4>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                Explore engineering, medical, management, or law degrees using our interactive course discovery tool.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 relative">
              <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy font-extrabold flex items-center justify-center text-base mb-4 shadow">
                2
              </div>
              <h4 className="font-bold text-lg text-white">Explore Universities</h4>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                Filter accredited colleges by total fees, location, NIRF ranks, and verified placement packages.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 relative">
              <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy font-extrabold flex items-center justify-center text-base mb-4 shadow">
                3
              </div>
              <h4 className="font-bold text-lg text-white">Get Expert Guidance</h4>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                Connect with our academic counsellors for personalized guidance, scholarships, and document checks.
              </p>
            </div>

            <div className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/10 relative">
              <div className="w-10 h-10 rounded-full bg-brand-gold text-brand-navy font-extrabold flex items-center justify-center text-base mb-4 shadow">
                4
              </div>
              <h4 className="font-bold text-lg text-white">Complete Your Admission</h4>
              <p className="text-xs text-slate-200 mt-2 leading-relaxed">
                Submit verified applications, track status on your dashboard, and secure your admission letter.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 8: POPULAR ENTRANCE EXAMS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
              Test Prep & Dates
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
              Popular Entrance Examinations
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Stay updated on exam patterns, important schedules, and participating universities.
            </p>
          </div>
          <Link
            to="/exams"
            className="mt-4 md:mt-0 text-sm font-bold text-brand-royal hover:text-brand-navy flex items-center gap-1 group"
          >
            <span>View All Exams</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {exams.map((exam) => (
            <div
              key={exam._id}
              className="bg-white p-6 rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                    {exam.stream}
                  </span>
                  <span className="text-xs text-slate-400 font-medium">
                    {exam.examLevel} Level
                  </span>
                </div>
                <h3 className="font-bold text-base text-brand-navy">
                  {exam.name}
                </h3>
                <p className="text-xs text-slate-500 mt-1 line-clamp-2">
                  {exam.overview}
                </p>
                <div className="mt-4 p-3 bg-brand-light rounded-xl border border-slate-100 text-xs space-y-1">
                  <p className="text-slate-600">
                    <strong>Mode:</strong> {exam.examPattern?.mode || 'Computer Based'}
                  </p>
                  <p className="text-slate-600">
                    <strong>Duration:</strong> {exam.examPattern?.duration || '3 Hours'}
                  </p>
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-100">
                <Link
                  to={`/exams/${exam.slug}`}
                  className="block text-center py-2 bg-brand-light hover:bg-slate-200 text-brand-royal font-bold text-xs rounded-lg transition-colors"
                >
                  Exam Pattern & Syllabus &rarr;
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 9: STUDENT TESTIMONIALS */}
      <section className="py-20 bg-white border-y border-brand-border">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
              Real Experiences
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
              What Our Students Say
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Thousands of students have found their dream colleges through CaptonAdmission guidance.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
            {testimonials.map((t) => (
              <div
                key={t._id}
                className="bg-brand-light p-6 rounded-2xl border border-brand-border shadow-card flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center gap-1 text-amber-500 mb-3">
                    {[...Array(t.rating || 5)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-slate-700 italic leading-relaxed">
                    "{t.quote}"
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-200/80 flex items-center gap-3">
                  <img
                    src={t.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&h=80&fit=crop'}
                    alt={t.studentName}
                    className="w-10 h-10 rounded-full object-cover border border-brand-border"
                  />
                  <div>
                    <h4 className="font-bold text-xs text-brand-navy">{t.studentName}</h4>
                    <p className="text-[11px] text-brand-royal font-medium">{t.course}</p>
                    <p className="text-[10px] text-slate-500">{t.university}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* SECTION 10: LATEST EDUCATION BLOGS */}
      <section className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-brand-royal bg-blue-50 px-3 py-1 rounded-full">
              Articles & Guides
            </span>
            <h2 className="text-3xl font-extrabold text-brand-navy mt-3">
              Latest Education Insights
            </h2>
            <p className="text-slate-600 text-sm mt-2">
              Stay ahead with curated admissions advice, career roadmaps, and college fee analysis.
            </p>
          </div>
          <Link
            to="/blogs"
            className="mt-4 md:mt-0 text-sm font-bold text-brand-royal hover:text-brand-navy flex items-center gap-1 group"
          >
            <span>View All Articles</span>
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-7">
          {blogs.map((b) => (
            <div
              key={b._id}
              className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
            >
              <div className="h-44 overflow-hidden">
                <img
                  src={b.featuredImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop'}
                  alt={b.title}
                  className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                />
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-brand-royal">
                    {b.category}
                  </span>
                  <h3 className="font-bold text-sm text-brand-navy mt-1 line-clamp-2 leading-snug">
                    {b.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                    {b.excerpt}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                  <span>By {b.author || 'Editorial Desk'}</span>
                  <Link
                    to={`/blogs/${b.slug}`}
                    className="font-bold text-brand-royal hover:underline"
                  >
                    Read Article &rarr;
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 11: COUNSELLING CTA */}
      <section className="py-16 bg-gradient-to-r from-brand-royal to-brand-navy text-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <h2 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Confused About Your Career or University?
          </h2>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl mx-auto">
            Speak directly with our senior admission advisors. We evaluate your marks, recommend genuine accredited options, and assist with scholarships at zero cost.
          </p>
          <div className="pt-2">
            <button
              onClick={() => dispatch(openEnquiryModal({}))}
              className="bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-extrabold text-base px-8 py-3.5 rounded-xl shadow-xl transition-all inline-flex items-center gap-2"
            >
              <PhoneCall className="w-5 h-5" />
              <span>Get Free Counselling</span>
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
