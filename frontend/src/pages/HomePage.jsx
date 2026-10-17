import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  Scissors,
  Stethoscope,
  GraduationCap,
  Sparkles,
  Calendar,
  Clock,
  ShieldCheck,
  Star,
  ArrowRight,
  CheckCircle2,
  Users,
  Search,
  ChevronRight
} from 'lucide-react';

export const HomePage = () => {
  const [providers, setProviders] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCat, setSelectedCat] = useState('All');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [pRes, sRes] = await Promise.all([
          api.getProviders({ limit: 6 }),
          api.getServices({ limit: 6 })
        ]);
        if (pRes.success) setProviders(pRes.providers.slice(0, 3));
        if (sRes.success) setServices(sRes.services.slice(0, 6));
      } catch (err) {
        console.error('Error fetching home data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleHeroSearch = (e) => {
    e.preventDefault();
    if (selectedCat !== 'All' && !searchQuery) {
      navigate(`/services?category=${encodeURIComponent(selectedCat)}`);
    } else if (searchQuery) {
      navigate(`/services?search=${encodeURIComponent(searchQuery)}&category=${encodeURIComponent(selectedCat)}`);
    } else {
      navigate('/services');
    }
  };

  return (
    <div className="space-y-20 pb-20">
      {/* HERO SECTION */}
      <section className="relative overflow-hidden pt-12 pb-20 lg:pt-20 lg:pb-28 bg-gradient-to-b from-brand-50/60 via-slate-50 to-white">
        {/* Background decorative blurs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-96 pointer-events-none opacity-40">
          <div className="absolute top-10 left-10 w-72 h-72 bg-blue-300 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-subtle"></div>
          <div className="absolute top-20 right-10 w-80 h-80 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl animate-pulse-subtle" style={{ animationDelay: '2s' }}></div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative">
          <div className="text-center max-w-3xl mx-auto space-y-6">
            {/* Pill */}
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-brand-200 shadow-xs text-xs font-bold text-brand-700">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              All-In-One Unified Booking Platform
            </div>

            {/* Title */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-950 tracking-tight leading-[1.15]">
              Book Your Appointment{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-brand-600 via-blue-600 to-indigo-600">
                Easily
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-lg sm:text-xl text-slate-600 font-normal leading-relaxed max-w-2xl mx-auto">
              Find the right barber, clinic, or private tutor and book your preferred time in just a few clicks. Real-time slot availability, instant confirmation, and zero double booking.
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-2">
              <Link
                to="/book"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-xl shadow-brand-600/30 hover:shadow-brand-600/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
              >
                <Sparkles className="w-5 h-5 text-amber-300" />
                Book Appointment
              </Link>
              <Link
                to="/services"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-7 py-4 rounded-2xl text-base font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs hover:border-slate-300 transition-all"
              >
                Explore Services
                <ArrowRight className="w-4 h-4 text-slate-400" />
              </Link>
            </div>

            {/* Interactive Hero Search Filter Card */}
            <form
              onSubmit={handleHeroSearch}
              className="mt-8 bg-white p-3 rounded-2xl shadow-xl shadow-slate-200/60 border border-slate-200 max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2"
            >
              <div className="flex-1 flex items-center gap-3 px-3 w-full">
                <Search className="w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="What service or doctor do you need?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-sm font-medium placeholder:text-slate-400 focus:outline-none"
                />
              </div>

              <div className="w-full sm:w-auto flex items-center gap-2">
                <select
                  value={selectedCat}
                  onChange={(e) => setSelectedCat(e.target.value)}
                  className="w-full sm:w-auto text-xs font-semibold text-slate-700 bg-slate-50 border border-slate-200 rounded-xl px-3 py-2.5 focus:outline-none cursor-pointer"
                >
                  <option value="All">All Categories</option>
                  <option value="Barber">Barber</option>
                  <option value="Clinic">Clinic</option>
                  <option value="Private Tutor">Private Tutor</option>
                </select>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-brand-600 hover:bg-brand-700 text-white rounded-xl text-xs font-bold transition-colors whitespace-nowrap shadow-sm"
                >
                  Search
                </button>
              </div>
            </form>
          </div>

          {/* Highlights Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto">
            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-blue-100 text-brand-600 flex items-center justify-center shrink-0">
                <Clock className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Real-Time Slots</p>
                <p className="text-xs text-slate-500">Instant validation</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-600 flex items-center justify-center shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Zero Overlaps</p>
                <p className="text-xs text-slate-500">Double-booking guard</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-600 flex items-center justify-center shrink-0">
                <Users className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Top Verified</p>
                <p className="text-xs text-slate-500">Barbers, doctors & tutors</p>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-xs p-4 rounded-2xl border border-slate-200/80 shadow-xs flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-600 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-900">Fast Confirmation</p>
                <p className="text-xs text-slate-500">Unique booking code</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3 CATEGORY CARDS SECTION (Section 3 Requirement) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-bold tracking-wider uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
            Specialized Categories
          </span>
          <h2 className="text-3xl font-extrabold text-slate-900">
            Choose Your Service Category
          </h2>
          <p className="text-slate-600 text-sm">
            Whether you need a fresh look, medical care, or personalized academic coaching, we have the right expert for you.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* BARBER CARD */}
          <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-brand-300 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1503951914875-452162b0f3f1?auto=format&fit=crop&w=700&q=80"
                alt="Barber"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-lg">
                  <Scissors className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Barber</h3>
                  <p className="text-xs text-amber-200 font-medium">Haircuts & Grooming</p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Professional haircuts, precision beard trims, hot towel shaves, and luxury gentleman grooming styling.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Haircut & Blowout Styling
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Royal Hot Towel Shaving
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                    Beard Sculpting & Conditioning
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/services?category=Barber"
                  className="flex-1 py-3 px-4 rounded-xl text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Explore Services
                </Link>
                <Link
                  to="/book?category=Barber"
                  className="py-3 px-5 rounded-xl text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 transition-colors shadow-sm"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* CLINIC CARD */}
          <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-emerald-300 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=700&q=80"
                alt="Clinic"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center shadow-lg">
                  <Stethoscope className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Clinic</h3>
                  <p className="text-xs text-emerald-200 font-medium">Healthcare & Consultation</p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Certified general practitioners, routine health checkups, dermatology, and diagnostic consultations.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Doctor Consultation & Diagnosis
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Comprehensive Routine Checkup
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                    Dermatology & Skin Assessment
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/services?category=Clinic"
                  className="flex-1 py-3 px-4 rounded-xl text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Explore Services
                </Link>
                <Link
                  to="/book?category=Clinic"
                  className="py-3 px-5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-700 transition-colors shadow-sm"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>

          {/* PRIVATE TUTOR CARD */}
          <div className="group bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl hover:border-purple-300 transition-all duration-300 overflow-hidden flex flex-col">
            <div className="relative h-48 overflow-hidden bg-slate-900">
              <img
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=700&q=80"
                alt="Private Tutor"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent"></div>
              <div className="absolute bottom-4 left-4 flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center shadow-lg">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-white">Private Tutor</h3>
                  <p className="text-xs text-purple-200 font-medium">Academics & Mentorship</p>
                </div>
              </div>
            </div>

            <div className="p-6 flex-1 flex flex-col justify-between space-y-6">
              <div className="space-y-3">
                <p className="text-sm text-slate-600 leading-relaxed">
                  Tailored one-on-one sessions in university mathematics, programming, academic English, and scientific problem-solving.
                </p>
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs font-semibold text-slate-700">
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Mathematics (Calculus & Algebra)
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    Web Development & Python DSA
                  </div>
                  <div className="flex items-center gap-2 text-slate-700">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-500"></span>
                    English Literature & IELTS Prep
                  </div>
                </div>
              </div>

              <div className="pt-2 flex items-center gap-3">
                <Link
                  to="/services?category=Private%20Tutor"
                  className="flex-1 py-3 px-4 rounded-xl text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 transition-colors"
                >
                  Explore Services
                </Link>
                <Link
                  to="/book?category=Private%20Tutor"
                  className="py-3 px-5 rounded-xl text-xs font-bold text-white bg-purple-600 hover:bg-purple-700 transition-colors shadow-sm"
                >
                  Book Now
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED SERVICES PREVIEW */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Popular Offerings
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Browse Top Services
            </h2>
          </div>
          <Link
            to="/services"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            View All 15 Services
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service) => (
            <div
              key={service._id}
              className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs hover:shadow-lg transition-all duration-200 flex flex-col justify-between"
            >
              <div>
                <div className="relative h-44 overflow-hidden">
                  <img
                    src={service.image}
                    alt={service.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-3 right-3 px-2.5 py-1 bg-white/95 backdrop-blur-xs text-xs font-bold text-slate-800 rounded-lg shadow-xs">
                    ${service.price}
                  </span>
                  <span className={`absolute bottom-3 left-3 px-2.5 py-1 rounded-lg text-xs font-bold text-white shadow-xs ${
                    service.category === 'Barber' ? 'bg-amber-600' :
                    service.category === 'Clinic' ? 'bg-emerald-600' : 'bg-purple-600'
                  }`}>
                    {service.category}
                  </span>
                </div>

                <div className="p-5 space-y-2">
                  <h3 className="text-lg font-bold text-slate-900 line-clamp-1">{service.name}</h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{service.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
                    <span className="flex items-center gap-1 font-medium">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      {service.duration} mins
                    </span>
                    {service.providerId && (
                      <span className="text-brand-600 font-semibold truncate max-w-[140px]">
                        By {service.providerId.name}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="p-5 pt-0">
                <Link
                  to={`/book?serviceId=${service._id}&category=${encodeURIComponent(service.category)}`}
                  className="w-full inline-flex items-center justify-center gap-2 py-2.5 rounded-xl text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 transition-colors shadow-xs"
                >
                  Book Service
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* HOW THE BOOKING SYSTEM WORKS (Process flow) */}
      <section className="bg-slate-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
            <span className="text-xs font-bold tracking-widest uppercase text-brand-400 bg-brand-950/60 border border-brand-800/80 px-3 py-1 rounded-full">
              Seamless 5-Step Process
            </span>
            <h2 className="text-3xl font-extrabold text-white">
              How The Booking Engine Works
            </h2>
            <p className="text-slate-400 text-sm">
              Strictly engineered with database validation to prevent overlapping appointments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
            <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                1
              </span>
              <h4 className="font-bold text-white text-base mb-1">Pick Category</h4>
              <p className="text-xs text-slate-400">Barber, Clinic, or Private Tutor.</p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                2
              </span>
              <h4 className="font-bold text-white text-base mb-1">Choose Provider</h4>
              <p className="text-xs text-slate-400">View specialties, bios, and ratings.</p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                3
              </span>
              <h4 className="font-bold text-white text-base mb-1">Select Service</h4>
              <p className="text-xs text-slate-400">Transparent duration and pricing.</p>
            </div>

            <div className="bg-slate-800/70 border border-slate-700 p-5 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-brand-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                4
              </span>
              <h4 className="font-bold text-white text-base mb-1">Live Date & Slot</h4>
              <p className="text-xs text-slate-400">Real-time availability checked from DB.</p>
            </div>

            <div className="bg-slate-800/70 border border-brand-500/50 p-5 rounded-2xl relative">
              <span className="w-8 h-8 rounded-lg bg-emerald-600 text-white font-bold text-sm flex items-center justify-center mb-4">
                5
              </span>
              <h4 className="font-bold text-emerald-400 text-base mb-1">Instant Code</h4>
              <p className="text-xs text-slate-300">Confirmed booking with unique reference.</p>
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PROVIDERS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 gap-4">
          <div>
            <span className="text-xs font-bold tracking-wider uppercase text-brand-600 bg-brand-50 px-3 py-1 rounded-full border border-brand-200">
              Expert Staff
            </span>
            <h2 className="text-3xl font-extrabold text-slate-900 mt-2">
              Meet Our Service Providers
            </h2>
          </div>
          <Link
            to="/providers"
            className="inline-flex items-center gap-1.5 text-sm font-bold text-brand-600 hover:text-brand-700"
          >
            View All Providers
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {providers.map((provider) => (
            <div
              key={provider._id}
              className="bg-white rounded-3xl border border-slate-200/80 p-6 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <img
                    src={provider.image}
                    alt={provider.name}
                    className="w-16 h-16 rounded-2xl object-cover border-2 border-slate-100 shadow-xs"
                  />
                  <div>
                    <span className="text-[11px] font-bold uppercase tracking-wider text-brand-600">
                      {provider.category}
                    </span>
                    <h3 className="text-lg font-bold text-slate-900">{provider.name}</h3>
                    <div className="flex items-center gap-1 text-xs text-amber-500 font-bold">
                      <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      <span>{provider.rating.toFixed(1)}</span>
                      <span className="text-slate-400 font-normal">({provider.reviewsCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <p className="text-xs font-semibold text-slate-700">{provider.specialty}</p>
                <p className="text-xs text-slate-500 line-clamp-3 leading-relaxed">{provider.description}</p>
                
                <div className="text-xs text-slate-500 flex items-center gap-2 pt-2 border-t border-slate-100">
                  <span className="font-semibold text-slate-700">Hours:</span>
                  <span>{provider.workingHours?.start} - {provider.workingHours?.end}</span>
                </div>
              </div>

              <div className="pt-6 flex items-center gap-3">
                <Link
                  to={`/providers/${provider._id}`}
                  className="flex-1 py-2.5 text-center text-xs font-bold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors"
                >
                  View Profile
                </Link>
                <Link
                  to={`/book?providerId=${provider._id}&category=${encodeURIComponent(provider.category)}`}
                  className="py-2.5 px-4 text-xs font-bold text-white bg-brand-600 hover:bg-brand-700 rounded-xl transition-colors shadow-xs"
                >
                  Book Appointment
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};
