"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Dumbbell, Flame, Trophy, Target, Zap } from "lucide-react";

export const ShowcaseSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const features = [
    {
      title: "ELITE TRAINING",
      description: "Level up your game with pro-level workouts",
      icon: <Trophy className="w-8 h-8 text-[#DB6E1E]" />,
      image:
        "https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80",
    },
    {
      title: "BEAST MODE",
      description: "Push past your limits, break through barriers",
      icon: <Flame className="w-8 h-8 text-[#DB6E1E]" />,
      image:
        "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&q=80",
    },
    {
      title: "POWER MOVES",
      description: "Master advanced techniques, dominate your goals",
      icon: <Zap className="w-8 h-8 text-[#DB6E1E]" />,
      image:
        "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80",
    },
    {
      title: "PRECISION FOCUS",
      description: "Dial in your form, maximize results",
      icon: <Target className="w-8 h-8 text-[#DB6E1E]" />,
      image:
        "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&q=80",
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-8 bg-black overflow-hidden"
    >
      {/* Dynamic background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5" />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black"
          style={{
            opacity: useTransform(scrollYProgress, [0, 0.5], [0, 1]),
          }}
        />
      </div>

      <div className="container relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-6xl md:text-8xl font-black text-center mb-24"
        >
          <span className="bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
            UNLOCK YOUR POTENTIAL
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="group relative"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <motion.img
                  src={feature.image}
                  alt={feature.title}
                  className="w-full h-full object-cover"
                  whileHover={{ scale: 1.05 }}
                  transition={{ duration: 0.6 }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="p-2 bg-black/50 backdrop-blur-sm rounded-xl">
                      {feature.icon}
                    </div>
                    <h3 className="text-3xl font-black bg-gradient-to-r from-white to-[#DB6E1E] bg-clip-text text-transparent">
                      {feature.title}
                    </h3>
                  </div>
                  <p className="text-gray-300 text-lg transform translate-y-8 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* NO LIMITS. NO EXCUSES */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="flex justify-center mt-16"
        >
          <div className="inline-flex items-center gap-2 text-2xl font-bold">
            <Dumbbell className="w-8 h-8 text-[#DB6E1E]" />
            <span className="bg-gradient-to-r from-white to-[#DB6E1E] bg-clip-text text-transparent">
              NO LIMITS. NO EXCUSES.
            </span>
          </div>
        </motion.div>

        {/* Discover Text in the Top Background */}
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
      </div>
    </section>
  );
};
