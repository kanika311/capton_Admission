import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { login, logout } from '../../redux/slices/authSlice';
import toast from 'react-hot-toast';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();
  const { loading, error } = useSelector((state) => state.auth);

  const from = location.state?.from?.pathname || '/student/dashboard';

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter both email and password');
      return;
    }

    const res = await dispatch(login({ email, password, portal: 'student' }));
    if (res.meta.requestStatus === 'fulfilled') {
      const user = res.payload.user;
      if (user?.role !== 'student') {
        dispatch(logout());
        toast.error('Access Denied: This login is for students only. Staff and Administrators must log in from the Admin Portal.');
        return;
      }
      toast.success(`Welcome back, ${user.name}`);
      navigate(from);
    } else {
      toast.error(res.payload || 'Login failed');
    }
  };

  return (
    <div className="min-h-screen bg-brand-light flex items-center justify-center py-16 px-4">
      <div className="bg-white rounded-3xl border border-brand-border shadow-2xl p-8 max-w-md w-full space-y-6">
        <div className="text-center">
          <Link to="/" className="inline-block mb-3">
            <img src="/logo.png" alt="CaptonAdmission" className="w-14 h-14 mx-auto rounded-full" />
          </Link>
          <h2 className="text-2xl font-extrabold text-brand-navy">Student Login</h2>
          <p className="text-xs text-slate-500 mt-1">
            Access your applications, shortlisted universities, and counselling requests.
          </p>
        </div>

        {error && (
          <div className="p-3 bg-red-50 border border-red-200 text-red-600 text-xs rounded-xl">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Student Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-royal focus:outline-none"
              />
            </div>
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-semibold text-slate-700">Password</label>
              <Link to="/forgot-password" className="text-[11px] text-brand-royal hover:underline font-semibold">
                Forgot password?
              </Link>
            </div>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-9 pr-3 py-2.5 text-xs border border-slate-300 rounded-xl focus:ring-2 focus:ring-brand-royal focus:outline-none"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-royal hover:bg-brand-navy text-white font-bold rounded-xl text-xs shadow transition-all flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Signing in...' : 'Sign In as Student'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="pt-2 text-center text-xs text-slate-500 border-t border-slate-100">
          Don't have an account yet?{' '}
          <Link to="/register" className="font-bold text-brand-royal hover:underline">
            Register for Free
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
