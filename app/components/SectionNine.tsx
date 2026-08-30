import React from 'react';
import Image from 'next/image';

export default function SectionNine() {
  return (
    <section className="py-12 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-sky-700 rounded-2xl overflow-hidden p-8 md:p-12 text-white">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Left Specialist Image */}
            <div className="relative h-64 md:h-80 w-full rounded-xl overflow-hidden">
              <Image
                src="/images/samira-support.jpg"
                alt="24/7 Patient Support Specialist"
                fill
                className="object-cover object-top"
              />
            </div>

            {/* Right Call To Action Content */}
            <div className="space-y-6">
              <h2 className="text-2xl sm:text-3xl font-bold leading-tight">
                We operate a 24/7 support for all our patients throughout their medical journey.
              </h2>
              <div className="flex flex-wrap gap-4">
                <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition">
                  Book Consultation
                </button>
                <button className="px-6 py-3 bg-blue-600 hover:bg-blue-500 border border-blue-400 text-white font-medium rounded-lg transition">
                  Call Samira
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}