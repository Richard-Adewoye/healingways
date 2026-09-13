import React from 'react';

export default function AboutJourneyCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Network Teaser */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-900 uppercase bg-blue-100/90 px-3.5 py-1.5 rounded-lg border border-blue-200/60">
            OUR NETWORK
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-blue-950 mt-2 tracking-tight">
            Trusted healthcare connections across West Africa, Asia & the Arab world
          </h2>
          <p className="text-base sm:text-lg text-slate-700 leading-relaxed font-normal">
            Explore the hospitals and specialists we work with to support your care.
          </p>
          <div className="pt-2">
            <a href="/partner-hospitals" className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-emerald-950 font-bold rounded-xl border-2 border-emerald-600 text-base transition-all shadow-sm hover:shadow-md cursor-pointer">
              Explore Our Partner Network
            </a>
          </div>
        </div>

        {/* CTA Card Banner */}
        <div className="bg-slate-950 rounded-3xl p-8 sm:p-14 text-center text-white space-y-6 border border-slate-800 shadow-xl">
          <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black tracking-tight text-white">
            You don't have to navigate your healthcare journey alone.
          </h3>
          <p className="text-slate-200 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed font-normal">
            Whether you're exploring treatment locally or internationally, our team is ready to guide you toward the care you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="/consultation"
              className="px-6 py-3.5 bg-emerald-600 hover:bg-emerald-500 active:bg-emerald-700 text-white font-bold rounded-xl shadow-md hover:shadow-lg focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden text-base transition-all cursor-pointer"
            >
              Book Your Consultation
            </a>
            <a
              href="/contact"
              className="px-6 py-3.5 bg-white/20 hover:bg-white/30 active:bg-white/35 border-2 border-white/40 text-white font-bold rounded-xl focus-visible:ring-2 focus-visible:ring-white focus-visible:outline-hidden text-base transition-all cursor-pointer"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}