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
  Phone,
  FileCheck,
  Sparkles,
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
      setIsScrolled(window.scrollY > 15);
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
    { name: 'Management (BBA / MBA)', slug: 'management' },
    { name: 'Computer Applications (BCA / MCA)', slug: 'computer-applications' },
    { name: 'Medical & Dental (MBBS / BDS)', slug: 'medical' },
    { name: 'Law (BA LLB / LLB)', slug: 'law' },
    { name: 'Pharmacy (B.Pharm / D.Pharm)', slug: 'pharmacy' },
    { name: 'Design (B.Des / UI-UX)', slug: 'design' },
  ];

  const universityTypes = [
    { name: 'Government Universities', query: 'Government' },
    { name: 'Deemed to be Universities', query: 'Deemed' },
    { name: 'Top Private Universities', query: 'Private' },
    { name: 'Universities in Delhi NCR', query: 'Delhi' },
    { name: 'Universities in Bangalore', query: 'Karnataka' },
    { name: 'Universities in Pune / Mumbai', query: 'Maharashtra' },
  ];

  const navLinkClass = ({ isActive }) =>
    `font-medium text-[14px] transition-colors py-1 px-1 flex items-center gap-1 ${
      isActive
        ? 'text-brand-royal font-semibold'
        : 'text-slate-700 hover:text-brand-royal'
    }`;

  return (
    <>
      {/* Sleek Minimal Top Announcement Bar */}
      <div className="bg-slate-900 text-slate-300 text-[12px] py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-300">
              <Phone className="w-3 h-3 text-brand-gold" />
              Admission Helpline: <strong className="text-white font-medium">+91 98765 43210</strong>
            </span>
            <span className="text-slate-600">|</span>
            <span className="text-slate-300 flex items-center gap-1">
              <Sparkles className="w-3 h-3 text-brand-gold" />
              Verified University Discovery & Counselling Portal
            </span>
          </div>
          <div className="flex items-center gap-5">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="text-slate-300 hover:text-brand-gold flex items-center gap-1 text-[12px] transition-colors"
            >
              <Search className="w-3 h-3" /> Search
            </button>
            <Link to="/compare" className="text-slate-300 hover:text-brand-gold transition-colors">
              Compare
            </Link>
            <Link to="/about" className="text-slate-300 hover:text-brand-gold transition-colors">
              Why Us
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar - Ultra Clean */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 bg-white/95 backdrop-blur-md ${
          isScrolled ? 'shadow-sm py-2.5 border-b border-slate-200' : 'border-b border-slate-100 py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="CaptonAdmission"
                className="w-10 h-10 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl font-black tracking-tight text-brand-navy">
                  Capton<span className="text-brand-gold">Admission</span>
                </span>
                <span className="text-[9px] tracking-widest uppercase text-slate-400 font-semibold -mt-1">
                  Empowering Futures
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-6">
              <NavLink to="/" end className={navLinkClass}>
                Home
              </NavLink>

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
                        Explore by Stream
                      </p>
                    </div>
                    {courseCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/courses?category=${cat.slug}`}
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-royal flex items-center justify-between transition-colors"
                      >
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1.5 px-4">
                      <Link
                        to="/courses"
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="text-xs font-semibold text-brand-royal hover:underline block py-1"
                      >
                        Launch 3-Panel Discovery &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              {/* Universities Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => setUnisDropdownOpen(true)}
                onMouseLeave={() => setUnisDropdownOpen(false)}
              >
                <NavLink to="/universities" className={navLinkClass}>
                  <span>Universities</span>
                  <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                </NavLink>

                {unisDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-2xl shadow-xl border border-slate-100 py-2.5 z-50 animate-fadeIn">
                    <div className="px-4 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        University Directory
                      </p>
                    </div>
                    {universityTypes.map((t, idx) => (
                      <Link
                        key={idx}
                        to={`/universities?type=${encodeURIComponent(t.query)}`}
                        onClick={() => setUnisDropdownOpen(false)}
                        className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-brand-royal block transition-colors"
                      >
                        {t.name}
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1.5 px-4">
                      <Link
                        to="/universities"
                        onClick={() => setUnisDropdownOpen(false)}
                        className="text-xs font-semibold text-brand-royal hover:underline block py-1"
                      >
                        All 20+ Verified Universities &rarr;
                      </Link>
                    </div>
                  </div>
                )}
              </div>

              <NavLink to="/services" className={navLinkClass}>
                Services
              </NavLink>

              <NavLink to="/exams" className={navLinkClass}>
                Entrance Exams
              </NavLink>

              <NavLink to="/about" className={navLinkClass}>
                About Us
              </NavLink>

              <NavLink to="/contact" className={navLinkClass}>
                Contact
              </NavLink>
            </nav>

            {/* Right Actions */}
            <div className="hidden lg:flex items-center gap-3">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-slate-500 hover:text-brand-royal hover:bg-slate-50 rounded-full transition-colors"
                title="Search courses or colleges"
              >
                <Search className="w-4 h-4" />
              </button>

              {isAuthenticated && user ? (
                /* User Profile Dropdown */
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
                        <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-50 text-brand-royal">
                          {user.role}
                        </span>
                      </div>

                      {user.role === 'student' ? (
                        <Link
                          to="/student/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 text-xs font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-3.5 h-3.5 text-brand-royal" />
                          Student Dashboard
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
                  className="text-xs font-semibold text-slate-700 hover:text-brand-royal px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
              )}

              {/* Primary CTA */}
              <button
                onClick={() => dispatch(openEnquiryModal({}))}
                className="bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <FileCheck className="w-3.5 h-3.5 text-brand-gold" />
                Apply Now
              </button>
            </div>

            {/* Mobile Menu Toggle */}
            <div className="flex items-center gap-2 lg:hidden">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-slate-600 hover:text-brand-royal"
              >
                <Search className="w-5 h-5" />
              </button>

              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="p-2 text-slate-700 hover:text-brand-royal rounded-lg"
              >
                {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
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
              Universities
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Services
            </NavLink>
            <NavLink
              to="/exams"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Entrance Exams
            </NavLink>
            <NavLink
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Compare Universities
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-sm font-semibold text-slate-800"
            >
              Contact Us
            </NavLink>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-blue-50 text-brand-royal font-bold rounded-xl text-xs"
                  >
                    Go to {user.role === 'student' ? 'Student Dashboard' : 'Admin Console'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 text-red-600 font-semibold text-xs"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 border border-slate-200 text-slate-800 font-bold rounded-xl text-xs"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 bg-brand-royal text-white font-bold rounded-xl text-xs"
                  >
                    Register
                  </Link>
                </div>
              )}

              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  dispatch(openEnquiryModal({}));
                }}
                className="w-full text-center py-3 bg-brand-gold text-brand-navy font-bold rounded-xl shadow-sm mt-1 text-xs"
              >
                Apply Now / Free Counselling
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
