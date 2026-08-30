'use client';

import { motion, Variants } from 'framer-motion';
import Image from 'next/image';

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { duration: 0.6 },
  },
  exit: {
    opacity: 0,
    y: -30,
    filter: 'blur(10px)',
    transition: { duration: 0.5, ease: 'easeInOut' },
  },
};

export const AnimatedLogoLoader = () => {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden"
    >
      {/* 1. BACKGROUND AMBIENT GLOW */}
      <motion.div
        className="absolute size-[500px] rounded-full"
        style={{
          background:
            'radial-gradient(circle, rgba(14,165,233,0.18) 0%, rgba(20,184,166,0.08) 45%, rgba(255,255,255,0) 75%)',
        }}
        animate={{
          scale: [0.85, 1.15, 0.85],
          opacity: [0.6, 1, 0.6],
        }}
        transition={{
          duration: 3.5,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
      />

      {/* 2. DUAL ROTATING ORBITAL RINGS */}
      <motion.div
        className="absolute size-[420px] rounded-full border border-sky-400/30 border-t-sky-500"
        animate={{ rotate: 360 }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: 'linear',
        }}
      />
      <motion.div
        className="absolute size-[460px] rounded-full border border-teal-400/20 border-b-teal-500"
        animate={{ rotate: -360 }}
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: 'linear',
        }}
      />

      {/* 3. CENTERED LOGO CONTAINER WITH FLOAT & PULSE */}
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{
          opacity: 1,
          scale: [0.95, 1.05, 0.95],
          y: [-6, 6, -6],
        }}
        transition={{
          opacity: { duration: 0.8 },
          scale: {
            duration: 2.5,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
          y: {
            duration: 3,
            repeat: Infinity,
            repeatType: 'reverse',
            ease: 'easeInOut',
          },
        }}
        /* INCREASED LOGO SIZE HERE */
        className="relative z-10 h-48 w-[600px] max-w-[90vw]"
      >
        <Image
          src="/healing-ways-logo.png" 
          alt="HealingWays Logo"
          fill
          className="object-contain drop-shadow-[0_10px_25px_rgba(14,165,233,0.15)]"
          priority
        />
      </motion.div>
    </motion.div>
  );
};