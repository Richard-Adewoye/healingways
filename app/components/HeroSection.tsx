import React from 'react';
import Image from 'next/image';
import Link from 'next/link';

export default function HeroSection() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-r from-[#033ca8] via-[#0444c5] to-[#012a80] text-white py-16 sm:py-20 lg:py-24">
      {/* Top-left green decorative circle */}
      <div className="absolute -top-24 -left-24 w-72 h-72 sm:w-96 sm:h-96 bg-[#34a86b] rounded-full pointer-events-none z-0 opacity-90" />

      {/* Bottom-right lighter blue decorative ring element */}
      <div className="absolute -bottom-40 -right-20 w-[500px] h-[500px] sm:w-[650px] sm:h-[650px] bg-[#1a6eff] rounded-full pointer-events-none z-0 opacity-70" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          
          {/* Left Content Column */}
          <div className="lg:col-span-6 space-y-6">
            {/* Top Tag Badge */}
            <div>
              <span className="inline-flex items-center gap-2 px-4 py-2 bg-white text-emerald-950 text-xs sm:text-sm font-extrabold rounded-full shadow-md tracking-wide">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                Healthcare Navigation, Simplified
              </span>
            </div>

            {/* Main Headline */}
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-[2.85rem] font-black leading-[1.2] text-white tracking-tight drop-shadow-sm">
              We provide specialized guidance to help you and your family make better healthcare decisions.
            </h1>

            <p className="text-slate-100 text-base sm:text-lg lg:text-xl leading-relaxed max-w-xl font-normal">
              From specialist placement and clinical review to travel logistics and recovery monitoring — compassionate, clear guidance every step of the way.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-2">
              <Link
                href="/consultation"
                id="hero-start-consultation-btn"
                className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold text-base rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden transition-all flex items-center justify-center cursor-pointer"
              >
                Start Consultation
              </Link>
              <Link
                href="/login"
                id="hero-patient-login-btn"
                className="px-6 py-3.5 bg-white hover:bg-slate-100 active:bg-slate-200 text-slate-950 font-bold text-base rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden transition-all flex items-center justify-center cursor-pointer"
              >
                Patient Login
              </Link>
              <Link
                href="/services"
                id="hero-explore-services-btn"
                className="px-6 py-3.5 bg-white/20 hover:bg-white/30 active:bg-white/35 text-white font-bold text-base rounded-xl border-2 border-white/40 focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden transition-all flex items-center justify-center cursor-pointer"
              >
                Explore Services
              </Link>
            </div>
          </div>

          {/* Right Image Graphic & Tooltips */}
          <div className="lg:col-span-6 relative flex justify-center items-center mt-6 lg:mt-0">
            {/* Background highlight glow */}
            <div className="absolute w-[280px] h-[280px] sm:w-[400px] sm:h-[400px] bg-[#1e75ff]/80 rounded-full z-0 filter blur-2xl opacity-60 pointer-events-none" />

            <div className="relative z-10 w-full max-w-lg flex justify-center items-center">
              <Image
                src="/images/hero-image.png"
                alt="Patient guided by HealingWays healthcare service"
                width={450}
                height={530}
                className="w-full h-auto max-w-[360px] sm:max-w-[400px] object-contain relative z-10 drop-shadow-2xl"
                priority
              />

              {/* Floating Node Tag 1 (Left side) */}
              <div className="absolute -left-2 sm:-left-6 bottom-20 sm:bottom-24 z-20 flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 bg-slate-950/95 backdrop-blur-md rounded-xl border border-white/30 shadow-2xl">
                <span className="text-xs sm:text-sm text-white font-bold whitespace-nowrap tracking-wide">
                  You don't have to figure it out alone
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#3cd070] shrink-0 animate-pulse" />
              </div>

              {/* Floating Node Tag 2 (Top right) */}
              <div className="absolute -right-2 sm:-right-6 top-6 sm:top-8 z-20 flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 bg-slate-950/95 backdrop-blur-md rounded-xl border border-white/30 shadow-2xl">
                <span className="text-xs sm:text-sm text-white font-bold whitespace-nowrap tracking-wide">
                  HealingWays makes connection
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#3cd070] shrink-0 animate-pulse" />
              </div>

              {/* Floating Node Tag 3 (Bottom right) */}
              <div className="absolute right-0 sm:right-2 -bottom-4 z-20 flex items-center gap-2.5 px-3.5 sm:px-4 py-2.5 bg-slate-950/95 backdrop-blur-md rounded-xl border border-white/30 shadow-2xl">
                <span className="text-xs sm:text-sm text-white font-bold whitespace-nowrap tracking-wide">
                  Seamless medical travel navigation
                </span>
                <span className="w-2.5 h-2.5 rounded-full bg-[#3cd070] shrink-0 animate-pulse" />
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
