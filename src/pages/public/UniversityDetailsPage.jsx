import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Building2,
  MapPin,
  Star,
  Award,
  BookOpen,
  GraduationCap,
  Globe,
  Mail,
  Phone,
  CheckCircle,
  HelpCircle,
  ArrowRight,
  ShieldCheck,
  Send,
} from 'lucide-react';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import api from '../../services/api';

const UniversityDetailsPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();

  const [uni, setUni] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUniversity = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/universities/slug/${slug}`);
        setUni(res.data.data);
      } catch (err) {
        console.error('Error fetching university:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUniversity();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-royal"></div>
      </div>
    );
  }

  if (!uni) {
    return (
      <div className="min-h-screen py-24 text-center">
        <h2 className="text-xl font-bold text-brand-navy">University Not Found</h2>
        <Link to="/universities" className="mt-4 inline-block text-brand-royal underline">
          &larr; Back to Universities Directory
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      {/* Banner */}
      <div className="relative bg-brand-navy text-white">
        <div className="h-60 sm:h-72 w-full overflow-hidden relative">
          <img
            src={uni.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop'}
            alt={uni.name}
            className="w-full h-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-brand-navy via-brand-navy/60 to-transparent"></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative -mt-24 pb-8">
          <div className="flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6">
            <div className="flex items-start sm:items-end gap-5">
              <img
                src={uni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=120&h=120&fit=crop'}
                alt={uni.name}
                className="w-24 h-24 rounded-2xl object-cover bg-white p-1 border-2 border-white shadow-xl shrink-0"
              />
              <div>
                <div className="flex items-center gap-2 flex-wrap mb-1.5">
                  <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-navy">
                    {uni.universityType}
                  </span>
                  <span className="text-xs text-slate-300 flex items-center gap-1 font-semibold">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    {uni.rating || 4.5} / 5.0
                  </span>
                  {uni.establishedYear && (
                    <span className="text-xs text-slate-300">
                      Estd. {uni.establishedYear}
                    </span>
                  )}
                </div>

                <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                  {uni.name}
                </h1>

                <p className="text-xs sm:text-sm text-slate-300 flex items-center gap-1.5 mt-1">
                  <MapPin className="w-4 h-4 text-brand-gold shrink-0" />
                  <span>{uni.location?.address ? `${uni.location.address}, ` : ''}{uni.location?.city}, {uni.location?.state}</span>
                </p>
              </div>
            </div>

            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={() => dispatch(openEnquiryModal({ university: uni }))}
                className="bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-extrabold px-6 py-3 rounded-xl shadow-lg transition-all text-sm flex items-center gap-2"
              >
                <span>Apply / Enquire</span>
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Left Details (8 cols) */}
          <div className="lg:col-span-8 space-y-8">
            {/* About University */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-4">
              <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                <Building2 className="w-5 h-5 text-brand-royal" />
                About {uni.name}
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed whitespace-pre-line">
                {uni.about}
              </p>

              {/* Accreditations */}
              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                  Recognitions & Accreditations
                </span>
                <div className="flex flex-wrap gap-2">
                  {(uni.accreditation || []).map((acc, i) => (
                    <span
                      key={i}
                      className="px-3 py-1 rounded-lg bg-blue-50 text-brand-royal font-bold text-xs border border-blue-200"
                    >
                      {acc}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Courses Offered */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3 mb-6">
                <h2 className="text-xl font-bold text-brand-navy flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-brand-royal" />
                  Courses & Fee Structure
                </h2>
                <span className="text-xs font-bold text-slate-500">
                  {uni.coursesOffered?.length || 0} Programs
                </span>
              </div>

              {uni.coursesOffered && uni.coursesOffered.length > 0 ? (
                <div className="space-y-4">
                  {uni.coursesOffered.map((mapping) => {
                    const c = mapping.course;
                    if (!c) return null;
                    return (
                      <div
                        key={mapping._id}
                        className="p-4 rounded-xl border border-slate-200 hover:border-brand-royal/40 bg-brand-light/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4"
                      >
                        <div>
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-brand-royal border border-blue-200">
                              {c.level}
                            </span>
                            <span className="text-xs text-slate-500 font-medium">
                              {mapping.duration || c.duration}
                            </span>
                          </div>
                          <h4 className="font-bold text-sm text-brand-navy">{c.name}</h4>
                          <p className="text-xs text-slate-500 mt-0.5">
                            Specialization: <strong>{mapping.specialization || 'General'}</strong>
                          </p>
                          <p className="text-[11px] text-slate-400 mt-1">
                            Eligibility: {mapping.eligibility || c.eligibility}
                          </p>
                        </div>

                        <div className="text-left sm:text-right shrink-0">
                          <span className="text-xs text-slate-400 block">Total Tuition</span>
                          <strong className="text-brand-navy font-bold text-base">
                            ₹ {(mapping.totalFees / 100000).toFixed(2)} Lakh
                          </strong>
                          <button
                            onClick={() =>
                              dispatch(
                                openEnquiryModal({
                                  course: c,
                                  university: uni,
                                  specialization: mapping.specialization,
                                })
                              )
                            }
                            className="mt-2 block w-full sm:w-auto px-4 py-1.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold text-xs rounded-lg shadow-sm text-center"
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
                  Course details are currently updated. Contact admission counsellor for seat inquiry.
                </p>
              )}
            </div>

            {/* Placements & Recruiter Highlights */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-4">
              <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                Placement Overview
              </h2>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                <div className="p-4 bg-emerald-50/60 rounded-xl border border-emerald-200">
                  <span className="text-[11px] font-bold text-emerald-700 uppercase tracking-wider block">
                    Average Package
                  </span>
                  <strong className="text-lg font-extrabold text-emerald-800">
                    {uni.placementOverview?.averagePackage || 'Verified'}
                  </strong>
                </div>

                <div className="p-4 bg-blue-50/60 rounded-xl border border-blue-200">
                  <span className="text-[11px] font-bold text-brand-royal uppercase tracking-wider block">
                    Highest Package
                  </span>
                  <strong className="text-lg font-extrabold text-brand-navy">
                    {uni.placementOverview?.highestPackage || 'Verified'}
                  </strong>
                </div>

                <div className="p-4 bg-purple-50/60 rounded-xl border border-purple-200">
                  <span className="text-[11px] font-bold text-purple-700 uppercase tracking-wider block">
                    Placement Rate
                  </span>
                  <strong className="text-lg font-extrabold text-purple-800">
                    {uni.placementOverview?.placementRate || '90%+'}
                  </strong>
                </div>
              </div>

              {uni.placementOverview?.topRecruiters && uni.placementOverview.topRecruiters.length > 0 && (
                <div className="pt-2">
                  <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-2">
                    Key Campus Recruiters
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {uni.placementOverview.topRecruiters.map((rec, i) => (
                      <span key={i} className="px-3 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-semibold">
                        {rec}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Campus Facilities */}
            {uni.facilities && uni.facilities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card">
                <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3 mb-4 flex items-center gap-2">
                  <CheckCircle className="w-5 h-5 text-brand-royal" />
                  Campus Facilities & Infrastructure
                </h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                  {uni.facilities.map((fac, i) => (
                    <div key={i} className="p-3 bg-brand-light rounded-xl border border-brand-border text-xs font-semibold text-slate-700 flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-brand-royal"></span>
                      <span>{fac}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Right Sidebar (4 cols) */}
          <div className="lg:col-span-4 space-y-6">
            {/* Contact & Official Website Card */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-4">
              <h3 className="font-bold text-base text-brand-navy border-b border-slate-100 pb-2">
                Official Information
              </h3>

              <div className="space-y-3 text-xs">
                {uni.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-brand-royal shrink-0" />
                    <a
                      href={uni.website}
                      target="_blank"
                      rel="noreferrer"
                      className="text-brand-royal hover:underline truncate"
                    >
                      {uni.website}
                    </a>
                  </div>
                )}
                {uni.contactInfo?.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-brand-royal shrink-0" />
                    <span className="truncate">{uni.contactInfo.email}</span>
                  </div>
                )}
                {uni.contactInfo?.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-brand-royal shrink-0" />
                    <span>{uni.contactInfo.phone}</span>
                  </div>
                )}
              </div>

              <div className="pt-2">
                <button
                  onClick={() => dispatch(openEnquiryModal({ university: uni }))}
                  className="w-full py-2.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold rounded-xl text-xs shadow"
                >
                  Request University Prospectus
                </button>
              </div>
            </div>

            {/* Similar Universities */}
            {uni.similarUniversities && uni.similarUniversities.length > 0 && (
              <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card">
                <h3 className="font-bold text-base text-brand-navy mb-4">
                  Similar Universities
                </h3>
                <div className="space-y-3">
                  {uni.similarUniversities.map((sim) => (
                    <Link
                      key={sim._id}
                      to={`/universities/${sim.slug}`}
                      className="block p-3 rounded-xl bg-brand-light hover:bg-slate-100 border border-brand-border transition-colors"
                    >
                      <h4 className="font-bold text-xs text-brand-navy">{sim.name}</h4>
                      <p className="text-[11px] text-slate-500 mt-0.5">
                        {sim.location?.city}, {sim.location?.state} &bull; {sim.universityType}
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

export default UniversityDetailsPage;
