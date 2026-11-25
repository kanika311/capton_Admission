import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Search,
  Compass,
  BookOpen,
  Building2,
  FileText,
  GraduationCap,
  Award,
  ShieldCheck,
  CheckCircle2,
  Check,
  ArrowRight,
  Share2,
  Copy,
  Sparkles,
  PhoneCall,
  ChevronRight,
  HelpCircle,
  Users,
  Clock,
  Star,
  ExternalLink,
  Shield,
  Layers,
  MapPin,
  MessageSquare,
} from 'lucide-react';
import api from '../../services/api';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import toast from 'react-hot-toast';

const serviceCategories = ['All', 'Career Planning', 'Admissions', 'Financial Support', 'Exam Prep'];

const serviceIconMap = {
  'career-counselling': Compass,
  'course-selection-guidance': BookOpen,
  'university-shortlisting': Building2,
  'application-assistance': FileText,
  'entrance-exam-guidance': GraduationCap,
  'scholarship-assistance': Award,
  'education-loan-support': ShieldCheck,
  'documentation-seat-confirmation': CheckCircle2,
};

const categoryBadgeColors = {
  'Career Planning': 'bg-blue-50 text-blue-700 border-blue-200',
  Admissions: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  'Financial Support': 'bg-amber-50 text-amber-700 border-amber-200',
  'Exam Prep': 'bg-purple-50 text-purple-700 border-purple-200',
};

