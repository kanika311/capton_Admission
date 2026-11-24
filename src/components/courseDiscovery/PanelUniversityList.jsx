import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import {
  Building2,
  MapPin,
  Star,
  Check,
  Plus,
  ArrowUpDown,
  Filter,
  CheckCircle,
  Eye,
  Send,
  Layers,
  Sparkles,
  GitCompare,
  FileText,
  Download,
} from 'lucide-react';
import {
  setUniversityFilters,
  resetUniversityFilters,
  fetchMatchingUniversities,
  addToShortlist,
  removeFromShortlist,
  toggleCompare,
} from '../../redux/slices/courseDiscoverySlice';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import toast from 'react-hot-toast';
import { indianStatesList, countriesList, getStatesForCountry } from '../../data/locationData';

const PanelUniversityList = () => {
  const dispatch = useDispatch();
  const {
    selectedCourse,
    selectedSpecialization,
    matchingUniversities,
    loadingUniversities,
    universityFilters,
    shortlisted,
    compared,
  } = useSelector((state) => state.courseDiscovery);

  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);

  const handleFilterChange = (key, value) => {
    const updated = { ...universityFilters, [key]: value };
    dispatch(setUniversityFilters(updated));
    if (selectedCourse) {
      dispatch(
        fetchMatchingUniversities({
          courseId: selectedCourse._id,
          filters: { ...updated, specialization: selectedSpecialization },
        })
      );
    }
  };

  const handleShortlistToggle = (item) => {
    const isShortlisted = shortlisted.some((s) => s._id === item._id);
    if (isShortlisted) {
      dispatch(removeFromShortlist(item._id));
      toast.success('Removed from your shortlist');
    } else {
      dispatch(addToShortlist(item));
      toast.success('Added to your shortlist in Panel 3!');
    }
  };

  const handleCompareToggle = (item) => {
    const isCompared = compared.some((c) => c._id === item._id);
    if (!isCompared && compared.length >= 4) {
      toast.error('You can compare a maximum of 4 universities at a time');
      return;
    }
    dispatch(toggleCompare(item));
    if (!isCompared) {
      toast.success('Added to comparison table!');
    } else {
      toast('Removed from comparison');
    }
  };

  const allStates = ['All', ...indianStatesList];
  const allCountries = ['All Countries', ...countriesList];
  const types = ['All', 'Government', 'Private', 'Deemed'];
  const statuses = ['All', 'Open', 'Upcoming'];

  return (
    <div className="bg-white rounded-2xl border border-brand-border shadow-card flex flex-col h-full overflow-hidden">
      {/* Panel 2 Header */}
      <div className="p-4 border-b border-brand-border bg-slate-50/70 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-6 h-6 rounded-full bg-brand-royal text-white text-xs font-extrabold flex items-center justify-center">
              2
            </span>
            <h2 className="text-sm font-extrabold text-brand-navy uppercase tracking-wider">
              Explore Universities
            </h2>
            <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-brand-royal">
              {matchingUniversities.length} Verified
            </span>
          </div>
          <p className="text-[11px] text-slate-500">
            Colleges offering{' '}
            <strong className="text-brand-darkText">
              {selectedCourse ? selectedCourse.name : 'your chosen course'}
            </strong>
          </p>
        </div>

        {/* Filter Toggle */}
        <button
          onClick={() => setFilterDrawerOpen(!filterDrawerOpen)}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-colors ${
            filterDrawerOpen
              ? 'bg-brand-royal text-white border-brand-royal'
              : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-100'
          }`}
        >
          <Filter className="w-3.5 h-3.5" />
          <span>Filters</span>
        </button>
      </div>

      {/* Filter Drawer / Bar */}
      {filterDrawerOpen && (
        <div className="p-3.5 bg-brand-light border-b border-brand-border text-xs space-y-3 animate-fadeIn">
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2.5">
            {/* Country filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Country
              </label>
              <select
                value={universityFilters.country || 'All'}
                onChange={(e) => handleFilterChange('country', e.target.value)}
                className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
              >
                {allCountries.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {/* State filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                State
              </label>
              <select
                value={universityFilters.state}
                onChange={(e) => handleFilterChange('state', e.target.value)}
                className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
              >
                {allStates.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>

            {/* University Type filter */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                College Type
              </label>
              <select
                value={universityFilters.universityType}
                onChange={(e) => handleFilterChange('universityType', e.target.value)}
                className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
              >
                {types.map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            {/* Admission Status */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Admissions
              </label>
              <select
                value={universityFilters.admissionStatus}
                onChange={(e) => handleFilterChange('admissionStatus', e.target.value)}
                className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none"
              >
                {statuses.map((st) => (
                  <option key={st} value={st}>{st}</option>
                ))}
              </select>
            </div>

            {/* Sorting */}
            <div>
              <label className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
                Sort By
              </label>
              <select
                value={universityFilters.sort}
                onChange={(e) => handleFilterChange('sort', e.target.value)}
                className="w-full p-1.5 text-xs bg-white border border-slate-300 rounded-md focus:outline-none font-medium"
              >
                <option value="fee_low">Lowest Fees</option>
                <option value="fee_high">Highest Fees</option>
                <option value="popularity">Popularity / Rating</option>
                <option value="alpha">Alphabetical (A-Z)</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* University Cards Container */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {loadingUniversities ? (
          <div className="space-y-4 py-4">
            {[1, 2, 3].map((n) => (
              <div key={n} className="animate-pulse bg-slate-100 h-36 rounded-2xl"></div>
            ))}
          </div>
        ) : !selectedCourse ? (
          <div className="text-center py-20 px-4 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h4 className="font-bold text-sm text-slate-600">No Course Selected</h4>
            <p className="text-xs mt-1">
              Please select a course in Panel 1 to discover matching universities.
            </p>
          </div>
        ) : matchingUniversities.length === 0 ? (
          <div className="text-center py-20 px-4 text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h4 className="font-bold text-sm text-slate-600">No Matching Universities Found</h4>
            <p className="text-xs mt-1">
              Try adjusting your state or fee filters to see more colleges.
            </p>
            <button
              onClick={() => {
                dispatch(resetUniversityFilters());
                dispatch(fetchMatchingUniversities({ courseId: selectedCourse._id }));
              }}
              className="mt-3 text-xs font-bold text-brand-royal hover:underline"
            >
              Reset All Filters
            </button>
          </div>
        ) : (
          matchingUniversities.map((item) => {
            const uni = item.university;
            if (!uni) return null;

            const isShortlisted = shortlisted.some((s) => s._id === item._id);
            const isCompared = compared.some((c) => c._id === item._id);

            return (
              <div
                key={item._id}
                className="bg-white rounded-2xl border border-slate-200 hover:border-brand-royal/50 shadow-sm hover:shadow-card transition-all overflow-hidden flex flex-col justify-between"
              >
                <div className="p-4 sm:p-5">
                  {/* Top row: Logo, Name, Type, Rating */}
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-start gap-3">
                      <img
                        src={uni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=80&h=80&fit=crop'}
                        alt={uni.name}
                        className="w-12 h-12 rounded-xl object-cover border border-slate-200 shrink-0 bg-slate-50"
                      />
                      <div>
                        <div className="flex items-center gap-2 mb-1 flex-wrap">
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                            {uni.universityType}
                          </span>
                          <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-50 text-emerald-700">
                            Admission {item.admissionStatus || 'Open'}
                          </span>
                        </div>
                        <h3 className="font-bold text-sm sm:text-base text-brand-navy leading-snug">
                          {uni.name}
                        </h3>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                          <span>{uni.location?.city}, {uni.location?.state}</span>
                        </p>
                      </div>
                    </div>

                    <div className="text-right shrink-0">
                      <div className="flex items-center justify-end gap-1 text-amber-500 font-bold text-xs">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{uni.rating || 4.5}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 block mt-0.5">
                        {uni.accreditation?.[0] || 'NAAC Accredited'}
                      </span>
                    </div>
                  </div>

                  {/* Course specifics cardlet */}
                  <div className="mt-3.5 p-3 rounded-xl bg-brand-light border border-slate-200/80 grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Specialization
                      </span>
                      <strong className="text-brand-darkText font-semibold truncate block">
                        {item.specialization || 'General'}
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Total Course Fees
                      </span>
                      <strong className="text-brand-navy font-bold text-sm">
                        ₹ {(item.totalFees / 100000).toFixed(2)} Lakh
                      </strong>
                    </div>

                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">
                        Placement Metric
                      </span>
                      <strong className="text-emerald-700 font-bold">
                        {item.placementInfo?.averagePackage || uni.placementOverview?.averagePackage || 'Verified'}
                      </strong>
                    </div>
                  </div>

                  {/* Eligibility snippet */}
                  <p className="text-[11px] text-slate-500 mt-2.5 truncate">
                    <strong>Eligibility:</strong> {item.eligibility}
                  </p>
                </div>

                {/* Card Actions Footer */}
                <div className="p-3 bg-slate-50/80 border-t border-slate-100 flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    {/* Shortlist Button */}
                    <button
                      onClick={() => handleShortlistToggle(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isShortlisted
                          ? 'bg-emerald-600 text-white shadow-sm'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-emerald-600 hover:text-emerald-700'
                      }`}
                    >
                      {isShortlisted ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{isShortlisted ? 'Shortlisted' : 'Shortlist'}</span>
                    </button>

                    {/* Compare Button */}
                    <button
                      onClick={() => handleCompareToggle(item)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                        isCompared
                          ? 'bg-brand-royal text-white'
                          : 'bg-white border border-slate-300 text-slate-700 hover:border-brand-royal hover:text-brand-royal'
                      }`}
                    >
                      <GitCompare className="w-3.5 h-3.5" />
                      <span>{isCompared ? 'Comparing' : 'Compare'}</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Official Brochure Download or Request */}
                    {(item.brochureUrl || uni.brochureUrl) ? (
                      <a
                        href={item.brochureUrl || uni.brochureUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-2.5 py-1.5 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Download Official Campus & Course Brochure PDF"
                      >
                        <FileText className="w-3.5 h-3.5 text-amber-700" />
                        <span>Brochure</span>
                      </a>
                    ) : (
                      <button
                        type="button"
                        onClick={() =>
                          dispatch(
                            openEnquiryModal({
                              course: selectedCourse,
                              university: uni,
                              specialization: item.specialization,
                            })
                          )
                        }
                        className="px-2.5 py-1.5 text-xs font-semibold bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-200 rounded-lg flex items-center gap-1 transition-colors cursor-pointer"
                        title="Request Official Brochure"
                      >
                        <Download className="w-3.5 h-3.5 text-slate-400" />
                        <span>Brochure</span>
                      </button>
                    )}

                    <Link
                      to={`/universities/${uni.slug}`}
                      className="px-3 py-1.5 text-xs font-bold text-brand-royal hover:underline flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Details</span>
                    </Link>

                    <button
                      onClick={() =>
                        dispatch(
                          openEnquiryModal({
                            course: selectedCourse,
                            university: uni,
                            specialization: item.specialization,
                          })
                        )
                      }
                      className="px-3.5 py-1.5 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-extrabold text-xs rounded-lg shadow-sm transition-all"
                    >
                      Apply Now
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

export default PanelUniversityList;
