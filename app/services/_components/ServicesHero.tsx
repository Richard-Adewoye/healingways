'use client';

import React from 'react';
import Link from 'next/link';

export default function ServicesHero() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
            Healthcare Support Services
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
            Supporting you through every step of your healthcare journey.
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            When facing a medical challenge, finding the right care can feel overwhelming. We connect you with trusted hospitals and specialists while coordinating the support you need throughout.
          </p>
          <div className="pt-2">
            <Link
              href="#consultation"
              className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition-colors text-sm sm:text-base"
            >
              Start Your Healthcare Journey
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}