import React, { useState } from 'react';
import {
  Mail,
  Phone,
  MapPin,
  Clock,
  Send,
  CheckCircle2,
  Calendar,
  Sparkles,
  HelpCircle
} from 'lucide-react';

export const ContactPage = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-slate-50/50 pb-24">
      {/* Header */}
      <div className="bg-gradient-to-b from-brand-50 via-slate-50 to-white py-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80">
        <div className="max-w-4xl mx-auto text-center">
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-brand-100 text-brand-800 border border-brand-200 inline-block mb-3">
            Get In Touch
          </span>
          <h1 className="text-3xl sm:text-5xl font-extrabold text-slate-900 tracking-tight">
            Contact & Support
          </h1>
          <p className="mt-3 text-base text-slate-600 max-w-xl mx-auto">
            Have questions about booking an appointment or listing your practice? Our support team is ready to help.
          </p>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Contact Details */}
          <div className="space-y-6">
            <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs">
              <h3 className="text-lg font-bold text-slate-900 mb-6">Contact Information</h3>

              <div className="space-y-5 text-sm text-slate-600">
                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase block">Email Support</span>
                    <a href="mailto:support@bookeasy.com" className="font-bold text-slate-900 hover:text-brand-600">
                      support@bookeasy.com
                    </a>
                    <p className="text-xs text-slate-400 mt-0.5">Average response: &lt; 2 hours</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase block">Phone Hotline</span>
                    <p className="font-bold text-slate-900">+1 (555) 019-2834</p>
                    <p className="text-xs text-slate-400 mt-0.5">Mon - Sat: 9:00 AM - 7:00 PM</p>
                  </div>
                </div>

                <div className="flex items-start gap-3.5">
                  <div className="w-10 h-10 rounded-xl bg-brand-50 text-brand-600 flex items-center justify-center flex-shrink-0">
                    <MapPin className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 font-semibold uppercase block">University Campus / HQ</span>
                    <p className="font-bold text-slate-900">Department of Computer Science</p>
                    <p className="text-xs text-slate-400 mt-0.5">Web Design & Internet Programming Lab</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Quick FAQ Box */}
            <div className="bg-gradient-to-br from-brand-600 to-blue-700 text-white rounded-3xl p-6 shadow-md">
              <div className="flex items-center gap-2 mb-2">
                <HelpCircle className="w-5 h-5 text-amber-300" />
                <h4 className="font-bold text-base">Quick Booking Help</h4>
              </div>
              <p className="text-xs text-brand-100 leading-relaxed mb-4">
                Need to cancel or reschedule? Simply visit your user dashboard to manage bookings with 1-click.
              </p>
              <span className="inline-block px-3 py-1 bg-white/15 rounded-lg text-xs font-semibold">
                Available 24/7 Online
              </span>
            </div>
          </div>

          {/* Form */}
          <div className="lg:col-span-2 bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs">
            <h3 className="text-xl font-bold text-slate-900 mb-1">Send Us a Message</h3>
            <p className="text-xs text-slate-500 mb-6">
              Fill out this form and our support desk will respond shortly.
            </p>

            {submitted ? (
              <div className="py-12 text-center bg-emerald-50 rounded-2xl border border-emerald-200 p-6 animate-fadeIn">
                <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-3" />
                <h4 className="text-lg font-bold text-emerald-900">Message Delivered!</h4>
                <p className="text-xs text-emerald-700 mt-1">
                  Thank you for contacting BookEasy. We have received your inquiry.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Name</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John Doe"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Your Email</label>
                    <input
                      type="email"
                      required
                      placeholder="john@example.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Subject</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Appointment rescheduling question / General feedback"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 uppercase mb-1">Message</label>
                  <textarea
                    rows={5}
                    required
                    placeholder="How can we assist you today?..."
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-brand-500 resize-none"
                  ></textarea>
                </div>

                <button
                  type="submit"
                  className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-bold text-sm shadow-md shadow-brand-500/20 transition-all flex items-center gap-2"
                >
                  <Send className="w-4 h-4" />
                  Send Inquiry
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
