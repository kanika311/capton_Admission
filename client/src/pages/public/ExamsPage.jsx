import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Calendar, Clock, CheckCircle, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const ExamsPage = () => {
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);
  const [streamFilter, setStreamFilter] = useState('All');

  useEffect(() => {
    const fetchExams = async () => {
      try {
        setLoading(true);
        const params = new URLSearchParams();
        if (streamFilter !== 'All') params.append('stream', streamFilter);
        const res = await api.get(`/exams?${params.toString()}`);
        setExams(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [streamFilter]);

  const streams = ['All', 'Engineering', 'Medical', 'Management', 'Law', 'Design', 'Pharmacy'];

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <div className="bg-brand-navy text-white py-12 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
            Admissions Benchmarks
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Top Entrance Examinations in India
          </h1>
          <p className="text-slate-300 text-sm max-w-2xl mx-auto leading-relaxed">
            Verified schedules, eligibility guidelines, computer-based exam formats, and participating universities.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {/* Stream Pills */}
        <div className="flex items-center justify-center gap-2 flex-wrap mb-10">
          {streams.map((s) => (
            <button
              key={s}
              onClick={() => setStreamFilter(s)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                streamFilter === s
                  ? 'bg-brand-royal text-white shadow'
                  : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white h-52 rounded-2xl border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {exams.map((exam) => (
              <div
                key={exam._id}
                className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-all p-6 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-emerald-50 text-emerald-700">
                      {exam.stream}
                    </span>
                    <span className="text-xs text-slate-400 font-medium">
                      {exam.examLevel}
                    </span>
                  </div>

                  <h3 className="font-bold text-base text-brand-navy">
                    {exam.name}
                  </h3>

                  <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {exam.overview}
                  </p>

                  <div className="mt-4 p-3 bg-brand-light rounded-xl border border-slate-100 text-xs space-y-1">
                    <p className="text-slate-600">
                      <strong>Conducted By:</strong> {exam.conductingBody || 'National Agency'}
                    </p>
                    <p className="text-slate-600">
                      <strong>Mode:</strong> {exam.examPattern?.mode || 'Computer Based Test'}
                    </p>
                  </div>
                </div>

                <div className="mt-5 pt-3 border-t border-slate-100">
                  <Link
                    to={`/exams/${exam.slug}`}
                    className="block text-center py-2 bg-brand-royal hover:bg-brand-navy text-white font-bold text-xs rounded-lg transition-colors"
                  >
                    View Exam Pattern & Syllabus &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ExamsPage;
