import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Clock, User, ArrowRight } from 'lucide-react';
import api from '../../services/api';

const BlogsPage = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const res = await api.get('/blogs');
        setBlogs(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <div className="bg-brand-navy text-white py-12 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto text-center space-y-3">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider bg-white/10 px-3 py-1 rounded-full border border-white/20">
            CaptonAdmission Editorial
          </span>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
            Education Insights & Admission Guides
          </h1>
          <p className="text-slate-300 text-sm max-w-xl mx-auto leading-relaxed">
            Expert analyses, engineering vs management roadmaps, and college fee disclosures.
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white h-72 rounded-2xl border border-slate-200"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {blogs.map((b) => (
              <div
                key={b._id}
                className="bg-white rounded-2xl border border-brand-border overflow-hidden shadow-card hover:shadow-card-hover transition-all flex flex-col justify-between"
              >
                <div className="h-44 overflow-hidden">
                  <img
                    src={b.featuredImage || 'https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?w=600&h=300&fit=crop'}
                    alt={b.title}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>

                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-brand-royal">
                      {b.category}
                    </span>
                    <h3 className="font-bold text-sm text-brand-navy mt-1 line-clamp-2 leading-snug">
                      {b.title}
                    </h3>
                    <p className="text-xs text-slate-500 mt-2 line-clamp-3">
                      {b.excerpt}
                    </p>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
                    <span>By {b.author || 'Editorial'}</span>
                    <Link to={`/blogs/${b.slug}`} className="font-bold text-brand-royal hover:underline">
                      Read Article &rarr;
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default BlogsPage;
