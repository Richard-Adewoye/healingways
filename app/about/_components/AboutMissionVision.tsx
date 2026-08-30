import React from 'react';

export default function AboutMissionVision() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Mission Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-blue-900">Our Mission</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To help patients and families make confident healthcare decisions by connecting them with trusted hospitals and specialists, and providing expert guidance throughout every stage of their journey.
            </p>
          </div>

          {/* Vision Card */}
          <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm space-y-4">
            <h3 className="text-xl font-bold text-blue-900">Our Vision</h3>
            <p className="text-gray-600 text-sm leading-relaxed">
              To become Africa's most trusted healthcare navigation platform, making quality healthcare more accessible through technology, expertise, and compassionate human support.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}