import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, User, Calendar } from 'lucide-react';
import api from '../../services/api';

const BlogDetailsPage = () => {
  const { slug } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      try {
        setLoading(true);
        const res = await api.get(`/blogs/slug/${slug}`);
        setBlog(res.data.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-brand-light">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-royal"></div>
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen py-24 text-center">
        <h2 className="text-xl font-bold text-brand-navy">Article Not Found</h2>
        <Link to="/blogs" className="mt-4 inline-block text-brand-royal underline">
          &larr; Back to Articles
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      <div className="bg-brand-navy text-white py-12 px-4 border-b border-brand-border">
        <div className="max-w-4xl mx-auto space-y-3">
          <span className="text-xs font-bold text-brand-gold uppercase tracking-wider">
            {blog.category}
          </span>
          <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
            {blog.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-slate-300">
            <span>By {blog.author}</span>
            <span>&bull;</span>
            <span>{new Date(blog.createdAt).toLocaleDateString()}</span>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 mt-8">
        <div className="bg-white p-6 sm:p-10 rounded-2xl border border-brand-border shadow-card space-y-6">
          {blog.featuredImage && (
            <img
              src={blog.featuredImage}
              alt={blog.title}
              className="w-full h-80 object-cover rounded-xl"
            />
          )}

          <div className="text-slate-700 text-sm sm:text-base leading-relaxed space-y-4 whitespace-pre-line">
            {blog.content}
          </div>

          {blog.tags && blog.tags.length > 0 && (
            <div className="pt-6 border-t border-slate-100 flex flex-wrap gap-2">
              {blog.tags.map((tag, i) => (
                <span key={i} className="text-xs bg-slate-100 px-3 py-1 rounded-full text-slate-600 font-medium">
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BlogDetailsPage;
