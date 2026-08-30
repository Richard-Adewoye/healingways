'use client';

import React from 'react';

export default function HospitalsInfoSection() {
  return (
    <section className="py-16 bg-slate-50 border-t border-gray-100">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Two Column Explanations */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              HOW WE SELECT PARTNERS
            </span>
            <h3 className="text-xl font-bold text-blue-900">
              Partnerships built around quality and trust
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              We consider medical expertise, quality standards, patient experience, and communication when developing healthcare relationships — not marketing budgets.
            </p>
          </div>

          <div className="space-y-3">
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              HOW RECOMMENDATIONS WORK
            </span>
            <h3 className="text-xl font-bold text-blue-900">
              The right care depends on your unique needs
            </h3>
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
              Rather than a one-size-fits-all list, our team reviews each case individually — medical condition, required specialty, location, and preferences — before guiding you toward suitable options.
            </p>
          </div>
        </div>

        {/* Green Disclaimer Banner */}
        <div className="bg-emerald-50 border border-emerald-100 p-5 rounded-xl">
          <p className="text-xs text-emerald-900 leading-relaxed">
            <strong className="font-semibold">A note on our network:</strong> HealingWays partners with healthcare institutions to support patient access and coordination. This page demonstrates our healthcare connections — it does not represent a complete directory, guarantee treatment outcomes, or replace professional medical advice.
          </p>
        </div>

      </div>
    </section>
  );
}