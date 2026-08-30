'use client';

import React from 'react';

export default function HospitalsHero() {
  return (
    <section className="py-16 md:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl space-y-6">
          <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
            Our Global Network
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
            Connecting patients with trusted healthcare institutions worldwide.
          </h1>
          <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
            We carefully consider each patient's needs before recommending suitable healthcare providers — this page showcases our network, it isn't a directory to book from directly.
          </p>
        </div>
      </div>
    </section>
  );
}