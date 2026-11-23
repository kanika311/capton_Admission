import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  setMobileStep,
  setSelectedCategory,
  selectCourse,
  fetchMatchingUniversities,
} from '../../redux/slices/courseDiscoverySlice';
import PanelCourseSelect from '../../components/courseDiscovery/PanelCourseSelect';
import PanelUniversityList from '../../components/courseDiscovery/PanelUniversityList';
import PanelMySelection from '../../components/courseDiscovery/PanelMySelection';
import api from '../../services/api';

const CoursesPage = () => {
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch();
  const { mobileStep, shortlisted, selectedCourse } = useSelector(
    (state) => state.courseDiscovery
  );

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

  return (
    <div className="min-h-screen bg-brand-light flex flex-col">
      {/* Top Breadcrumb & Page Banner */}
      <div className="bg-brand-navy text-white py-6 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-gold font-semibold uppercase tracking-wider mb-1">
              <span>CaptonAdmission Core Discovery</span>
              <span>&bull;</span>
              <span>Interactive Three-Panel Engine</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Course & University Discovery System
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Select your desired degree in Panel 1, discover matching accredited universities in Panel 2, and review your selection & enquiries in Panel 3.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/10 px-3 py-1.5 rounded-lg border border-white/20 text-slate-200">
              Shortlisted: <strong className="text-brand-gold">{shortlisted.length}</strong> Colleges
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Step Wizard Tabs (shown only on mobile/tablet) */}
      <div className="lg:hidden bg-white border-b border-brand-border p-2 sticky top-[60px] z-30 shadow-sm">
        <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
          <button
            onClick={() => dispatch(setMobileStep(1))}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mobileStep === 1
                ? 'bg-brand-royal text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            1. Select Course
          </button>
          <button
            onClick={() => dispatch(setMobileStep(2))}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mobileStep === 2
                ? 'bg-brand-royal text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            2. Universities
          </button>
          <button
            onClick={() => dispatch(setMobileStep(3))}
            className={`py-2 text-xs font-bold rounded-lg transition-all ${
              mobileStep === 3
                ? 'bg-brand-royal text-white shadow'
                : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            3. My Selection ({shortlisted.length})
          </button>
        </div>
      </div>

      {/* MAIN THREE-PANEL CORE LAYOUT */}
      <div className="flex-1 max-w-[1550px] w-full mx-auto px-3 sm:px-6 py-6">
        {/* Desktop: 3 Columns. Mobile: Step Wizard */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 h-[calc(100vh-210px)] min-h-[640px]">
          {/* PANEL 1: SELECT COURSE (3 cols on desktop) */}
          <div
            className={`lg:col-span-3 h-full ${
              mobileStep === 1 ? 'block' : 'hidden lg:block'
            }`}
          >
            <PanelCourseSelect />
          </div>

          {/* PANEL 2: EXPLORE UNIVERSITIES (6 cols on desktop) */}
          <div
            className={`lg:col-span-6 h-full ${
              mobileStep === 2 ? 'block' : 'hidden lg:block'
            }`}
          >
            <PanelUniversityList />
          </div>

          {/* PANEL 3: MY SELECTION (3 cols on desktop) */}
          <div
            className={`lg:col-span-3 h-full ${
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
