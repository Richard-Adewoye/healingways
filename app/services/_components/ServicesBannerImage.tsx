'use client';

import React from 'react';
import Image from 'next/image';

export default function ServicesBannerImage() {
  return (
    <section className="pb-16 bg-white">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative w-full h-[280px] sm:h-[380px] md:h-[420px] rounded-2xl overflow-hidden shadow-sm">
          <Image
            src="/images/services-doctor-banner.jpg"
            alt="Doctor holding medical file clipboard"
            fill
            className="object-cover object-top"
            priority
          />
        </div>
      </div>
    </section>
  );
}