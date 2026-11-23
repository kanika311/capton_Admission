import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  GraduationCap,
  Clock,
  BookOpen,
  Building2,
  CheckCircle,
  Award,
  ArrowRight,
  Send,
  Layers,
  ChevronRight,
  Briefcase,
  Target,
} from 'lucide-react';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import api from '../../services/api';

const CourseDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/courses/slug/${slug}`);
        setCourse(res.data.data);
      } catch (err) {
        console.error('Error fetching course:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchCourse();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-royal"></div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen py-24 text-center">
        <h2 className="text-xl font-bold text-brand-navy">Course Not Found</h2>
        <Link to="/courses" className="mt-4 inline-block text-brand-royal underline">
          &larr; Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      {/* Banner */}
      <div className="bg-brand-navy text-white py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 text-xs text-brand-gold font-semibold uppercase tracking-wider mb-2">
            <Link to="/courses" className="hover:underline">
              Courses
            </Link>
            <ChevronRight className="w-3.5 h-3.5" />
            <span>{course.category?.name || 'Program'}</span>
          </div>
          <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-royal text-white">
                  {course.level}
                </span>
                <span className="text-xs text-slate-300 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-brand-gold" />
                  {course.duration}
                </span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
                {course.name}
              </h1>
              <p className="text-slate-300 text-sm mt-2 max-w-3xl leading-relaxed">
                {course.overview}
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3 shrink-0">
              <button
                onClick={() => navigate(`/courses?selectCourse=${course.slug}`)}
                className="bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2"
              >
                <span>Explore Universities</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => dispatch(openEnquiryModal({ course }))}
                className="bg-brand-royal hover:bg-blue-800 text-white font-bold px-6 py-3 rounded-xl shadow transition-all text-sm"
              >
                Get Counselling
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Grid Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Overview & Eligibility Card */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-6">
              <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-brand-royal" />
                Course Overview & Curriculum Scope
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {course.description || course.overview}
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="p-4 bg-brand-light rounded-xl border border-brand-border">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Minimum Eligibility
                  </span>
                  <p className="text-sm font-semibold text-brand-darkText">
                    {course.eligibility}
                  </p>
                </div>

                <div className="p-4 bg-brand-light rounded-xl border border-brand-border">
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                    Admission Benchmark
                  </span>
                  <p className="text-sm font-semibold text-brand-darkText">
                    {course.admissionRequirements || 'National / State Entrance score or Merit list'}
                  </p>
                </div>
              </div>
            </div>

            {/* Specializations Available */}
            {course.specializations && course.specializations.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card">
                <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Layers className="w-5 h-5 text-brand-royal" />
                  Available Specializations
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {course.specializations.map((spec, i) => (
                    <div
                      key={i}
                      className="p-3.5 bg-brand-light rounded-xl border border-brand-border flex items-center gap-2.5"
                    >
                      <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span className="text-sm font-medium text-brand-darkText">{spec}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Universities Offering this Course */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
                <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                  <Building2 className="w-5 h-5 text-brand-gold" />
                  Universities Offering {course.name}
                </h2>
                <span className="text-xs font-bold text-brand-royal bg-blue-50 px-2.5 py-1 rounded-full">
                  {course.universities?.length || 0} Listed
                </span>
              </div>

              {course.universities && course.universities.length > 0 ? (
                <div className="space-y-4">
                  {course.universities.map((item) => {
                    const uni = item.university;
                    if (!uni) return null;
                    return (
                      <div
                        key={item._id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-brand-royal/50 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={uni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=80&h=80&fit=crop'}
                            alt={uni.name}
                            className="w-12 h-12 rounded-xl object-cover border border-slate-200"
                          />
                          <div>
                            <h4 className="font-bold text-sm text-brand-navy">{uni.name}</h4>
                            <p className="text-xs text-slate-500">
                              {uni.location?.city}, {uni.location?.state} &bull; {uni.universityType}
                            </p>
                            <span className="text-xs font-bold text-brand-royal">
                              Total Fees: ₹ {(item.totalFees / 100000).toFixed(2)} Lakh
                            </span>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <Link
                            to={`/universities/${uni.slug}`}
                            className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-brand-darkText font-bold text-xs rounded-lg"
                          >
                            Details
                          </Link>
                          <button
                            onClick={() =>
                              dispatch(
                                openEnquiryModal({
                                  course,
                                  university: uni,
                                  specialization: item.specialization,
                                })
                              )
                            }
                            className="px-3.5 py-1.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold text-xs rounded-lg shadow-sm"
                          >
                            Apply Now
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <p className="text-xs text-slate-400 py-4">
                  Universities for this course are being mapped. Contact us for direct assistance.
                </p>
              )}
            </div>

            {/* Career Opportunities */}
            {course.careerOpportunities && course.careerOpportunities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card">
                <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <Briefcase className="w-5 h-5 text-brand-royal" />
                  Career Opportunities & Job Roles
                </h2>
                <div className="flex flex-wrap gap-2">
                  {course.careerOpportunities.map((career, i) => (
                    <span
                      key={i}
                      className="px-3 py-1.5 rounded-lg bg-blue-50 text-brand-royal font-semibold text-xs border border-blue-200"
                    >
                      {career}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Quick Summary Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-4">
              <h3 className="font-bold text-base text-brand-navy border-b border-slate-100 pb-2">
                Quick Facts
              </h3>

              <div className="space-y-3 text-xs">
                <div>
                  <span className="text-slate-400 block">Level</span>
                  <strong className="text-brand-darkText font-semibold">{course.level}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Duration</span>
                  <strong className="text-brand-darkText font-semibold">{course.duration}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Estimated Average Fees</span>
                  <strong className="text-brand-royal font-bold text-sm">
                    ₹ {(course.averageFeeRange?.min / 1000).toFixed(0)}k - {(course.averageFeeRange?.max / 1000).toFixed(0)}k / Year
                  </strong>
                </div>
                <div>
                  <span className="text-slate-400 block">Applicable Entrance Exams</span>
                  <div className="flex flex-wrap gap-1 mt-1">
                    {(course.entranceExams || []).map((ex, i) => (
                      <span key={i} className="text-[10px] bg-slate-100 px-2 py-0.5 rounded font-medium">
                        {ex}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button
                  onClick={() => dispatch(openEnquiryModal({ course }))}
                  className="w-full py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold rounded-xl text-xs shadow"
                >
                  Apply For Free Counselling
                </button>
              </div>
            </div>

            {/* Related Courses */}
            {course.relatedCourses && course.relatedCourses.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card">
                <h3 className="font-bold text-base text-brand-navy mb-4">
                  Related Degrees
                </h3>
                <div className="space-y-3">
                  {course.relatedCourses.map((rel) => (
                    <Link
                      key={rel._id}
                      to={`/courses/${rel.slug}`}
                      className="block p-3 rounded-xl bg-brand-light hover:bg-slate-100 border border-brand-border transition-colors"
                    >
                      <h4 className="font-bold text-xs text-brand-darkText">{rel.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {rel.level} &bull; {rel.duration}
                      </p>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseDetailsPage;
