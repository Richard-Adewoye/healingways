'use client';

import React from 'react';
import Link from 'next/link';

export default function ServicesHero() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="inline-block px-3.5 py-1.5 bg-emerald-100 text-emerald-950 text-xs sm:text-sm font-extrabold rounded-full border border-emerald-200">
            Healthcare Support Services
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-950 leading-tight tracking-tight">
            Supporting you through every step of your healthcare journey.
          </h1>
          <p className="text-slate-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
            When facing a medical challenge, finding the right care can feel overwhelming. We connect you with trusted hospitals and specialists while coordinating the support you need throughout.
          </p>
          <div className="pt-2">
            <Link
              href="/consultation"
              className="inline-block px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all text-base cursor-pointer"
            >
              Start Your Healthcare Journey
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}