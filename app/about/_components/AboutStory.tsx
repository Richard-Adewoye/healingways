import React from 'react';

export default function AboutStory() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left space-y-6">
        <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-900 uppercase bg-blue-100/90 px-3.5 py-1.5 rounded-lg border border-blue-200/60">
          OUR STORY
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 leading-tight tracking-tight">
          Because no one should navigate healthcare alone
        </h2>
        <div className="space-y-5 text-slate-700 leading-relaxed text-base sm:text-lg font-normal">
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