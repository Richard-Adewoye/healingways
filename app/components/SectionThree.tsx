import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { CheckCircle2 } from 'lucide-react';

const highlights = [
  '8+ years coordinating specialized patient care',
  '40+ partner hospitals across our accredited network',
  'Round-the-clock support when you need it most',
  'A dedicated care coordinator, from day one to discharge',
];

export default function SectionThree() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-white border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Left */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 tracking-tight leading-tight">
              Trusted care, wherever your journey leads
            </h2>
            <p className="text-slate-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
              We've built real relationships with hospitals and specialists across our network, so you're never starting from zero. Wherever treatment takes you, someone who knows the way is already there.
            </p>
            <ul className="space-y-4">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 text-slate-800 text-base font-semibold">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <div className="pt-2">
              <Link 
                href="/consultation"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all cursor-pointer"
              >
                Book a Consultation
              </Link>
            </div>
          </div>

          {/* Image Right with Backdrop Accent */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 transform translate-x-3 -translate-y-3 rounded-2xl -z-10" />
            <Image
              src="/images/image-four.avif"
              alt="Medical Consultation"
              width={600}
              height={400}
              className="rounded-2xl object-cover shadow-md w-full h-auto"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
