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
  GraduationCap,
  Building2,
  Compass,
  FileCheck,
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
      setIsScrolled(window.scrollY > 20);
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
    `font-medium text-[15px] transition-colors py-1 flex items-center gap-1 ${
      isActive
        ? 'text-brand-royal font-semibold border-b-2 border-brand-royal'
        : 'text-brand-darkText hover:text-brand-royal'
    }`;

  return (
    <>
      {/* Top Banner Bar */}
      <div className="bg-brand-navy text-white text-xs py-1.5 px-4 hidden md:block">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5 text-slate-200">
              <Phone className="w-3.5 h-3.5 text-brand-gold" />
              Admission Helpline: <strong className="text-white">+91 98765 43210</strong>
            </span>
            <span className="text-slate-300">|</span>
            <span className="text-slate-200">
              Free Guidance & University Discovery Portal 2026
            </span>
          </div>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSearchModalOpen(true)}
              className="text-slate-200 hover:text-brand-gold flex items-center gap-1 text-xs"
            >
              <Search className="w-3.5 h-3.5" /> Search Courses & Colleges
            </button>
            <Link to="/compare" className="text-slate-200 hover:text-brand-gold">
              Compare Universities
            </Link>
          </div>
        </div>
      </div>

      {/* Main Sticky Navbar */}
      <header
        className={`sticky top-0 z-40 transition-all duration-200 bg-white ${
          isScrolled ? 'shadow-md py-2.5' : 'border-b border-brand-border py-3.5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Brand Logo */}
            <Link to="/" className="flex items-center gap-3 group">
              <img
                src="/logo.png"
                alt="CaptonAdmission"
                className="w-11 h-11 object-contain rounded-full shadow-sm group-hover:scale-105 transition-transform"
              />
              <div className="flex flex-col">
                <span className="text-xl font-extrabold tracking-tight text-brand-navy">
                  Capton<span className="text-brand-gold">Admission</span>
                </span>
                <span className="text-[10px] tracking-wider uppercase text-slate-500 font-medium -mt-1">
                  Empowering Futures
                </span>
              </div>
            </Link>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center gap-7">
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
                  <ChevronDown className="w-4 h-4 text-slate-400 group-hover:text-brand-royal" />
                </NavLink>

                {coursesDropdownOpen && (
                  <div className="absolute top-full left-0 w-72 bg-white rounded-xl shadow-xl border border-brand-border py-2.5 z-50 animate-fadeIn">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        Explore by Stream
                      </p>
                    </div>
                    {courseCategories.map((cat) => (
                      <Link
                        key={cat.slug}
                        to={`/courses?category=${cat.slug}`}
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="px-3.5 py-2 text-sm text-brand-darkText hover:bg-brand-light hover:text-brand-royal flex items-center justify-between"
                      >
                        <span>{cat.name}</span>
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1.5 px-3.5">
                      <Link
                        to="/courses"
                        onClick={() => setCoursesDropdownOpen(false)}
                        className="text-xs font-semibold text-brand-royal hover:underline block py-1"
                      >
                        View 3-Panel Course Discovery &rarr;
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
                  <ChevronDown className="w-4 h-4 text-slate-400" />
                </NavLink>

                {unisDropdownOpen && (
                  <div className="absolute top-full left-0 w-64 bg-white rounded-xl shadow-xl border border-brand-border py-2.5 z-50">
                    <div className="px-3.5 py-1.5 border-b border-slate-100 mb-1">
                      <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                        University Directory
                      </p>
                    </div>
                    {universityTypes.map((t, idx) => (
                      <Link
                        key={idx}
                        to={`/universities?type=${encodeURIComponent(t.query)}`}
                        onClick={() => setUnisDropdownOpen(false)}
                        className="px-3.5 py-2 text-sm text-brand-darkText hover:bg-brand-light hover:text-brand-royal block"
                      >
                        {t.name}
                      </Link>
                    ))}
                    <div className="border-t border-slate-100 mt-1 pt-1.5 px-3.5">
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

            {/* Right Action Buttons */}
            <div className="hidden lg:flex items-center gap-3.5">
              <button
                onClick={() => setSearchModalOpen(true)}
                className="p-2 text-slate-500 hover:text-brand-royal hover:bg-slate-100 rounded-full transition-colors"
                title="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {isAuthenticated && user ? (
                /* Logged In User Dropdown */
                <div className="relative">
                  <button
                    onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                    className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full border border-slate-200 hover:border-brand-royal bg-white shadow-sm transition-all"
                  >
                    <div className="w-7 h-7 rounded-full bg-brand-royal text-white flex items-center justify-center font-bold text-xs uppercase">
                      {user.name ? user.name[0] : 'U'}
                    </div>
                    <span className="text-xs font-semibold text-brand-darkText max-w-[90px] truncate">
                      {user.name?.split(' ')[0]}
                    </span>
                    <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
                  </button>

                  {userDropdownOpen && (
                    <div className="absolute right-0 top-full mt-2 w-56 bg-white rounded-xl shadow-xl border border-brand-border py-2 z-50">
                      <div className="px-4 py-2 border-b border-slate-100">
                        <p className="text-xs font-bold text-brand-darkText">{user.name}</p>
                        <p className="text-[11px] text-slate-500 truncate">{user.email}</p>
                        <span className="inline-block mt-1 text-[10px] uppercase font-semibold px-2 py-0.5 rounded bg-blue-50 text-brand-royal">
                          {user.role}
                        </span>
                      </div>

                      {user.role === 'student' ? (
                        <Link
                          to="/student/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 text-sm text-brand-darkText hover:bg-brand-light flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-royal" />
                          Student Dashboard
                        </Link>
                      ) : (
                        <Link
                          to="/admin/dashboard"
                          onClick={() => setUserDropdownOpen(false)}
                          className="px-4 py-2 text-sm text-brand-darkText hover:bg-brand-light flex items-center gap-2"
                        >
                          <LayoutDashboard className="w-4 h-4 text-brand-royal" />
                          Admin Console
                        </Link>
                      )}

                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 flex items-center gap-2"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                /* Login / Register */
                <Link
                  to="/login"
                  className="text-sm font-semibold text-brand-royal hover:text-brand-navy px-3 py-2 rounded-lg transition-colors"
                >
                  Log In
                </Link>
              )}

              {/* Apply Now Primary CTA */}
              <button
                onClick={() => dispatch(openEnquiryModal({}))}
                className="bg-brand-gold hover:bg-brand-goldHover text-brand-navy font-bold text-sm px-4 py-2 rounded-lg shadow-sm hover:shadow transition-all flex items-center gap-1.5"
              >
                <FileCheck className="w-4 h-4" />
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
          <div className="lg:hidden border-t border-brand-border bg-white px-4 pt-3 pb-6 space-y-3 animate-fadeIn">
            <NavLink
              to="/"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-brand-darkText"
            >
              Home
            </NavLink>
            <NavLink
              to="/courses"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-brand-royal"
            >
              Courses (3-Panel Discovery)
            </NavLink>
            <NavLink
              to="/universities"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-brand-darkText"
            >
              Universities
            </NavLink>
            <NavLink
              to="/services"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-brand-darkText"
            >
              Services
            </NavLink>
            <NavLink
              to="/exams"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-brand-darkText"
            >
              Entrance Exams
            </NavLink>
            <NavLink
              to="/compare"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-brand-darkText"
            >
              Compare Universities
            </NavLink>
            <NavLink
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-brand-darkText"
            >
              About Us
            </NavLink>
            <NavLink
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-2 text-base font-semibold text-brand-darkText"
            >
              Contact Us
            </NavLink>

            <div className="pt-3 border-t border-slate-100 flex flex-col gap-2">
              {isAuthenticated && user ? (
                <>
                  <Link
                    to={user.role === 'student' ? '/student/dashboard' : '/admin/dashboard'}
                    onClick={() => setMobileMenuOpen(false)}
                    className="w-full text-center py-2.5 bg-brand-light text-brand-royal font-bold rounded-lg text-sm"
                  >
                    Go to {user.role === 'student' ? 'Student Dashboard' : 'Admin Console'}
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full text-center py-2 text-red-600 font-semibold text-sm"
                  >
                    Logout
                  </button>
                </>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <Link
                    to="/login"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 border border-brand-royal text-brand-royal font-bold rounded-lg text-sm"
                  >
                    Sign In
                  </Link>
                  <Link
                    to="/register"
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-center py-2.5 bg-brand-royal text-white font-bold rounded-lg text-sm"
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
                className="w-full text-center py-3 bg-brand-gold text-brand-navy font-bold rounded-lg shadow mt-1 text-sm"
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
