import { motion, useScroll, useTransform } from "framer-motion";
import React from "react";

interface BackgroundElementsProps {
  scrollYProgress: any;
}

export const BackgroundElements = ({
  scrollYProgress,
}: BackgroundElementsProps) => {
  // Import and use `useTransform` and `useScroll` directly from framer-motion
  // Instead of calling `motion.useTransform`, we call `useTransform` directly.

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <div className="absolute inset-0">
      <video
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover opacity-10"
      >
        <source src="/videos/motivation-delivered.mp4" type="video/mp4" />
      </video>

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5"
          style={{ y }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black"
          style={{ opacity }}
        />
      </div>
    </div>
  );
};
