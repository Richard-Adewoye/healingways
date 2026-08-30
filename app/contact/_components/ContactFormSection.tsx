'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { Phone, Mail, MessageSquare } from 'lucide-react';

export default function ContactFormSection() {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    inquiryType: 'General Question',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Submit contact form logic
    console.log('Form Submitted:', formData);
  };

  return (
    <section id="contact-form" className="py-12 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Contact Form Card */}
          <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-gray-100 shadow-sm">
            <h2 className="text-lg sm:text-xl font-bold text-blue-900 mb-6">
              Send us a message
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Full Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  placeholder="Your name"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="you@example.com"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1">
                    Phone
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Optional"
                    className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Inquiry Type
                </label>
                <select
                  value={formData.inquiryType}
                  onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
                >
                  <option value="General Question">General Question</option>
                  <option value="Begin a Consultation">Begin a Consultation</option>
                  <option value="Existing Patient Support">Existing Patient Support</option>
                  <option value="Partnership Opportunities">Partnership Opportunities</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-gray-700 mb-1">
                  Message <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="How can we assist you?"
                  className="w-full px-3.5 py-2.5 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all resize-none"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-lg shadow-sm transition-colors mt-2"
              >
                Send Message
              </button>
            </form>
          </div>

          {/* Right Column: Direct Info Cards & Disclaimers */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Direct Contact Card with Doctor Image */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="relative h-48 w-full bg-red-600">
                <Image
                  src="/images/about-image-three.avif"
                  alt="Healthcare Specialist"
                  fill
                  className="object-cover object-center"
                />
              </div>

              <div className="p-6 space-y-4">
                <h3 className="text-base font-bold text-blue-900">
                  Reach us directly
                </h3>

                <div className="space-y-3 text-xs sm:text-sm">
                  <a
                    href="tel:+2348001234567"
                    className="flex items-center gap-2.5 text-blue-900 font-medium hover:underline"
                  >
                    <Phone className="w-4 h-4 text-blue-800" />
                    <span>+234 800 123 4567</span>
                  </a>

                  <a
                    href="mailto:care@healingways.org"
                    className="flex items-center gap-2.5 text-blue-900 font-medium hover:underline"
                  >
                    <Mail className="w-4 h-4 text-blue-800" />
                    <span>care@healingways.org</span>
                  </a>

                  <a
                    href="https://wa.me/2348001234567"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2.5 text-blue-900 font-medium hover:underline"
                  >
                    <MessageSquare className="w-4 h-4 text-blue-800" />
                    <span>Chat on WhatsApp</span>
                  </a>
                </div>

                <p className="text-xs text-gray-400 pt-2 border-t border-gray-50">
                  We aim to respond within one business day.
                </p>
              </div>
            </div>

            {/* Emergency Notice */}
            <div className="p-5 bg-emerald-50/70 border border-emerald-100 rounded-2xl">
              <p className="text-xs text-emerald-950 leading-relaxed">
                <strong className="font-semibold">Not an emergency service.</strong> If you or someone you know requires urgent medical attention, please contact your nearest emergency healthcare provider immediately.
              </p>
            </div>

            {/* Scope Disclaimer Box */}
            <div className="p-5 bg-blue-50/50 border border-blue-100/60 rounded-2xl">
              <p className="text-xs text-blue-900/80 leading-relaxed">
                HealingWays provides healthcare navigation and coordination. We do not diagnose, treat, or provide emergency medical care.
              </p>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}