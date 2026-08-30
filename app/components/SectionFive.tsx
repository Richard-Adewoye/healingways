import React from 'react';
import { FileText, MessageSquare, Hospital, Briefcase, Heart } from 'lucide-react';

const steps = [
  {
    step: 1,
    icon: FileText,
    title: 'Book a Consultation',
    desc: 'Tell us about your healthcare situation — no need to know exactly what you need yet.',
  },
  {
    step: 2,
    icon: MessageSquare,
    title: 'Share Your Medical Reports',
    desc: 'Securely upload relevant documents so our advisors understand your case.',
  },
  {
    step: 3,
    icon: Hospital,
    title: 'Receive Recommendations',
    desc: 'Our team reviews your case and prepares personalized hospital and specialist guidance.',
  },
  {
    step: 4,
    icon: Briefcase,
    title: 'Coordinate Travel & Treatment',
    desc: 'We help arrange accommodation, visas, and logistics around your treatment.',
  },
  {
    step: 5,
    icon: Heart,
    title: 'Focus On Recovery',
    desc: 'We stay connected through treatment and recovery, for as long as you need us.',
  },
];

export default function SectionFive() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            HOW IT WORKS
          </span>
          <h2 className="text-3xl font-bold text-blue-900 mt-1">
            From first message to full recovery
          </h2>
        </div>

        <div className="relative">
          {/* Connector Line */}
          <div className="hidden lg:block absolute top-1/4 left-12 right-12 h-0.5 bg-gray-200 -z-0" />

          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-8 relative z-10">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.step} className="flex flex-col items-center text-center space-y-3">
                  <div className="relative">
                    <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center text-emerald-600">
                      <Icon className="w-7 h-7" />
                    </div>
                    <span className="absolute -top-1 -right-1 bg-blue-900 text-white text-xs w-6 h-6 rounded-full flex items-center justify-center font-bold">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-blue-900 text-base">{item.title}</h3>
                  <p className="text-xs text-gray-600">{item.desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}