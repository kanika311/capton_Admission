import React, { useState, useEffect } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  Menu,
  X,
  ChevronDown,
  User,
  LogOut,
  LayoutDashboard,
  Search,
  MessageCircle,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { openEnquiryModal } from '../../redux/slices/enquiryModalSlice';
import GlobalSearchModal from './GlobalSearchModal';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [coursesDropdownOpen, setCoursesDropdownOpen] = useState(false);
  const [unisDropdownOpen, setUnisDropdownOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchModalOpen, setSearchModalOpen] = useState(false);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    setUserDropdownOpen(false);
    navigate('/');
  };

  const courseCategories = [
    { name: 'Engineering (B.Tech / M.Tech)', slug: 'engineering' },
    { name: 'Medical & Dental (MBBS / BDS)', slug: 'medical' },
    { name: 'Management (BBA / MBA)', slug: 'management' },
    { name: 'Computer Applications (BCA / MCA)', slug: 'computer-applications' },
    { name: 'Law (BA LLB / LLB)', slug: 'law' },
    { name: 'Pharmacy (B.Pharm / D.Pharm)', slug: 'pharmacy' },
    { name: 'Design & Architecture', slug: 'design' },
  ];

  const universityTypes = [
    { name: 'Top Private Universities', query: 'Private' },
    { name: 'Government Universities', query: 'Government' },
    { name: 'Deemed Universities', query: 'Deemed' },
    { name: 'Colleges in Delhi NCR', query: 'Delhi' },
    { name: 'Colleges in Bangalore', query: 'Karnataka' },
    { name: 'Colleges in Pune & Mumbai', query: 'Maharashtra' },
  ];

  const navLinkClass = ({ isActive }) =>
    `font-semibold text-[14px] transition-colors py-1.5 px-2 flex items-center gap-1 ${
      isActive
        ? 'text-brand-royal font-bold'
        : 'text-slate-700 hover:text-brand-royal'
    }`;

  return (
    <>
      {/* Crystal Clear Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 bg-white/95 backdrop-blur-md ${
          isScrolled ? 'shadow-sm py-2.5 border-b border-slate-200' : 'border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Clean Brand Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <img
                src="/logo.png"
                alt="CaptonAdmission"
                className="w-10 h-10 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-slate-900">
                  Capton<span className="text-brand-royal">Admission</span>
                </span>
                <span className="text-[9px] tracking-widest uppercase text-slate-400 font-semibold -mt-1">
                  Education Discovery
                </span>
              </div>
            </Link>

            {/* Clean Center Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              {/* Colleges Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setUnisDropdownOpen(true)}
                onMouseLeave={() => setUnisDropdownOpen(false)}
              >
                <NavLink to="/universities" className={navLinkClass}>
                  <span>Colleges</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </NavLink>

                {unisDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-fadeIn">
                    <div className="px-4 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Explore Colleges
                      </p>
                    </div>
                    {universityTypes.map((t, idx) => (
                      <Link
                        key={idx}
                        to={`/universities?type=${encodeURIComponent(t.query)}`}
                        onClick={() => setUnisDropdownOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-royal block transition-colors"
                      >
                        {t.name}
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1.5 px-4">
                      <Link
                        to="/universities"
                        onClick={() => setUnisDropdownOpen(false)}
                        className="text-xs font-bold text-brand-royal hover:underline block py-1"
                      >
                        All 20+ Verified Universities &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Courses Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setCoursesDropdownOpen(true)}
                onMouseLeave={() => setCoursesDropdownOpen(false)}
              >
                <NavLink to="/courses" className={navLinkClass}>
                  <span>Courses</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </NavLink>

                {coursesDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-fadeIn">
                    <div className="px-4 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        Select Stream
                      </p>
                    </div>
                    {courseCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/courses?category=${cat.slug}`}
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="px-4 py-2 text-xs font-semibold text-slate-700 hover:bg-slate-50 hover:text-brand-royal flex items-center justify-between transition-colors"
                      >
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1.5 px-4">
                      <Link
                        to="/courses"
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="text-xs font-bold text-brand-royal hover:underline block py-1"
                      >
                        3-Panel Course Discovery &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/exams" className={navLinkClass}>
                Exams
              </NavLink>

              <NavLink to="/services" className={navLinkClass}>
                Services
              </NavLink>

              <NavLink to="/blogs" className={navLinkClass}>
                Blogs
              </NavLink>
            </nav>

            {/* Right Action Icons & Let's Connect CTA */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-600 hover:text-brand-royal hover:bg-slate-50 rounded-full transition-colors"
              >
                <Search className="w-3.5 h-3.5" />
                <span>Search</span>
              </button>

              {isAuthenticated && user ? (
                /* User Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-royal bg-white shadow-sm transition-all"
                  >
                    <div className="w-6 h-6 rounded-full bg-brand-royal text-white flex items-center justify-center font-bold text-[11px] uppercase">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 max-w-[85px] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3 h-3 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-52 bg-white rounded-2xl shadow-xl border border-slate-100 py-2 z-50 animate-fadeIn">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-slate-900">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                      </div>

                      {user.role === 'student' ? (
                        <Link
                          to="/student/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-brand-royal" />
                          Student Portal
                        </Link>
                      ) : (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-brand-royal" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-xs font-medium text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:text-brand-royal transition-colors"
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Student Login</span>
                </Link>
              )}

              {/* Crystal Clear Let's Connect CTA Button */}
              <button
                onClick={() => dispatch(openEnquiryModal({}))}
                className="bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs px-4 py-2 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <MessageCircle className="w-3.5 h-3.5 text-brand-gold" />
                Let's Connect
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-slate-600 hover:text-brand-royal"
              >
                <Search className="w-4 h-4" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-brand-royal rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {mobileMenuOpen && (
          <div className="lg:hidden border-t border-slate-100 bg-white px-4 pt-3 pb-6 space-y-2.5 animate-fadeIn">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-brand-royal"
            >
              Courses (3-Panel Discovery)
            </NavLink>
            <NavLink
              to="/universities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Colleges & Universities
            </NavLink>
            <NavLink
              to="/exams"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Entrance Exams
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Services
            </NavLink>
            <NavLink
              to="/blogs"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Blogs & Articles
            </NavLink>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {!isAuthenticated ? (
                <div className="flex items-center gap-2 mb-1">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 border border-brand-royal text-brand-royal font-bold rounded-xl text-xs"
                  >
                    Student Login
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex-1 text-center py-2 bg-brand-royal text-white font-bold rounded-xl text-xs"
                  >
                    Register
                  </Link>
                </div>
              ) : (
                <div className="flex items-center justify-between py-2 border-b border-slate-100 mb-1">
                  <span className="text-xs font-bold text-slate-800">{user?.name}</span>
                  <button
                    onClick={handleLogout}
                    className="text-xs text-red-600 font-bold hover:underline"
                  >
                    Sign Out
                  </button>
                </div>
              )}
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  dispatch(openEnquiryModal({}));
                }}
                className="w-full text-center py-2.5 bg-brand-gold text-brand-navy font-bold rounded-xl shadow-sm text-xs"
              >
                Let's Connect (Get Free Counselling)
              </button>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      {searchModalOpen && <GlobalSearchModal onClose={() => setSearchModalOpen(false)} />}
    </>
  );
};

export default Navbar;
