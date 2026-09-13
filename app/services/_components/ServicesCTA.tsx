'use client';

import React from 'react';
import Link from 'next/link';

export default function ServicesCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-slate-950 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 border border-slate-800 shadow-xl">
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            You don&apos;t have to navigate your healthcare journey alone.
          </h2>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Whether you&apos;re exploring treatment locally or internationally, our team is ready to guide you toward the care you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <Link
              href="/consultation"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden text-base transition-all cursor-pointer"
            >
              Book Your Consultation
            </Link>
            <Link
              href="/contact"
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 active:bg-white/35 border-2 border-white/40 text-white font-bold rounded-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden text-base transition-all cursor-pointer"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}