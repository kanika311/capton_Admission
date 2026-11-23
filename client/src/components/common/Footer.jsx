import React from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap,
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
} from 'lucide-react';

const Footer = () => {
  return (
    <footer className="bg-brand-navy text-slate-300 pt-16 pb-8 border-t-4 border-brand-gold">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 mb-12">
          {/* Brand Info */}
          <div className="lg:col-span-2">
            <Link to="/" className="flex items-center gap-3 mb-4">
              <img
                src="/logo.png"
                alt="CaptonAdmission"
                className="w-12 h-12 object-contain rounded-full bg-white p-0.5"
              />
              <span className="text-2xl font-extrabold text-white tracking-tight">
                Capton<span className="text-brand-gold">Admission</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-sm">
              India’s trusted higher education discovery and admission counselling platform. Helping students select verified courses, compare accredited universities, and achieve academic excellence.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="https://facebook.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-royal text-white flex items-center justify-center transition-colors"
              >
                <Facebook className="w-4 h-4" />
              </a>
              <a
                href="https://twitter.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-royal text-white flex items-center justify-center transition-colors"
              >
                <Twitter className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-royal text-white flex items-center justify-center transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-royal text-white flex items-center justify-center transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://youtube.com"
                target="_blank"
                rel="noreferrer"
                className="w-8 h-8 rounded-full bg-slate-800 hover:bg-brand-royal text-white flex items-center justify-center transition-colors"
              >
                <Youtube className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-gold pl-2.5">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses" className="hover:text-brand-gold transition-colors">
                  Three-Panel Discovery
                </Link>
              </li>
              <li>
                <Link to="/universities" className="hover:text-brand-gold transition-colors">
                  Universities Directory
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-brand-gold transition-colors">
                  Compare Universities
                </Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-gold transition-colors">
                  Admission Services
                </Link>
              </li>
              <li>
                <Link to="/exams" className="hover:text-brand-gold transition-colors">
                  Entrance Examinations
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-gold transition-colors">
                  About Our Mission
                </Link>
              </li>
            </ul>
          </div>

          {/* Popular Courses */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-gold pl-2.5">
              Popular Degrees
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/courses?category=engineering" className="hover:text-brand-gold transition-colors">
                  B.Tech Computer Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=engineering" className="hover:text-brand-gold transition-colors">
                  B.Tech AI & Data Science
                </Link>
              </li>
              <li>
                <Link to="/courses?category=management" className="hover:text-brand-gold transition-colors">
                  Master of Business (MBA)
                </Link>
              </li>
              <li>
                <Link to="/courses?category=computer-applications" className="hover:text-brand-gold transition-colors">
                  BCA Full Stack Dev
                </Link>
              </li>
              <li>
                <Link to="/courses?category=medical" className="hover:text-brand-gold transition-colors">
                  MBBS & Dental Programs
                </Link>
              </li>
              <li>
                <Link to="/courses?category=law" className="hover:text-brand-gold transition-colors">
                  5-Year BA LLB Integrated
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact Details */}
          <div>
            <h4 className="text-white font-bold text-sm uppercase tracking-wider mb-4 border-l-2 border-brand-gold pl-2.5">
              Contact & Helpline
            </h4>
            <div className="space-y-3 text-sm text-slate-300">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-brand-gold mt-1 shrink-0" />
                <span>CaptonAdmission Tower, Knowledge Park, New Delhi, India</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-brand-gold shrink-0" />
                <span>+91 98765 43210</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-brand-gold shrink-0" />
                <span>admissions@captonadmission.com</span>
              </div>
              <div className="pt-2">
                <span className="text-xs bg-slate-800 text-brand-gold px-2.5 py-1 rounded-md font-medium inline-block">
                  Counselling Hours: 9 AM - 7 PM (Mon-Sat)
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Line */}
        <div className="pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center text-xs text-slate-500 gap-4">
          <p>&copy; {new Date().getFullYear()} CaptonAdmission. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/privacy-policy" className="hover:text-slate-300">
              Privacy Policy
            </Link>
            <Link to="/terms-conditions" className="hover:text-slate-300">
              Terms & Conditions
            </Link>
            <Link to="/contact" className="hover:text-slate-300">
              Sitemap
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
