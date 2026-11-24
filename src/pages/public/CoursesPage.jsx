import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  Share2,
  Copy,
  Check,
  PhoneCall,
  X,
  GraduationCap,
} from 'lucide-react';
import {
  setMobileStep,
  setSelectedCategory,
  setSelectedLevel,
  setSearchQuery,
  selectCourse,
  fetchMatchingUniversities,
} from '../../redux/slices/courseDiscoverySlice';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import PanelCourseSelect from '../../components/courseDiscovery/PanelCourseSelect';
import PanelUniversityList from '../../components/courseDiscovery/PanelUniversityList';
import PanelMySelection from '../../components/courseDiscovery/PanelMySelection';
import api from '../../services/api';
import toast from 'react-hot-toast';

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const {
    mobileStep,
    shortlisted,
    selectedCategory,
    selectedCourse,
    selectedLevel,
    searchQuery,
  } = useSelector((state) => state.courseDiscovery);

  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Check URL query parameters (e.g. ?category=engineering or ?selectCourse=btech-computer-science-engineering)
  useEffect(() => {
    const handleUrlParams = async () => {
      const catSlug = searchParams.get('category');
      const courseSlug = searchParams.get('selectCourse');

      if (catSlug) {
        try {
          const res = await api.get('/courses/categories');
          const found = (res.data.data || []).find((c) => c.slug === catSlug);
          if (found) dispatch(setSelectedCategory(found));
        } catch (e) {}
      }

      if (courseSlug) {
        try {
          const res = await api.get(`/courses/slug/${courseSlug}`);
          if (res.data.data) {
            dispatch(selectCourse(res.data.data));
            dispatch(fetchMatchingUniversities({ courseId: res.data.data._id }));
          }
        } catch (e) {}
      }
    };

    handleUrlParams();
  }, [searchParams, dispatch]);

  const getShareUrl = () => {
    const origin = window.location.origin;
    const catSlug = selectedCategory?.slug || '';
    const courseSlug = selectedCourse?.slug || '';
    return `${origin}/courses?category=${catSlug}&selectCourse=${courseSlug}`;
  };

  const handleCopyLink = () => {
    const url = getShareUrl();
    navigator.clipboard.writeText(url);
    setCopied(true);
    toast.success('Course share link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const url = getShareUrl();
    const courseName = selectedCourse?.name || 'Top Degree Programs';
    const duration = selectedCourse?.duration ? `(${selectedCourse.duration})` : '';
    const text = `Explore verified eligibility, fee structures, syllabus, and top universities offering ${courseName} ${duration} on CaptonAdmission: ${url}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  const handleApplyClick = () => {
    dispatch(
      openEnquiryModal({
        prefillCourse: selectedCourse,
      })
    );
  };

  return (
    <div className="h-[calc(100vh-65px)] bg-brand-light flex flex-col overflow-hidden">
      {/* Top Sticky Bar: Brand, Search, Level Filter, Share, Count & Free Advice */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs px-3 sm:px-6 py-2.5 shrink-0">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Count */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center font-bold">
                <GraduationCap className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-royal block leading-none">
                  Three-Panel Discovery
                </span>
                <h1 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                  Course Finder
                </h1>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
              <strong className="text-brand-royal font-extrabold">{shortlisted.length}</strong> Shortlisted
            </span>
          </div>

          {/* Sticky Search & Level Filter Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search degrees, streams (e.g. B.Tech, MBA, MCA, MBBS)..."
                value={searchQuery}
                onChange={(e) => dispatch(setSearchQuery(e.target.value))}
                className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
              />
              {searchQuery && (
                <button
                  onClick={() => dispatch(setSearchQuery(''))}
                  className="absolute inset-y-0 right-0 pr-2.5 flex items-center text-slate-400 hover:text-slate-600 cursor-pointer"
                  title="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Level Filter Dropdown */}
            <select
              value={selectedLevel}
              onChange={(e) => dispatch(setSelectedLevel(e.target.value))}
              className="py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal cursor-pointer shrink-0"
            >
              <option value="All">All Levels</option>
              <option value="Undergraduate">Undergraduate (UG)</option>
              <option value="Postgraduate">Postgraduate (PG)</option>
              <option value="Diploma">Diploma</option>
            </select>
          </div>

          {/* Right Action Controls: WhatsApp Share & Free Advice */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto relative">
            {/* Share Option Button */}
            <div className="relative">
              <button
                onClick={() => setIsShareOpen(!isShareOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="Share Course Details"
              >
                <Share2 className="w-3.5 h-3.5 text-brand-royal" />
                <span>Share</span>
              </button>

              {/* Share Dropdown Menu */}
              {isShareOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-scaleUp">
                  <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-500 truncate">
                    Share {selectedCourse?.name || 'Selected Course'}
                  </div>
                  <button
                    onClick={handleCopyLink}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors cursor-pointer"
                  >
                    {copied ? <Check className="w-4 h-4 text-emerald-600" /> : <Copy className="w-4 h-4 text-slate-500" />}
                    <span>{copied ? 'Link Copied!' : 'Copy Share Link'}</span>
                  </button>
                  <button
                    onClick={handleWhatsAppShare}
                    className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors cursor-pointer"
                  >
                    <span className="text-sm">💬</span>
                    <span>Share on WhatsApp</span>
                  </button>
                </div>
              )}
            </div>

            {/* Direct Free Counselling */}
            <button
              onClick={handleApplyClick}
              className="px-4 py-2 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
              <span>Get Free Advice</span>
            </button>
          </div>
        </div>

        {/* Mobile Step Wizard Tabs (shown only on mobile/tablet) */}
        <div className="lg:hidden grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => dispatch(setMobileStep(1))}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              mobileStep === 1
                ? 'bg-brand-royal text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            1. Select Course
          </button>
          <button
            onClick={() => dispatch(setMobileStep(2))}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              mobileStep === 2
                ? 'bg-brand-royal text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            2. Universities
          </button>
          <button
            onClick={() => dispatch(setMobileStep(3))}
            className={`py-1.5 text-xs font-bold rounded-lg transition-all ${
              mobileStep === 3
                ? 'bg-brand-royal text-white shadow-xs'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            3. My Selection ({shortlisted.length})
          </button>
        </div>
      </header>

      {/* MAIN THREE-PANEL CORE LAYOUT (Left and Right Sticky, Center Scroll Only) */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto px-2 sm:px-4 py-3 overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-full overflow-hidden">
          {/* PANEL 1: SELECT COURSE (Sticky Left Panel) */}
          <div
            className={`lg:col-span-3 h-full overflow-hidden lg:sticky lg:top-0 ${
              mobileStep === 1 ? 'block' : 'hidden lg:block'
            }`}
          >
            <PanelCourseSelect />
          </div>

          {/* PANEL 2: EXPLORE UNIVERSITIES (Center Panel - Scrollable) */}
          <div
            className={`lg:col-span-6 h-full overflow-hidden ${
              mobileStep === 2 ? 'block' : 'hidden lg:block'
            }`}
          >
            <PanelUniversityList />
          </div>

          {/* PANEL 3: MY SELECTION (Sticky Right Panel) */}
          <div
            className={`lg:col-span-3 h-full overflow-hidden lg:sticky lg:top-0 ${
              mobileStep === 3 ? 'block' : 'hidden lg:block'
            }`}
          >
            <PanelMySelection />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CoursesPage;
