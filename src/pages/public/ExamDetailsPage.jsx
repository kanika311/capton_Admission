import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, CheckCircle2, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const ExamDetailsPage = () => {
  const { slug } = useParams();
  const [exam, setExam] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/exams/slug/${slug}`);
        setExam(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-royal"></div>
      </div>
    );
  }

  if (!exam) {
    return (
      <div className="min-h-screen py-24 text-center">
        <h2 className="text-xl font-bold text-brand-navy">Exam Not Found</h2>
        <Link to="/exams" className="mt-4 inline-block text-brand-royal underline">
          &larr; Back to Exams
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <div className="bg-brand-navy text-white py-12 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold px-2.5 py-0.5 rounded-full bg-brand-gold text-brand-navy">
              {exam.stream}
            </span>
            <span className="text-xs text-slate-300">
              {exam.conductingBody}
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            {exam.name}
          </h1>
          <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
            {exam.overview}
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8 space-y-8">
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-4">
              <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3">
                Exam Overview & Scope
              </h2>
              <p className="text-slate-600 text-sm leading-relaxed">
                {exam.overview}
              </p>

              <div className="pt-2">
                <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Eligibility
                </span>
                <p className="text-sm font-semibold text-brand-darkText">
                  {exam.eligibility}
                </p>
              </div>
            </div>

            {/* Exam Pattern */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-4">
              <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3">
                Exam Pattern
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div className="p-4 bg-brand-light rounded-xl border border-brand-border">
                  <span className="text-slate-400 block mb-1 font-semibold">Test Mode</span>
                  <strong className="text-sm text-brand-navy">{exam.examPattern?.mode || 'Computer Based'}</strong>
                </div>
                <div className="p-4 bg-brand-light rounded-xl border border-brand-border">
                  <span className="text-slate-400 block mb-1 font-semibold">Duration</span>
                  <strong className="text-sm text-brand-navy">{exam.examPattern?.duration || '3 Hours'}</strong>
                </div>
                <div className="p-4 bg-brand-light rounded-xl border border-brand-border">
                  <span className="text-slate-400 block mb-1 font-semibold">Total Questions</span>
                  <strong className="text-sm text-brand-navy">{exam.examPattern?.totalQuestions}</strong>
                </div>
                <div className="p-4 bg-brand-light rounded-xl border border-brand-border">
                  <span className="text-slate-400 block mb-1 font-semibold">Marking Scheme</span>
                  <strong className="text-sm text-emerald-700">{exam.examPattern?.markingScheme}</strong>
                </div>
              </div>
            </div>

            {/* Participating Universities */}
            {exam.participatingUniversities && exam.participatingUniversities.length > 0 && (
              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-brand-border shadow-card space-y-4">
                <h2 className="text-xl font-bold text-brand-navy border-b border-slate-100 pb-3">
                  Key Participating Colleges
                </h2>
                <div className="flex flex-wrap gap-2">
                  {exam.participatingUniversities.map((uni, i) => (
                    <span key={i} className="px-3 py-1.5 rounded-lg bg-blue-50 text-brand-royal font-semibold text-xs border border-blue-200">
                      {uni}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-4 space-y-6">
            {/* Important Dates */}
            <div className="bg-white p-6 rounded-2xl border border-brand-border shadow-card space-y-4">
              <h3 className="font-bold text-base text-brand-navy border-b border-slate-100 pb-2 flex items-center gap-2">
                <Calendar className="w-4 h-4 text-brand-royal" />
                Important Schedules
              </h3>
              <div className="space-y-3">
                {(exam.importantDates || []).map((date, i) => (
                  <div key={i} className="p-3 bg-brand-light rounded-xl border border-brand-border text-xs">
                    <span className="font-bold text-brand-navy block">{date.title}</span>
                    <span className="text-brand-royal font-semibold text-[11px]">{date.date}</span>
                    {date.description && <p className="text-slate-500 text-[10px] mt-0.5">{date.description}</p>}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ExamDetailsPage;
