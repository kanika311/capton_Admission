import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, GraduationCap, Building2, BookOpen } from 'lucide-react';
import api from '../../services/api';

const GlobalSearchModal = ({ onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState({ courses: [], universities: [], exams: [] });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!query.trim()) {
      setResults({ courses: [], universities: [], exams: [] });
      return;
    }

    const timer = setTimeout(async () => {
      try {
        setLoading(true);
        const res = await api.get(`/search?q=${encodeURIComponent(query)}`);
        setResults(res.data.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [query]);

  const handleSelectCourse = (slug) => {
    onClose();
    navigate(`/courses/${slug}`);
  };

  const handleSelectUni = (slug) => {
    onClose();
    navigate(`/universities/${slug}`);
  };

  const handleSelectExam = (slug) => {
    onClose();
    navigate(`/exams/${slug}`);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-sm flex items-start justify-center pt-20 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-brand-border overflow-hidden">
        {/* Search Input */}
        <div className="p-4 border-b border-brand-border flex items-center gap-3">
          <Search className="w-5 h-5 text-slate-400" />
          <input
            type="text"
            autoFocus
            placeholder="Search courses (B.Tech, MBA...), universities, exams..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full text-base text-brand-darkText focus:outline-none"
          />
          <button onClick={onClose} className="p-1 rounded-full text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Results Area */}
        <div className="p-4 max-h-[60vh] overflow-y-auto space-y-4">
          {loading && <p className="text-xs text-slate-400 text-center py-4">Searching...</p>}

          {!loading && !query && (
            <p className="text-xs text-slate-400 text-center py-6">
              Start typing to search courses, top colleges, or entrance exams...
            </p>
          )}

          {!loading && query && results.courses.length === 0 && results.universities.length === 0 && results.exams.length === 0 && (
            <p className="text-sm text-slate-500 text-center py-6">
              No matching results found for "{query}".
            </p>
          )}

          {/* Courses */}
          {results.courses.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <GraduationCap className="w-3.5 h-3.5 text-brand-royal" /> Courses
              </p>
              <div className="space-y-1">
                {results.courses.map((c) => (
                  <button
                    key={c._id}
                    onClick={() => handleSelectCourse(c.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-light flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-brand-darkText">{c.name}</span>
                    <span className="text-xs text-slate-400">{c.level} &bull; {c.duration}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Universities */}
          {results.universities.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-brand-gold" /> Universities
              </p>
              <div className="space-y-1">
                {results.universities.map((u) => (
                  <button
                    key={u._id}
                    onClick={() => handleSelectUni(u.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-light flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-brand-darkText">{u.name}</span>
                    <span className="text-xs text-slate-400">{u.location?.city}, {u.location?.state}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Exams */}
          {results.exams.length > 0 && (
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <BookOpen className="w-3.5 h-3.5 text-emerald-600" /> Entrance Exams
              </p>
              <div className="space-y-1">
                {results.exams.map((ex) => (
                  <button
                    key={ex._id}
                    onClick={() => handleSelectExam(ex.slug)}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-brand-light flex items-center justify-between text-sm"
                  >
                    <span className="font-medium text-brand-darkText">{ex.name}</span>
                    <span className="text-xs text-slate-400">{ex.stream}</span>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GlobalSearchModal;
