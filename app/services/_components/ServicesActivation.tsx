'use client';

import React from 'react';
import Link from 'next/link';

const caseSteps = [
  'Consultation & case review',
  'Medical report translation',
  'Hospital & specialist recommendation',
  'Accommodation & logistics coordination',
  'Visa documentation support',
  'Post-treatment follow-up',
];

export default function ServicesActivation() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          
          {/* Left Text */}
          <div className="lg:col-span-7 space-y-6">
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-900 uppercase bg-blue-100/90 px-3.5 py-1.5 rounded-lg border border-blue-200/60">
              HOW SUPPORT IS ACTIVATED
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 leading-tight tracking-tight">
              One patient. One case. One coordinated journey.
            </h2>
            <p className="text-slate-700 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-normal">
              You don&apos;t choose services from a menu. You begin with a consultation, and our team activates the right combination of support — translation, hospital placement, accommodation, visa support — based entirely on your case.
            </p>
            <div>
              <Link
                href="/consultation"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all text-base cursor-pointer"
              >
                Start Your Healthcare Journey
              </Link>
            </div>
          </div>

          {/* Right White Card */}
          <div className="lg:col-span-5 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-lg font-bold text-blue-950">
              A typical case pathway includes:
            </h3>
            <ol className="space-y-3.5 text-base text-slate-800">
              {caseSteps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="font-black text-blue-900 bg-blue-50 w-6 h-6 rounded-full flex items-center justify-center text-xs shrink-0 mt-0.5 border border-blue-200">{idx + 1}</span>
                  <span className="font-semibold text-slate-800">{step}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
}