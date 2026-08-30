'use client';

import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import FAQHero from './_components/FaqHero';
import FAQAccordion from './_components/FAQAccordion';
import FAQCTA from './_components/FAQCTA';
import Footer from '../components/Footer';

export default function FAQPage() {
  const [searchQuery, setSearchQuery] = useState('');

  return (
    <main className="min-h-screen bg-slate-50">
      <Navbar />
      <FAQHero searchQuery={searchQuery} setSearchQuery={setSearchQuery} />
      <FAQAccordion searchQuery={searchQuery} />
      <FAQCTA />
      <Footer />
    </main>
  );
}