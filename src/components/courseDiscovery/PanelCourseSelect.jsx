import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  Search,
  Check,
  ChevronRight,
  Filter,
  GraduationCap,
  Layers,
  Sparkles,
} from 'lucide-react';
import {
  setSelectedCategory,
  setSelectedLevel,
  selectCourse,
  setSelectedSpecialization,
  fetchMatchingUniversities,
} from '../../redux/slices/courseDiscoverySlice';
import api from '../../services/api';

const PanelCourseSelect = () => {
  const dispatch = useDispatch();
  const {
    selectedCategory,
    selectedLevel,
    selectedCourse,
    selectedSpecialization,
  } = useSelector((state) => state.courseDiscovery);

  const [categories, setCategories] = useState([]);
  const [courses, setCourses] = useState([]);
  const [search, setSearch] = useState('');
  const [loadingCourses, setLoadingCourses] = useState(false);

  // Fetch categories on mount
  useEffect(() => {
    const loadCategories = async () => {
      try {
        const res = await api.get('/courses/categories');
        const cats = res.data.data || [];
        setCategories(cats);
        if (!selectedCategory && cats.length > 0) {
          dispatch(setSelectedCategory(cats[0]));
        }
      } catch (err) {
        console.error('Error fetching categories:', err);
      }
    };
    loadCategories();
  }, [dispatch, selectedCategory]);

  // Fetch courses whenever category, level, or search changes
  useEffect(() => {
    const loadCourses = async () => {
      try {
        setLoadingCourses(true);
        const params = new URLSearchParams();
        if (selectedCategory) {
          params.append('category', selectedCategory._id);
        }
        if (selectedLevel && selectedLevel !== 'All') {
          params.append('level', selectedLevel);
        }
        if (search) {
          params.append('search', search);
        }

        const res = await api.get(`/courses?${params.toString()}`);
        const courseList = res.data.data || [];
        setCourses(courseList);

        // If no course is currently selected and courses exist, select the first course automatically
        if (!selectedCourse && courseList.length > 0) {
          dispatch(selectCourse(courseList[0]));
          dispatch(fetchMatchingUniversities({ courseId: courseList[0]._id }));
        }
      } catch (err) {
        console.error('Error fetching courses:', err);
      } finally {
        setLoadingCourses(false);
      }
    };

    if (selectedCategory) {
      loadCourses();
    }
  }, [selectedCategory, selectedLevel, search, dispatch]);

  const handleCourseClick = (course) => {
    dispatch(selectCourse(course));
    dispatch(fetchMatchingUniversities({ courseId: course._id }));
  };

  const levels = ['All', 'Undergraduate', 'Postgraduate', 'Diploma'];

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card flex flex-col h-full overflow-hidden">
      {/* Panel Header */}
      <div className="p-4 border-b border-brand-border bg-slate-50/70">
        <div className="flex items-center gap-2 mb-2">
          <span className="w-6 h-6 rounded-full bg-brand-royal text-white text-xs font-extrabold flex items-center justify-center">
            1
          </span>
          <h2 className="text-sm font-extrabold text-brand-navy uppercase tracking-wider">
            Select Course
          </h2>
        </div>
        <p className="text-[11px] text-slate-500">
          Choose category, level and course to view verified universities.
        </p>

        {/* Search within panel */}
        <div className="mt-3 relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            placeholder="Search degrees (e.g. B.Tech, MBA)..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-brand-royal"
          />
        </div>
      </div>

      {/* Categories Horizontal Scrolling Tabs */}
      <div className="p-3 border-b border-brand-border bg-white overflow-x-auto flex gap-1.5 no-scrollbar">
        {categories.map((cat) => {
          const isCatSelected = selectedCategory?._id === cat._id;
          return (
            <button
              key={cat._id}
              onClick={() => dispatch(setSelectedCategory(cat))}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                isCatSelected
                  ? 'bg-brand-royal text-white shadow-sm'
                  : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat.name}
            </button>
          );
        })}
      </div>

      {/* Level Filter Pills */}
      <div className="px-3 py-2 bg-brand-light border-b border-brand-border flex items-center gap-1.5 text-xs">
        <span className="text-slate-400 text-[11px] font-medium mr-1 flex items-center gap-1">
          <Filter className="w-3 h-3" /> Level:
        </span>
        {levels.map((lvl) => (
          <button
            key={lvl}
            onClick={() => dispatch(setSelectedLevel(lvl))}
            className={`px-2 py-0.5 rounded text-[11px] font-medium transition-colors ${
              selectedLevel === lvl
                ? 'bg-brand-navy text-white font-bold'
                : 'text-slate-600 hover:bg-slate-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>

      {/* Courses List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
        {loadingCourses ? (
          <div className="space-y-2 py-4">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="animate-pulse bg-slate-100 h-20 rounded-xl"></div>
            ))}
          </div>
        ) : courses.length === 0 ? (
          <div className="py-12 text-center text-xs text-slate-400">
            No courses found matching criteria.
          </div>
        ) : (
          courses.map((course) => {
            const isSelected = selectedCourse?._id === course._id;
            return (
              <div
                key={course._id}
                onClick={() => handleCourseClick(course)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer relative ${
                  isSelected
                    ? 'border-brand-royal bg-blue-50/70 shadow-sm ring-1 ring-brand-royal'
                    : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <div className="flex items-center gap-1.5 mb-1">
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-white text-brand-royal border border-blue-200">
                        {course.level}
                      </span>
                      <span className="text-[11px] text-slate-500 font-medium">
                        {course.duration}
                      </span>
                    </div>
                    <h3 className="font-bold text-xs sm:text-sm text-brand-darkText">
                      {course.name}
                    </h3>
                  </div>

                  {isSelected && (
                    <span className="w-5 h-5 rounded-full bg-brand-royal text-white flex items-center justify-center shrink-0">
                      <Check className="w-3 h-3" />
                    </span>
                  )}
                </div>

                {/* Specializations Pill preview if selected */}
                {isSelected && course.specializations && course.specializations.length > 0 && (
                  <div className="mt-3 pt-2.5 border-t border-blue-200/80">
                    <p className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1.5">
                      Select Specialization:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          dispatch(setSelectedSpecialization('All'));
                          dispatch(
                            fetchMatchingUniversities({
                              courseId: course._id,
                              filters: { specialization: 'All' },
                            })
                          );
                        }}
                        className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                          selectedSpecialization === 'All'
                            ? 'bg-brand-royal text-white'
                            : 'bg-white text-slate-600 border border-slate-200'
                        }`}
                      >
                        All Specializations
                      </button>
                      {course.specializations.map((spec, i) => (
                        <button
                          key={i}
                          onClick={(e) => {
                            e.stopPropagation();
                            dispatch(setSelectedSpecialization(spec));
                            dispatch(
                              fetchMatchingUniversities({
                                courseId: course._id,
                                filters: { specialization: spec },
                              })
                            );
                          }}
                          className={`text-[10px] px-2 py-0.5 rounded-md font-semibold ${
                            selectedSpecialization === spec
                              ? 'bg-brand-royal text-white'
                              : 'bg-white text-slate-600 border border-slate-200'
                          }`}
                        >
                          {spec}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Bottom Summary Bar in Panel 1 */}
      {selectedCourse && (
        <div className="p-3 bg-slate-50 border-t border-brand-border text-xs flex items-center justify-between text-slate-600">
          <span className="truncate">
            Selected: <strong className="text-brand-royal">{selectedCourse.name}</strong>
          </span>
          <span className="text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded">
            Active
          </span>
        </div>
      )}
    </div>
  );
};

export default PanelCourseSelect;
