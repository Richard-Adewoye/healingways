import React from 'react';
import Image from 'next/image';
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
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        {/* Top Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {valueProps.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm flex items-center space-x-4">
                <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="font-semibold text-gray-800 text-sm">{item.title}</span>
              </div>
            );
          })}
        </div>

        {/* Bottom Content Split */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 transform -translate-x-4 -translate-y-4 rounded-xl -z-10" />
            <Image
              src="/images/image-three.avif"
              alt="Medical Coordinators"
              width={600}
              height={400}
              className="rounded-xl object-cover shadow-md"
            />
          </div>

          <div className="space-y-6">
            <h2 className="text-3xl font-bold text-blue-900">
              Confident decisions, guided by people who know the way
            </h2>
            <p className="text-gray-600">
              From your first conversation to your final follow-up, our team coordinates every detail of your care — so you can focus on getting better, not on logistics.
            </p>
            <ul className="space-y-3">
              {checkPoints.map((pt, idx) => (
                <li key={idx} className="flex items-start space-x-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{pt}</span>
                </li>
              ))}
            </ul>
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition">
              Book a Consultation
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}