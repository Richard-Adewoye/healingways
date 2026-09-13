import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { PhoneCall } from 'lucide-react';

export default function SectionNine() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-br from-blue-950 via-blue-900 to-sky-900 rounded-3xl overflow-hidden p-8 sm:p-12 lg:p-14 text-white shadow-xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Specialist Image */}
            <div className="relative h-64 sm:h-80 md:h-96 w-full rounded-2xl overflow-hidden shadow-lg border border-white/10">
              <Image
                src="/images/samira-support.jpg"
                alt="24/7 Patient Support Specialist"
                fill
                className="object-cover object-top"
              />
              <div className="absolute bottom-3 left-3 bg-slate-900/80 backdrop-blur-md px-3.5 py-1.5 rounded-xl border border-white/20 text-xs font-semibold flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Live Patient Coordination
              </div>
            </div>

            {/* Right Call To Action Content */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-white/15 text-blue-200 text-xs font-bold rounded-full backdrop-blur-xs">
                Dedicated Care Coordinators
              </div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold leading-tight tracking-tight">
                We operate 24/7 support for all our patients throughout their medical journey.
              </h2>
              <p className="text-blue-100 text-sm sm:text-base leading-relaxed">
                Speak directly with clinical advisors who understand hospital protocols, emergency responses, and cross-border medical scheduling.
              </p>
              <div className="flex flex-wrap gap-4 pt-2">
                <Link
                  href="/consultation"
                  className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-sm sm:text-base rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden transition-all inline-flex items-center justify-center cursor-pointer"
                >
                  Book Consultation
                </Link>
                <Link
                  href="/contact"
                  className="px-6 py-3.5 bg-white/15 hover:bg-white/25 active:bg-white/30 text-white font-bold text-sm sm:text-base rounded-xl border border-white/30 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden transition-all inline-flex items-center justify-center gap-2 cursor-pointer"
                >
                  <PhoneCall className="w-4 h-4" />
                  <span>Call Support</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
