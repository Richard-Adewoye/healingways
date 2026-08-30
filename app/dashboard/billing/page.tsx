'use client';

import React from 'react';
import Header from '../Header';

export default function BillingPage() {
  return (
    <div className="p-6 sm:p-10 max-w-7xl space-y-6">
      <Header title="Billing & Payments" />
      
      <div>
        <h2 className="text-2xl font-bold text-blue-900">Billing & Payments</h2>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Pay for services individually as they become part of your journey — before you arrive for treatment.
        </p>
      </div>

      {/* Info Callout */}
      <div className="p-4 bg-blue-50/60 border border-blue-100 rounded-2xl text-xs sm:text-sm text-slate-600">
        <strong className="text-blue-900 font-semibold">Medical consultations are always free of charge.</strong> The items below are billed separately as they become relevant to your case.
      </div>

      {/* Billing Card */}
      <div className="bg-white border border-slate-200/80 rounded-2xl p-6 max-w-xl space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-blue-900">HW Service Charge</h3>
          <span className="px-3 py-1 bg-emerald-50 text-emerald-700 text-xs font-semibold rounded-full border border-emerald-100">
            Paid
          </span>
        </div>
        <p className="text-xs text-slate-500">
          This covers all support services we provide for patients throughout their medical journey. T&C apply.
        </p>
        <p className="text-base font-bold text-blue-900">$300 USD</p>
        <button className="px-4 py-2 border border-emerald-600 text-emerald-700 font-semibold text-xs rounded-lg hover:bg-emerald-50 transition-colors">
          View Receipt
        </button>
      </div>

      {/* Payment History Section */}
      <div className="pt-4">
        <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-4">
          PAYMENT HISTORY
        </span>
      </div>
    </div>
  );
}