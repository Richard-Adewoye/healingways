'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { AnimatedLogoLoader } from './components/AnimatedLogoLoader';
import HeroSection from './components/HeroSection';
import SectionTwo from './components/SectionTwo';
import SectionThree from './components/SectionThree';
import SectionFour from './components/SectionFour';
import SectionFive from './components/SectionFive';
import SectionSix from './components/SectionSix';
import SectionSeven from './components/SectionSeven';
import SectionEight from './components/SectionEight';
import SectionNine from './components/SectionNine';
import Footer from './components/Footer';
import Navbar from './components/Navbar';

export default function Home() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Increased duration to 6000ms (6 seconds) to allow full app initialization
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 10000); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* Animated Loading Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && <AnimatedLogoLoader key="page-loader" />}
      </AnimatePresence>

      {/* Main Page Content */}
      <Navbar />
      <HeroSection />
      <SectionTwo />
      <SectionThree />
      <SectionFour />
      <SectionFive />
      <SectionSix />
      <SectionSeven />
      <SectionEight />
      <SectionNine />
      <Footer />
    </main>
  );
}