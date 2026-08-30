import React from 'react';

const quickLinks = ['About', 'Services', 'Partner Hospitals', 'Blog', 'FAQs'];

const servicesLinks = [
  'Medical Report Translation',
  'Hospital & Specialist Placement',
  'Clinical Advisory & Consulting',
  'Medical Accommodation & Logistics',
  'Visa Processing & Support',
];

const patientResources = [
  'Book Consultation',
  'My Portal',
  'Privacy Policy',
  'Terms of Use',
  'Medical Disclaimer',
];

export default function Footer() {
  return (
    <footer className="bg-blue-900 text-white pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 text-xs">
          {/* Brand Info */}
          <div className="space-y-3">
            <h3 className="text-xl font-bold tracking-tight">HealingWays®</h3>
            <p className="text-blue-200 leading-relaxed">
              Your compass to healthy living. Helping patients and families make confident healthcare decisions, locally and abroad.
            </p>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-2 text-blue-200">
              {quickLinks.map((item, idx) => (
                <li key={idx}><a href="#" className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider">Services</h4>
            <ul className="space-y-2 text-blue-200">
              {servicesLinks.map((item, idx) => (
                <li key={idx}><a href="#" className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Patient Resources */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider">Patient Resources</h4>
            <ul className="space-y-2 text-blue-200">
              {patientResources.map((item, idx) => (
                <li key={idx}><a href="#" className="hover:text-white transition">{item}</a></li>
              ))}
            </ul>
          </div>

          {/* Contact Details */}
          <div className="space-y-3">
            <h4 className="font-bold text-white uppercase tracking-wider">Contact</h4>
            <p className="text-blue-200">+234 800 123 4567</p>
            <p className="text-blue-200">care@healingways.org</p>
            <p className="text-blue-200">Chat on WhatsApp</p>
            <p className="text-blue-300 pt-2">Lagos · Accra · Remote-first team</p>
          </div>
        </div>

        <hr className="border-blue-800" />

        <div className="flex flex-col sm:flex-row justify-between items-center text-[11px] text-blue-300 gap-4">
          <p>© 2026 HealingWays. All rights reserved.</p>
          <p className="text-center sm:text-right">
            HealingWays provides healthcare navigation and coordination. We do not provide medical treatment.
          </p>
        </div>
      </div>
    </footer>
  );
}