'use client';

import React from 'react';

interface FAQHeroProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export default function FAQHero({ searchQuery, setSearchQuery }: FAQHeroProps) {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <div>
          <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
            Frequently Asked Questions
          </span>
        </div>
        
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
          Answers to help you understand<br className="hidden sm:inline" /> your healthcare journey.
        </h1>

        <div className="max-w-md mx-auto pt-2">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search FAQs, e.g. 'visa' or 'hospital'"
            className="w-full px-4 py-3 bg-white border border-gray-200 rounded-lg text-sm text-gray-900 placeholder-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-all"
          />
        </div>
      </div>
    </section>
  );
}