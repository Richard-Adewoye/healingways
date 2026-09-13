import React from 'react';

export default function AboutMissionVision() {
  return (
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-2xl font-black text-blue-950">Our Mission</h3>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              To help patients and families make confident healthcare decisions by connecting them with trusted hospitals and specialists, and providing expert guidance throughout every stage of their journey.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm space-y-4">
            <h3 className="text-2xl font-black text-blue-950">Our Vision</h3>
            <p className="text-slate-700 text-base sm:text-lg leading-relaxed font-normal">
              To become Africa's most trusted healthcare navigation platform, making quality healthcare more accessible through technology, expertise, and compassionate human support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}