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
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            CORE VALUES
          </span>
          <h2 className="text-3xl font-bold text-blue-900 mt-1">
            What guides every decision we make
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {values.map((item, idx) => (
            <div key={idx} className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm space-y-3">
              <h3 className="text-lg font-bold text-blue-900">{item.title}</h3>
              <p className="text-sm text-gray-600 leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}