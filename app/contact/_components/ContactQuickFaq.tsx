'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ChevronDown } from 'lucide-react';

const quickFaqs = [
  {
    id: '1',
    question: 'What is HealingWays?',
    answer: 'HealingWays is a global healthcare coordination platform that guides patients through medical consultations, hospital selection, medical travel logistics, and ongoing care coordination.',
  },
  {
    id: '2',
    question: 'What makes HealingWays different from a medical tourism company?',
    answer: 'Unlike traditional medical tourism brokers, HealingWays focuses on individual clinical case reviews, independent hospital quality criteria, and continuous post-treatment advocacy.',
  },
  {
    id: '3',
    question: 'Does HealingWays provide medical treatment?',
    answer: 'No, HealingWays is not a medical facility and does not provide clinical care directly. We connect patients with accredited hospitals and licensed medical specialists.',
  },
];

export default function ContactQuickFAQ() {
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
        <div className="text-center space-y-1">
          <span className="text-xs font-semibold uppercase tracking-wider text-blue-600">
            BEFORE YOU REACH OUT
          </span>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900">
            A few quick answers
          </h2>
        </div>

        {/* Quick FAQ Accordion */}
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {quickFaqs.map((faq) => {
            const isOpen = openId === faq.id;
            return (
              <div key={faq.id} className="py-4">
                <button
                  onClick={() => toggleAccordion(faq.id)}
                  className="w-full flex items-center justify-between text-left focus:outline-none group"
                >
                  <span className="text-sm font-semibold text-blue-900 group-hover:text-blue-700 transition-colors">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-4 h-4 text-blue-600 flex-shrink-0 transition-transform duration-200 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="mt-2 text-xs sm:text-sm text-gray-600 leading-relaxed pr-4">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="pt-2 text-left">
          <Link
            href="/faq"
            className="text-xs sm:text-sm font-semibold text-blue-900 hover:text-blue-700 inline-flex items-center gap-1 transition-colors"
          >
            View All FAQs &rarr;
          </Link>
        </div>
      </div>
    </section>
  );
}