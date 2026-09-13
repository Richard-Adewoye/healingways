import React from 'react';
import Link from 'next/link';

const quickLinks = [
  { name: 'About Us', href: '/about' },
  { name: 'Our Services', href: '/services' },
  { name: 'Partner Hospitals', href: '/partner-hospitals' },
  { name: 'Medical Blog', href: '/blog' },
  { name: 'FAQs', href: '/faq' },
  { name: 'Contact Us', href: '/contact' },
];

const servicesLinks = [
  { name: 'Medical Report Translation', href: '/services' },
  { name: 'Hospital & Specialist Placement', href: '/services' },
  { name: 'Clinical Advisory & Consulting', href: '/services' },
  { name: 'Medical Accommodation & Logistics', href: '/services' },
  { name: 'Visa Processing & Support', href: '/services' },
];

const patientResources = [
  { name: 'Start Consultation', href: '/consultation' },
  { name: 'Patient Login', href: '/login' },
  { name: 'Admin Portal', href: '/admin' },
  { name: 'Privacy Policy', href: '#' },
  { name: 'Terms of Use', href: '#' },
  { name: 'Medical Disclaimer', href: '#' },
];

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-white pt-16 pb-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-sm sm:text-base">
          {/* Brand Info */}
          <div className="space-y-4 sm:col-span-2 lg:col-span-2">
            <h3 className="text-2xl font-black tracking-tight text-white">HealingWays®</h3>
            <p className="text-slate-200 text-base leading-relaxed max-w-sm font-normal">
              Your compass to healthy living. Guiding patients and families to make confident healthcare decisions with trusted international hospital partners and personalized medical navigation.
            </p>
            <div className="pt-2 text-xs sm:text-sm text-emerald-400 font-bold">
              <span>Accredited Clinical Coordination Network</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2.5 text-slate-200">
              {quickLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">Services</h4>
            <ul className="space-y-2.5 text-slate-200">
              {servicesLinks.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Patient Resources */}
          <div className="space-y-3">
            <h4 className="font-extrabold text-white text-xs sm:text-sm uppercase tracking-wider">Patient Portal</h4>
            <ul className="space-y-2.5 text-slate-200">
              {patientResources.map((item, idx) => (
                <li key={idx}>
                  <Link href={item.href} className="hover:text-white transition-colors focus-visible:ring-2 focus-visible:ring-blue-400 rounded-sm font-medium">
                    {item.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-slate-800 flex flex-col sm:flex-row justify-between items-center text-xs sm:text-sm text-slate-300 gap-4">
          <p>© 2026 HealingWays. All rights reserved.</p>
          <p className="text-center sm:text-right text-xs text-slate-300 max-w-lg leading-relaxed">
            HealingWays provides healthcare navigation and care coordination services. We work with accredited medical institutions and do not directly deliver medical treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}
