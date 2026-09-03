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
  const [isLoading, setIsLoading] = useState(() => {
    if (typeof window === 'undefined') return true;
    try {
      return !sessionStorage.getItem('hw_splash_seen');
    } catch {
      return false;
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('hw_splash_seen', 'true');
    } catch {}

    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 600); 

    return () => clearTimeout(timer);
  }, []);

  return (
    <main className="relative min-h-screen">
      {/* Animated Loading Overlay */}
      <AnimatePresence mode="wait">
        {isLoading && (
          <AnimatedLogoLoader
            key="page-loader"
            onDismiss={() => setIsLoading(false)}
          />
        )}
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