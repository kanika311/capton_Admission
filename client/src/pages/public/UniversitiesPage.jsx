import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Search,
  Building2,
  MapPin,
  Star,
  Filter,
  CheckCircle,
  ArrowRight,
  Sparkles,
} from 'lucide-react';
import api from '../../services/api';

const UniversitiesPage = () => {
  const [searchParams] = useSearchParams();
  const [universities, setUniversities] = useState([]);
  const [loading, setLoading] = useState(true);

  // Filters state
  const [search, setSearch] = useState('');
  const [stateFilter, setStateFilter] = useState(searchParams.get('state') || 'All');
  const [typeFilter, setTypeFilter] = useState(searchParams.get('type') || 'All');
  const [sort, setSort] = useState('rating');

  const fetchUniversities = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (search) params.append('search', search);
      if (stateFilter && stateFilter !== 'All') params.append('state', stateFilter);
      if (typeFilter && typeFilter !== 'All') params.append('universityType', typeFilter);
      if (sort) params.append('sort', sort);

      const res = await api.get(`/universities?${params.toString()}`);
      setUniversities(res.data.data || []);
    } catch (err) {
      console.error('Error fetching universities:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUniversities();
  }, [stateFilter, typeFilter, sort]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    fetchUniversities();
  };

  const states = ['All', 'Delhi', 'Tamil Nadu', 'Karnataka', 'Maharashtra', 'Punjab', 'Uttar Pradesh', 'Rajasthan', 'Gujarat', 'Odisha'];
  const types = ['All', 'Government', 'Private', 'Deemed'];

  return (
    <div className="min-h-screen bg-brand-light pb-20">
      {/* Page Header Banner */}
      <div className="bg-brand-navy text-white py-12 px-4 border-b border-brand-border">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 text-xs text-brand-gold font-semibold uppercase tracking-wider mb-2">
              <Building2 className="w-4 h-4" />
              Verified College Directory
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight">
              Top Universities in India
            </h1>
            <p className="text-slate-300 text-sm mt-2 max-w-2xl leading-relaxed">
              Explore authentic NIRF ranked government and private institutions with verified fee structures, placements, and hostel facilities.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs bg-white/10 px-3.5 py-2 rounded-xl border border-white/20 text-slate-200">
              Showing <strong className="text-brand-gold font-bold">{universities.length}</strong> Universities
            </span>
          </div>
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6">
        <div className="bg-white p-4 rounded-2xl shadow-lg border border-brand-border grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
          {/* Search box */}
          <form onSubmit={handleSearchSubmit} className="md:col-span-5 flex items-center gap-2 px-3 py-2 bg-slate-50 border border-slate-200 rounded-xl focus-within:border-brand-royal">
            <Search className="w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search university by name or city..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-transparent text-xs focus:outline-none"
            />
            <button type="submit" className="text-xs font-bold text-brand-royal hover:underline shrink-0">
              Go
            </button>
          </form>

          {/* State filter */}
          <div className="md:col-span-3">
            <select
              value={stateFilter}
              onChange={(e) => setStateFilter(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
            >
              <option value="All">All States</option>
              {states.filter((s) => s !== 'All').map((st) => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>

          {/* Type filter */}
          <div className="md:col-span-2">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
            >
              <option value="All">All Types</option>
              {types.filter((t) => t !== 'All').map((tp) => (
                <option key={tp} value={tp}>{tp}</option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div className="md:col-span-2">
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="w-full p-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:outline-none font-medium"
            >
              <option value="rating">Top Rated</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {/* University Cards Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((n) => (
              <div key={n} className="animate-pulse bg-white h-72 rounded-2xl border border-slate-200"></div>
            ))}
          </div>
        ) : universities.length === 0 ? (
          <div className="bg-white rounded-2xl border border-brand-border p-12 text-center text-slate-400">
            <Building2 className="w-12 h-12 mx-auto mb-3 text-slate-300" />
            <h3 className="font-bold text-base text-slate-600">No Universities Found</h3>
            <p className="text-xs mt-1">Try resetting the filters or modifying your search keyword.</p>
            <button
              onClick={() => {
                setSearch('');
                setStateFilter('All');
                setTypeFilter('All');
              }}
              className="mt-4 px-4 py-2 bg-brand-royal text-white text-xs font-bold rounded-lg"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {universities.map((uni) => (
              <div
                key={uni._id}
                className="bg-white rounded-2xl border border-brand-border shadow-card hover:shadow-card-hover transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Cover Image */}
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={uni.coverImage || 'https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=600&h=300&fit=crop'}
                    alt={uni.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute top-3 left-3">
                    <span className="text-[10px] font-bold px-2.5 py-1 rounded-md bg-brand-navy/90 text-white backdrop-blur-sm">
                      {uni.universityType}
                    </span>
                  </div>
                  <div className="absolute top-3 right-3 flex items-center gap-1 bg-white/95 px-2 py-0.5 rounded-md text-xs font-bold text-amber-600 shadow-sm">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{uni.rating || 4.5}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-base text-brand-navy leading-snug line-clamp-1">
                      {uni.name}
                    </h3>
                    <p className="text-xs text-slate-500 flex items-center gap-1 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-brand-gold shrink-0" />
                      <span>{uni.location?.city}, {uni.location?.state}</span>
                    </p>

                    <p className="text-xs text-slate-600 mt-2.5 line-clamp-2 leading-relaxed">
                      {uni.about}
                    </p>

                    <div className="mt-3 flex flex-wrap gap-1.5">
                      {(uni.accreditation || []).slice(0, 3).map((acc, i) => (
                        <span key={i} className="text-[10px] font-semibold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                          {acc}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 grid grid-cols-2 gap-2 text-xs">
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Avg Package</span>
                      <strong className="text-emerald-700 font-bold">
                        {uni.placementOverview?.averagePackage || 'Verified'}
                      </strong>
                    </div>
                    <div>
                      <span className="text-slate-400 text-[10px] uppercase font-bold block">Highest Package</span>
                      <strong className="text-brand-navy font-bold">
                        {uni.placementOverview?.highestPackage || 'Verified'}
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Footer Link */}
                <div className="p-3.5 bg-slate-50 border-t border-brand-border">
                  <Link
                    to={`/universities/${uni.slug}`}
                    className="block w-full text-center py-2 bg-brand-royal hover:bg-brand-navy text-white text-xs font-bold rounded-lg transition-colors"
                  >
                    View University Profile &rarr;
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

export default UniversitiesPage;
