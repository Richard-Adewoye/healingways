import React from 'react';
import { FileText, MessageSquare, Hospital, Briefcase, Heart } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: FileText,
    title: 'Book a Consultation',
    desc: 'Tell us about your medical situation — no prior technical knowledge required.',
  },
  {
    step: 2,
    icon: MessageSquare,
    title: 'Share Medical Reports',
    desc: 'Securely upload diagnosis notes, scans, and doctor reports to your encrypted portal.',
  },
  {
    step: 3,
    icon: Hospital,
    title: 'Receive Recommendations',
    desc: 'Our clinical board prepares certified hospital and specialist placements.',
  },
  {
    step: 4,
    icon: Briefcase,
    title: 'Coordinate Logistics',
    desc: 'We arrange accommodation, medical visas, schedules, and airport logistics.',
  },
  {
    step: 5,
    icon: Heart,
    title: 'Focus On Recovery',
    desc: 'We monitor your hospital care and post-operative recovery every step.',
  },
];

export default function SectionFive() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
        <div>
          <span className="text-xs font-bold tracking-wider text-blue-700 uppercase bg-blue-50 px-3 py-1 rounded-md">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight mt-3">
            From first message to full recovery
          </h2>
          <p className="text-slate-600 text-base sm:text-lg max-w-2xl mt-2 leading-relaxed">
            A clear, 5-stage medical navigation pathway engineered to eliminate uncertainty.
          </p>
        </div>

        <div className="relative">
          {/* Desktop Connector Line */}
          <div className="hidden lg:block absolute top-8 left-12 right-12 h-0.5 bg-slate-200 -z-0" />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col items-center text-center space-y-3.5 group">
                  <div className="relative">
                    <div className="w-16 h-16 bg-emerald-50 border border-emerald-100 rounded-2xl flex items-center justify-center text-emerald-700 group-hover:scale-105 group-hover:bg-emerald-100 transition-all shadow-xs">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="absolute -top-2 -right-2 bg-blue-950 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold ring-2 ring-white shadow-xs">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base leading-snug">{item.title}</h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-xs">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
