'use client';

import React from 'react';

const contactOptions = [
  {
    title: 'Begin a Consultation',
    description: 'For patients and families seeking medical support.',
    href: '#contact-form',
  },
  {
    title: 'Existing Patient Support',
    description: 'Already have an active case? Access your portal.',
    href: '#',
  },
  {
    title: 'Partnership Opportunities',
    description: 'For hospitals and healthcare organizations.',
    href: '#contact-form',
  },
  {
    title: 'General Questions',
    description: "Send us a message and we'll follow up.",
    href: '#contact-form',
  },
];

export default function ContactHero() {
  return (
    <section className="py-16 md:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Header Block */}
        <div className="max-w-3xl space-y-4">
          <span className="inline-block px-3.5 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-full">
            Contact HealingWays
          </span>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
            We're here to help you find<br /> the right path to care.
          </h1>
          <p className="text-sm sm:text-base text-gray-600 max-w-2xl">
            Whether you have questions, need guidance, or are ready to begin — our team is available to listen and support you.
          </p>
        </div>

        {/* 4 Option Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {contactOptions.map((option, idx) => (
            <a
              key={idx}
              href={option.href}
              className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow group flex flex-col justify-between"
            >
              <div className="space-y-2">
                <h3 className="text-base font-bold text-blue-900 group-hover:text-blue-700 transition-colors">
                  {option.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {option.description}
                </p>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}