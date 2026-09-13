import React from 'react';
import Image from 'next/image';

export default function AboutHero() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <span className="inline-block px-3.5 py-1.5 bg-emerald-100 text-emerald-950 text-xs sm:text-sm font-extrabold rounded-lg border border-emerald-200">
              About HealingWays
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-blue-950 leading-tight tracking-tight">
              More than a healthcare service — a trusted guide on your journey to better health.
            </h1>
            <p className="text-slate-700 text-base sm:text-lg lg:text-xl leading-relaxed font-normal">
              We help patients and families make confident healthcare decisions by connecting them with trusted hospitals and specialists, locally or internationally, guiding every step with compassion, experience, and personalized support.
            </p>
            <div className="pt-2">
              <a
                href="/consultation"
                className="inline-flex items-center justify-center px-6 py-3.5 bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all text-base cursor-pointer"
              >
                Book a Consultation
              </a>
            </div>
          </div>

          {/* Right Image Container */}
          <div className="relative flex justify-center">
            <div className="absolute inset-0 bg-blue-100 transform translate-x-4 translate-y-4 rounded-2xl -z-10" />
            <div className="relative w-full max-w-lg h-[350px] sm:h-[400px] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/images/about-image.avif"
                alt="Medical team performing surgery"
                fill
                className="object-cover"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}