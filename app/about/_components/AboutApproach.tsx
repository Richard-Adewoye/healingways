import React from 'react';

const trustReasons = [
  'Personalized healthcare guidance, never a generic list',
  'Carefully selected hospital partners',
  'Experienced Care Coordinators',
  'Secure handling of medical information',
  'Continued support before, during, and after treatment',
];

export default function AboutApproach() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
          {/* Left Text */}
          <div className="lg:col-span-6 space-y-6 flex flex-col justify-center">
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-900 uppercase bg-blue-100/90 px-3.5 py-1.5 rounded-lg border border-blue-200/60 w-fit">
              OUR APPROACH
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 leading-tight tracking-tight">
              Technology enables the experience. People deliver the care.
            </h2>
            <p className="text-slate-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
              HealingWays combines digital convenience with personalized human support. You can securely upload reports, track your case, and message our team online — while experienced Care Coordinators guide you throughout.
            </p>
          </div>

          {/* Right Highlight Box */}
          <div className="lg:col-span-6 bg-white p-8 sm:p-10 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-center space-y-6">
            <h3 className="text-xl font-black text-blue-950">
              Why patients trust HealingWays
            </h3>
            <ul className="space-y-4 text-base text-slate-800">
              {trustReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-3">
                  <span className="text-emerald-600 font-black text-lg">•</span>
                  <span className="font-semibold text-slate-800">{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}