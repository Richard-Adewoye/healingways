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
    <section className="py-16 sm:py-20 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((service, index) => {
            const Icon = service.icon;
            return (
              <div
                key={index}
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-950 group-hover:text-blue-950 transition-colors leading-snug">
                    {service.title}
                  </h3>
                  <p className="text-slate-700 text-base leading-relaxed font-normal">
                    {service.description}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    href={service.href}
                    className="inline-flex items-center text-base font-bold text-blue-800 hover:text-blue-950 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden rounded-md transition-colors"
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