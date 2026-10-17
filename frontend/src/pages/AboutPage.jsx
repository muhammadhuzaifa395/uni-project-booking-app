import React from 'react';
import { Link } from 'react-router-dom';
import {
  Calendar,
  CheckCircle2,
  GraduationCap,
  Sparkles,
  ShieldCheck,
  Clock,
  Users,
  Code2,
  Database,
  ArrowRight
} from 'lucide-react';

export const AboutPage = () => {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Hero Banner */}
      <div className="bg-gradient-to-b from-brand-50 via-slate-50 to-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200 mb-4">
            <GraduationCap className="w-4 h-4 text-brand-600" />
            University Semester Project
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            About Book<span className="text-brand-600">Easy</span> Platform
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
            A comprehensive, full-stack online appointment scheduling platform tailored for three everyday service pillars:
            Barbers, Medical Clinics, and Private Academic Tutors.
          </p>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-12 space-y-12">
        {/* Project Overview Card */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
          <h2 className="text-2xl font-bold text-slate-900 mb-4">Project Information</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 pt-2">
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <span className="text-xs text-slate-400 font-semibold uppercase">Subject</span>
              <p className="text-sm font-bold text-slate-900 mt-1">Web Design & Internet Programming</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <span className="text-xs text-slate-400 font-semibold uppercase">Developer</span>
              <p className="text-sm font-bold text-slate-900 mt-1">Muhammad Huzaifa</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <span className="text-xs text-slate-400 font-semibold uppercase">Architecture</span>
              <p className="text-sm font-bold text-slate-900 mt-1">MERN Stack (REST API)</p>
            </div>
            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
              <span className="text-xs text-slate-400 font-semibold uppercase">Status</span>
              <p className="text-sm font-bold text-emerald-600 mt-1">100% Production Ready</p>
            </div>
          </div>
        </div>

        {/* The 3 Core Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center mb-4">
              ✂️
            </div>
            <h3 className="text-lg font-bold text-slate-900">Barber Services</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Precision haircuts, traditional hot towel shaves, beard trims, and grooming packages. Solves wait times in barbershops.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mb-4">
              🩺
            </div>
            <h3 className="text-lg font-bold text-slate-900">Clinic Consultations</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              Doctor checkups, general medical consultations, and specialist appointments. Prevents double-booking and manages clinic flow.
            </p>
          </div>

          <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs">
            <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center mb-4">
              🎓
            </div>
            <h3 className="text-lg font-bold text-slate-900">Private Academic Tutors</h3>
            <p className="text-xs sm:text-sm text-slate-500 mt-2 leading-relaxed">
              1-on-1 tutoring sessions in Mathematics, Computer Programming, Physics, and Languages for students of all levels.
            </p>
          </div>
        </div>

        {/* Technical Highlights */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200/80 shadow-xs">
          <h2 className="text-xl font-bold text-slate-900 mb-4 flex items-center gap-2">
            <Code2 className="w-5 h-5 text-brand-600" />
            Key Technical Implementations
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm text-slate-600">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Double-Booking Prevention:</strong> Real-time backend slot lock ensuring that a slot booked by one client is instantly marked unavailable.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Role-Based Access Control (RBAC):</strong> Secure JWT authentication distinguishing regular Clients from Administrative staff.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Modular REST API:</strong> Decoupled Express controllers, MongoDB schema population, and clean error handling.</span>
            </div>
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
              <span><strong>Mobile-First Responsive Design:</strong> Tailored Tailwind CSS layouts ensuring smooth operation on smartphones, tablets, and laptops.</span>
            </div>
          </div>
        </div>

        {/* CTA */}
        <div className="text-center py-6">
          <Link
            to="/book"
            className="inline-flex items-center gap-2 px-8 py-4 bg-brand-600 text-white font-bold rounded-2xl shadow-lg shadow-brand-500/25 hover:bg-brand-700 transition-all hover:scale-105"
          >
            Experience The Booking Flow <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
