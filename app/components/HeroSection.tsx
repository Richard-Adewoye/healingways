import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-[#004bbd] via-[#0043b2] to-[#00388d] text-white pt-12 sm:pt-16 lg:pt-20 pb-12 sm:pb-0">
      {/* Top-left green organic decorative shape */}
      <div 
        className="absolute -top-16 -left-16 w-56 h-56 sm:w-72 sm:h-72 lg:w-80 lg:h-80 bg-[#2ea866] rounded-full pointer-events-none z-0 opacity-95"
        aria-hidden="true" 
      />

      {/* Sweeping decorative blue ribbon path in the background */}
      <svg
        className="absolute right-0 bottom-0 w-[550px] sm:w-[700px] lg:w-[850px] h-[360px] sm:h-[450px] pointer-events-none z-0"
        viewBox="0 0 850 450"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M 850 300 C 650 380, 480 340, 360 220 C 280 140, 200 120, 100 180"
          stroke="#2087fa"
          strokeWidth="64"
          strokeLinecap="round"
          opacity="0.55"
        />
      </svg>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6 sm:space-y-8 py-4 lg:py-12">
            {/* Top Tag Badge */}
            <div>
              <div className="inline-block bg-white px-3.5 py-1.5 rounded-sm shadow-xs">
                <span className="text-[#1a5b46] font-semibold text-xs sm:text-sm tracking-wide">
                  Healthcare Navigation, Simplified
                </span>
              </div>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[3.25rem] font-bold text-white leading-[1.18] tracking-tight max-w-2xl drop-shadow-xs">
              We provide specialized guidance to help you and your family make better healthcare decisions.
            </h1>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2 sm:pt-4">
              <Link
                href="/consultation"
                id="hero-start-consultation-btn"
                className="px-7 py-3.5 bg-gradient-to-b from-[#38b273] to-[#2fa458] hover:from-[#32a468] hover:to-[#28964f] active:from-[#2a8b49] active:to-[#237d40] text-white font-bold text-sm sm:text-base rounded-2xl shadow-md hover:shadow-lg transition-all flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
              >
                Start Consultation
              </Link>
              <Link
                href="/services"
                id="hero-explore-services-btn"
                className="px-7 py-3.5 bg-[#dbe8f9] hover:bg-[#d0e0f5] active:bg-[#c2d7f0] text-[#2c8d56] font-bold text-sm sm:text-base rounded-2xl shadow-xs transition-all flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Right Image Graphic & Tooltips */}
          <div className="lg:col-span-6 relative flex justify-center items-end mt-4 lg:mt-0 px-2 sm:px-4">
            {/* Crisp vibrant blue circle backdrop framing the patient */}
            <div 
              className="absolute top-4 sm:top-6 lg:top-8 w-[320px] h-[320px] sm:w-[420px] sm:h-[420px] lg:w-[480px] lg:h-[480px] bg-[#0070f3] rounded-full z-0 shadow-lg pointer-events-none"
              aria-hidden="true" 
            />

            <div className="relative z-10 w-full max-w-[420px] sm:max-w-[480px] lg:max-w-[520px] flex justify-center items-end">
              <Image
                src="/images/hero-image.png"
                alt="Patient guided by HealingWays healthcare service"
                width={520}
                height={600}
                className="w-full h-auto max-w-[340px] sm:max-w-[420px] lg:max-w-[480px] object-contain relative z-10 select-none drop-shadow-xl"
                priority
              />

              {/* Floating Tag 1 (Top right side - pushed outwards so it doesn't block patient portrait) */}
              <div className="absolute top-20 sm:top-24 -right-1 sm:-right-6 lg:-right-10 z-20 flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-md pointer-events-none">
                <span className="text-[11px] sm:text-xs lg:text-sm text-white font-medium whitespace-nowrap tracking-wide">
                  Healingways makes connection
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#a3f7bf] shrink-0" />
              </div>

              {/* Floating Tag 2 (Middle left side - positioned clear of face & torso) */}
              <div className="absolute bottom-28 sm:bottom-32 -left-3 sm:-left-8 lg:-left-14 z-20 flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-md pointer-events-none">
                <span className="text-[11px] sm:text-xs lg:text-sm text-white font-medium whitespace-nowrap tracking-wide">
                  You don't have to figure it out alone
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#a3f7bf] shrink-0" />
              </div>

              {/* Floating Tag 3 (Lower right side - positioned at lower corner edge) */}
              <div className="absolute bottom-4 sm:bottom-8 right-0 sm:-right-2 lg:right-2 z-20 flex items-center gap-2 px-3 sm:px-3.5 py-1.5 sm:py-2 bg-white/20 backdrop-blur-md rounded-xl border border-white/30 shadow-md pointer-events-none">
                <span className="text-[11px] sm:text-xs lg:text-sm text-white font-medium whitespace-nowrap tracking-wide">
                  Healthcare tourism can feel impossible
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#a3f7bf] shrink-0" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
