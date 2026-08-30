import React from 'react';
import Image from 'next/image';

const hospitals = [
  {
    region: 'West Africa',
    title: 'Lagoon Specialist Hospital',
    location: 'Lagos, Nigeria',
    description: 'A leading specialist hospital recognized for advanced cardiac and cancer care, with a strong patient-centered approach and multidisciplinary teams.',
    tags: ['Cardiology', 'Oncology', 'Orthopedics'],
    image: '/images/hospital-one.avif',
  },
  {
    region: 'West Africa',
    title: 'Accra Heart Institute',
    location: 'Accra, Ghana',
    description: 'A dedicated cardiac center known for advanced diagnostic imaging and interventional cardiology services.',
    tags: ['Cardiology', 'Vascular Surgery'],
    image: '/images/hospital-six.avif',
  },
  {
    region: 'West Africa',
    title: 'Douala General Reference Hospital',
    location: 'Douala, Cameroon',
    description: 'A key regional referral hospital offering a broad range of specialized medical and surgical services.',
    tags: ['General Surgery', 'Maternal Health'],
    image: '/images/hospital-four.avif',
  },
];

export default function SectionSix() {
  return (
    <section className="py-16 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs font-semibold tracking-wider text-blue-600 uppercase">
            OUR NETWORK
          </span>
          <h2 className="text-3xl font-bold text-blue-900 mt-1">
            Trusted healthcare connections worldwide
          </h2>
          <p className="text-gray-600 max-w-xl text-sm mt-2">
            A sample of the healthcare institutions we work with. Recommendations are always personalized to your case — this isn't a directory to browse.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {hospitals.map((item, idx) => (
            <div key={idx} className="bg-white rounded-xl overflow-hidden border border-gray-100 shadow-sm flex flex-col justify-between">
              <div>
                <div className="relative h-48 w-full">
                  <Image src={item.image} alt={item.title} fill className="object-cover" />
                </div>
                <div className="p-6 space-y-3">
                  <span className="text-xs font-semibold text-blue-600 bg-blue-50 px-2.5 py-1 rounded-full">
                    {item.region}
                  </span>
                  <h3 className="text-lg font-bold text-blue-900">{item.title}</h3>
                  <p className="text-xs text-gray-500">{item.location}</p>
                  <p className="text-xs text-gray-600 leading-relaxed">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-2">
                    {item.tags.map((t, tIdx) => (
                      <span key={tIdx} className="text-xs bg-slate-100 text-slate-700 px-2 py-0.5 rounded">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 pt-0">
                <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-800">
                  Learn more &rarr;
                </a>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="px-6 py-2.5 bg-white hover:bg-gray-50 text-emerald-700 font-medium rounded-lg border border-emerald-600 transition">
            View Our Global Network
          </button>
        </div>
      </div>
    </section>
  );
}