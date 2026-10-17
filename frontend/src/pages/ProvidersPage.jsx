import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Scissors,
  Stethoscope,
  GraduationCap,
  Star,
  MapPin,
  Clock,
  Search,
  Filter,
  Sparkles,
  ArrowRight,
  ShieldCheck
} from 'lucide-react';

export const ProvidersPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [providers, setProviders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    const fetchProviders = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        const res = await api.getProviders(params);
        if (res.success) {
          setProviders(res.providers);
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchProviders();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  const categories = [
    { name: 'All', icon: Sparkles },
    { name: 'Barber', icon: Scissors },
    { name: 'Clinic', icon: Stethoscope },
    { name: 'Private Tutor', icon: GraduationCap }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-wider uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Professional Team
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Available Service Providers
        </h1>
        <p className="text-slate-600 text-sm">
          Connect with top-rated barbers, experienced medical doctors, and certified university tutors ready for bookings.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        {/* Category Filter */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((cat) => {
            const Icon = cat.icon;
            const isSelected = selectedCategory === cat.name;
            return (
              <button
                key={cat.name}
                onClick={() => handleCategoryChange(cat.name)}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  isSelected
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                <Icon className="w-4 h-4" />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search */}
        <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
          <div className="relative w-full sm:w-96">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by provider name, specialty, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="hidden sm:block text-xs font-semibold text-slate-500">
            Showing {providers.length} registered specialists
          </div>
        </div>
      </div>

      {/* Providers Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading providers...</p>
        </div>
      ) : providers.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Providers Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No professional matches your query. Try broadening your search or resetting category filters.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 bg-brand-600 text-white rounded-xl text-xs font-bold hover:bg-brand-700"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {providers.map((p) => (
            <div
              key={p._id}
              className="bg-white rounded-3xl border border-slate-200/90 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between group"
            >
              <div className="space-y-4">
                {/* Header card info */}
                <div className="flex items-start gap-4">
                  <div className="relative">
                    <img
                      src={p.image}
                      alt={p.name}
                      className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                    />
                    <span
                      className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${
                        p.category === 'Barber'
                          ? 'bg-amber-500'
                          : p.category === 'Clinic'
                          ? 'bg-emerald-500'
                          : 'bg-purple-500'
                      }`}
                    ></span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                        {p.category}
                      </span>
                      <div className="flex items-center gap-1 text-xs text-amber-500 font-bold bg-amber-50 px-2 py-0.5 rounded-md">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span>{p.rating.toFixed(1)}</span>
                      </div>
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 truncate mt-0.5">
                      {p.name}
                    </h3>
                    <p className="text-xs text-slate-500 font-medium truncate">
                      {p.experience}
                    </p>
                  </div>
                </div>

                {/* Specialty */}
                <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <p className="text-xs font-semibold text-slate-800 leading-snug">
                    {p.specialty}
                  </p>
                </div>

                {/* Bio */}
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {p.description}
                </p>

                {/* Location & Hours */}
                <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-500">
                  <div className="flex items-center gap-2 truncate">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">{p.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span>
                      {p.workingHours?.start} - {p.workingHours?.end}
                    </span>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="pt-6 flex items-center gap-3">
                <Link
                  to={`/providers/${p._id}`}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  to={`/book?providerId=${p._id}&category=${encodeURIComponent(p.category)}`}
                  className="py-2.5 px-4 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-xs"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
