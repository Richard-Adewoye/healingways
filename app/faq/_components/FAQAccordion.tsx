'use client';

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

export interface FAQItem {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export const faqData: FAQItem[] = [
  {
    id: '1',
    category: 'About HealingWays',
    question: 'What is HealingWays?',
    answer: 'HealingWays is a global healthcare coordination platform that guides patients through medical consultations, hospital selection, medical travel logistics, document translation, and post-treatment follow-up.',
  },
  {
    id: '2',
    category: 'About HealingWays',
    question: 'What makes HealingWays different from a medical tourism company?',
    answer: 'Unlike high-volume agency brokers, HealingWays focuses on individual clinical case reviews, independent hospital quality criteria, and continuous post-treatment advocacy rather than commission-driven bookings.',
  },
  {
    id: '3',
    category: 'About HealingWays',
    question: 'Does HealingWays provide medical treatment?',
    answer: 'No, HealingWays is not a healthcare facility and does not directly provide medical treatment. We connect patients with verified hospitals and licensed medical specialists.',
  },
  {
    id: '4',
    category: 'Getting Started',
    question: 'How do I begin my healthcare journey with HealingWays?',
    answer: 'You start by submitting an initial consultation request or contacting our advisory team. We will review your medical case and recommend a structured care plan.',
  },
  {
    id: '5',
    category: 'Getting Started',
    question: 'Do I need to know exactly what service I need first?',
    answer: 'No. Our team performs an intake consultation to assess your overall medical, travel, and budget situation to match you with the exact services required.',
  },
  {
    id: '6',
    category: 'Getting Started',
    question: 'Can someone contact HealingWays on behalf of a family member?',
    answer: 'Yes, family members or designated care representatives can initiate inquiries and manage logistical support on behalf of the patient.',
  },
  {
    id: '7',
    category: 'Hospitals & Specialists',
    question: 'How does HealingWays help me find the right hospital or specialist?',
    answer: 'We evaluate healthcare providers based on clinical excellence, specialty accreditation, patient outcomes, and international care standards before making tailored recommendations.',
  },
  {
    id: '8',
    category: 'Hospitals & Specialists',
    question: 'Can I choose any hospital from your website?',
    answer: 'Our website displays a highlighted selection of partner institutions. During consultation, we recommend specific options best suited to your exact diagnosis and medical needs.',
  },
  {
    id: '9',
    category: 'International Healthcare Support',
    question: 'Does HealingWays only support treatment abroad?',
    answer: 'No, we assist with both local specialized healthcare navigation and international medical travel depending on where the appropriate care is located.',
  },
  {
    id: '10',
    category: 'Hospitals & Specialists',
    question: 'Does HealingWays guarantee treatment success?',
    answer: 'No, medical treatments always carry inherent clinical risks. HealingWays facilitates access to top-tier care providers but cannot guarantee specific medical outcomes.',
  },
  {
    id: '11',
    category: 'Medical Reports & Documents',
    question: 'Can HealingWays help me understand my medical reports?',
    answer: 'Yes, we provide medical report translation and clinical summarization services to help you clearly understand diagnoses, treatment options, and provider recommendations.',
  },
  {
    id: '12',
    category: 'Medical Reports & Documents',
    question: 'What documents should I provide?',
    answer: 'Typically, you should share recent diagnostic imaging, blood tests, doctor consultation notes, pathology reports, and a summary of your medical history.',
  },
  {
    id: '13',
    category: 'Accommodation & Logistics',
    question: 'Does HealingWays own hotels or accommodation facilities?',
    answer: 'No, but we partner with vetted lodging providers, serviced apartments, and recovery suites conveniently located near our partner hospital networks.',
  },
  {
    id: '14',
    category: 'Accommodation & Logistics',
    question: 'What happens if my preferred accommodation is unavailable?',
    answer: 'Our dedicated logistics team immediately provides comparable alternative options nearby that meet healthcare accessibility and comfort standards.',
  },
  {
    id: '15',
    category: 'Visa Support',
    question: 'Does HealingWays guarantee visa approval?',
    answer: 'No, visa decisions rest entirely with immigration authorities. However, we supply official hospital invitation letters and visa support documentation to strengthen your application.',
  },
  {
    id: '16',
    category: 'After Treatment Support',
    question: 'Does HealingWays support patients after treatment?',
    answer: 'Yes, our team facilitates follow-up consultations, post-surgical rehabilitation planning, and ongoing communication between you and your attending medical team.',
  },
  {
    id: '17',
    category: 'Costs & Payments',
    question: 'How much does HealingWays charge?',
    answer: 'Pricing depends on the scope of support required (e.g., full medical travel coordination vs. single report translation). Transparent estimates are provided upfront during your initial consultation.',
  },
  {
    id: '18',
    category: 'Privacy & Security',
    question: 'Is my medical information secure?',
    answer: 'Yes, we adhere to strict international data privacy and confidentiality standards to ensure your medical records and personal data remain protected at all times.',
  },
];

export const categories = [
  'All',
  'About HealingWays',
  'Getting Started',
  'Hospitals & Specialists',
  'International Healthcare Support',
  'Medical Reports & Documents',
  'Accommodation & Logistics',
  'Visa Support',
  'After Treatment Support',
  'Costs & Payments',
  'Privacy & Security',
] as const;

interface FAQAccordionProps {
  searchQuery: string;
}

export default function FAQAccordion({ searchQuery }: FAQAccordionProps) {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [openId, setOpenId] = useState<string | null>(null);

  const toggleAccordion = (id: string) => {
    setOpenId(openId === id ? null : id);
  };

  const filteredFAQs = faqData.filter((item) => {
    const matchesCategory =
      selectedCategory === 'All' || item.category === selectedCategory;
    const matchesSearch =
      item.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.answer.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <section className="py-12 bg-slate-50 min-h-[500px]">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Category Filters */}
        <div className="flex flex-wrap items-center justify-center gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Accordion Items List */}
        <div className="divide-y divide-gray-200 border-t border-b border-gray-200">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((faq) => {
              const isOpen = openId === faq.id;
              return (
                <div key={faq.id} className="py-4 transition-colors">
                  <button
                    onClick={() => toggleAccordion(faq.id)}
                    className="w-full flex items-center justify-between text-left focus:outline-none group"
                  >
                    <span className="text-sm sm:text-base font-semibold text-blue-900 group-hover:text-blue-700 transition-colors pr-4">
                      {faq.question}
                    </span>
                    <ChevronDown
                      className={`w-4 h-4 text-blue-600 flex-shrink-0 transition-transform duration-200 ${
                        isOpen ? 'rotate-180' : ''
                      }`}
                    />
                  </button>
                  {isOpen && (
                    <div className="mt-3 pr-6 text-xs sm:text-sm text-gray-600 leading-relaxed">
                      {faq.answer}
                    </div>
                  )}
                </div>
              );
            })
          ) : (
            <div className="py-12 text-center text-gray-500 text-sm">
              No questions found matching your search criteria.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}