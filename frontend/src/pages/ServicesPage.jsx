import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { api } from '../services/api';
import {
  Scissors,
  Stethoscope,
  GraduationCap,
  Clock,
  Search,
  Filter,
  DollarSign,
  ArrowRight,
  Sparkles
} from 'lucide-react';

export const ServicesPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'All';
  const initialSearch = searchParams.get('search') || '';

  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [sortBy, setSortBy] = useState('featured');

  useEffect(() => {
    setSelectedCategory(searchParams.get('category') || 'All');
  }, [searchParams]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        if (searchQuery.trim()) {
          params.search = searchQuery.trim();
        }
        const res = await api.getServices(params);
        if (res.success) {
          setServices(res.services);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [selectedCategory, searchQuery]);

  const handleCategoryChange = (cat) => {
    setSelectedCategory(cat);
    setSearchParams(cat === 'All' ? {} : { category: cat });
  };

  const sortedServices = [...services].sort((a, b) => {
    if (sortBy === 'price-low') return a.price - b.price;
    if (sortBy === 'price-high') return b.price - a.price;
    if (sortBy === 'duration') return a.duration - b.duration;
    return 0;
  });

  const categories = [
    { name: 'All', icon: Sparkles, color: 'text-brand-600 bg-brand-50' },
    { name: 'Barber', icon: Scissors, color: 'text-amber-600 bg-amber-50' },
    { name: 'Clinic', icon: Stethoscope, color: 'text-emerald-600 bg-emerald-50' },
    { name: 'Private Tutor', icon: GraduationCap, color: 'text-purple-600 bg-purple-50' }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      {/* Page Header */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-xs font-bold tracking-wider uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
          Catalog & Pricing
        </span>
        <h1 className="text-3xl sm:text-4xl font-extrabold text-slate-900">
          Explore Available Services
        </h1>
        <p className="text-slate-600 text-sm">
          Select from our curated list of professional haircut styles, clinical checkups, or private tutoring courses.
        </p>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200/90 shadow-sm space-y-4">
        {/* Category Pills */}
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
                <Icon className={`w-4 h-4 ${isSelected ? 'text-white' : ''}`} />
                {cat.name}
              </button>
            );
          })}
        </div>

        {/* Search input & Sort */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-slate-100">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search services by keyword..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 text-xs bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <span className="text-xs text-slate-500 font-medium">Sort by:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-semibold focus:outline-none cursor-pointer"
            >
              <option value="featured">Featured First</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="duration">Shortest Duration</option>
            </select>
          </div>
        </div>
      </div>

      {/* Services Grid */}
      {loading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-3">
          <div className="w-10 h-10 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
          <p className="text-xs text-slate-500 font-medium">Loading database services...</p>
        </div>
      ) : sortedServices.length === 0 ? (
        <div className="py-16 text-center bg-white rounded-3xl border border-slate-200 p-8 space-y-4">
          <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto text-slate-400">
            <Filter className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">No Services Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No service matches your current filter or search criteria. Try choosing "All" or a different keyword.
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
          {sortedServices.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-48 overflow-hidden bg-slate-100">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-3 right-3 px-3 py-1 bg-white/95 backdrop-blur-xs text-sm font-extrabold text-slate-900 rounded-xl shadow-xs">
                    ${service.price}
                  </div>
                  <span
                    className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs ${
                      service.category === 'Barber'
                        ? 'bg-amber-600'
                        : service.category === 'Clinic'
                        ? 'bg-emerald-600'
                        : 'bg-purple-600'
                    }`}
                  >
                    {service.category}
                  </span>
                </div>

                <div className="p-5 space-y-3">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">
                    {service.name}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {service.description}
                  </p>

                  <div className="flex items-center justify-between text-xs text-slate-600 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-semibold text-slate-700">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {service.duration} mins
                    </span>
                    {service.providerId ? (
                      <span className="text-brand-600 font-semibold truncate max-w-[150px]">
                        {service.providerId.name}
                      </span>
                    ) : (
                      <span className="text-slate-400">Available across staff</span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/book?serviceId=${service._id}&category=${encodeURIComponent(
                    service.category
                  )}${service.providerId ? `&providerId=${service.providerId._id}` : ''}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-3 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-xs"
                >
                  Book This Service
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
