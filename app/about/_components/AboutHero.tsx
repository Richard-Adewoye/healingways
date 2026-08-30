import React from 'react';
import Image from 'next/image';

export default function AboutHero() {
  return (
    <section className="py-16 md:py-24 bg-white overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-6">
            <span className="inline-block px-3 py-1 bg-emerald-100 text-emerald-800 text-xs font-semibold rounded-md">
              About HealingWays
            </span>
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-blue-900 leading-tight">
              More than a healthcare service — a trusted guide on your journey to better health.
            </h1>
            <p className="text-gray-600 text-base sm:text-lg leading-relaxed">
              We help patients and families make confident healthcare decisions by connecting them with trusted hospitals and specialists, locally or internationally, guiding every step with compassion, experience, and personalized support.
            </p>
            <div className="pt-2">
              <a
                href="#consultation"
                className="inline-block px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition"
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