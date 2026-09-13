import React from 'react';
import Link from 'next/link';
import { FileText, Building2, MessageSquare, Home, CreditCard, HeartHandshake, ArrowRight } from 'lucide-react';

const services = [
  {
    icon: FileText,
    title: 'Medical Report Translation',
    description: 'Ensuring your medical documents are clearly translated and structured for every specialist involved in your care.',
  },
  {
    icon: Building2,
    title: 'Hospital & Specialist Placement',
    description: 'Personalized matching with verified international hospitals and board-certified clinical specialists.',
  },
  {
    icon: MessageSquare,
    title: 'Clinical Advisory & Consulting',
    description: 'Expert medical second opinions to help you understand all treatment pathways and therapeutic options.',
  },
  {
    icon: Home,
    title: 'Medical Accommodation & Logistics',
    description: 'Coordinated accessible lodging, airport medical transfers, and patient-centered hospitality services.',
  },
  {
    icon: CreditCard,
    title: 'Visa Processing & Support',
    description: 'Fast-track medical visa invitation letters, consulate guidance, and official travel documentation.',
  },
  {
    icon: HeartHandshake,
    title: 'Post Surgery Support & Advocacy',
    description: 'Dedicated post-discharge rehabilitation tracking, telemedicine follow-ups, and long-term recovery advocacy.',
  },
];

export default function SectionFour() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/60" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-900 uppercase bg-blue-100/90 px-3.5 py-1.5 rounded-lg border border-blue-200/60">
            WHAT WE DO
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 tracking-tight mt-3">
            Support for every stage of your healthcare journey
          </h2>
          <p className="text-slate-700 text-base sm:text-lg lg:text-xl max-w-2xl mt-2 leading-relaxed font-normal">
            We don't sell isolated packages — our clinical team activates tailored support based on your unique case file.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
              >
                <div className="space-y-4">
                  <div className="w-12 h-12 bg-emerald-50 rounded-xl flex items-center justify-center text-emerald-700 group-hover:bg-emerald-100 transition-colors">
                    <Icon className="w-6 h-6" />
                  </div>
                  <h3 className="text-xl font-bold text-slate-900 group-hover:text-blue-950 transition-colors">{srv.title}</h3>
                  <p className="text-base text-slate-700 leading-relaxed font-normal">{srv.description}</p>
                </div>
                <div className="pt-6">
                  <Link 
                    href="/services" 
                    className="text-base font-bold text-blue-800 hover:text-blue-950 inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden rounded-md"
                  >
                    Learn more <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>

        <div className="text-center pt-4">
          <Link 
            href="/services" 
            className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-emerald-900 font-bold text-base rounded-xl border-2 border-emerald-600 shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all cursor-pointer"
          >
            View All Services
          </Link>
        </div>
      </div>
    </section>
  );
}
