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
            <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
              OUR APPROACH
            </span>
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 leading-tight">
              Technology enables the experience. People deliver the care.
            </h2>
            <p className="text-gray-600 text-sm sm:text-base leading-relaxed">
              HealingWays combines digital convenience with personalized human support. You can securely upload reports, track your case, and message our team online — while experienced Care Coordinators guide you throughout.
            </p>
          </div>

          {/* Right Highlight Box */}
          <div className="lg:col-span-6 bg-blue-50/70 p-8 rounded-2xl border border-blue-100 flex flex-col justify-center space-y-4">
            <h3 className="text-lg font-bold text-blue-900">
              Why patients trust HealingWays
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              {trustReasons.map((reason, idx) => (
                <li key={idx} className="flex items-start space-x-2">
                  <span className="text-blue-600 font-bold">•</span>
                  <span>{reason}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}