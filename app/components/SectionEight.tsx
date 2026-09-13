'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const homepageFaqs = [
  {
    question: 'What is HealingWays?',
    answer:
      'HealingWays is a healthcare navigation and coordination platform that helps patients and families make confident healthcare decisions — connecting them with trusted hospitals and specialists locally and internationally, with dedicated guidance at every step.',
  },
  {
    question: 'What makes HealingWays different from a medical tourism company?',
    answer:
      'HealingWays does not sell destinations or standardized tourist packages. Our role is clinical navigation: helping you understand your medical options, match with certified healthcare providers, and coordinate practical logistics with your medical team.',
  },
  {
    question: 'Does HealingWays provide medical treatment?',
    answer:
      "No. We do not diagnose, treat, or perform procedures directly. We work alongside accredited doctors, surgeons, and healthcare institutions to help you safely access top-tier medical care.",
  },
  {
    question: 'How do I begin my healthcare journey with HealingWays?',
    answer:
      'It starts with a simple consultation. You share information about your health situation and upload any existing reports. Our clinical team reviews your file to prepare tailored recommendations.',
  },
  {
    question: 'Do I need to know exactly what service I need first?',
    answer:
      "Not at all. Many patients come to us unsure of the exact treatment pathway or specialty required — clarifying your options is the cornerstone of our clinical intake service.",
  },
];

export default function SectionEight() {
  const [openIdx, setOpenIdx] = useState<number | null>(0);

  const toggleAccordion = (idx: number) => {
    setOpenIdx(openIdx === idx ? null : idx);
  };

  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-900 uppercase bg-blue-100/90 px-3.5 py-1.5 rounded-lg border border-blue-200/60">
            COMMON QUESTIONS
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 tracking-tight mt-3">
            Answers before you begin
          </h2>
        </div>

        <div className="space-y-4">
          {homepageFaqs.map((faq, idx) => {
            const isOpen = openIdx === idx;
            return (
              <div 
                key={idx} 
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggleAccordion(idx)}
                  className="w-full flex justify-between items-center text-left p-5 sm:p-6 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden group cursor-pointer"
                  aria-expanded={isOpen}
                >
                  <span className="font-bold text-slate-950 group-hover:text-blue-950 transition-colors text-lg sm:text-xl pr-4">
                    {faq.question}
                  </span>
                  <div className={`p-2 rounded-full bg-slate-100 group-hover:bg-blue-100 transition-colors shrink-0 ${isOpen ? 'bg-blue-100 text-blue-900' : 'text-slate-700'}`}>
                    <ChevronDown
                      className={`w-5 h-5 transition-transform duration-200 ${
                        isOpen ? 'rotate-180 text-blue-800' : ''
                      }`}
                    />
                  </div>
                </button>
                {isOpen && (
                  <div className="px-5 sm:px-6 pb-6 pt-0 text-slate-700 text-base sm:text-lg leading-relaxed border-t border-slate-100 mt-1">
                    <p className="pt-3 font-normal text-slate-700">{faq.answer}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2">
          <Link
            href="/faq"
            className="text-base font-bold text-blue-800 hover:text-blue-950 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden rounded-md transition-colors inline-flex items-center gap-1.5 cursor-pointer"
          >
            View All FAQs &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}
