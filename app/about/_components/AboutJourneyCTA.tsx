import React from 'react';

export default function AboutJourneyCTA() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        {/* Network Teaser */}
        <div className="text-center space-y-4 max-w-3xl mx-auto">
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            OUR NETWORK
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-blue-900">
            Trusted healthcare connections across West Africa, Asia & the Arab world
          </h2>
          <p className="text-sm text-gray-600">
            Explore the hospitals and specialists we work with to support your care.
          </p>
          <div>
            <button className="px-6 py-2.5 bg-white hover:bg-gray-50 text-emerald-700 font-medium rounded-lg border border-emerald-600 text-sm transition">
              Explore Our Partner Network
            </button>
          </div>
        </div>

        {/* CTA Card Banner */}
        <div className="bg-blue-900 rounded-2xl p-8 sm:p-12 text-center text-white space-y-6">
          <h3 className="text-2xl sm:text-3xl font-bold">
            You don't have to navigate your healthcare journey alone.
          </h3>
          <p className="text-blue-100 text-sm sm:text-base max-w-2xl mx-auto">
            Whether you're exploring treatment locally or internationally, our team is ready to guide you toward the care you need.
          </p>
          <div className="flex flex-wrap justify-center gap-4 pt-2">
            <a
              href="#consultation"
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm text-sm transition"
            >
              Book Your Consultation
            </a>
            <a
              href="#contact"
              className="px-6 py-3 bg-transparent hover:bg-blue-800 border border-blue-400 text-white font-medium rounded-lg text-sm transition"
            >
              Contact Us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}