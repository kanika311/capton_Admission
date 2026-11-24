import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Search,
  Building2,
  MapPin,
  Star,
  Award,
  Globe,
  Share2,
  Copy,
  Check,
  CheckCircle,
  ArrowRight,
  Sparkles,
  BookOpen,
  GraduationCap,
  TrendingUp,
  PhoneCall,
  ExternalLink,
  ChevronRight,
  SlidersHorizontal,
  Wifi,
  Coffee,
  HeartPulse,
  Home,
  Compass,
  Layers,
  FileText,
  Download,
} from 'lucide-react';
import api from '../../services/api';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import toast from 'react-hot-toast';
import { indianStatesList, countriesList, getStatesForCountry } from '../../data/locationData';

const typesList = ['All', 'Government', 'Private', 'Deemed'];

const facilityIcons = {
  Hostel: Home,
  Library: BookOpen,
  'Wi-Fi': Wifi,
  Sports: Compass,
  Cafeteria: Coffee,
  Medical: HeartPulse,
};

const UniversitiesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [universities, setUniversities] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active selection
  const [selectedUni, setSelectedUni] = useState(null);

  // Filters state
  const [search, setSearch] = useState('');
  const [countryFilter, setCountryFilter] = useState(searchParams.get('country') || 'All');
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || 'All');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'All');

  // Dynamic available states based on selected country
  const availableStates = useMemo(() => {
    return ['All States / Regions', ...getStatesForCountry(countryFilter)];
  }, [countryFilter]);

  // Mobile step switcher: 'list' | 'details' | 'suggestions'
  const [mobileStep, setMobileStep] = useState('list');

  // Share menu state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch initial universities and courses
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [uniRes, courseRes] = await Promise.all([
          api.get('/universities?limit=100'),
          api.get('/courses?limit=30'),
        ]);

        const allUnis = uniRes.data.data || [];
        setUniversities(allUnis);
        setCourses(courseRes.data.data || []);

        // Pre-select university if slug provided in URL query, otherwise first university
        const urlUniSlug = searchParams.get('uni');
        if (urlUniSlug) {
          const found = allUnis.find((u) => u.slug === urlUniSlug);
          if (found) {
            setSelectedUni(found);
            return;
          }
        }
        if (allUnis.length > 0) {
          setSelectedUni(allUnis[0]);
        }
      } catch (err) {
        console.error('Error fetching university discovery data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Filter universities based on search & filters (including Country & All States)
  const filteredUniversities = useMemo(() => {
    return universities.filter((u) => {
      const q = search.toLowerCase();
      const matchesSearch =
        !search ||
        u.name.toLowerCase().includes(q) ||
        u.location?.city?.toLowerCase().includes(q) ||
        u.location?.state?.toLowerCase().includes(q) ||
        u.location?.country?.toLowerCase().includes(q) ||
        (u.accreditation || []).some((a) => a.toLowerCase().includes(q));

      const matchesCountry =
        countryFilter === 'All' ||
        countryFilter === 'All Countries' ||
        (u.location?.country || 'India').toLowerCase() === countryFilter.toLowerCase();

      const matchesState =
        stateFilter === 'All' ||
        stateFilter === 'All States' ||
        stateFilter === 'All States / Regions' ||
        u.location?.state?.toLowerCase() === stateFilter.toLowerCase();

      const matchesType = typeFilter === 'All' || u.universityType === typeFilter;

      return matchesSearch && matchesCountry && matchesState && matchesType;
    });
  }, [universities, search, countryFilter, stateFilter, typeFilter]);

  // Handle selecting a university
  const handleSelectUniversity = (uni) => {
    setSelectedUni(uni);
    setSearchParams({ uni: uni.slug }, { replace: true });
    setMobileStep('details');
  };

  // Handle Share functionality
  const handleCopyLink = () => {
    const shareUrl = `${window.location.origin}/universities?uni=${selectedUni?.slug || ''}`;
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    toast.success('University link copied to clipboard!');
    setTimeout(() => setCopied(false), 2000);
  };

  const handleWhatsAppShare = () => {
    const shareUrl = `${window.location.origin}/universities?uni=${selectedUni?.slug || ''}`;
    const text = `Explore verified admissions, fees, and placements for ${selectedUni?.name || 'Top Universities'} on CaptonAdmission: ${shareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
  };

  // Open Enquiry Modal
  const handleApplyClick = (courseName = '') => {
    dispatch(
      openEnquiryModal({
        prefillUniversity: selectedUni,
        prefillCourse: courseName ? { name: courseName } : null,
      })
    );
  };

  // Suggested courses for this university
  const suggestedCourses = useMemo(() => {
    if (!selectedUni) return courses.slice(0, 5);
    // Return courses that might match or popular degrees
    return courses.slice(0, 5);
  }, [selectedUni, courses]);

  // Similar universities (same state or same type, excluding selected)
  const similarUniversities = useMemo(() => {
    if (!selectedUni) return [];
    return universities
      .filter((u) => u._id !== selectedUni._id && (u.location?.state === selectedUni.location?.state || u.universityType === selectedUni.universityType))
      .slice(0, 4);
  }, [selectedUni, universities]);

  return (
    <div className="min-h-screen bg-slate-100 flex flex-col overflow-hidden">
      {/* =========================================================================
          TOP STICKY SEARCH & SHARE BAR (Replaces the big banner completely)
         ========================================================================= */}
      <header className="sticky top-0 z-30 bg-white border-b border-slate-200/90 shadow-xs px-3 sm:px-6 py-2.5">
        <div className="max-w-[1700px] mx-auto flex flex-col md:flex-row items-center justify-between gap-3">
          {/* Brand & Count Tag */}
          <div className="flex items-center justify-between w-full md:w-auto gap-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-brand-royal/10 text-brand-royal flex items-center justify-center font-bold">
                <Building2 className="w-4 h-4" />
              </div>
              <div>
                <span className="text-[10px] font-black uppercase tracking-wider text-brand-royal block leading-none">
                  Three-Panel Discovery
                </span>
                <h1 className="text-sm font-black text-slate-900 tracking-tight leading-snug">
                  University Directory
                </h1>
              </div>
            </div>

            <span className="text-[11px] font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-full border border-slate-200 shrink-0">
              <strong className="text-brand-navy font-extrabold">{filteredUniversities.length}</strong> Campuses
            </span>
          </div>

          {/* Search & Filter Controls */}
          <div className="flex items-center gap-2 w-full md:w-auto flex-1 max-w-2xl">
            {/* Search Input */}
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
                <Search className="w-3.5 h-3.5" />
              </div>
              <input
                type="text"
                placeholder="Search university by name, city, stream..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl text-xs font-semibold text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all"
              />
            </div>

            {/* Country Filter */}
            <select
              value={countryFilter}
              onChange={(e) => {
                setCountryFilter(e.target.value);
                setStateFilter('All');
              }}
              className="py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal cursor-pointer shrink-0"
            >
              <option value="All">🌐 All Countries</option>
              {countriesList.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>

            {/* State / Region Filter */}
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal cursor-pointer shrink-0 max-w-[160px] truncate"
            >
              {availableStates.map((st) => (
                <option key={st} value={st}>
                  {st === 'All' || st === 'All States / Regions' ? '📍 All States' : st}
                </option>
              ))}
            </select>

            {/* Type Filter */}
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="py-2 px-2.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal cursor-pointer shrink-0"
            >
              {typesList.map((tp) => (
                <option key={tp} value={tp}>
                  {tp === 'All' ? 'All Types' : tp}
                </option>
              ))}
            </select>
          </div>

          {/* Right Action: Share & Free Counselling */}
          <div className="flex items-center gap-2 shrink-0 self-end md:self-auto relative">
            {/* Share Option Button */}
            <div className="relative">
              <button
                onClick={() => setIsShareOpen(!isShareOpen)}
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors cursor-pointer"
                title="Share University Profile"
              >
                <Share2 className="w-3.5 h-3.5 text-brand-royal" />
                <span>Share</span>
              </button>

              {/* Share Dropdown Menu */}
              {isShareOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-2xl border border-slate-200 p-2 z-50 animate-scaleUp">
                  <div className="px-3 py-2 border-b border-slate-100 text-[11px] font-bold text-slate-500">
                    Share {selectedUni?.name || 'University'}
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
              onClick={() => handleApplyClick()}
              className="px-4 py-2 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white font-bold text-xs rounded-xl shadow-xs transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-brand-gold" />
              <span>Get Free Advice</span>
            </button>
          </div>
        </div>

        {/* Mobile Step Switcher Tabs (Only visible on small screens) */}
        <div className="lg:hidden grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-100">
          <button
            onClick={() => setMobileStep('list')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
              mobileStep === 'list'
                ? 'bg-brand-royal text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            1. Campuses ({filteredUniversities.length})
          </button>
          <button
            onClick={() => setMobileStep('details')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
              mobileStep === 'details'
                ? 'bg-brand-royal text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            2. Campus Details
          </button>
          <button
            onClick={() => setMobileStep('suggestions')}
            className={`py-1.5 rounded-lg text-xs font-bold transition-all text-center ${
              mobileStep === 'suggestions'
                ? 'bg-brand-royal text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            3. Suggestions
          </button>
        </div>
      </header>

      {/* =========================================================================
          THE THREE-PANEL CORE SYSTEM CONTAINER
         ========================================================================= */}
      <div className="flex-1 max-w-[1700px] w-full mx-auto flex overflow-hidden h-[calc(100vh-65px)]">
        {/* =======================================================================
            PANEL 1: LEFT PANEL (University Name List & Filters - Sticky)
           ======================================================================= */}
        <aside
          className={`w-full lg:w-[320px] xl:w-[350px] shrink-0 border-r border-slate-200 bg-white flex flex-col h-full lg:sticky lg:top-0 overflow-hidden ${
            mobileStep === 'list' ? 'flex' : 'hidden lg:flex'
          }`}
        >
          {/* Panel 1 Header */}
          <div className="p-3.5 border-b border-slate-100 flex items-center justify-between bg-slate-50/60">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-600 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-brand-royal" />
              <span>Select Campus</span>
            </span>
            <span className="text-[10px] font-bold text-slate-400">
              {filteredUniversities.length} Verified
            </span>
          </div>

          {/* Quick Filter Badges (Destination / Country & Types) */}
          <div className="p-2 border-b border-slate-100 flex items-center gap-1.5 overflow-x-auto no-scrollbar bg-white">
            {['All', 'India', 'United States', 'United Kingdom', 'Canada', 'Australia', 'Germany'].map((c) => (
              <button
                key={c}
                onClick={() => {
                  setCountryFilter(c);
                  setStateFilter('All');
                }}
                className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition-colors cursor-pointer ${
                  countryFilter === c
                    ? 'bg-brand-royal text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                }`}
              >
                {c === 'All' ? '🌐 All' : c === 'United States' ? '🇺🇸 USA' : c === 'United Kingdom' ? '🇬🇧 UK' : c === 'Canada' ? '🇨🇦 Canada' : c === 'Australia' ? '🇦🇺 Australia' : c === 'Germany' ? '🇩🇪 Germany' : '🇮🇳 India'}
              </button>
            ))}
          </div>

          {/* Scrollable University List */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100">
            {loading ? (
              <div className="p-8 text-center text-xs text-slate-400 space-y-2">
                <div className="animate-spin w-6 h-6 border-2 border-brand-royal border-t-transparent rounded-full mx-auto"></div>
                <p>Loading universities...</p>
              </div>
            ) : filteredUniversities.length === 0 ? (
              <div className="p-8 text-center text-xs text-slate-400">
                No universities match your search criteria.
              </div>
            ) : (
              filteredUniversities.map((uni) => {
                const isSelected = selectedUni?._id === uni._id;
                return (
                  <div
                    key={uni._id}
                    onClick={() => handleSelectUniversity(uni)}
                    className={`p-3.5 cursor-pointer transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-blue-50/70 border-l-4 border-l-brand-royal text-brand-navy shadow-xs'
                        : 'hover:bg-slate-50 text-slate-700'
                    }`}
                  >
                    {/* University Logo / Avatar */}
                    <img
                      src={uni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=80&h=80&fit=crop'}
                      alt={uni.name}
                      className="w-10 h-10 rounded-xl object-cover bg-white p-0.5 border border-slate-200 shadow-xs shrink-0"
                    />

                    {/* Meta */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1">
                        <span
                          className={`text-[9px] font-black uppercase px-1.5 py-0.5 rounded ${
                            uni.universityType === 'Government'
                              ? 'bg-emerald-100 text-emerald-800'
                              : uni.universityType === 'Deemed'
                              ? 'bg-purple-100 text-purple-800'
                              : 'bg-blue-100 text-brand-royal'
                          }`}
                        >
                          {uni.universityType}
                        </span>
                        <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-500">
                          <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                          <span>{uni.rating || 4.5}</span>
                        </span>
                      </div>

                      <h3 className="text-xs font-extrabold text-slate-900 truncate mt-1">
                        {uni.name}
                      </h3>

                      <p className="text-[11px] text-slate-400 truncate flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3 shrink-0" />
                        <span>{uni.location?.city}, {uni.location?.state}{uni.location?.country && uni.location.country !== 'India' ? `, ${uni.location.country}` : ''}</span>
                      </p>

                      <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1.5 pt-1.5 border-t border-slate-100/60 font-semibold">
                        <span className="text-emerald-700 font-bold">
                          Avg: {uni.placementOverview?.averagePackage || 'Verified'}
                        </span>
                        {uni.isFeatured && (
                          <span className="text-brand-gold font-extrabold uppercase text-[8px] bg-amber-50 px-1 rounded">
                            Featured
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </aside>

        {/* =======================================================================
            PANEL 2: CENTER PANEL (University Details & Campus Features)
           ======================================================================= */}
        <main
          className={`flex-1 h-full overflow-y-auto bg-slate-50/70 p-4 sm:p-6 space-y-5 ${
            mobileStep === 'details' ? 'block' : 'hidden lg:block'
          }`}
        >
          {selectedUni ? (
            <div className="space-y-5 max-w-4xl mx-auto pb-12">
              {/* Cover Banner & Identity Header */}
              <div className="bg-white rounded-3xl border border-slate-200/90 shadow-sm overflow-hidden">
                {/* Campus Image */}
                <div className="h-44 sm:h-56 w-full relative bg-slate-900 overflow-hidden">
                  <img
                    src={selectedUni.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=1200&h=400&fit=crop'}
                    alt={selectedUni.name}
                    className="w-full h-full object-cover opacity-85"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent"></div>

                  <div className="absolute top-3 right-3 flex items-center gap-2">
                    <span className="px-3 py-1 bg-white/90 backdrop-blur-sm rounded-full text-xs font-black text-slate-800 shadow-md flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{selectedUni.rating || 4.5} / 5.0</span>
                    </span>
                  </div>
                </div>

                {/* Profile row */}
                <div className="p-5 sm:p-6 relative -mt-12 sm:-mt-14">
                  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-slate-100">
                    <div className="flex items-end gap-4">
                      <img
                        src={selectedUni.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=100&h=100&fit=crop'}
                        alt={selectedUni.name}
                        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover bg-white p-1 border-4 border-white shadow-xl shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="text-[10px] font-black uppercase px-2 py-0.5 rounded-full bg-brand-royal text-white shadow-xs">
                            {selectedUni.universityType} Campus
                          </span>
                          {selectedUni.establishedYear && (
                            <span className="text-xs text-slate-500 font-semibold">
                              Estd. {selectedUni.establishedYear}
                            </span>
                          )}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                          {selectedUni.name}
                        </h2>
                        <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5 font-medium">
                          <MapPin className="w-3.5 h-3.5 text-brand-royal" />
                          <span>{selectedUni.location?.city}, {selectedUni.location?.state}, India</span>
                        </p>
                      </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-2 pt-2 sm:pt-0 flex-wrap sm:flex-nowrap">
                      <button
                        onClick={() => handleApplyClick()}
                        className="flex-1 sm:flex-none px-5 py-2.5 bg-brand-royal hover:bg-brand-navy active:scale-95 text-white font-bold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer whitespace-nowrap"
                      >
                        Apply / Enquire
                      </button>

                      {/* Official Brochure Download or Request */}
                      {(selectedUni.brochureUrl || selectedUni.brochure) ? (
                        <a
                          href={selectedUni.brochureUrl || selectedUni.brochure}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2.5 bg-amber-500 hover:bg-amber-600 active:scale-95 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          title="Download Official Campus Brochure"
                        >
                          <FileText className="w-4 h-4 text-slate-900" />
                          <span>Brochure</span>
                        </a>
                      ) : (
                        <button
                          type="button"
                          onClick={() => handleApplyClick()}
                          className="px-3.5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs uppercase tracking-wider rounded-xl transition-all flex items-center gap-1.5 cursor-pointer whitespace-nowrap"
                          title="Request Campus Brochure"
                        >
                          <FileText className="w-3.5 h-3.5 text-slate-500" />
                          <span>Get Brochure</span>
                        </button>
                      )}

                      {selectedUni.website && (
                        <a
                          href={selectedUni.website}
                          target="_blank"
                          rel="noreferrer"
                          className="p-2.5 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-600 transition-colors cursor-pointer"
                          title="Official Website"
                        >
                          <ExternalLink className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Highlights Grid */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Average Package
                      </span>
                      <strong className="text-sm sm:text-base font-black text-emerald-700 block mt-0.5">
                        {selectedUni.placementOverview?.averagePackage || '₹ 8.5 LPA'}
                      </strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Highest Package
                      </span>
                      <strong className="text-sm sm:text-base font-black text-brand-royal block mt-0.5">
                        {selectedUni.placementOverview?.highestPackage || '₹ 45 LPA'}
                      </strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Accreditation
                      </span>
                      <strong className="text-xs font-black text-slate-800 block mt-0.5 truncate">
                        {(selectedUni.accreditation || [])[0] || 'NAAC A++'}
                      </strong>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-xl border border-slate-100 text-center">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                        Placement Rate
                      </span>
                      <strong className="text-sm sm:text-base font-black text-slate-900 block mt-0.5">
                        95%+
                      </strong>
                    </div>
                  </div>
                </div>
              </div>

              {/* About Institution Card */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Building2 className="w-4 h-4 text-brand-royal" />
                  <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                    About the Institution
                  </h3>
                </div>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                  {selectedUni.about ||
                    `${selectedUni.name} is a premier accredited institution recognized for outstanding academic rigor, modern research centers, and verified campus placement ties with Fortune 500 corporate recruiters.`}
                </p>

                {/* Accreditations Badges */}
                <div className="pt-2 flex flex-wrap gap-2">
                  {(selectedUni.accreditation || ['NAAC A++', 'NIRF Ranked', 'AICTE Approved', 'UGC Recognized']).map(
                    (acc, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 bg-amber-50 text-amber-800 font-bold text-[10px] rounded-lg border border-amber-200 flex items-center gap-1"
                      >
                        <Award className="w-3 h-3 text-brand-gold" />
                        <span>{acc}</span>
                      </span>
                    )
                  )}
                </div>
              </div>

              {/* Degrees & Courses Offered at this University */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-4">
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <div className="flex items-center gap-2">
                    <GraduationCap className="w-4 h-4 text-brand-royal" />
                    <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                      Degrees & Programs Offered
                    </h3>
                  </div>
                  <span className="text-xs text-slate-400 font-semibold">
                    Direct Admission Open
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {suggestedCourses.map((c) => (
                    <div
                      key={c._id}
                      className="p-3.5 rounded-2xl border border-slate-100 hover:border-brand-royal/40 bg-slate-50/50 hover:bg-blue-50/20 transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="flex items-center justify-between text-[10px] font-bold text-slate-500 mb-1">
                          <span className="text-brand-royal">{c.category?.name || 'Undergraduate'}</span>
                          <span>{c.duration}</span>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 leading-snug">
                          {c.name}
                        </h4>
                        <p className="text-[11px] text-slate-500 mt-1 line-clamp-1">
                          Eligibility: {c.eligibility}
                        </p>
                      </div>

                      <div className="flex items-center justify-between pt-3 mt-2 border-t border-slate-100">
                        <span className="text-[11px] font-bold text-emerald-700">
                          ₹ {((c.averageFeeRange?.min || 100000) / 1000).toFixed(0)}k/yr
                        </span>
                        <button
                          onClick={() => handleApplyClick(c.name)}
                          className="px-2.5 py-1 bg-brand-royal text-white rounded-lg text-[10px] font-bold hover:bg-brand-navy transition-colors cursor-pointer"
                        >
                          Enquire
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Campus Amenities & Facilities */}
              <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200/90 shadow-sm space-y-3">
                <div className="flex items-center gap-2 pb-2 border-b border-slate-100">
                  <Sparkles className="w-4 h-4 text-brand-gold" />
                  <h3 className="text-sm font-bold text-brand-navy uppercase tracking-wider">
                    Campus Facilities & Life
                  </h3>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-1">
                  {[
                    { name: 'Hostel Accommodation', icon: Home, desc: 'AC & Non-AC Rooms' },
                    { name: 'Central Library', icon: BookOpen, desc: '100,000+ Digital Books' },
                    { name: 'Campus Wi-Fi', icon: Wifi, desc: 'High-speed Optical Fiber' },
                    { name: 'Sports Arena', icon: Compass, desc: 'Indoor & Outdoor Courts' },
                    { name: 'Modern Cafeteria', icon: Coffee, desc: 'Hygienic Multi-Cuisine' },
                    { name: 'Medical Center', icon: HeartPulse, desc: '24/7 Healthcare & Ambulance' },
                  ].map((fac, idx) => {
                    const Icon = fac.icon;
                    return (
                      <div
                        key={idx}
                        className="p-3 rounded-2xl bg-slate-50 border border-slate-100 flex items-center gap-3"
                      >
                        <div className="w-8 h-8 rounded-xl bg-white text-brand-royal flex items-center justify-center shadow-xs shrink-0">
                          <Icon className="w-4 h-4" />
                        </div>
                        <div>
                          <strong className="text-xs font-bold text-slate-800 block">
                            {fac.name}
                          </strong>
                          <span className="text-[10px] text-slate-400 block">{fac.desc}</span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          ) : (
            <div className="p-12 text-center text-slate-400 text-xs">
              Select a university from the left panel to inspect details.
            </div>
          )}
        </main>

        {/* =======================================================================
            PANEL 3: RIGHT PANEL (Suggestions: Courses & Similar Universities - Sticky)
           ======================================================================= */}
        <aside
          className={`w-full lg:w-[320px] xl:w-[360px] shrink-0 border-l border-slate-200 bg-white h-full overflow-y-auto lg:sticky lg:top-0 p-4 sm:p-5 space-y-5 ${
            mobileStep === 'suggestions' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Panel 3 Header */}
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="text-[11px] font-black uppercase tracking-wider text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-gold" />
              <span>Recommended For You</span>
            </span>
            <span className="text-[10px] font-bold text-brand-royal bg-blue-50 px-2 py-0.5 rounded-full">
              Matched
            </span>
          </div>

          {/* Quick Apply / Counsellor Connect Widget */}
          <div className="p-4 rounded-2xl bg-gradient-to-br from-brand-royal to-brand-navy text-white shadow-md space-y-3">
            <div className="flex items-center gap-2 text-brand-gold text-xs font-bold">
              <Sparkles className="w-4 h-4" />
              <span>Need Direct Admission Advice?</span>
            </div>
            <p className="text-[11px] text-blue-100 leading-relaxed">
              Our academic advisors provide 100% free fee verification, cut-off evaluation, and scholarship guidance.
            </p>
            <button
              onClick={() => handleApplyClick()}
              className="w-full py-2.5 bg-brand-gold hover:bg-amber-400 text-slate-900 font-extrabold text-xs uppercase tracking-wider rounded-xl shadow-md transition-all cursor-pointer"
            >
              Get Free Counselling
            </button>
          </div>

          {/* Top Suggested Programs */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center justify-between">
              <span>Popular Programs</span>
              <Link to="/courses" className="text-[10px] text-brand-royal hover:underline normal-case font-semibold">
                Explore All &rarr;
              </Link>
            </h4>

            <div className="space-y-2">
              {suggestedCourses.slice(0, 4).map((c) => (
                <div
                  key={c._id}
                  className="p-3 rounded-xl border border-slate-100 hover:border-slate-200 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2"
                >
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-brand-royal block uppercase">
                      {c.level}
                    </span>
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {c.name}
                    </h5>
                    <span className="text-[10px] text-slate-400 block">
                      ₹ {((c.averageFeeRange?.min || 100000) / 1000).toFixed(0)}k - {((c.averageFeeRange?.max || 300000) / 1000).toFixed(0)}k/yr
                    </span>
                  </div>

                  <button
                    onClick={() => handleApplyClick(c.name)}
                    className="p-1.5 rounded-lg bg-white border border-slate-200 hover:bg-brand-royal hover:text-white text-slate-600 transition-colors shrink-0 cursor-pointer"
                    title="Enquire for this degree"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Similar Universities Section */}
          <div className="space-y-3 pt-2 border-t border-slate-100">
            <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wider flex items-center justify-between">
              <span>Similar Universities</span>
              <span className="text-[10px] text-slate-400 font-semibold">
                {similarUniversities.length} Alternatives
              </span>
            </h4>

            <div className="space-y-2">
              {similarUniversities.map((sim) => (
                <div
                  key={sim._id}
                  onClick={() => handleSelectUniversity(sim)}
                  className="p-2.5 rounded-xl border border-slate-100 hover:border-brand-royal/40 bg-white hover:bg-blue-50/30 transition-all flex items-center gap-2.5 cursor-pointer"
                >
                  <img
                    src={sim.logo || 'https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=60&h=60&fit=crop'}
                    alt={sim.name}
                    className="w-8 h-8 rounded-lg object-cover bg-white p-0.5 border border-slate-200 shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-bold text-slate-900 truncate">
                      {sim.name}
                    </h5>
                    <p className="text-[10px] text-slate-400 truncate">
                      {sim.location?.city}, {sim.location?.state} &bull; {sim.universityType}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                </div>
              ))}
            </div>
          </div>

          {/* Quick Share Widget at Bottom */}
          <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 space-y-2.5">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-500 block">
              Share Profile
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handleCopyLink}
                className="flex-1 py-2 px-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-500" />}
                <span>{copied ? 'Copied!' : 'Copy Link'}</span>
              </button>
              <button
                onClick={handleWhatsAppShare}
                className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold flex items-center gap-1 transition-colors cursor-pointer shadow-xs"
                title="Share on WhatsApp"
              >
                <span>💬 WhatsApp</span>
              </button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default UniversitiesPage;
