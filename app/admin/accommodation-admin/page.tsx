'use client';

import React from 'react';
import { Plus, MapPin } from 'lucide-react';

interface AccommodationCardProps {
  image: string;
  title: string;
  location: string;
  tags: string[];
  description: string;
  proximity: string;
  features: string[];
  price: string;
  pricePeriod: string;
}

const accommodations: AccommodationCardProps[] = [
  {
    image: '/images/accommodations/eko-comfort-suites.jpg',
    title: 'Eko Comfort Suites',
    location: 'Lagos, Nigeria',
    tags: ['Hotel', '1BHK', 'Fully Furnished'],
    description: 'Fully Serviced — daily housekeeping, in-room dining',
    proximity: '12 min (6.2 km) from Lagoon Specialist',
    features: ['Free WiFi', 'Airport Pickup'],
    price: '$85',
    pricePeriod: '/night',
  },
  {
    image: '/images/accommodations/harbour-view.jpg',
    title: 'Harbour View Guest House',
    location: 'Accra, Ghana',
    tags: ['Short-let', 'Studio', 'Semi-Furnished'],
    description: 'Self-Catering — kitchenette, weekly cleaning',
    proximity: '18 min (9.1 km) from Accra Heart Institute',
    features: ['Free WiFi', 'Balcony'],
    price: '$65',
    pricePeriod: '/night',
  },
  {
    image: '/images/accommodations/riverside-family.jpg',
    title: 'Riverside Family Apartments',
    location: 'Chennai, India',
    tags: ['Short-let', '2BHK', 'Fully Furnished'],
    description: 'Self-Catering — full kitchen, weekly cleaning',
    proximity: '22 min (11.4 km) from Apex Multispecialty Hospital',
    features: ['Free WiFi', 'Breakfast Included'],
    price: '$1,200',
    pricePeriod: '/month',
  },
  {
    image: '/images/accommodations/douala-riverside.jpg',
    title: 'Douala Riverside Lodge',
    location: 'Douala, Cameroon',
    tags: ['Hotel', '1BHK', 'Fully Furnished'],
    description: 'Fully Serviced — daily housekeeping',
    proximity: '10 min (4.8 km) from Douala General Reference Hospital',
    features: ['Free WiFi', 'Airport Pickup'],
    price: '$70',
    pricePeriod: '/night',
  },
  {
    image: '/images/accommodations/dubai-care.jpg',
    title: 'Dubai Care Residences',
    location: 'Dubai, United Arab Emirates',
    tags: ['Hotel', '1BHK', 'Fully Furnished'],
    description: 'Fully Serviced — daily housekeeping, concierge',
    proximity: '15 min (7.5 km) from Al Noor Specialist Medical Center',
    features: ['Free WiFi', 'Airport Pickup', 'Gym Access'],
    price: '$145',
    pricePeriod: '/night',
  },
  {
    image: '/images/accommodations/bangkok-wellness.jpg',
    title: 'Bangkok Wellness Suites',
    location: 'Bangkok, Thailand',
    tags: ['Short-let', 'Studio', 'Fully Furnished'],
    description: 'Self-Catering — kitchenette, weekly cleaning',
    proximity: '13 min (5.9 km) from Raffles Specialist Medical Center',
    features: ['Free WiFi', 'Breakfast Included', 'Pool Access'],
    price: '$2,100',
    pricePeriod: '/month',
  },
];

export default function AccommodationPage() {
  return (
    <div className="p-4 sm:p-6 md:p-8 max-w-7xl mx-auto w-full space-y-6">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-xl sm:text-2xl font-bold text-blue-900 leading-tight">
            Accommodation & Housing
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-2xl">
            Browse the housing catalog near partner hospitals. Recommend an option directly to a patient&apos;s case.
          </p>
        </div>
        <button className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold px-4 py-2.5 rounded-xl text-xs sm:text-sm transition-colors w-full sm:w-auto shrink-0 shadow-sm">
          <Plus className="w-4 h-4 stroke-[2.5]" />
          Add Accommodation Listing
        </button>
      </div>

      {/* Accommodations Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {accommodations.map((item, idx) => (
          <div
            key={idx}
            className="bg-white border border-slate-200/80 rounded-2xl overflow-hidden shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
          >
            <div>
              {/* Card Image Header */}
              <div className="relative h-44 sm:h-48 w-full bg-slate-100">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-full object-cover"
                />
              </div>

              {/* Card Body Content */}
              <div className="p-4 sm:p-5 space-y-3">
                {/* Title and Location */}
                <div>
                  <h3 className="font-bold text-slate-900 text-sm sm:text-base leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5 font-medium">{item.location}</p>
                </div>

                {/* Filter Badges */}
                <div className="flex flex-wrap gap-1.5">
                  {item.tags.map((tag, tIdx) => (
                    <span
                      key={tIdx}
                      className="bg-blue-50 text-blue-700 text-[10px] sm:text-[11px] font-semibold px-2.5 py-0.5 rounded-md"
                    >
                      {tag}
                    </span>
                  ))}
                </div>

                {/* Service Details */}
                <p className="text-xs text-slate-600 font-normal leading-relaxed">
                  {item.description}
                </p>

                {/* Proximity / Distance */}
                <div className="flex items-start gap-1.5 text-xs text-slate-500">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span className="leading-tight">{item.proximity}</span>
                </div>

                {/* Feature Chips */}
                {item.features.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {item.features.map((feat, fIdx) => (
                      <span
                        key={fIdx}
                        className="bg-slate-100 text-slate-600 text-[10px] sm:text-[11px] font-medium px-2 py-0.5 rounded"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Card Footer: Pricing & Actions */}
            <div className="p-4 sm:p-5 pt-0 space-y-3">
              {/* Pricing */}
              <div className="text-sm">
                <span className="font-bold text-emerald-600 text-base sm:text-lg">{item.price}</span>
                <span className="text-xs font-semibold text-slate-500 ml-0.5">{item.pricePeriod}</span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between sm:justify-start gap-3 border-t border-slate-100 pt-3">
                <button className="border border-emerald-600 text-emerald-700 hover:bg-emerald-50 font-semibold px-3 py-1.5 rounded-lg text-xs transition-colors shrink-0">
                  Recommend
                </button>
                <div className="flex items-center gap-3 ml-auto sm:ml-0">
                  <button className="text-xs font-semibold text-blue-900 hover:underline">
                    Edit
                  </button>
                  <button className="text-xs font-semibold text-red-600 hover:underline">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}