import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { api } from '../services/api';
import { useAuth } from '../context/AuthContext';
import {
  Calendar as CalendarIcon,
  Clock,
  User,
  Scissors,
  Stethoscope,
  GraduationCap,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  ArrowLeft,
  Video,
  Phone,
  Building,
  Star,
  ChevronLeft,
  ChevronRight,
  Info,
  DollarSign
} from 'lucide-react';

export const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  // URL Query pre-selections
  const initialProviderId = searchParams.get('providerId') || '';
  const initialServiceId = searchParams.get('serviceId') || '';
  const initialCategory = searchParams.get('category') || 'All';

  // State
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [providers, setProviders] = useState([]);
  const [selectedProvider, setSelectedProvider] = useState(null);
  const [services, setServices] = useState([]);
  const [selectedService, setSelectedService] = useState(null);

  // Date selection (defaults to today's ISO date string)
  const getTodayString = () => {
    const today = new Date();
    return today.toISOString().split('T')[0];
  };

  const [selectedDate, setSelectedDate] = useState(getTodayString());
  const [availableSlots, setAvailableSlots] = useState([]);
  const [selectedTime, setSelectedTime] = useState('');
  const [appointmentType, setAppointmentType] = useState('In Person');
  const [notes, setNotes] = useState('');

  // Status & loaders
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [bookingError, setBookingError] = useState('');

  // 1. Fetch Providers when category changes
  useEffect(() => {
    const fetchProviders = async () => {
      setLoadingProviders(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All') {
          params.category = selectedCategory;
        }
        const res = await api.getProviders(params);
        if (res.success) {
          setProviders(res.providers);

          // If there's an initialProviderId, select it
          if (initialProviderId) {
            const found = res.providers.find((p) => p._id === initialProviderId);
            if (found) setSelectedProvider(found);
          }
        }
      } catch (err) {
        console.error('Error fetching providers:', err);
      } finally {
        setLoadingProviders(false);
      }
    };

    fetchProviders();
  }, [selectedCategory, initialProviderId]);

  // 2. Fetch Services when Provider changes
  useEffect(() => {
    if (!selectedProvider) {
      setServices([]);
      setSelectedService(null);
      return;
    }

    const fetchServices = async () => {
      setLoadingServices(true);
      try {
        const res = await api.getServices({ providerId: selectedProvider._id });
        if (res.success) {
          setServices(res.services);

          // Check if initialServiceId matches
          if (initialServiceId) {
            const found = res.services.find((s) => s._id === initialServiceId);
            if (found) setSelectedService(found);
            else if (res.services.length > 0) setSelectedService(res.services[0]);
          } else if (res.services.length > 0) {
            setSelectedService(res.services[0]);
          }
        }
      } catch (err) {
        console.error('Error fetching services:', err);
      } finally {
        setLoadingServices(false);
      }
    };

    fetchServices();
  }, [selectedProvider, initialServiceId]);

  // 3. Fetch Available Slots when Provider or Date changes
  useEffect(() => {
    if (!selectedProvider || !selectedDate) {
      setAvailableSlots([]);
      setSelectedTime('');
      return;
    }

    const fetchSlots = async () => {
      setLoadingSlots(true);
      setBookingError('');
      setSelectedTime('');
      try {
        const res = await api.getAvailableSlots(selectedProvider._id, selectedDate);
        if (res.success && res.slots) {
          setAvailableSlots(res.slots);
        }
      } catch (err) {
        console.error('Error fetching slots:', err);
      } finally {
        setLoadingSlots(false);
      }
    };

    fetchSlots();
  }, [selectedProvider, selectedDate]);

  // Handle Provider Selection
  const handleSelectProvider = (prov) => {
    setSelectedProvider(prov);
    setSelectedCategory(prov.category);
    setSelectedService(null);
    setSelectedTime('');
    setBookingError('');
  };

  // Quick 7-Day Date Picker Generator
  const generateUpcomingDays = () => {
    const days = [];
    const base = new Date();
    for (let i = 0; i < 14; i++) {
      const d = new Date(base);
      d.setDate(base.getDate() + i);
      const iso = d.toISOString().split('T')[0];
      const dayName = d.toLocaleDateString('en-US', { weekday: 'short' });
      const dayNum = d.getDate();
      const monthName = d.toLocaleDateString('en-US', { month: 'short' });
      days.push({ iso, dayName, dayNum, monthName });
    }
    return days;
  };

  const upcomingDays = generateUpcomingDays();

  // Booking Confirmation Handler
  const handleConfirmBooking = async () => {
    setBookingError('');

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/book' } } });
      return;
    }

    if (!selectedProvider) {
      setBookingError('Please choose a service provider.');
      return;
    }

    if (!selectedService) {
      setBookingError('Please select a service.');
      return;
    }

    if (!selectedDate) {
      setBookingError('Please pick an appointment date.');
      return;
    }

    if (!selectedTime) {
      setBookingError('Please choose an available time slot.');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        providerId: selectedProvider._id,
        serviceId: selectedService._id,
        date: selectedDate,
        time: selectedTime,
        appointmentType,
        notes: notes.trim()
      };

      const res = await api.createBooking(payload);
      if (res.success && res.booking) {
        navigate(`/confirmation/${res.booking._id}`, { state: { booking: res.booking } });
      } else {
        setBookingError(res.message || 'Unable to complete appointment reservation.');
      }
    } catch (err) {
      console.error('Booking failed:', err);
      setBookingError(err.message || 'Double booking conflict: this slot was just taken. Please pick another.');
      // Refresh slots
      if (selectedProvider && selectedDate) {
        api.getAvailableSlots(selectedProvider._id, selectedDate).then((res) => {
          if (res.success) setAvailableSlots(res.slots);
        });
      }
    } finally {
      setSubmitting(false);
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'Barber':
        return <Scissors className="w-4 h-4 text-amber-500" />;
      case 'Clinic':
        return <Stethoscope className="w-4 h-4 text-emerald-500" />;
      case 'Private Tutor':
        return <GraduationCap className="w-4 h-4 text-purple-500" />;
      default:
        return <Sparkles className="w-4 h-4 text-brand-500" />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50/60 pb-24">
      {/* Header Banner */}
      <div className="bg-gradient-to-r from-brand-900 via-brand-800 to-navy-900 text-white py-10 px-4 sm:px-6 lg:px-8 border-b border-brand-800 shadow-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="px-3 py-1 text-xs font-bold rounded-full bg-brand-500/30 text-brand-200 border border-brand-400/30">
                Online Booking Portal
              </span>
              <span className="text-xs text-brand-300">• Instant Confirmation</span>
            </div>
            <h1 className="text-2xl sm:text-4xl font-extrabold tracking-tight">
              Book Your Appointment
            </h1>
            <p className="text-brand-200 text-sm sm:text-base mt-1 max-w-2xl">
              Choose your professional, pick an open date & time slot, and secure your schedule in seconds.
            </p>
          </div>

          {/* Step Progress Pill */}
          <div className="hidden lg:flex items-center gap-3 bg-white/10 backdrop-blur-md px-4 py-2.5 rounded-2xl border border-white/15 text-xs">
            <span className={selectedProvider ? 'text-emerald-400 font-bold' : 'text-white'}>1. Provider</span>
            <span>→</span>
            <span className={selectedService ? 'text-emerald-400 font-bold' : 'text-white'}>2. Service</span>
            <span>→</span>
            <span className={selectedTime ? 'text-emerald-400 font-bold' : 'text-white'}>3. Date & Time</span>
            <span>→</span>
            <span className="text-white">4. Confirm</span>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Main Booking Wizard (8 Columns) */}
          <div className="lg:col-span-8 space-y-8">
            {/* STEP 1: Select Category */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 font-bold text-sm flex items-center justify-center border border-brand-200">
                    1
                  </span>
                  <h2 className="text-lg font-bold text-slate-900">Select Category</h2>
                </div>
                {selectedCategory !== 'All' && (
                  <button
                    onClick={() => {
                      setSelectedCategory('All');
                      setSelectedProvider(null);
                    }}
                    className="text-xs font-semibold text-brand-600 hover:text-brand-700"
                  >
                    View All Categories
                  </button>
                )}
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {[
                  { name: 'All', icon: Sparkles, color: 'text-brand-500' },
                  { name: 'Barber', icon: Scissors, color: 'text-amber-500' },
                  { name: 'Clinic', icon: Stethoscope, color: 'text-emerald-500' },
                  { name: 'Private Tutor', icon: GraduationCap, color: 'text-purple-500' }
                ].map((cat) => {
                  const Icon = cat.icon;
                  const isSelected = selectedCategory === cat.name;
                  return (
                    <button
                      key={cat.name}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(cat.name);
                        setSelectedProvider(null);
                      }}
                      className={`flex flex-col sm:flex-row items-center justify-center gap-2.5 py-3 px-3 rounded-2xl border text-xs sm:text-sm font-bold transition-all duration-150 ${
                        isSelected
                          ? 'border-brand-600 bg-brand-50/80 text-brand-700 shadow-xs ring-2 ring-brand-500/20'
                          : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/80 text-slate-700'
                      }`}
                    >
                      <Icon className={`w-4 h-4 ${cat.color}`} />
                      <span>{cat.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* STEP 2: Select Provider */}
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2.5">
                  <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 font-bold text-sm flex items-center justify-center border border-brand-200">
                    2
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Choose Specialist / Provider</h2>
                    <p className="text-xs text-slate-500">Pick the professional you wish to book with</p>
                  </div>
                </div>
                {selectedProvider && (
                  <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Selected
                  </span>
                )}
              </div>

              {loadingProviders ? (
                <div className="py-12 flex justify-center">
                  <div className="w-8 h-8 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                </div>
              ) : providers.length === 0 ? (
                <p className="text-center py-6 text-sm text-slate-500">No providers found in this category.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                  {providers.map((prov) => {
                    const isSelected = selectedProvider?._id === prov._id;
                    return (
                      <div
                        key={prov._id}
                        onClick={() => handleSelectProvider(prov)}
                        className={`cursor-pointer rounded-2xl p-4 border transition-all duration-200 flex flex-col justify-between ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/50 shadow-md ring-2 ring-brand-500/20'
                            : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={prov.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80'}
                            alt={prov.name}
                            className="w-13 h-13 rounded-xl object-cover border border-slate-200 shadow-2xs"
                          />
                          <div className="flex-1 min-w-0">
                            <h3 className="text-sm font-bold text-slate-900 truncate">{prov.name}</h3>
                            <p className="text-xs text-brand-600 font-medium truncate">{prov.specialty}</p>
                            <div className="flex items-center gap-1 mt-1 text-[11px] text-amber-600 font-bold">
                              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                              <span>{prov.rating ? prov.rating.toFixed(1) : '5.0'}</span>
                            </div>
                          </div>
                        </div>

                        <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
                          <span>{prov.category}</span>
                          <span className={isSelected ? 'text-brand-600 font-bold' : 'text-slate-400'}>
                            {isSelected ? 'Selected ✓' : 'Click to Pick'}
                          </span>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* STEP 3: Select Service */}
            {selectedProvider && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs animate-fadeIn">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 font-bold text-sm flex items-center justify-center border border-brand-200">
                      3
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">
                        Select Service by {selectedProvider.name}
                      </h2>
                      <p className="text-xs text-slate-500">Choose the exact treatment or session</p>
                    </div>
                  </div>
                </div>

                {loadingServices ? (
                  <div className="py-8 flex justify-center">
                    <div className="w-6 h-6 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                  </div>
                ) : services.length === 0 ? (
                  <p className="text-sm text-slate-500">No specific services loaded for this provider.</p>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {services.map((srv) => {
                      const isSelected = selectedService?._id === srv._id;
                      return (
                        <div
                          key={srv._id}
                          onClick={() => setSelectedService(srv)}
                          className={`cursor-pointer rounded-2xl p-4 border transition-all duration-150 flex flex-col justify-between ${
                            isSelected
                              ? 'border-brand-600 bg-brand-50/60 shadow-md ring-2 ring-brand-500/20'
                              : 'border-slate-200 hover:border-slate-300 hover:bg-slate-50/60'
                          }`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-2">
                              <h4 className="text-sm font-bold text-slate-900">{srv.name}</h4>
                              <span className="text-sm font-extrabold text-brand-600">${srv.price}</span>
                            </div>
                            <p className="text-xs text-slate-500 line-clamp-2 mt-1">{srv.description}</p>
                          </div>

                          <div className="mt-3 pt-2.5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                            <span className="flex items-center gap-1 font-medium text-slate-600">
                              <Clock className="w-3.5 h-3.5 text-slate-400" />
                              {srv.duration} mins
                            </span>
                            <span className={isSelected ? 'text-brand-600 font-bold' : 'text-slate-400'}>
                              {isSelected ? 'Selected ✓' : 'Select'}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

            {/* STEP 4: Select Appointment Type */}
            {selectedProvider && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center gap-2.5 mb-4">
                  <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 font-bold text-sm flex items-center justify-center border border-brand-200">
                    4
                  </span>
                  <div>
                    <h2 className="text-lg font-bold text-slate-900">Select Appointment Type</h2>
                    <p className="text-xs text-slate-500">In-person session or convenient virtual meeting</p>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  {[
                    { id: 'In Person', label: 'In Person', icon: Building },
                    { id: 'Video Call', label: 'Video Call', icon: Video },
                    { id: 'Audio Call', label: 'Audio Call', icon: Phone }
                  ].map((type) => {
                    const Icon = type.icon;
                    const isSelected = appointmentType === type.id;
                    return (
                      <button
                        key={type.id}
                        type="button"
                        onClick={() => setAppointmentType(type.id)}
                        className={`flex flex-col items-center justify-center p-3.5 rounded-2xl border text-xs sm:text-sm font-bold transition-all ${
                          isSelected
                            ? 'border-brand-600 bg-brand-50/80 text-brand-700 ring-2 ring-brand-500/20'
                            : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100 text-slate-700'
                        }`}
                      >
                        <Icon className={`w-5 h-5 mb-1 ${isSelected ? 'text-brand-600' : 'text-slate-500'}`} />
                        <span>{type.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {/* STEP 5 & 6: Select Date and Time Slot */}
            {selectedProvider && (
              <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-2.5">
                    <span className="w-7 h-7 rounded-lg bg-brand-50 text-brand-600 font-bold text-sm flex items-center justify-center border border-brand-200">
                      5
                    </span>
                    <div>
                      <h2 className="text-lg font-bold text-slate-900">Select Date & Time Slot</h2>
                      <p className="text-xs text-slate-500">Pick an available day and an open time slot</p>
                    </div>
                  </div>
                </div>

                {/* Horizontal Date Picker Slider */}
                <div className="mb-6">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Available Dates (Next 14 Days)
                  </label>
                  <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-thin">
                    {upcomingDays.map((day) => {
                      const isSelected = selectedDate === day.iso;
                      return (
                        <button
                          key={day.iso}
                          type="button"
                          onClick={() => setSelectedDate(day.iso)}
                          className={`flex-shrink-0 flex flex-col items-center justify-center w-16 py-3 rounded-2xl border transition-all ${
                            isSelected
                              ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-105'
                              : 'border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700'
                          }`}
                        >
                          <span className={`text-[10px] uppercase font-bold ${isSelected ? 'text-brand-100' : 'text-slate-400'}`}>
                            {day.dayName}
                          </span>
                          <span className="text-lg font-extrabold mt-0.5">{day.dayNum}</span>
                          <span className={`text-[10px] ${isSelected ? 'text-brand-100' : 'text-slate-500'}`}>
                            {day.monthName}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Time Slots Chips Grid */}
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                      Time Slots for {selectedDate}
                    </label>
                    <div className="flex items-center gap-3 text-xs">
                      <span className="flex items-center gap-1.5 text-slate-600">
                        <span className="w-2.5 h-2.5 rounded-full bg-slate-100 border border-slate-300"></span> Available
                      </span>
                      <span className="flex items-center gap-1.5 text-red-500">
                        <span className="w-2.5 h-2.5 rounded-full bg-red-100 border border-red-300"></span> Booked
                      </span>
                    </div>
                  </div>

                  {loadingSlots ? (
                    <div className="py-8 flex justify-center">
                      <div className="w-6 h-6 border-3 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
                    </div>
                  ) : availableSlots.length === 0 ? (
                    <p className="text-sm text-slate-500">No time slots configured.</p>
                  ) : (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                      {availableSlots.map((slot) => {
                        const isSelected = selectedTime === slot.time;
                        const isBooked = slot.isBooked;

                        return (
                          <button
                            key={slot.time}
                            type="button"
                            disabled={isBooked}
                            onClick={() => setSelectedTime(slot.time)}
                            className={`py-2.5 px-3 rounded-xl border text-xs font-bold transition-all flex items-center justify-between ${
                              isBooked
                                ? 'bg-red-50/50 border-red-100 text-red-400 cursor-not-allowed line-through'
                                : isSelected
                                ? 'border-brand-600 bg-brand-600 text-white shadow-md shadow-brand-500/25 scale-[1.02]'
                                : 'border-slate-200 bg-slate-50/80 hover:bg-slate-100 text-slate-800 hover:border-slate-300'
                            }`}
                          >
                            <span>{slot.time}</span>
                            <span className="text-[10px] font-semibold">
                              {isBooked ? 'Booked' : isSelected ? '✓' : 'Available'}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* STEP 7: Notes / Concerns */}
                <div className="mt-6 pt-6 border-t border-slate-100">
                  <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                    Special Requests / Concerns / Notes (Optional)
                  </label>
                  <textarea
                    rows={3}
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Skin sensitivity, specific haircut style reference, math topics needing extra attention..."
                    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 focus:bg-white transition-all resize-none"
                  ></textarea>
                </div>
              </div>
            )}
          </div>

          {/* Booking Summary Column (4 Columns - Sticky Sidebar) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-lg sticky top-28">
              <h3 className="text-lg font-bold text-slate-900 mb-1 flex items-center gap-2">
                <CalendarIcon className="w-5 h-5 text-brand-600" />
                Booking Summary
              </h3>
              <p className="text-xs text-slate-500 mb-6">
                Review your appointment details before placing reservation
              </p>

              {/* Summary Items */}
              <div className="space-y-4 text-sm divide-y divide-slate-100">
                {/* Provider info */}
                <div className="pb-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Provider</span>
                  {selectedProvider ? (
                    <div className="flex items-center gap-3 mt-1.5">
                      <img
                        src={selectedProvider.image || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'}
                        alt={selectedProvider.name}
                        className="w-10 h-10 rounded-xl object-cover border border-slate-200"
                      />
                      <div>
                        <p className="font-bold text-slate-900">{selectedProvider.name}</p>
                        <p className="text-xs text-brand-600">{selectedProvider.specialty}</p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1">No provider selected yet</p>
                  )}
                </div>

                {/* Service info */}
                <div className="py-3">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Service</span>
                  {selectedService ? (
                    <div className="flex items-center justify-between mt-1">
                      <div>
                        <p className="font-bold text-slate-900">{selectedService.name}</p>
                        <p className="text-xs text-slate-500">{selectedService.duration} minutes</p>
                      </div>
                      <span className="font-bold text-slate-900 text-base">${selectedService.price}</span>
                    </div>
                  ) : (
                    <p className="text-xs text-slate-400 italic mt-1">No service selected yet</p>
                  )}
                </div>

                {/* Appointment Type */}
                <div className="py-3 flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Modality</span>
                  <span className="text-xs font-bold bg-slate-100 text-slate-700 px-2.5 py-1 rounded-lg">
                    {appointmentType}
                  </span>
                </div>

                {/* Date & Time */}
                <div className="py-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-sm">
                      {selectedDate || 'Not selected'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Time Slot</span>
                    <span className="font-bold text-brand-600 text-xs sm:text-sm">
                      {selectedTime || 'Not chosen'}
                    </span>
                  </div>
                </div>

                {/* Total Price */}
                <div className="pt-4 flex items-center justify-between">
                  <div>
                    <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Due</span>
                    <p className="text-[11px] text-slate-400">Pay online or on arrival</p>
                  </div>
                  <span className="text-2xl font-extrabold text-slate-900">
                    ${selectedService?.price || 0}
                  </span>
                </div>
              </div>

              {/* Error Banner */}
              {bookingError && (
                <div className="mt-4 p-3.5 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-shake">
                  <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                  <span className="font-medium">{bookingError}</span>
                </div>
              )}

              {/* Action Button */}
              <div className="mt-6">
                <button
                  type="button"
                  disabled={submitting || !selectedProvider || !selectedService || !selectedTime}
                  onClick={handleConfirmBooking}
                  className="w-full py-4 px-4 rounded-2xl text-white font-bold text-sm bg-gradient-to-r from-brand-600 to-blue-600 hover:from-brand-700 hover:to-blue-700 shadow-xl shadow-brand-500/25 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                >
                  {submitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      <span>Verifying & Confirming...</span>
                    </>
                  ) : !isAuthenticated ? (
                    <>
                      <span>Login to Confirm Booking</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  ) : (
                    <>
                      <span>Confirm Appointment</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </div>

              <div className="mt-4 text-center">
                <p className="text-[11px] text-slate-400">
                  🔒 System checks for double booking in real-time.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
