// src/pages/GymRegistrationForm/components/HeroSection.tsx
import React from "react";
import { motion } from "framer-motion";

// Animations
const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.6 } },
};

const staggerChildren = {
  initial: { opacity: 0 },
  animate: { opacity: 1, transition: { staggerChildren: 0.2 } },
};

export const HeroSection: React.FC = () => {
  return (
    <div className="relative h-[60vh] bg-black overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=1920"
          alt="Motivation"
          className="w-full h-full object-cover opacity-60"
        />
      </div>

      {/* Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/50 to-black z-10" />

      {/* Content with Animations */}
      <motion.div
        initial="initial"
        animate="animate"
        variants={staggerChildren}
        className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4"
      >
        {/* Main Heading */}
        <motion.h1
          variants={fadeInUp}
          className="text-4xl md:text-6xl font-black bg-gradient-to-r from-white via-orange-400 to-[#DB6E1E] bg-clip-text text-transparent drop-shadow-lg"
        >
          PUSH BEYOND LIMITS
        </motion.h1>

        {/* Subheading */}
        <motion.p
          variants={fadeInUp}
          className="text-lg md:text-xl text-gray-300 max-w-3xl px-4 mt-6 leading-relaxed"
        >
          Your transformation journey begins here. Complete your registration
          below and take the first step towards achieving your fitness goals.
        </motion.p>
      </motion.div>
    </div>
  );
};

export default HeroSection;
