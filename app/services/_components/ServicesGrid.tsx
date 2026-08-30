'use client';

import React from 'react';
import Link from 'next/link';
import { 
  FileText, 
  Building2, 
  MessageSquare, 
  Home, 
  Plane, 
  HeartHandshake 
} from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'Medical Report Translation',
    description: 'Ensuring your medical documents are clearly understood by every healthcare provider involved in your care.',
    href: '#translation',
  },
  {
    icon: Building2,
    title: 'Hospital & Specialist Placement',
    description: 'Personalized guidance toward hospitals and specialists suited to your specific healthcare needs.',
    href: '#placement',
  },
  {
    icon: MessageSquare,
    title: 'Clinical Advisory & Consulting',
    description: 'Expert guidance to help you understand your options before making important healthcare decisions.',
    href: '#advisory',
  },
  {
    icon: Home,
    title: 'Medical Accommodation & Logistics',
    description: 'Coordinated accommodation and travel logistics so you can focus on treatment, not arrangements.',
    href: '#logistics',
  },
  {
    icon: Plane,
    title: 'Visa Processing & Support',
    description: 'Guidance through the documentation required for healthcare-related travel.',
    href: '#visa',
  },
  {
    icon: HeartHandshake,
    title: 'Post Surgery Support & Advocacy',
    description: 'Continued support and advocacy through your recovery, long after treatment ends.',
    href: '#advocacy',
  },
];

export default function ServicesGrid() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div className="space-y-4">
                  <div className="w-10 h-10 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900 leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {service.description}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Learn more <span className="ml-1">→</span>
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}