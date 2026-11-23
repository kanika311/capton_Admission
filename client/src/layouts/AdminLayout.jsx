import React, { useState } from 'react';
import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {
  LayoutDashboard,
  GraduationCap,
  Building2,
  GitMerge,
  FileText,
  Users,
  UserCheck,
  PhoneCall,
  Compass,
  MessageSquare,
  LogOut,
  Menu,
  X,
  ExternalLink,
  ShieldAlert,
  Video,
} from 'lucide-react';
import { logout } from '../redux/slices/authSlice';

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const navItems = [
    { label: 'Analytics Dashboard', to: '/admin/dashboard', icon: LayoutDashboard },
    { label: 'Hero Video & CMS', to: '/admin/cms', icon: Video },
    { label: 'Course Management', to: '/admin/courses', icon: GraduationCap },
    { label: 'University Directory', to: '/admin/universities', icon: Building2 },
    { label: 'Course-University Mapping', to: '/admin/mappings', icon: GitMerge },
    { label: 'Applications Management', to: '/admin/applications', icon: FileText },
    { label: 'Enquiries & Leads', to: '/admin/enquiries', icon: PhoneCall },
    { label: 'Student Directory', to: '/admin/students', icon: Users },
    { label: 'Counsellor Team', to: '/admin/counsellors', icon: UserCheck },
  ];

  return (
    <div className="min-h-screen bg-brand-light flex">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 z-40 bg-slate-900/50 lg:hidden"
        ></div>
      )}

      {/* Admin Sidebar */}
      <aside
        className={`fixed lg:sticky top-0 left-0 z-50 h-screen w-64 bg-slate-900 text-white flex flex-col justify-between transition-transform duration-200 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        <div>
          {/* Header */}
          <div className="p-5 border-b border-slate-800 flex items-center justify-between">
            <Link to="/admin/dashboard" className="flex items-center gap-2.5">
              <img
                src="/logo.png"
                alt="CaptonAdmission"
                className="w-9 h-9 rounded-full bg-white p-0.5"
              />
              <div>
                <span className="font-extrabold text-base tracking-tight text-white">
                  Capton<span className="text-brand-gold">Admission</span>
                </span>
                <span className="text-[10px] block uppercase text-brand-gold font-bold">
                  Admin Console
                </span>
              </div>
            </Link>

            <button
              onClick={() => setSidebarOpen(false)}
              className="p-1 rounded-lg text-slate-400 hover:text-white lg:hidden"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User badge */}
          <div className="p-4 mx-3 my-3 bg-slate-800/80 rounded-xl border border-slate-700/60 flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-royal text-white font-bold flex items-center justify-center uppercase text-xs">
              {user?.name ? user.name[0] : 'A'}
            </div>
            <div className="flex-1 truncate">
              <p className="text-xs font-bold text-white truncate">{user?.name || 'Admin'}</p>
              <span className="inline-block mt-0.5 text-[9px] uppercase font-bold px-2 py-0.5 rounded bg-blue-900/60 text-brand-gold">
                {user?.role || 'Staff'}
              </span>
            </div>
          </div>

          {/* Nav Links */}
          <nav className="px-3 space-y-1 mt-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <NavLink
                  key={item.to}
                  to={item.to}
                  end={item.to === '/admin/dashboard'}
                  onClick={() => setSidebarOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                      isActive
                        ? 'bg-brand-royal text-white font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800 hover:text-white'
                    }`
                  }
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </NavLink>
              );
            })}
          </nav>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-800 space-y-2">
          <Link
            to="/"
            className="flex items-center justify-between px-3 py-2 rounded-lg text-xs text-slate-300 hover:text-white hover:bg-slate-800"
          >
            <span>View Public Website</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </Link>

          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs font-bold text-red-400 hover:bg-red-500/10 transition-colors"
          >
            <LogOut className="w-4 h-4" />
            <span>Sign Out</span>
          </button>
        </div>
      </aside>

      {/* Main Container */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-16 bg-white border-b border-brand-border px-4 sm:px-6 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-600 hover:text-brand-royal lg:hidden"
            >
              <Menu className="w-6 h-6" />
            </button>
            <h1 className="text-base font-extrabold text-brand-navy">
              Administration & Admission Control
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full font-bold border border-emerald-200">
              Live System Active
            </span>
          </div>
        </header>

        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-[1600px] w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
