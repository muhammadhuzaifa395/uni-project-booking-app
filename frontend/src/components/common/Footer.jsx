import React from 'react';
import { Link } from 'react-router-dom';
import { Calendar, Shield, Heart, Scissors, Stethoscope, GraduationCap } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-slate-900 text-slate-300 pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pb-12 border-b border-slate-800">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-brand-600 to-blue-500 flex items-center justify-center text-white shadow-md">
                <Calendar className="w-5 h-5" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-white">
                Book<span className="text-brand-400">Easy</span>
              </span>
            </div>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              A comprehensive appointment booking platform designed for barbers, clinics, and private tutors. Engineered for seamless scheduling, zero double-booking, and multi-role operations.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/50 border border-emerald-800/60 px-3 py-1.5 rounded-lg w-fit">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
              MongoDB & Node.js API Online
            </div>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Service Sectors
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/services?category=Barber" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Scissors className="w-4 h-4 text-amber-400" />
                  Barber & Grooming
                </Link>
              </li>
              <li>
                <Link to="/services?category=Clinic" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <Stethoscope className="w-4 h-4 text-emerald-400" />
                  Medical & Clinic
                </Link>
              </li>
              <li>
                <Link to="/services?category=Private Tutor" className="hover:text-brand-400 transition-colors flex items-center gap-2">
                  <GraduationCap className="w-4 h-4 text-purple-400" />
                  Private Tutoring
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Quick Links
            </h4>
            <ul className="space-y-2.5 text-sm">
              <li>
                <Link to="/" className="hover:text-brand-400 transition-colors">Home Page</Link>
              </li>
              <li>
                <Link to="/services" className="hover:text-brand-400 transition-colors">Browse Services</Link>
              </li>
              <li>
                <Link to="/providers" className="hover:text-brand-400 transition-colors">Verified Providers</Link>
              </li>
              <li>
                <Link to="/book" className="hover:text-brand-400 transition-colors">Book Now</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-brand-400 transition-colors">Project Architecture</Link>
              </li>
            </ul>
          </div>

          {/* University Details */}
          <div>
            <h4 className="text-xs font-bold text-white uppercase tracking-wider mb-4">
              Academic Project
            </h4>
            <div className="bg-slate-800/80 p-4 rounded-xl border border-slate-700 space-y-2 text-xs">
              <div>
                <p className="text-slate-400">Subject:</p>
                <p className="text-white font-semibold">Web Design & Internet Programming</p>
              </div>
              <div>
                <p className="text-slate-400">Stack:</p>
                <p className="text-white font-semibold">React • Express • MongoDB • JWT</p>
              </div>
              <div>
                <p className="text-slate-400">Student:</p>
                <p className="text-brand-400 font-semibold">Muhammad Huzaifa</p>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <p>© {new Date().getFullYear()} BookEasy Appointment Booking System. University Term Project.</p>
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 text-slate-400">
              Built with <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> for Academic Evaluation
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};
