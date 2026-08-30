'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';

interface Hospital {
  id: string;
  name: string;
  location: string;
  region: 'West Africa' | 'Asia' | 'Arab Region';
  description: string;
  tags: string[];
  image: string;
}

const hospitals: Hospital[] = [
  {
    id: 'lagoon',
    name: 'Lagoon Specialist Hospital',
    location: 'Lagos, Nigeria',
    region: 'West Africa',
    description: 'A leading specialist hospital recognized for advanced cardiac and cancer care, with a strong patient-centered approach and multidisciplinary teams.',
    tags: ['Cardiology', 'Oncology', 'Orthopedics'],
    image: '/images/hospital-one.avif',
  },
  {
    id: 'accra-heart',
    name: 'Accra Heart Institute',
    location: 'Accra, Ghana',
    region: 'West Africa',
    description: 'A dedicated cardiac center known for advanced diagnostic imaging and interventional cardiology services.',
    tags: ['Cardiology', 'Vascular Surgery'],
    image: '/images/hospital-three.avif',
  },
  {
    id: 'douala-general',
    name: 'Douala General Reference Hospital',
    location: 'Douala, Cameroon',
    region: 'West Africa',
    description: 'A key regional referral hospital offering a broad range of specialized medical and surgical services.',
    tags: ['General Surgery', 'Maternal Health'],
    image: '/images/hospital-eight.avif',
  },
  {
    id: 'kinshasa-mc',
    name: 'Kinshasa Medical Center',
    location: 'Kinshasa, DR Congo',
    region: 'West Africa',
    description: 'A trusted community hospital providing comprehensive general and pediatric care across the region.',
    tags: ['General Medicine', 'Pediatrics'],
    image: '/images/hospital-two.avif',
  },
  {
    id: 'apex-multispecialty',
    name: 'Apex Multispecialty Hospital',
    location: 'Chennai, India',
    region: 'Asia',
    description: 'An internationally recognized institution offering advanced treatment across multiple specialties, with dedicated international patient services.',
    tags: ['Oncology', 'Neurology', 'Organ Transplant'],
    image: '/images/hospital-four.avif',
  },
  {
    id: 'raffles-specialist',
    name: 'Raffles Specialist Medical Center',
    location: 'Bangkok, Thailand',
    region: 'Asia',
    description: 'A modern medical center recognized for advanced orthopedic and fertility treatment programs.',
    tags: ['Orthopedics', 'Fertility', 'Eye Care'],
    image: '/images/hospital-five.avif',
  },
  {
    id: 'al-noor',
    name: 'Al Noor Specialist Medical Center',
    location: 'Dubai, United Arab Emirates',
    region: 'Arab Region',
    description: 'A premier medical center combining advanced technology with internationally trained specialists.',
    tags: ['Cardiology', 'Orthopedics', 'Rehabilitation'],
    image: '/images/hospital-six.avif',
  },
  {
    id: 'crescent-care',
    name: 'Crescent Care Medical City',
    location: 'Riyadh, Saudi Arabia',
    region: 'Arab Region',
    description: 'A large-scale medical city offering comprehensive specialty and tertiary care services.',
    tags: ['Oncology', 'Cardiology'],
    image: '/images/hospital-three.avif',
  },
];

const categories = ['All Regions', 'West Africa', 'Asia', 'Arab Region'] as const;

export default function HospitalsGrid() {
  const [selectedCategory, setSelectedCategory] = useState<string>('All Regions');

  const filteredHospitals = selectedCategory === 'All Regions'
    ? hospitals
    : hospitals.filter((h) => h.region === selectedCategory);

  return (
    <section className="py-12 bg-slate-50 min-h-[600px]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Filter Tabs */}
        <div className="flex flex-wrap items-center gap-2">
          {categories.map((category) => {
            const isActive = selectedCategory === category;
            return (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-5 py-2 text-sm font-medium rounded-full transition-colors ${
                  isActive
                    ? 'bg-blue-900 text-white shadow-sm'
                    : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {/* Hospital Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredHospitals.map((hospital) => (
            <div
              key={hospital.id}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden flex flex-col justify-between hover:shadow-md transition-shadow"
            >
              <div>
                {/* Image Header */}
                <div className="relative w-full h-48 bg-slate-100">
                  <Image
                    src={hospital.image}
                    alt={hospital.name}
                    fill
                    className="object-cover"
                  />
                </div>

                {/* Card Content */}
                <div className="p-6 space-y-4">
                  <span className="inline-block px-2.5 py-0.5 bg-blue-50 text-blue-700 text-xs font-medium rounded-md">
                    {hospital.region}
                  </span>

                  <div>
                    <h3 className="text-lg font-bold text-blue-900 leading-snug">
                      {hospital.name}
                    </h3>
                    <p className="text-xs text-gray-500 font-medium mt-1">
                      {hospital.location}
                    </p>
                  </div>

                  <p className="text-xs sm:text-sm text-gray-600 leading-relaxed">
                    {hospital.description}
                  </p>

                  {/* Specialty Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {hospital.tags.map((tag, idx) => (
                      <span
                        key={idx}
                        className="px-2.5 py-1 bg-slate-100 text-slate-600 text-xs rounded-md font-medium"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Card Footer Link */}
              <div className="px-6 pb-6 pt-2">
                <Link
                  href={`#${hospital.id}`}
                  className="inline-flex items-center text-xs font-semibold text-blue-600 hover:text-blue-800 transition-colors"
                >
                  Learn more <span className="ml-1">→</span>
                </Link>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}