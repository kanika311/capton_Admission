import React from 'react';
import { Link } from 'react-router-dom';
import { Award, ShieldCheck, Users, CheckCircle2, Target, HeartHandshake, ArrowRight } from 'lucide-react';

const AboutPage = () => {
  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <div className="bg-brand-navy text-white py-14 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto text-center space-y-4">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
            About CaptonAdmission
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight">
            Empowering Higher Education Aspirations
          </h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            We bridge students with genuine higher education opportunities through transparent data, accredited university discovery, and personalized academic counselling.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-blue-100 text-brand-royal flex items-center justify-center mb-2">
              <Target className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Our Mission</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To democratize college admissions by providing every student across India with accessible, 100% verified academic metrics, genuine fee disclosures, and empathetic counselling mentorship.
            </p>
          </div>

          <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-card space-y-3">
            <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center mb-2">
              <Award className="w-6 h-6" />
            </div>
            <h3 className="text-xl font-bold text-brand-navy">Our Vision</h3>
            <p className="text-slate-600 text-sm leading-relaxed">
              To be India’s most trusted education ecosystem, where choosing a university is transparent, objective, and aligned with each student’s genuine career calling.
            </p>
          </div>
        </div>

        {/* Our Core Values */}
        <div className="bg-white p-8 rounded-2xl border border-brand-border shadow-card space-y-6">
          <h2 className="text-2xl font-bold text-brand-navy text-center">
            Our Core Principles
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="p-4 bg-brand-light rounded-xl border border-brand-border text-center space-y-2">
              <ShieldCheck className="w-8 h-8 text-brand-royal mx-auto" />
              <h4 className="font-bold text-sm text-brand-navy">Verified Information Only</h4>
              <p className="text-xs text-slate-500">
                Zero fabricated placements or fees. We only publish verified government and university disclosures.
              </p>
            </div>

            <div className="p-4 bg-brand-light rounded-xl border border-brand-border text-center space-y-2">
              <Users className="w-8 h-8 text-brand-gold mx-auto" />
              <h4 className="font-bold text-sm text-brand-navy">Student-First Mentorship</h4>
              <p className="text-xs text-slate-500">
                Our counsellors advocate for the student's true potential and family budget, not commercial quotas.
              </p>
            </div>

            <div className="p-4 bg-brand-light rounded-xl border border-brand-border text-center space-y-2">
              <HeartHandshake className="w-8 h-8 text-emerald-600 mx-auto" />
              <h4 className="font-bold text-sm text-brand-navy">End-to-End Support</h4>
              <p className="text-xs text-slate-500">
                From 10th/12th grade career confusion to campus hostel check-in, we stay by your side.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutPage;
