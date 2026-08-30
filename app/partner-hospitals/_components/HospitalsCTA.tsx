'use client';

import React from 'react';
import Link from 'next/link';

export default function HospitalsCTA() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-blue-900 rounded-2xl p-8 sm:p-12 text-center text-white space-y-6">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
            You don't have to navigate your healthcare journey alone.
          </h2>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
            Whether you're exploring treatment locally or internationally, our team is ready to guide you toward the care you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="#consultation"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm text-sm transition-colors"
            >
              Book Your Consultation
            </Link>
            <Link
              href="#contact"
              className="px-6 py-3 bg-transparent hover:bg-blue-800 border border-blue-400 text-white font-medium rounded-lg text-sm transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}