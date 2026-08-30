'use client';

import React from 'react';
import Header from '../Header';
import { Plus } from 'lucide-react';

const cases = [
  {
    title: 'Visa support',
    id: 'HW-2026-150088',
    date: 'Started Today',
    status: 'Consultation Submitted',
  },
  {
    title: 'Cardiology',
    id: 'HW-2026-000145',
    date: 'Started 20 Jul 2026',
    status: 'Hospital Recommendation',
  },
];

export default function MyCasesPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl">
      <Header title="My Cases" />
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-2xl font-bold text-blue-900">My Cases</h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Every healthcare journey you've started with HealingWays.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-semibold rounded-lg transition-colors self-start sm:self-auto">
          <Plus className="w-4 h-4" />
          New Consultation
        </button>
      </div>

      <div className="space-y-4">
        {cases.map((item) => (
          <div
            key={item.id}
            className="bg-white border border-slate-200/80 rounded-2xl p-6 flex items-center justify-between shadow-sm hover:border-slate-300 transition-all"
          >
            <div>
              <h3 className="text-base font-bold text-blue-900">{item.title}</h3>
              <p className="text-xs text-slate-400 mt-1">
                {item.id} · {item.date}
              </p>
            </div>
            <span className="px-3 py-1.5 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
              {item.status}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}