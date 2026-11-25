import React, { useState, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import {
  Search,
  BookOpen,
  Clock,
  User,
  ArrowRight,
  Share2,
  Copy,
  Check,
  MessageSquare,
  Sparkles,
  ChevronRight,
  Tag,
  Bookmark,
  ExternalLink,
  GraduationCap,
  Building2,
  HelpCircle,
  FileText,
  Calendar,
  CheckCircle2,
  PhoneCall,
  Flame,
} from 'lucide-react';
import api from '../../services/api';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import toast from 'react-hot-toast';

const blogCategories = [
  'All',
  'Engineering',
  'Management',
  'Admissions',
  'Medical',
  'Financial Aid',
  'Entrance Exams',
];

const categoryBadgeColors = {
  Engineering: 'bg-blue-50 text-blue-700 border-blue-200',
  Management: 'bg-purple-50 text-purple-700 border-purple-200',
  Admissions: 'bg-emerald-50 text-emerald-700 border-emerald-200',
  Medical: 'bg-rose-50 text-rose-700 border-rose-200',
  'Financial Aid': 'bg-amber-50 text-amber-700 border-amber-200',
  'Entrance Exams': 'bg-indigo-50 text-indigo-700 border-indigo-200',
};

const BlogsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const dispatch = useDispatch();

  const [blogs, setBlogs] = useState([]);
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  // Active selected article
  const [selectedBlog, setSelectedBlog] = useState(null);

  // Filter state
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState(searchParams.get('category') || 'All');

  // Mobile step switcher: 'list' | 'reader' | 'suggestions'
  const [mobileStep, setMobileStep] = useState('list');

  // Share dropdown state
  const [isShareOpen, setIsShareOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  // Fetch blogs & related exams
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [blogRes, examRes] = await Promise.all([
          api.get('/blogs'),
          api.get('/exams'),
        ]);

        const allBlogs = blogRes.data.data || [];
        setBlogs(allBlogs);
        setExams(examRes.data.data || []);

        // Pre-select blog if slug in URL, else first blog
        const urlSlug = searchParams.get('article');
        if (urlSlug) {
          const found = allBlogs.find((b) => b.slug === urlSlug);
          if (found) {
            setSelectedBlog(found);
            return;
          }
        }
        if (allBlogs.length > 0) {
          setSelectedBlog(allBlogs[0]);
        }
      } catch (err) {
        console.error('Error fetching blogs:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [searchParams]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter((blog) => {
      const matchCat =
        categoryFilter === 'All' ||
        blog.category?.toLowerCase() === categoryFilter.toLowerCase();
      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        blog.title?.toLowerCase().includes(q) ||
        blog.excerpt?.toLowerCase().includes(q) ||
        blog.author?.toLowerCase().includes(q) ||
        (blog.category && blog.category.toLowerCase().includes(q));
      return matchCat && matchSearch;
    });
  }, [blogs, categoryFilter, search]);

  // Suggested articles (excluding current)
  const suggestedBlogs = useMemo(() => {
    if (!selectedBlog) return blogs.slice(0, 4);
    // Prioritize same category, then others
    const sameCat = blogs.filter(
      (b) => b.category === selectedBlog.category && b.slug !== selectedBlog.slug
    );
    const otherCat = blogs.filter(
      (b) => b.category !== selectedBlog.category && b.slug !== selectedBlog.slug
    );
    return [...sameCat, ...otherCat].slice(0, 4);
  }, [blogs, selectedBlog]);

  // Handle article selection
  const handleSelectBlog = (blog) => {
    setSelectedBlog(blog);
    setSearchParams((prev) => {
      const next = new URLSearchParams(prev);
      next.set('article', blog.slug);
      return next;
    });
    setMobileStep('reader');
  };

  // Handle share link
  const currentShareUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/blogs?article=${selectedBlog?.slug || ''}`
    : '';

  const handleCopyLink = () => {
    if (!currentShareUrl) return;
    navigator.clipboard.writeText(currentShareUrl);
    setCopied(true);
    toast.success('Article link copied to clipboard!');
    setTimeout(() => {
      setCopied(false);
      setIsShareOpen(false);
    }, 2000);
  };

  const handleWhatsAppShare = () => {
    const text = `Read "${selectedBlog?.title || 'Admission Guide'}" on CaptonAdmission: ${currentShareUrl}`;
    window.open(`https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`, '_blank');
    setIsShareOpen(false);
  };

  return (
    <div className="flex-1 flex flex-col h-[calc(100vh-64px)] overflow-hidden bg-slate-50 font-sans">
      {/* ============================================================== */}
      {/* TOP STICKY BAR: Search, Category Selector, Share & Counselling */}
      {/* ============================================================== */}
      <header className="h-14 sm:h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between gap-3 shrink-0 z-20 shadow-xs">
        {/* Left: Branding & Article Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="w-9 h-9 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-brand-royal">
            <BookOpen className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-sm sm:text-base font-extrabold text-brand-navy leading-none">
                Admission Guides
              </h1>
              <span className="hidden sm:inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-brand-royal border border-blue-100">
                {filteredBlogs.length} Editorial Guides
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium hidden sm:block">
              Expert Cutoffs, Counseling Strategies & College Disclosures
            </p>
          </div>
        </div>

        {/* Center: Keyword Search & Category Dropdown */}
        <div className="flex-1 max-w-xl flex items-center gap-2">
          {/* Keyword Search */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search guides, cutoffs, engineering, medical..."
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
              {blogCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat === 'All' ? 'All Topics' : cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Right: Share Button & Get Counselling CTA */}
        <div className="flex items-center gap-2 shrink-0">
          {/* Share Dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsShareOpen(!isShareOpen)}
              className="flex items-center gap-1.5 px-3 py-1.5 sm:py-2 rounded-xl text-xs font-bold border border-slate-200 hover:bg-slate-50 text-slate-700 transition-colors shadow-xs"
              title="Share this article"
            >
              <Share2 className="w-3.5 h-3.5 text-slate-500" />
              <span className="hidden sm:inline">Share</span>
            </button>

            {isShareOpen && (
              <div className="absolute right-0 mt-2 w-56 bg-white rounded-2xl shadow-xl border border-slate-200 p-2 z-50 animate-in fade-in slide-in-from-top-2">
                <div className="px-3 py-2 border-b border-slate-100 mb-1">
                  <p className="text-[11px] font-bold text-slate-700 uppercase tracking-wider">
                    Share Guide
                  </p>
                  <p className="text-[10px] text-slate-400 truncate">
                    {selectedBlog?.title || 'CaptonAdmission Editorial'}
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

          {/* Counselling Modal Trigger */}
          <button
            onClick={() => dispatch(openEnquiryModal({}))}
            className="flex items-center gap-1.5 px-3.5 py-1.5 sm:py-2 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-black rounded-xl text-xs uppercase tracking-wider shadow-sm transition-all"
          >
            <Sparkles className="w-3.5 h-3.5 text-brand-navy" />
            <span className="hidden sm:inline">Ask Counsellor</span>
            <span className="sm:hidden">Ask</span>
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
          1. Articles ({filteredBlogs.length})
        </button>
        <button
          onClick={() => setMobileStep('reader')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            mobileStep === 'reader'
              ? 'border-brand-royal text-brand-royal bg-blue-50/40'
              : 'border-transparent text-slate-600'
          }`}
        >
          2. Full Guide
        </button>
        <button
          onClick={() => setMobileStep('suggestions')}
          className={`flex-1 py-2.5 text-center border-b-2 transition-colors ${
            mobileStep === 'suggestions'
              ? 'border-brand-royal text-brand-royal bg-blue-50/40'
              : 'border-transparent text-slate-600'
          }`}
        >
          3. Related & Advice
        </button>
      </div>

      {/* ============================================================== */}
      {/* MAIN 3-PANEL LAYOUT CONTAINER                                  */}
      {/* ============================================================== */}
      <div className="flex-1 grid grid-cols-1 lg:grid-cols-12 overflow-hidden">
        {/* ------------------------------------------------------------ */}
        {/* PANEL 1: LEFT - STICKY BLOG DIRECTORY (Titles & Thumbnails)   */}
        {/* ------------------------------------------------------------ */}
        <aside
          className={`lg:col-span-3 xl:col-span-3 h-full overflow-y-auto border-r border-slate-200/80 bg-white styled-scrollbar flex flex-col ${
            mobileStep === 'list' ? 'block' : 'hidden lg:flex'
          }`}
        >
          {/* Category Filter Pills (Horizontal Scroll Strip) */}
          <div className="p-3 border-b border-slate-100 bg-slate-50/70 shrink-0">
            <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-1">
              {blogCategories.map((cat) => (
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

          {/* Articles Directory List */}
          <div className="flex-1 overflow-y-auto p-3 space-y-2.5 styled-scrollbar">
            {loading ? (
              <div className="space-y-3 p-2">
                {[1, 2, 3, 4, 5, 6].map((n) => (
                  <div key={n} className="animate-pulse bg-slate-100 h-24 rounded-2xl border border-slate-200"></div>
                ))}
              </div>
            ) : filteredBlogs.length === 0 ? (
              <div className="text-center py-12 px-4">
                <HelpCircle className="w-8 h-8 text-slate-300 mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-700">No Guides Found</p>
                <p className="text-[11px] text-slate-400 mt-1">Try resetting your search query or topic.</p>
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
              filteredBlogs.map((blog) => {
                const isSelected = selectedBlog?._id === blog._id || selectedBlog?.slug === blog.slug;

                return (
                  <div
                    key={blog._id}
                    onClick={() => handleSelectBlog(blog)}
                    className={`p-3 rounded-2xl border cursor-pointer transition-all duration-200 relative group ${
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
                      {/* Thumbnail */}
                      <div className="w-14 h-14 rounded-xl overflow-hidden shrink-0 bg-slate-100 border border-slate-200/80">
                        <img
                          src={blog.featuredImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=200&h=200&fit=crop'}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1 mb-1">
                          <span
                            className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${
                              categoryBadgeColors[blog.category] || 'bg-slate-100 text-slate-600 border-slate-200'
                            }`}
                          >
                            {blog.category || 'Admissions'}
                          </span>
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <Clock className="w-2.5 h-2.5" />
                            {blog.readTime || '5 min read'}
                          </span>
                        </div>

                        <h3
                          className={`text-xs font-bold leading-snug line-clamp-2 ${
                            isSelected ? 'text-brand-royal font-extrabold' : 'text-slate-800'
                          }`}
                        >
                          {blog.title}
                        </h3>

                        <p className="text-[10px] text-slate-400 mt-1 truncate">
                          By {blog.author || 'Editorial Desk'}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Quick Help Strip at Bottom */}
          <div className="p-3 border-t border-slate-200/80 bg-slate-50/80 text-[11px] text-slate-600 flex items-center justify-between shrink-0">
            <span className="font-semibold">Need advice on these topics?</span>
            <button
              onClick={() => dispatch(openEnquiryModal({}))}
              className="font-bold text-brand-royal hover:underline"
            >
              Ask Counsellor &rarr;
            </button>
          </div>
        </aside>

        {/* ------------------------------------------------------------ */}
        {/* PANEL 2: CENTER - SCROLLING BLOG CONTENT & READER             */}
        {/* ------------------------------------------------------------ */}
        <main
          className={`lg:col-span-6 xl:col-span-6 h-full overflow-y-auto bg-slate-50/70 styled-scrollbar p-4 sm:p-6 lg:p-8 space-y-6 ${
            mobileStep === 'reader' ? 'block' : 'hidden lg:block'
          }`}
        >
          {selectedBlog ? (
            <article className="space-y-6">
              {/* ARTICLE HEADER & METADATA */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span
                      className={`text-xs font-bold px-3 py-1 rounded-full border ${
                        categoryBadgeColors[selectedBlog.category] || 'bg-blue-50 text-brand-royal border-blue-200'
                      }`}
                    >
                      {selectedBlog.category}
                    </span>
                    <span className="text-xs text-slate-400 flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5" />
                      {selectedBlog.readTime || '6 min read'}
                    </span>
                  </div>

                  <span className="text-xs text-slate-400 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(selectedBlog.createdAt || Date.now()).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric',
                    })}
                  </span>
                </div>

                <h1 className="text-xl sm:text-2xl lg:text-3xl font-black text-brand-navy leading-tight tracking-tight">
                  {selectedBlog.title}
                </h1>

                {/* Author Byline */}
                <div className="pt-4 border-t border-slate-100 flex items-center justify-between flex-wrap gap-3">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-blue-100 text-brand-royal flex items-center justify-center font-bold text-xs">
                      <User className="w-4 h-4" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-brand-navy">
                        {selectedBlog.author || 'Senior Editorial Staff'}
                      </p>
                      <p className="text-[10px] text-slate-400 font-medium">
                        {selectedBlog.authorRole || 'Admissions Research Desk'}
                      </p>
                    </div>
                  </div>

                  {/* Quick Share Pills */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={handleWhatsAppShare}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 text-emerald-700 hover:bg-emerald-100/80 border border-emerald-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Share to WhatsApp"
                    >
                      <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                      <span>WhatsApp</span>
                    </button>
                    <button
                      onClick={handleCopyLink}
                      className="px-3 py-1.5 rounded-lg bg-slate-100 text-slate-700 hover:bg-slate-200/70 border border-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors"
                      title="Copy Link"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* FEATURED COVER IMAGE */}
              {selectedBlog.featuredImage && (
                <div className="rounded-3xl overflow-hidden border border-slate-200/80 shadow-xs max-h-80 bg-slate-100">
                  <img
                    src={selectedBlog.featuredImage}
                    alt={selectedBlog.title}
                    className="w-full h-full object-cover max-h-80"
                  />
                </div>
              )}

              {/* KEY TAKEAWAYS CALLOUT BOX */}
              {selectedBlog.keyTakeaways && selectedBlog.keyTakeaways.length > 0 && (
                <div className="bg-gradient-to-br from-blue-50/80 via-white to-blue-50/30 rounded-3xl border border-blue-200/80 p-5 sm:p-6 shadow-2xs space-y-3">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-brand-royal" />
                    <h3 className="text-xs sm:text-sm font-extrabold uppercase tracking-wider text-brand-royal">
                      Key Takeaways & Editorial Summary
                    </h3>
                  </div>
                  <ul className="space-y-2.5">
                    {selectedBlog.keyTakeaways.map((takeaway, idx) => (
                      <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-700 leading-relaxed font-semibold">
                        <CheckCircle2 className="w-4 h-4 text-brand-royal shrink-0 mt-0.5" />
                        <span>{takeaway}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* MAIN ARTICLE BODY CONTENT */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-8 shadow-xs">
                <div className="prose prose-slate max-w-none text-xs sm:text-sm text-slate-700 leading-relaxed space-y-4">
                  {(selectedBlog.content || selectedBlog.excerpt || '')
                    .split('\n\n')
                    .map((block, idx) => {
                      // Subheading check
                      if (block.startsWith('### ')) {
                        return (
                          <h3
                            key={idx}
                            className="text-base sm:text-lg font-black text-brand-navy pt-4 pb-1 border-b border-slate-100"
                          >
                            {block.replace('### ', '')}
                          </h3>
                        );
                      }
                      if (block.startsWith('## ')) {
                        return (
                          <h2
                            key={idx}
                            className="text-lg sm:text-xl font-black text-brand-navy pt-5 pb-1 border-b border-slate-100"
                          >
                            {block.replace('## ', '')}
                          </h2>
                        );
                      }
                      // Bullet check
                      if (block.startsWith('- ')) {
                        const items = block.split('\n- ');
                        return (
                          <ul key={idx} className="space-y-2 my-2 list-none pl-0">
                            {items.map((item, itemIdx) => (
                              <li key={itemIdx} className="flex items-start gap-2 text-xs sm:text-sm text-slate-600">
                                <span className="w-1.5 h-1.5 rounded-full bg-brand-royal shrink-0 mt-2" />
                                <span>{item.replace(/^- /, '')}</span>
                              </li>
                            ))}
                          </ul>
                        );
                      }
                      return (
                        <p key={idx} className="text-slate-600 leading-relaxed font-normal whitespace-pre-line">
                          {block}
                        </p>
                      );
                    })}
                </div>

                {/* Tags Strip */}
                {selectedBlog.tags && selectedBlog.tags.length > 0 && (
                  <div className="pt-6 mt-6 border-t border-slate-100 flex flex-wrap items-center gap-2">
                    <span className="text-[11px] font-bold text-slate-400 flex items-center gap-1 mr-1">
                      <Tag className="w-3 h-3" />
                      <span>Topics:</span>
                    </span>
                    {selectedBlog.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="text-[11px] font-semibold text-slate-600 bg-slate-100 hover:bg-slate-200/80 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>

              {/* AUTHOR CREDENTIALS CARD */}
              <div className="bg-white rounded-3xl border border-slate-200/90 p-5 sm:p-6 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-brand-royal flex items-center justify-center font-black text-base shrink-0">
                    <User className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-brand-navy">
                      {selectedBlog.author || 'Dr. Rajesh Sharma'}
                    </h4>
                    <p className="text-xs text-slate-500 font-medium">
                      {selectedBlog.authorRole || 'Senior Admissions Strategist at CaptonAdmission'}
                    </p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      Assisted 10,000+ students in securing admissions across top engineering & medical institutions.
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => dispatch(openEnquiryModal({}))}
                  className="px-4 py-2 bg-slate-100 hover:bg-brand-royal hover:text-white text-slate-700 text-xs font-bold rounded-xl transition-all shrink-0"
                >
                  Consult Author &rarr;
                </button>
              </div>

              {/* BOTTOM COUNSELLING PROMISE BANNER */}
              <div className="bg-gradient-to-r from-brand-navy to-brand-royal rounded-3xl p-6 sm:p-8 text-white shadow-lg flex flex-col sm:flex-row items-center justify-between gap-5">
                <div className="space-y-2 text-center sm:text-left">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-brand-gold bg-white/10 px-3 py-1 rounded-full border border-white/20 inline-block">
                    Free Counselling Window
                  </span>
                  <h3 className="text-lg sm:text-xl font-black">
                    Need Personalized Help With College Choices?
                  </h3>
                  <p className="text-xs text-slate-200 max-w-md">
                    Connect 1-on-1 with experienced academic counsellors. Get authentic cutoffs, fee structures, and placement analytics.
                  </p>
                </div>

                <button
                  onClick={() => dispatch(openEnquiryModal({}))}
                  className="px-6 py-3 bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-black text-xs uppercase tracking-wider rounded-xl shadow-lg shrink-0 transition-transform active:scale-95"
                >
                  Book 1-on-1 Guidance
                </button>
              </div>
            </article>
          ) : (
            <div className="h-full flex items-center justify-center p-8 text-center text-slate-400">
              <p className="text-sm">Select an article on the left to read its full guide.</p>
            </div>
          )}
        </main>

        {/* ------------------------------------------------------------ */}
        {/* PANEL 3: RIGHT - STICKY SUGGESTIONS & RELATED EXAMS          */}
        {/* ------------------------------------------------------------ */}
        <aside
          className={`lg:col-span-3 xl:col-span-3 h-full overflow-y-auto border-l border-slate-200/80 bg-white styled-scrollbar p-4 space-y-5 ${
            mobileStep === 'suggestions' ? 'block' : 'hidden lg:block'
          }`}
        >
          {/* Header */}
          <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
            <span className="text-xs font-extrabold text-brand-navy uppercase tracking-wider">
              Recommended Reads
            </span>
            <span className="text-[10px] font-bold text-slate-400">Suggestions</span>
          </div>

          {/* 1. SUGGESTED / TRENDING GUIDES */}
          <div className="space-y-2.5">
            <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
              <Flame className="w-3.5 h-3.5 text-amber-500" />
              <span>Trending Admission Articles</span>
            </h4>

            <div className="space-y-2">
              {suggestedBlogs.map((item) => (
                <div
                  key={item._id}
                  onClick={() => handleSelectBlog(item)}
                  className="p-3 rounded-xl border border-slate-200 hover:border-brand-royal/40 hover:bg-slate-50/70 transition-all cursor-pointer group flex items-start gap-2.5"
                >
                  <div className="w-10 h-10 rounded-lg overflow-hidden shrink-0 bg-slate-100 border border-slate-200/70">
                    <img
                      src={item.featuredImage || 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=100&h=100&fit=crop'}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="flex-1 min-w-0">
                    <span className="text-[9px] font-bold text-brand-royal uppercase tracking-wider block">
                      {item.category}
                    </span>
                    <h5 className="text-xs font-bold text-slate-800 group-hover:text-brand-royal truncate mt-0.5">
                      {item.title}
                    </h5>
                    <p className="text-[10px] text-slate-400 truncate mt-0.5">
                      {item.readTime || '5 min read'} &bull; By {item.author || 'Editorial'}
                    </p>
                  </div>
                  <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-brand-royal group-hover:translate-x-0.5 transition-all shrink-0 mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. RELEVANT ENTRANCE EXAMS */}
          <div className="space-y-2.5 pt-4 border-t border-slate-100">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-brand-royal" />
                <span>Related Entrance Exams</span>
              </h4>
              <Link to="/exams" className="text-[10px] font-bold text-brand-royal hover:underline">
                View All &rarr;
              </Link>
            </div>

            <div className="space-y-2">
              {exams.slice(0, 4).map((exam) => (
                <Link
                  key={exam._id}
                  to={`/exams?exam=${exam.slug}`}
                  className="p-2.5 rounded-xl border border-slate-200/80 hover:border-slate-300 hover:bg-slate-50 transition-colors block group"
                >
                  <div className="flex items-center justify-between gap-1 mb-1">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-wider bg-slate-100 px-1.5 py-0.5 rounded">
                      {exam.stream || 'National'}
                    </span>
                    <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-1.5 py-0.5 rounded">
                      {exam.examLevel || 'National'}
                    </span>
                  </div>
                  <h5 className="text-xs font-bold text-brand-navy group-hover:text-brand-royal truncate">
                    {exam.name}
                  </h5>
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    By {exam.conductingBody || 'National Agency'}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          {/* 3. 1-CLICK WHATSAPP STUDY GROUP SHARE */}
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                <MessageSquare className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-emerald-900">
                Share With Study Groups
              </span>
            </div>
            <p className="text-[11px] text-emerald-800 leading-snug">
              Know friends or family preparing for admissions? Forward this verified editorial guide on WhatsApp.
            </p>
            <button
              onClick={handleWhatsAppShare}
              className="w-full py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <MessageSquare className="w-3.5 h-3.5" />
              <span>Forward on WhatsApp</span>
            </button>
          </div>

          {/* 4. INSTANT COUNSELLING ADVICE CARD */}
          <div className="p-4 rounded-2xl bg-brand-light border border-brand-border space-y-2.5">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-blue-100 text-brand-royal flex items-center justify-center shrink-0">
                <PhoneCall className="w-4 h-4" />
              </div>
              <span className="text-xs font-extrabold text-brand-navy">
                Speak With a Mentor
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-snug">
              Get clarity on cutoffs, college shortlisting, and institutional counselling windows.
            </p>
            <button
              onClick={() => dispatch(openEnquiryModal({}))}
              className="w-full py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-xl transition-all shadow-xs flex items-center justify-center gap-1.5"
            >
              <PhoneCall className="w-3.5 h-3.5" />
              <span>Book Free Advisory Call</span>
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default BlogsPage;
