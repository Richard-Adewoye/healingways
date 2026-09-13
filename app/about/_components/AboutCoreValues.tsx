import React from 'react';

const values = [
  {
    title: 'Compassion',
    description: 'We recognize every patient has a unique story, and approach each journey with empathy and respect.',
  },
  {
    title: 'Integrity',
    description: 'We provide honest guidance and recommendations based on your best interests, not ours.',
  },
  {
    title: 'Excellence',
    description: 'We hold high standards in every interaction, partnership, and service we provide.',
  },
  {
    title: 'Collaboration',
    description: 'We work closely with patients, families, hospitals, and partners toward the best outcomes.',
  },
  {
    title: 'Trust',
    description: 'We believe trust is earned through consistency, professionalism, and genuine care.',
  },
];

export default function AboutCoreValues() {
  return (
    <section className="py-16 sm:py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-900 uppercase bg-blue-100/90 px-3.5 py-1.5 rounded-lg border border-blue-200/60">
            CORE VALUES
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 mt-3 tracking-tight">
            What guides every decision we make
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {values.map((item, idx) => (
            <div key={idx} className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all space-y-3">
              <h3 className="text-xl font-bold text-blue-950">{item.title}</h3>
              <p className="text-base text-slate-700 leading-relaxed font-normal">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}