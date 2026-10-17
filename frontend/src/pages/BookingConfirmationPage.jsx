import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import {
  CheckCircle2,
  Calendar,
  Clock,
  MapPin,
  Printer,
  ArrowRight,
  ShieldCheck,
  User,
  Sparkles,
  Share2,
  Download
} from 'lucide-react';

export const BookingConfirmationPage = () => {
  const { bookingId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(location.state?.booking || null);
  const [loading, setLoading] = useState(!booking);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!booking && bookingId) {
      const fetchBooking = async () => {
        try {
          const res = await api.getBookingById(bookingId);
          if (res.success && res.booking) {
            setBooking(res.booking);
          } else {
            setError(res.message || 'Booking details not found');
          }
        } catch (err) {
          console.error('Error fetching booking confirmation:', err);
          setError(err.message || 'Failed to retrieve booking information');
        } finally {
          setLoading(false);
        }
      };

      fetchBooking();
    }
  }, [bookingId, booking]);

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center">
        <div className="w-12 h-12 border-4 border-brand-200 border-t-brand-600 rounded-full animate-spin"></div>
        <p className="mt-4 text-slate-500 font-medium">Generating booking confirmation...</p>
      </div>
    );
  }

  if (error || !booking) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center">
        <div className="w-16 h-16 bg-amber-50 text-amber-600 rounded-full flex items-center justify-center mx-auto mb-4 border border-amber-200">
          <Calendar className="w-8 h-8" />
        </div>
        <h2 className="text-2xl font-bold text-slate-900 mb-2">Booking Record Notice</h2>
        <p className="text-slate-600 mb-6">{error || 'Could not find booking data.'}</p>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 px-6 py-3 bg-brand-600 text-white font-semibold rounded-xl hover:bg-brand-700"
        >
          Check My Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/60 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        {/* Celebration Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 text-emerald-600 mb-4 shadow-lg shadow-emerald-500/20 border-4 border-white animate-bounce-subtle">
            <CheckCircle2 className="w-10 h-10" />
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Appointment Confirmed!
          </h1>
          <p className="mt-2 text-slate-600 max-w-md mx-auto text-sm sm:text-base">
            Your appointment has been successfully scheduled and recorded in the system.
          </p>
        </div>

        {/* Receipt Voucher Card */}
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xl overflow-hidden relative print:border-none print:shadow-none">
          {/* Top Banner Ribbon */}
          <div className="bg-gradient-to-r from-brand-600 via-blue-600 to-brand-700 px-6 sm:px-8 py-5 text-white flex items-center justify-between">
            <div>
              <p className="text-xs uppercase font-bold tracking-wider text-brand-200">Official Booking Pass</p>
              <p className="text-base sm:text-lg font-bold font-mono mt-0.5">
                Ref #{booking._id?.slice(-8).toUpperCase()}
              </p>
            </div>
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-500/20 text-emerald-200 border border-emerald-400/30 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              {booking.status || 'Confirmed'}
            </span>
          </div>

          {/* Details Body */}
          <div className="p-6 sm:p-8 space-y-6">
            {/* Provider & Service Row */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-slate-100 gap-4">
              <div className="flex items-center gap-4">
                <img
                  src={
                    booking.providerId?.image ||
                    'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=150&q=80'
                  }
                  alt={booking.providerId?.name || 'Provider'}
                  className="w-16 h-16 rounded-2xl object-cover border border-slate-200 shadow-2xs"
                />
                <div>
                  <span className="text-xs font-bold text-brand-600 uppercase tracking-wider">
                    {booking.providerId?.category || 'Service Provider'}
                  </span>
                  <h3 className="text-xl font-bold text-slate-900 mt-0.5">
                    {booking.providerId?.name || 'Selected Provider'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {booking.providerId?.specialty || 'Verified Specialist'}
                  </p>
                </div>
              </div>

              <div className="sm:text-right bg-slate-50 sm:bg-transparent p-3 sm:p-0 rounded-xl">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider block">Service</span>
                <p className="text-base font-bold text-slate-900 mt-0.5">
                  {booking.serviceId?.name || 'Professional Session'}
                </p>
                <p className="text-xs text-slate-500">
                  {booking.serviceId?.duration ? `${booking.serviceId.duration} mins` : 'Standard Duration'}
                </p>
              </div>
            </div>

            {/* Appointment Details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                  <Calendar className="w-4 h-4 text-brand-600" />
                  Appointment Date
                </div>
                <p className="text-base font-bold text-slate-900">{booking.date}</p>
              </div>

              <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
                <div className="flex items-center gap-2 text-slate-500 text-xs font-bold uppercase tracking-wider mb-1">
                  <Clock className="w-4 h-4 text-brand-600" />
                  Reserved Time Slot
                </div>
                <p className="text-base font-bold text-brand-600">{booking.time}</p>
              </div>
            </div>

            {/* Location & Modality */}
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70 flex items-start gap-3">
              <MapPin className="w-5 h-5 text-slate-400 flex-shrink-0 mt-0.5" />
              <div className="text-xs sm:text-sm">
                <p className="font-bold text-slate-900">
                  {booking.appointmentType || 'In Person'} Session
                </p>
                <p className="text-slate-500 mt-0.5">
                  {booking.providerId?.location || 'Central Studio & Clinic Plaza, Suite 4B'}
                </p>
              </div>
            </div>

            {/* Notes if any */}
            {booking.notes && (
              <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/60 text-xs text-amber-900">
                <span className="font-bold block mb-1">Client Notes:</span>
                <p className="italic">"{booking.notes}"</p>
              </div>
            )}

            {/* Total Paid / Due */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              <div>
                <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Amount</span>
                <p className="text-xs text-slate-400">Fixed appointment fee</p>
              </div>
              <span className="text-3xl font-extrabold text-slate-900">
                ${booking.price}
              </span>
            </div>
          </div>

          {/* Card Cutout Decor */}
          <div className="relative border-t-2 border-dashed border-slate-200 bg-slate-50/80 px-6 sm:px-8 py-4 flex flex-wrap items-center justify-between gap-4">
            <span className="text-xs text-slate-500 flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Verified & Protected by BookEasy Systems
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Booked at: {new Date(booking.createdAt).toLocaleDateString()}
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 print:hidden">
          <button
            onClick={handlePrint}
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            <Printer className="w-4 h-4" />
            Print Receipt
          </button>

          <Link
            to="/dashboard"
            className="w-full sm:w-auto px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-brand-500/25 transition-all flex items-center justify-center gap-2"
          >
            Go to My Dashboard
            <ArrowRight className="w-4 h-4" />
          </Link>

          <Link
            to="/book"
            className="w-full sm:w-auto px-5 py-3 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs sm:text-sm shadow-xs transition-colors flex items-center justify-center gap-2"
          >
            Book Another
          </Link>
        </div>
      </div>
    </div>
  );
};
