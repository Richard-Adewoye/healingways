'use client';

import React from 'react';

export default function BlogHero() {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
            Resources
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
            Trusted information to help you make better healthcare decisions.
          </h1>
        </div>
      </div>
    </section>
  );
}