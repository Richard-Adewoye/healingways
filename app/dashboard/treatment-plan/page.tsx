'use client';

import React from 'react';
import Link from 'next/link';
import Header from '../Header';
import { Calendar } from 'lucide-react';

export default function TreatmentPlanPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl">
      <Header title="Treatment Plan" />
      <h2 className="text-2xl font-bold text-blue-900 mb-8">Treatment Plan</h2>

      <div className="max-w-xl mx-auto my-12 bg-slate-50/80 border border-slate-100 rounded-3xl p-8 text-center space-y-4">
        <div className="w-12 h-12 rounded-full bg-emerald-100/60 text-emerald-600 flex items-center justify-center mx-auto">
          <Calendar className="w-6 h-6" />
        </div>
        <h3 className="text-lg font-bold text-blue-900 max-w-sm mx-auto">
          Available once you've accepted a hospital recommendation
        </h3>
        <p className="text-xs sm:text-sm text-slate-500 max-w-md mx-auto">
          Your treatment plan is built once you've chosen a hospital, so it can be tailored to their scheduling.
        </p>
        <div className="pt-2">
          <Link
            href="/dashboard/recommendations"
            className="inline-block px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm rounded-lg transition-colors"
          >
            View Recommendations
          </Link>
        </div>
      </div>
    </div>
  );
}