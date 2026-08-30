import React from 'react';

export default function AboutStory() {
  return (
    <section className="py-16 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-6">
        <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
          OUR STORY
        </span>
        <h2 className="text-3xl sm:text-4xl font-bold text-blue-900 leading-snug">
          Because no one should navigate healthcare alone
        </h2>
        <div className="space-y-4 text-gray-600 leading-relaxed text-sm sm:text-base">
          <p>
            Too many patients spend valuable time searching for answers when they should be focusing on recovery. Finding the right hospital, understanding treatment options, arranging travel, translating medical reports, and coordinating accommodation can quickly become overwhelming.
          </p>
          <p>
            HealingWays was created to simplify that journey — providing trusted guidance and coordinated support, so patients can access quality healthcare with greater confidence and peace of mind.
          </p>
        </div>
      </div>
    </section>
  );
}