const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [services, setServices] = useState([]);
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active selection
  const [selectedService, setSelectedService] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');

  // Mobile step switcher: 'list' | 'details' | 'suggestions'
  const [mobileStep, setMobileStep] = useState('list');

  // Share dropdown
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch services and partner universities
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servRes, uniRes] = await Promise.all([
          api.get('/services'),
          api.get('/universities?limit=6'),
        ]);

        const allServices = servRes.data.data || [];
        setServices(allServices);
        setUniversities(uniRes.data.data || []);

        // Pre-select service if slug in URL, else first service
        const urlSlug = searchParams.get('service');
        if (urlSlug) {
          const found = allServices.find((s) => s.slug === urlSlug);
          if (found) {
            setSelectedService(found);
            return;
          }
        }
        if (allServices.length > 0) {
          setSelectedService(allServices[0]);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Filtered services
  const filteredServices = useMemo(() => {
    return services.filter((serv) => {
      const matchCat =
        categoryFilter === 'All' ||
        serv.category?.toLowerCase() === categoryFilter.toLowerCase();
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        serv.title?.toLowerCase().includes(q) ||
        serv.shortDescription?.toLowerCase().includes(q) ||
        (serv.category && serv.category.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [services, categoryFilter, search]);

  // Suggested services (excluding selected)
  const suggestedServices = useMemo(() => {
    if (!selectedService) return services.slice(0, 4);
    return services
      .filter((s) => s.slug !== selectedService.slug)
      .slice(0, 4);
  }, [services, selectedService]);

  // Handle service selection
  const handleSelectService = (service) => {
    setSelectedService(service);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('service', service.slug);
      return next;
    });
    setMobileStep('details');
  };

  // Handle share link
  const currentShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/services?service=${selectedService?.slug || ''}`
    : '';

  const handleCopyLink = () => {
    if (!currentShareUrl) return;
    navigator.clipboard.writeText(currentShareUrl);
    setCopied(true);
    toast.success('Service link copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setIsShareOpen(false);
    }, 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Explore ${selectedService?.title || 'Admission Services'} on CaptonAdmission: ${currentShareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    setIsShareOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 font-sans">
      {/* ============================================================== */}
      {/* TOP STICKY BAR: Search, Filter, Live Stats, Share & CTA       */}
      {/* ============================================================== */}
      <header className="h-14 sm:h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-20 shadow-xs">
        {/* Left: Branding & Services Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-royal">
            <Compass className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-brand-navy leading-none">
                Admission Services
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-brand-royal border border-blue-100">
                {filteredServices.length} Active Services
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Free 1-on-1 Guidance, College Shortlisting & Document Support
            </p>
          </div>
        </div>

        {/* Center: Search & Category Dropdown */}
        <div className="flex-1 max-w-xl flex items-center gap-2">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services (e.g. Counselling, Scholarship, Loan)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-1.5 sm:py-2 text-xs sm:text-sm bg-slate-50 hover:bg-slate-100/70 focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-brand-royal/20 focus:border-brand-royal transition-all text-slate-800 placeholder-slate-400 font-medium"
            />
          </div>

          {/* Category Dropdown */}
          <div className="hidden md:block shrink-0">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
                setSearchParams((prev) => {
                  const next = new URLSearchParams(prev);
                  if (e.target.value === 'All') next.delete('category');
                  else next.set('category', e.target.value);
                  return next;
                });
              }}
              className="text-xs font-bold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 focus:outline-none focus:border-brand-royal cursor-pointer"
            >
              {serviceCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Categories' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Share Button & Free Consultation CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Share Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
              title="Share this service"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {isShareOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Share Service
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {selectedService?.title || 'CaptonAdmission Services'}
                  </p>
                </div>
                <button
                  onClick={handleWhatsAppShare}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-emerald-700 hover:bg-emerald-50 rounded-xl transition-colors"
                >
                  <div className="w-6 h-6 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-600">
                    <MessageSquare className="w-3.5 h-3.5" />
                  </div>
                  <span>Share on WhatsApp</span>
                </button>
                <button
                  onClick={handleCopyLink}
                  className="w-full flex items-center gap-2.5 px-3 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 rounded-xl transition-colors mt-1"
                >
                  <div className="w-6 h-6 rounded-lg bg-slate-100 flex items-center justify-center text-slate-600">
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  </div>
                  <span>{copied ? 'Link Copied!' : 'Copy Direct Link'}</span>
                </button>
              </div>
            )}
          </div>

          {/* Book Counselling Modal CTA */}
          <button
            onClick={() => dispatch(openEnquiryModal({ service: selectedService?.title }))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-black rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-navy" />
            <span className="hidden sm:inline">Book Free Guidance</span>
            <span className="sm:hidden">Consult</span>
          </button>
        </div>
      </header>

      {/* ============================================================== */}
      {/* MOBILE STEP SWITCHER (Visible strictly on small screens)        */}
      {/* ============================================================== */}
      <div className="lg:hidden flex border-b border-slate-200 bg-white text-xs font-bold shrink-0">
        <button
          onClick={() => setMobileStep('list')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            mobileStep === 'list'
              ? 'border-brand-royal text-brand-royal bg-blue-50/40'
              : 'border-transparent text-slate-600'
          }`}
        >
          1. Services ({filteredServices.length})
        </button>
        <button
          onClick={() => setMobileStep('details')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            mobileStep === 'details'
              ? 'border-brand-royal text-brand-royal bg-blue-50/40'
              : 'border-transparent text-slate-600'
          }`}
        >
          2. Full Details
        </button>
        <button
          onClick={() => setMobileStep('suggestions')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            mobileStep === 'suggestions'
              ? 'border-brand-royal text-brand-royal bg-blue-50/40'
              : 'border-transparent text-slate-600'
          }`}
        >
          3. Suggestions
        </button>
      </div>

      {/* ============================================================== */}
      {/* MAIN 3-PANEL LAYOUT CONTAINER                                  */}
      {/* ============================================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* ------------------------------------------------------------ */}
        {/* PANEL 1: LEFT - STICKY SERVICES LIST (Titles & Badges)        */}
        {/* ------------------------------------------------------------ */}
        <aside
          className={`lg:col-span-3 xl:col-span-3 h-full overflow-y-auto border-r border-slate-200/80 bg-white styled-scrollbar flex flex-col ${
            mobileStep === 'list' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Category Filter Pills (Horizontal Scrollable Strip) */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {serviceCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    setCategoryFilter(cat);
                    setSearchParams((prev) => {
                      const next = new URLSearchParams(prev);
                      if (cat === 'All') next.delete('category');
                      else next.set('category', cat);
                      return next;
                    });
                  }}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-bold whitespace-nowrap transition-all ${
                    categoryFilter === cat
                      ? 'bg-brand-royal text-white shadow-xs'
                      : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Services Directory List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 styled-scrollbar">
            {loading ? (
              <div className="space-y-3 p-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse bg-slate-100 h-24 rounded-2xl border border-slate-200"></div>
                ))}
              </div>
            ) : filteredServices.length === 0 ? (
              <div className="text-center py-12 px-4">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Services Found</p>
                <p className="text-[11px] text-slate-400 mt-1">Try resetting your search query or filters.</p>
                <button
                  onClick={() => {
                    setSearch('');
                    setCategoryFilter('All');
                  }}
                  className="mt-3 text-xs font-bold text-brand-royal hover:underline"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              filteredServices.map((service) => {
                const isSelected = selectedService?._id === service._id || selectedService?.slug === service.slug;
                const ServiceIcon = serviceIconMap[service.slug] || Compass;

                return (
                  <div
                    key={service._id}
                    onClick={() => handleSelectService(service)}
                    className={`p-3.5 rounded-2xl border cursor-pointer transition-all duration-200 relative group ${
                      isSelected
                        ? 'bg-blue-50/80 border-brand-royal/50 shadow-sm ring-1 ring-brand-royal/20'
                        : 'bg-white border-slate-200/80 hover:border-slate-300 hover:bg-slate-50/50'
                    }`}
                  >
                    {/* Active Left Indicator Bar */}
                    {isSelected && (
                      <div className="absolute left-0 top-3 bottom-3 w-1 bg-brand-royal rounded-r-full" />
                    )}

                    <div className="flex items-start gap-3">
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                          isSelected
                            ? 'bg-brand-royal text-white shadow-xs'
                            : 'bg-slate-100 text-slate-600 group-hover:bg-blue-50 group-hover:text-brand-royal'
                        }`}
                      >
                        <ServiceIcon className="w-5 h-5" />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                              categoryBadgeColors[service.category] || 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {service.category || 'Admissions'}
                          </span>
                          {service.stats?.rating && (
                            <span className="flex items-center gap-0.5 text-[10px] font-bold text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200/60">
                              <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                              {service.stats.rating}
                            </span>
                          )}
                        </div>

                        <h3
                          className={`text-xs font-bold leading-snug line-clamp-2 ${
                            isSelected ? 'text-brand-royal font-extrabold' : 'text-slate-800'
                          }`}
                        >
                          {service.title}
                        </h3>

                        <p className="text-[11px] text-slate-500 line-clamp-1 mt-1 leading-normal">
                          {service.shortDescription}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Help Strip at Bottom of Left Panel */}
          <div className="p-3 border-t border-slate-200/80 bg-slate-50/80 text-[11px] text-slate-600 flex items-center justify-between shrink-0">
            <span className="font-semibold">Need custom guidance?</span>
            <button
              onClick={() => dispatch(openEnquiryModal({}))}
              className="font-bold text-brand-royal hover:underline"
            >
              Ask Counsellor &rarr;
            </button>
          </div>
        </aside>

        {/* ------------------------------------------------------------ */}
        {/* PANEL 2: CENTER - SCROLLING SERVICE CONTENT & BLUEPRINT       */}
        {/* ------------------------------------------------------------ */}
        <main
          className={`lg:col-span-6 xl:col-span-6 h-full overflow-y-auto bg-slate-50/70 styled-scrollbar p-4 sm:p-6 lg:p-8 space-y-6 ${
            mobileStep === 'details' ? 'block' : 'hidden lg:block'
          }`}
        >
          {selectedService ? (
            <>
              {/* TOP HERO CARD */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs relative overflow-hidden">
                <div className="absolute top-0 right-0 w-64 h-64 bg-radial from-blue-50/80 to-transparent pointer-events-none" />

                <div className="relative z-10">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-3">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        categoryBadgeColors[selectedService.category] || 'bg-blue-50 text-brand-royal border-blue-200'
                      }`}
                    >
                      {selectedService.category || 'Admission Service'}
                    </span>
                    <span className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      100% Free / University Sponsored
                    </span>
                  </div>

                  <h2 className="text-xl sm:text-2xl font-black text-brand-navy leading-tight">
                    {selectedService.title}
                  </h2>

                  <p className="text-xs sm:text-sm text-slate-600 mt-2.5 leading-relaxed font-normal">
                    {selectedService.shortDescription}
                  </p>

                  {/* Action CTA Bar */}
                  <div className="mt-6 pt-5 border-t border-slate-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <button
                        onClick={() => dispatch(openEnquiryModal({ service: selectedService.title }))}
                        className="px-5 py-2.5 bg-brand-royal hover:bg-brand-navy text-white text-xs font-extrabold rounded-xl shadow-md hover:shadow-lg transition-all flex items-center gap-2"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>Book 1-on-1 Session</span>
                      </button>

                      <a
                        href={`https://api.whatsapp.com/send?text=${encodeURIComponent(
                          `Hi CaptonAdmission, I want to book a free session for: ${selectedService.title}`
                        )}`}
                        target="_blank"
                        rel="noreferrer"
                        className="px-4 py-2.5 bg-emerald-50 hover:bg-emerald-100/80 text-emerald-800 border border-emerald-200 text-xs font-extrabold rounded-xl transition-all flex items-center gap-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>WhatsApp Counsellor</span>
                      </a>
                    </div>

                    <span className="text-[11px] font-semibold text-slate-400">
                      Zero Brokerage Guaranteed
                    </span>
                  </div>
                </div>
              </div>

              {/* 4-CARD QUICK METRICS GRID */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Satisfaction
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
                    <span className="text-xs sm:text-sm font-black text-brand-navy">
                      {selectedService.stats?.satisfactionRate || '99%'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Student Rating</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Students Guided
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <Users className="w-3.5 h-3.5 text-brand-royal" />
                    <span className="text-xs sm:text-sm font-black text-brand-navy">
                      {selectedService.stats?.studentsAssisted || '20,000+'}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">Across India</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Session Format
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <Clock className="w-3.5 h-3.5 text-emerald-600" />
                    <span className="text-xs sm:text-sm font-black text-brand-navy">
                      1-on-1 Video
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">45-60 Mins</span>
                </div>

                <div className="bg-white p-3.5 rounded-2xl border border-slate-200/80 shadow-2xs">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                    Service Charge
                  </span>
                  <div className="flex items-center gap-1 mt-1">
                    <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
                    <span className="text-xs sm:text-sm font-black text-emerald-700">
                      ₹ 0 (Free)
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 mt-0.5 block">No Hidden Fees</span>
                </div>
              </div>

              {/* IN-DEPTH OVERVIEW */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-3">
                <h3 className="text-sm sm:text-base font-extrabold text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-brand-royal" />
                  <span>Comprehensive Service Blueprint</span>
                </h3>
                <p className="text-xs sm:text-sm text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                  {selectedService.fullDescription || selectedService.shortDescription}
                </p>
              </div>

              {/* KEY DELIVERABLES / WHAT YOU GET */}
              {selectedService.deliverables && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
                  <h3 className="text-sm sm:text-base font-extrabold text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    <span>What You Receive (Tangible Deliverables)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedService.deliverables.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 bg-slate-50/80 rounded-2xl border border-slate-200/70 flex items-start gap-2.5"
                      >
                        <div className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0 mt-0.5">
                          <Check className="w-3 h-3 stroke-[3]" />
                        </div>
                        <span className="text-xs font-semibold text-slate-700 leading-snug">
                          {item}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 4-STEP ADVISORY PROCESS ROADMAP */}
              {selectedService.process && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
                  <h3 className="text-sm sm:text-base font-extrabold text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Compass className="w-4 h-4 text-brand-royal" />
                    <span>How It Works (4-Stage Process Flow)</span>
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {selectedService.process.map((stepItem, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/80 border border-slate-200/70 flex flex-col justify-between"
                      >
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-xs font-black text-brand-royal bg-blue-100/60 px-2.5 py-0.5 rounded-lg font-mono">
                              STEP {stepItem.step}
                            </span>
                            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                          </div>
                          <h4 className="text-xs font-bold text-brand-navy mb-1">
                            {stepItem.title}
                          </h4>
                          <p className="text-[11px] text-slate-500 leading-relaxed font-normal">
                            {stepItem.desc}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* WHO SHOULD AVAIL THIS SERVICE */}
              {selectedService.whoIsThisFor && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-3">
                  <h3 className="text-sm sm:text-base font-extrabold text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                    <Users className="w-4 h-4 text-purple-600" />
                    <span>Target Aspirants (Who Should Avail This)</span>
                  </h3>
                  <div className="space-y-2">
                    {selectedService.whoIsThisFor.map((item, idx) => (
                      <div
                        key={idx}
                        className="p-3 rounded-xl bg-blue-50/40 border border-blue-100 flex items-center gap-2.5 text-xs text-slate-700 font-semibold"
                      >
                        <CheckCircle2 className="w-4 h-4 text-brand-royal shrink-0" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* FREQUENTLY ASKED QUESTIONS */}
              {selectedService.faqs && selectedService.faqs.length > 0 && (
                <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
                  <h3 className="text-sm sm:text-base font-extrabold text-brand-navy border-b border-slate-100 pb-3 flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-slate-600" />
                    <span>Frequently Asked Questions</span>
                  </h3>
                  <div className="space-y-3">
                    {selectedService.faqs.map((faq, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-slate-50/60 border border-slate-200/70 space-y-1.5"
                      >
                        <h4 className="text-xs font-bold text-brand-navy flex items-start gap-2">
                          <span className="text-brand-royal font-black">Q.</span>
                          <span>{faq.q}</span>
                        </h4>
                        <p className="text-[11px] text-slate-600 leading-relaxed font-normal pl-4">
                          {faq.a}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* BOTTOM COUNSELLING PROMISE BANNER */}
              <div className="bg-gradient-to-r from-brand-navy to-brand-royal rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block">
                    Official Student Assurance
                  </span>
                  <h3 className="text-lg sm:text-xl font-black">
                    Get Honest, Unbiased Career & College Guidance
                  </h3>
                  <p className="text-xs text-slate-200 max-w-md">
                    No misleading promises. No fake agent tie-ups. 100% transparent admission assistance backed by verified NIRF data.
                  </p>
                </div>

                <button
                  onClick={() => dispatch(openEnquiryModal({ service: selectedService.title }))}
                  className="px-6 py-3 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shrink-0 transition-transform active:scale-95"
                >
                  Schedule Free Call
                </button>
              </div>
            </>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-slate-400">
              <p className="text-sm">Select a service on the left to read its complete blueprint.</p>
            </div>
          )}
        </main>

        {/* ------------------------------------------------------------ */}
        {/* PANEL 3: RIGHT - STICKY SUGGESTIONS & PARTNER NETWORKS        */}
        {/* ------------------------------------------------------------ */}
        <aside
          className={`lg:col-span-3 xl:col-span-3 h-full overflow-y-auto border-l border-slate-200/80 bg-white styled-scrollbar p-4 space-y-5 ${
            mobileStep === 'suggestions' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Header */}
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
              Recommended For You
            </span>
            <span className="text-[10px] font-bold text-slate-400">Suggestions</span>
          </div>

          {/* 1. COMPLEMENTARY SUGGESTED SERVICES */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-royal" />
              <span>Complementary Guidance</span>
            </h4>

            <div className="space-y-2">
              {suggestedServices.map((item) => {
                const ItemIcon = serviceIconMap[item.slug] || Compass;
                return (
                  <div
                    key={item._id}
                    onClick={() => handleSelectService(item)}
                    className="p-3 rounded-xl border border-slate-200 hover:border-brand-royal/40 hover:bg-slate-50/70 transition-all cursor-pointer group flex items-start gap-2.5"
                  >
                    <div className="w-8 h-8 rounded-lg bg-blue-50 text-brand-royal flex items-center justify-center shrink-0 group-hover:bg-brand-royal group-hover:text-white transition-colors">
                      <ItemIcon className="w-4 h-4" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="text-xs font-bold text-slate-800 group-hover:text-brand-royal truncate">
                        {item.title}
                      </h5>
                      <p className="text-[10px] text-slate-400 truncate mt-0.5">
                        {item.category} &bull; Free Advisory
                      </p>
                    </div>
                    <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-royal group-hover:translate-x-0.5 transition-all shrink-0 mt-1" />
                  </div>
                );
              })}
            </div>
          </div>

          {/* 2. TOP ACCREDITED PARTNER UNIVERSITIES */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand-royal" />
                <span>Partner Institutions</span>
              </h4>
              <Link to="/universities" className="text-[10px] font-bold text-brand-royal hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              {universities.slice(0, 4).map((uni) => (
                <Link
                  key={uni._id}
                  to={`/universities?uni=${uni.slug}`}
                  className="p-2.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-colors block group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                      {uni.universityType || 'Government'}
                    </span>
                    <span className="text-[10px] font-bold text-amber-600 flex items-center gap-0.5">
                      <Star className="w-2.5 h-2.5 fill-amber-500 text-amber-500" />
                      {uni.rating || '4.8'}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-brand-navy group-hover:text-brand-royal truncate">
                    {uni.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-2.5 h-2.5" />
                    <span>{uni.location?.city}, {uni.location?.state}</span>
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. 1-CLICK WHATSAPP ADVISORY DESK CARD */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-emerald-900">
                Direct WhatsApp Advisory
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug">
              Have immediate questions about deadlines, eligibility, or cutoffs? Chat directly with a senior counsellor.
            </p>
            <a
              href="https://api.whatsapp.com/send?text=Hi%20CaptonAdmission%2C%20I%20need%20quick%20advice%20regarding%20college%20admissions"
              target="_blank"
              rel="noreferrer"
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Chat on WhatsApp</span>
            </a>
          </div>

          {/* 4. INSTANT CALLBACK REQUEST CARD */}
          <div className="p-4 rounded-2xl bg-brand-light border border-brand-border space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-royal flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-brand-navy">
                Request Free Callback
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Get an instant callback within 15 minutes from our dedicated admission department.
            </p>
            <button
              onClick={() => dispatch(openEnquiryModal({ service: selectedService?.title }))}
              className="w-full py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Request Callback</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default ServicesPage;
