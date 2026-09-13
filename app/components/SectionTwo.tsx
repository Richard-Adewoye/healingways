import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ShieldCheck, Users, FileText, Heart, CheckCircle2 } from 'lucide-react';

const valueProps = [
  { icon: ShieldCheck, title: 'Trusted healthcare partner' },
  { icon: Users, title: 'Experienced coordinators' },
  { icon: FileText, title: 'Secure document handling' },
  { icon: Heart, title: 'Support through recovery' },
];

const checkPoints = [
  'A thorough review of your diagnosis and medical history',
  'Matched with specialists suited to your specific case',
  'One coordinator with you from consultation to recovery',
  'Clear answers, in plain language, at every step',
];

export default function SectionTwo() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div 
                key={idx} 
                className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex items-center space-x-4"
              >
                <div className="p-3 bg-emerald-50 rounded-xl text-emerald-700 shrink-0">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-bold text-slate-800 text-sm">{item.title}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 transform -translate-x-3 -translate-y-3 rounded-2xl -z-10" />
            <Image
              src="/images/image-three.avif"
              alt="Medical Coordinators"
              width={600}
              height={400}
              className="rounded-2xl object-cover shadow-md w-full h-auto"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-extrabold text-blue-950 tracking-tight leading-tight">
              Confident decisions, guided by people who know the way
            </h2>
            <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
              From your first conversation to your final follow-up, our team coordinates every detail of your care — so you can focus on getting better, not on logistics.
            </p>
            <ul className="space-y-3.5">
              {checkPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-slate-700 text-sm sm:text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Link 
                href="/consultation"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm rounded-xl shadow-xs hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all cursor-pointer"
              >
                Book a Consultation
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
