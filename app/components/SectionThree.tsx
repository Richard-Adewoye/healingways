import React from 'react';
import Image from 'next/image';
import { CheckCircle2 } from 'lucide-react';

const highlights = [
  '8+ years coordinating patient care',
  '40+ partner hospitals across our network',
  'Round-the-clock support when you need it',
  'A dedicated team, from day one to discharge',
];

export default function SectionThree() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Text Left */}
          <div className="space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold text-blue-900">
              Trusted care, wherever your journey leads
            </h2>
            <p className="text-gray-600">
              We've built real relationships with hospitals and specialists across our network, so you're never starting from zero. Wherever treatment takes you, someone who knows the way is already there.
            </p>
            <ul className="space-y-3">
              {highlights.map((item, idx) => (
                <li key={idx} className="flex items-center space-x-3 text-gray-700">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <button className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg shadow-sm transition">
              Book a Consultation
            </button>
          </div>

          {/* Image Right with Backdrop Accent */}
          <div className="relative">
            <div className="absolute inset-0 bg-emerald-100 transform translate-x-4 -translate-y-4 rounded-xl -z-10" />
            <Image
              src="/images/image-four.avif"
              alt="Medical Consultation"
              width={600}
              height={400}
              className="rounded-xl object-cover shadow-md"
            />
          </div>
        </div>
      </div>
    </section>
  );
}