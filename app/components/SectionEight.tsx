'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

const faqs = [
  'What is HealingWays?',
  'What makes HealingWays different from a medical tourism company?',
  'Does HealingWays provide medical treatment?',
  'How do I begin my healthcare journey with HealingWays?',
  'Do I need to know exactly what service I need first?',
];

export default function SectionEight() {
  const [openIdx, setOpenIdx] = useState<number | null>(null);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl font-bold text-blue-900 mt-1">
            Answers before you begin
          </h2>
        </div>

        <div className="divide-y divide-gray-200">
          {faqs.map((question, idx) => (
            <div key={idx} className="py-4">
              <button
                onClick={() => toggleAccordion(idx)}
                className="w-full flex justify-between items-center text-left focus:outline-none"
              >
                <span className="font-semibold text-blue-900 text-sm sm:text-base">
                  {question}
                </span>
                <ChevronDown
                  className={`w-4 h-4 text-blue-600 transition-transform ${
                    openIdx === idx ? 'transform rotate-180' : ''
                  }`}
                />
              </button>
              {openIdx === idx && (
                <p className="mt-3 text-xs sm:text-sm text-gray-600 leading-relaxed">
                  HealingWays provides medical navigation and care coordination services, matching patients with trusted healthcare providers suited to their explicit medical situation.
                </p>
              )}
            </div>
          ))}
        </div>

        <div>
          <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
            View All FAQs &rarr;
          </a>
        </div>
      </div>
    </section>
  );
}