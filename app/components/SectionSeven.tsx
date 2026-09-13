'use client';

import React from 'react';
import Link from 'next/link';
import { Star, Quote, CheckCircle2 } from 'lucide-react';

const testimonials = [
  {
    patientName: 'Amina Bello',
    location: 'Abuja, Nigeria',
    condition: 'Cardiac Valve Replacement',
    hospital: 'Lagoon Specialist Hospital, Lagos',
    quote:
      'HealingWays transformed what felt like an impossible medical situation into a smooth, guided process. From matching us with the chief cardiac surgeon to coordinating our accommodation, our coordinator was always a call away.',
    rating: 5,
  },
  {
    patientName: 'Kofi Mensah',
    location: 'Accra, Ghana',
    condition: 'Complex Orthopedic Surgery',
    hospital: 'Global Specialist Medical Center',
    quote:
      'The clinical translation and second opinion review provided total clarity before we made our surgical decision. Having a coordinator manage hospital intake and visa documents gave my entire family peace of mind.',
    rating: 5,
  },
  {
    patientName: 'Dr. Chidi Okafor',
    location: 'Enugu, Nigeria',
    condition: 'Oncology Diagnostic & Treatment',
    hospital: 'Accra Heart & Oncology Institute',
    quote:
      'As a physician seeking specialized oncology care for my brother, I was thoroughly impressed by HealingWays’ strict clinical placement protocols, fast communication, and compassionate post-procedure follow-up.',
    rating: 5,
  },
];

export default function SectionSeven() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60" id="patient-stories">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div>
            <span className="text-xs sm:text-sm font-extrabold tracking-wider text-emerald-900 uppercase bg-emerald-100/90 px-3.5 py-1.5 rounded-lg border border-emerald-200/60">
              PATIENT STORIES
            </span>
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 tracking-tight mt-3">
              Real journeys, guided with care
            </h2>
            <p className="text-slate-700 text-base sm:text-lg lg:text-xl max-w-xl mt-2 leading-relaxed font-normal">
              Hear directly from patients and families who navigated critical medical care with dedicated HealingWays guidance.
            </p>
          </div>
          <div className="shrink-0">
            <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-4 py-2.5 rounded-2xl">
              <div className="flex text-amber-500">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 fill-amber-400 text-amber-400" />
                ))}
              </div>
              <span className="text-base font-extrabold text-slate-900">4.9/5</span>
              <span className="text-xs text-slate-700 font-bold border-l border-slate-300 pl-2">Over 1,200+ Guided Patients</span>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {testimonials.map((t, idx) => (
            <div
              key={idx}
              className="bg-slate-50 p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-slate-300 transition-all"
            >
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex text-amber-500">
                    {[...Array(t.rating)].map((_, rIdx) => (
                      <Star key={rIdx} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <Quote className="w-7 h-7 text-blue-200" />
                </div>

                <p className="text-base sm:text-[17px] text-slate-800 leading-relaxed font-normal">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>

              <div className="pt-6 border-t border-slate-200/80 mt-6 space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-extrabold text-slate-950 text-base">{t.patientName}</h4>
                    <p className="text-sm text-slate-700 font-medium">{t.location}</p>
                  </div>
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-emerald-800 bg-emerald-100/80 px-2.5 py-1 rounded-full">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                    Verified Patient
                  </span>
                </div>
                <p className="text-xs sm:text-sm text-slate-700 font-semibold bg-white border border-slate-200 px-3 py-1.5 rounded-lg">
                  {t.condition} • <span className="text-blue-900">{t.hospital}</span>
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-2">
          <Link
            href="/consultation"
            className="inline-flex items-center justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all cursor-pointer"
          >
            Start Your Guided Care Consultation
          </Link>
        </div>
      </div>
    </section>
  );
}
