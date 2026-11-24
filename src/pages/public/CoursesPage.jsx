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
    <div className="h-[calc(100vh-65px)] bg-brand-light flex flex-col overflow-hidden">
      {/* Top Compact Sticky Bar */}
      <div className="bg-white border-b border-slate-200/90 py-2.5 px-4 sm:px-6 shrink-0 z-20">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center font-bold">
              <span className="text-sm">🎯</span>
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-brand-royal block leading-none">
                Interactive Three-Panel Discovery
              </span>
              <h1 className="text-sm sm:text-base font-black text-slate-900 tracking-tight leading-snug">
                Course & University Finder
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs bg-slate-100 px-3 py-1.5 rounded-xl border border-slate-200 text-slate-700 font-bold">
              Shortlisted: <strong className="text-brand-royal">{shortlisted.length}</strong> Colleges
            </span>
          </div>
        </div>
      </div>

      {/* Mobile Step Wizard Tabs (shown only on mobile/tablet) */}
      <div className="lg:hidden bg-white border-b border-brand-border p-2 shrink-0 z-30 shadow-xs">
        <div className="grid grid-cols-3 gap-1 max-w-md mx-auto">
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
      </div>

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
