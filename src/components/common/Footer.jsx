import React from 'react';
import { Link } from 'react-router-dom';
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Twitter,
  Instagram,
  Linkedin,
  Youtube,
  ShieldCheck,
  Award,
  ArrowRight,
  Sparkles,
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-white text-slate-700 border-t border-slate-200 relative z-30 w-full block">
      {/* Top Value Banner */}
      <div className="border-b border-slate-200 bg-slate-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-brand-royal flex items-center justify-center shrink-0">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-900">100% UGC & AICTE Verified</h5>
                <p className="text-xs text-slate-500">Government accredited universities only</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-900">Zero Admission Brokerage</h5>
                <p className="text-xs text-slate-500">100% transparent fee structure & scholarships</p>
              </div>
            </div>

            <div className="flex items-center gap-4 p-4 rounded-2xl bg-white border border-slate-100 shadow-sm">
              <div className="w-12 h-12 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
                <Sparkles className="w-6 h-6" />
              </div>
              <div>
                <h5 className="font-bold text-sm text-slate-900">Expert Career Guidance</h5>
                <p className="text-xs text-slate-500">Free 1-on-1 personalized counselling sessions</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Links */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="inline-flex items-center gap-3">
              <img
                src="/logo.png"
                alt="CaptonAdmission"
                className="w-12 h-12 object-contain rounded-full shadow-sm"
              />
              <div className="flex flex-col">
                <span className="text-2xl font-black text-brand-navy tracking-tight">
                  Capton<span className="text-brand-gold">Admission</span>
                </span>
                <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                  Empowering Futures
                </span>
              </div>
            </Link>
            <p className="text-slate-600 text-sm leading-relaxed max-w-sm">
              CaptonAdmission is India’s premier higher education discovery platform. Helping students select verified courses, compare accredited universities, and achieve academic excellence.
            </p>
            <div className="pt-2 flex items-center gap-2.5">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Facebook"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-brand-royal hover:text-white text-slate-600 flex items-center justify-center transition-all"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Twitter"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-brand-royal hover:text-white text-slate-600 flex items-center justify-center transition-all"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-brand-royal hover:text-white text-slate-600 flex items-center justify-center transition-all"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-brand-royal hover:text-white text-slate-600 flex items-center justify-center transition-all"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                aria-label="YouTube"
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-brand-royal hover:text-white text-slate-600 flex items-center justify-center transition-all"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-royal pl-2">
              Explore Portal
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="text-slate-600 hover:text-brand-royal transition-colors">
                  3-Panel Course Discovery
                </Link>
              </li>
              <li>
                <Link to="/universities" className="text-slate-600 hover:text-brand-royal transition-colors">
                  Top Universities
                </Link>
              </li>
              <li>
                <Link to="/compare" className="text-slate-600 hover:text-brand-royal transition-colors">
                  Compare Colleges
                </Link>
              </li>
              <li>
                <Link to="/services" className="text-slate-600 hover:text-brand-royal transition-colors">
                  Admission Services
                </Link>
              </li>
              <li>
                <Link to="/exams" className="text-slate-600 hover:text-brand-royal transition-colors">
                  Entrance Exams 2026
                </Link>
              </li>
              <li>
                <Link to="/blogs" className="text-slate-600 hover:text-brand-royal transition-colors">
                  Latest Education News
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Streams */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-gold pl-2">
              Popular Degrees
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses?category=engineering" className="text-slate-600 hover:text-brand-royal transition-colors">
                  B.Tech Engineering
                </Link>
              </li>
              <li>
                <Link to="/courses?category=computer-applications" className="text-slate-600 hover:text-brand-royal transition-colors">
                  BCA & MCA Tech
                </Link>
              </li>
              <li>
                <Link to="/courses?category=management" className="text-slate-600 hover:text-brand-royal transition-colors">
                  MBA & BBA Programs
                </Link>
              </li>
              <li>
                <Link to="/courses?category=medical" className="text-slate-600 hover:text-brand-royal transition-colors">
                  MBBS & BDS Medical
                </Link>
              </li>
              <li>
                <Link to="/courses?category=law" className="text-slate-600 hover:text-brand-royal transition-colors">
                  BA LLB & Law
                </Link>
              </li>
              <li>
                <Link to="/courses?category=pharmacy" className="text-slate-600 hover:text-brand-royal transition-colors">
                  B.Pharmacy & Healthcare
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-slate-900 font-bold text-xs uppercase tracking-wider mb-4 border-l-2 border-brand-royal pl-2">
              Help & Contact
            </h4>
            <div className="space-y-3 text-sm text-slate-600">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-royal mt-1 shrink-0" />
                <span>CaptonAdmission Tower, Knowledge Park, New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-royal shrink-0" />
                <span className="font-semibold text-slate-800">+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-royal shrink-0" />
                <span>admissions@captonadmission.com</span>
              </div>
              <div className="pt-2">
                <span className="text-xs bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg font-medium inline-block border border-slate-200">
                  Counselling: 9 AM - 7 PM (Mon-Sat)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="mt-12 pt-6 border-t border-slate-200 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} CaptonAdmission Platform. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-brand-royal transition-colors">
              About Us
            </Link>
            <Link to="/contact" className="hover:text-brand-royal transition-colors">
              Contact Us
            </Link>
            <Link to="/login" className="hover:text-brand-royal transition-colors">
              Student Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
