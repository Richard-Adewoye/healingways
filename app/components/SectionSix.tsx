import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { MapPin, ArrowRight } from 'lucide-react';

const hospitals = [
  {
    region: 'West Africa',
    title: 'Lagoon Specialist Hospital',
    location: 'Lagos, Nigeria',
    description: 'A leading tertiary specialist hospital recognized for advanced cardiac interventions, oncology, and minimally invasive surgery.',
    tags: ['Cardiology', 'Oncology', 'Orthopedics'],
    image: '/images/hospital-one.avif',
  },
  {
    region: 'West Africa',
    title: 'Accra Heart Institute',
    location: 'Accra, Ghana',
    description: 'A dedicated high-volume cardiac center known for cutting-edge diagnostic imaging and interventional cath lab services.',
    tags: ['Cardiology', 'Vascular Surgery'],
    image: '/images/hospital-six.avif',
  },
  {
    region: 'Central Africa',
    title: 'Douala General Reference Hospital',
    location: 'Douala, Cameroon',
    description: 'A prestigious regional referral hospital providing comprehensive specialized surgical departments and critical care units.',
    tags: ['General Surgery', 'Maternal Health'],
    image: '/images/hospital-four.avif',
  },
];

export default function SectionSix() {
  return (
    <section className="py-16 sm:py-20 lg:py-24 bg-slate-50 border-b border-slate-200/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div>
          <span className="text-xs sm:text-sm font-extrabold tracking-wider text-blue-900 uppercase bg-blue-100/90 px-3.5 py-1.5 rounded-lg border border-blue-200/60">
            OUR NETWORK
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-[2.6rem] font-black text-blue-950 tracking-tight mt-3">
            Trusted healthcare connections worldwide
          </h2>
          <p className="text-slate-700 text-base sm:text-lg lg:text-xl max-w-xl mt-2 leading-relaxed font-normal">
            A sample of certified partner hospitals. Recommendations are strictly matched to your clinical case file.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
          {hospitals.map((item, idx) => (
            <div 
              key={idx} 
              className="bg-white rounded-2xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-md hover:border-slate-300 transition-all flex flex-col justify-between group"
            >
              <div>
                <div className="relative h-52 w-full overflow-hidden bg-slate-100">
                  <Image 
                    src={item.image} 
                    alt={item.title} 
                    fill 
                    className="object-cover group-hover:scale-105 transition-transform duration-300" 
                  />
                  <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-blue-950 font-extrabold text-xs sm:text-sm px-3.5 py-1 rounded-full shadow-md border border-slate-200">
                    {item.region}
                  </div>
                </div>
                <div className="p-6 sm:p-7 space-y-3">
                  <h3 className="text-xl font-bold text-slate-950 group-hover:text-blue-950 transition-colors">{item.title}</h3>
                  <div className="flex items-center gap-1.5 text-sm text-slate-700 font-bold">
                    <MapPin className="w-4 h-4 text-emerald-600" />
                    <span>{item.location}</span>
                  </div>
                  <p className="text-base text-slate-700 leading-relaxed font-normal pt-1">{item.description}</p>
                  
                  <div className="flex flex-wrap gap-2 pt-3">
                    {item.tags.map((t, tIdx) => (
                      <span key={tIdx} className="text-xs sm:text-sm bg-slate-100 border border-slate-200 text-slate-800 font-bold px-3 py-1 rounded-lg">
                        {t}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-6 sm:p-7 pt-0">
                <Link 
                  href="/partner-hospitals" 
                  className="text-base font-bold text-blue-800 hover:text-blue-950 inline-flex items-center gap-1.5 focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:outline-hidden rounded-md"
                >
                  View Facility Profile <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center pt-4">
          <Link 
            href="/partner-hospitals" 
            className="inline-flex items-center justify-center px-6 py-3.5 bg-white hover:bg-slate-50 active:bg-slate-100 text-emerald-900 font-bold text-base rounded-xl border-2 border-emerald-600 shadow-sm hover:shadow-md focus-visible:ring-2 focus-visible:ring-emerald-500 focus-visible:outline-hidden transition-all cursor-pointer"
          >
            View Our Global Hospital Network
          </Link>
        </div>
      </div>
    </section>
  );
}
