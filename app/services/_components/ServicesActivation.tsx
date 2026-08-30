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
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              HOW SUPPORT IS ACTIVATED
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 leading-tight">
              One patient. One case. One coordinated journey.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed max-w-xl">
              You don't choose services from a menu. You begin with a consultation, and our team activates the right combination of support — translation, hospital placement, accommodation, visa support — based entirely on your case.
            </p>
            <div>
              <Link
                href="#consultation"
                className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm text-sm transition-colors"
              >
                Start Your Healthcare Journey
              </Link>
            </div>
          </div>

          {/* Right White Card */}
          <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-blue-900">
              A typical case might include:
            </h3>
            <ol className="space-y-3 text-sm text-gray-600">
              {caseSteps.map((step, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="font-semibold text-gray-500">{idx + 1}.</span>
                  <span>{step}</span>
                </li>
              ))}
            </ol>
          </div>

        </div>
      </div>
    </section>
  );
}