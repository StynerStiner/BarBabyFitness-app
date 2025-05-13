"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

export const ParallaxGallery = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const images = [
    {
      url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
      title: "STRENGTH",
    },
    {
      url: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80",
      title: "DEDICATION",
    },
    {
      url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80",
      title: "POWER",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative h-[150vh] bg-black overflow-hidden mt-[-50px]"
    >
      {/* Smoky Top Transition */}
      <div className="absolute top-0 left-0 w-full h-48 bg-gradient-to-b from-black via-[#1A1A1A] to-transparent opacity-80 z-20 blur-lg"></div>

      {/* Header WATER Text */}
      <div className="absolute inset-x-0 top-[-100px] z-20 flex justify-center">
        <motion.h2
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.3], [0.2, 0.6]),
            y: useTransform(scrollYProgress, [0, 0.2], [50, 0]),
          }}
          className="text-[#F0F0F0] text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw] font-black opacity-[0.4] select-none tracking-wider uppercase transform-gpu"
        >
          Discover
        </motion.h2>
      </div>

      <div className="sticky top-0 h-screen flex items-center">
        <div className="absolute inset-0 bg-gradient-to-b from-black via-transparent to-black" />
        <div className="container relative">
          {/* Header */}
          <motion.h2
            style={{ opacity: useTransform(scrollYProgress, [0, 0.2], [0, 1]) }}
            className="text-6xl md:text-8xl font-black text-center mb-12"
          >
            <span className="bg-gradient-to-r from-[#F5F5F5] via-[#F5F5F5] to-[#DB6E1E] bg-clip-text text-transparent">
              TRANSFORM YOUR LIFE
            </span>
          </motion.h2>

          {/* Parallax Images */}
          <div className="flex justify-center gap-8">
            {images.map((image, index) => (
              <motion.div
                key={index}
                style={{
                  y: useTransform(
                    scrollYProgress,
                    [0, 1],
                    [0, (index - 1) * 300],
                  ),
                  opacity: useTransform(
                    scrollYProgress,
                    [0.2, 0.3, 0.8, 0.9],
                    [0, 1, 1, 0],
                  ),
                }}
                className="relative w-96 h-[32rem] rounded-lg overflow-hidden"
              >
                <img
                  src={image.url}
                  alt={image.title}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                <h3 className="absolute bottom-12 left-6 text-4xl font-bold text-[#F0F0F0]">
                  {image.title}
                </h3>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* YOUR FULL POTENTIAL */}
      <div className="absolute inset-x-0 bottom-[10%] z-20 flex flex-col items-center space-y-0">
        <motion.div className="relative">
          {/* YOUR */}
          <motion.h2
            style={{
              opacity: useTransform(scrollYProgress, [0.3, 0.4], [0, 1]), // YOUR fades in first
              y: useTransform(scrollYProgress, [0.3, 0.4], [50, 0]), // YOUR moves up first
              scale: useTransform(scrollYProgress, [0.3, 0.4], [0.9, 1]), // YOUR grows slightly
              filter: useTransform(
                scrollYProgress,
                [0.3, 0.4],
                ["brightness(0.8)", "brightness(1.2)"],
              ),
            }}
            className="text-[#F9F9F9] text-[14vw] sm:text-[12vw] font-black uppercase leading-none tracking-wide drop-shadow-[0px_4px_8px_rgba(255,255,255,0.4)] transform translate-x-[-15%]"
          >
            YOUR
          </motion.h2>

          {/* FULL */}
          <motion.h2
            style={{
              opacity: useTransform(scrollYProgress, [0.4, 0.5], [0, 1]), // FULL fades in second
              y: useTransform(scrollYProgress, [0.4, 0.5], [50, 0]), // FULL moves up second
              scale: useTransform(scrollYProgress, [0.4, 0.5], [0.9, 1]), // FULL grows slightly
              filter: useTransform(
                scrollYProgress,
                [0.4, 0.5],
                ["brightness(0.8)", "brightness(1.2)"],
              ),
            }}
            className="text-[#F9F9F9] text-[18vw] sm:text-[16vw] font-black uppercase leading-none tracking-wide drop-shadow-[0px_4px_8px_rgba(255,255,255,0.4)] transform translate-x-[0]"
          >
            FULL
          </motion.h2>

          {/* POTENTIAL */}
          <motion.h2
            style={{
              opacity: useTransform(scrollYProgress, [0.5, 0.6], [0, 1]), // POTENTIAL fades in third
              y: useTransform(scrollYProgress, [0.5, 0.6], [50, 0]), // POTENTIAL moves up third
              scale: useTransform(scrollYProgress, [0.5, 0.6], [0.9, 1]), // POTENTIAL grows slightly
              filter: useTransform(
                scrollYProgress,
                [0.5, 0.6],
                ["brightness(0.8)", "brightness(1.2)"],
              ),
            }}
            className="text-[#F9F9F9] text-[14vw] sm:text-[12vw] font-black uppercase leading-none tracking-wide drop-shadow-[0px_4px_8px_rgba(255,255,255,0.4)] transform translate-x-[15%]"
          >
            POTENTIAL
          </motion.h2>
        </motion.div>
      </div>

      {/* Smoky Bottom Transition */}
      <div className="absolute bottom-0 left-0 w-full h-48 bg-gradient-to-t from-black via-[#1A1A1A] to-transparent opacity-80 z-20 blur-lg"></div>
    </section>
  );
};
