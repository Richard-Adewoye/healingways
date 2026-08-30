import React from 'react';
import { FileText, Building2, MessageSquare, Home, CreditCard, HeartHandshake } from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'Medical Report Translation',
    description: 'Ensuring your medical documents are clearly understood by every healthcare provider involved in your care.',
  },
  {
    icon: Building2,
    title: 'Hospital & Specialist Placement',
    description: 'Personalized guidance toward hospitals and specialists suited to your specific healthcare needs.',
  },
  {
    icon: MessageSquare,
    title: 'Clinical Advisory & Consulting',
    description: 'Expert guidance to help you understand your options before making important healthcare decisions.',
  },
  {
    icon: Home,
    title: 'Medical Accommodation & Logistics',
    description: 'Coordinated accommodation and travel logistics so you can focus on treatment, not arrangements.',
  },
  {
    icon: CreditCard,
    title: 'Visa Processing & Support',
    description: 'Guidance through the documentation required for healthcare-related travel.',
  },
  {
    icon: HeartHandshake,
    title: 'Post Surgery Support & Advocacy',
    description: 'Continued support and advocacy through your recovery, long after treatment ends.',
  },
];

export default function SectionFour() {
  return (
    <section className="py-16 bg-slate-50" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            WHAT WE DO
          </span>
          <h2 className="text-3xl font-bold text-blue-900 mt-1">
            Support for every stage of your healthcare journey
          </h2>
          <p className="text-gray-600 max-w-2xl mt-2">
            We don't sell isolated services — our team activates the right support based on your unique case.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center text-emerald-600">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-lg font-bold text-blue-900">{srv.title}</h3>
                  <p className="text-sm text-gray-600">{srv.description}</p>
                </div>
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800 inline-flex items-center">
                  Learn more &rarr;
                </a>
              </div>
            );
          })}
        </div>

        <div className="text-center">
          <button className="px-6 py-2.5 bg-white hover:bg-gray-50 text-emerald-700 font-medium rounded-lg border border-emerald-600 transition">
            View All Services
          </button>
        </div>
      </div>
    </section>
  );
}