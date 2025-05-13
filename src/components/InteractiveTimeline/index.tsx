"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Flame, Star, Trophy, Users, Zap } from "lucide-react";

export const InteractiveTimeline = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const achievements = [
    {
      year: "2020",
      title: "THE COME UP",
      description:
        "Started from the bottom, now we're here. Bar Baby Fitness hits the scene.",
      icon: <Star className="w-8 h-8 text-[#DB6E1E]" />,
    },
    {
      year: "2021",
      title: "GOING GLOBAL",
      description:
        "Breaking boundaries with worldwide virtual training. No limits, no excuses.",
      icon: <Zap className="w-8 h-8 text-[#DB6E1E]" />,
    },
    {
      year: "2022",
      title: "LEVEL UP",
      description:
        "Dropped that AI-powered heat. Training game changed forever.",
      icon: <Flame className="w-8 h-8 text-[#DB6E1E]" />,
    },
    {
      year: "2023",
      title: "SQUAD GOALS",
      description: "10K strong family. Real recognize real.",
      icon: <Users className="w-8 h-8 text-[#DB6E1E]" />,
    },
    {
      year: "2024",
      title: "UNSTOPPABLE",
      description: "Future of fitness? We're writing it. Stay tuned.",
      icon: <Trophy className="w-8 h-8 text-[#DB6E1E]" />,
    },
  ];

  return (
    <section
      ref={containerRef}
      className="relative py-24 overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black" />
      </div>

      <div className="container relative">
        <div className="relative">
          {/* Timeline line */}
          <div className="absolute left-1/2 top-0 w-px h-full bg-[#DB6E1E]/30">
            <motion.div
              className="absolute top-0 left-0 w-full bg-[#DB6E1E]"
              style={{
                height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
              }}
            />
          </div>

          {/* Timeline items */}
          {achievements.map((achievement, index) => (
            <motion.div
              key={achievement.year}
              initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className={`flex items-center mb-24 ${
                index % 2 === 0 ? "flex-row" : "flex-row-reverse"
              }`}
            >
              <div className="w-1/2 px-12">
                <motion.div
                  whileHover={{ scale: 1.05 }}
                  className={`${
                    index % 2 === 0 ? "text-right" : "text-left"
                  } bg-black/50 p-6 rounded-2xl border border-[#DB6E1E]/20 hover:border-[#DB6E1E] transition-colors`}
                >
                  <div
                    className={`flex items-center gap-4 mb-4 ${
                      index % 2 === 0 ? "flex-row-reverse" : "flex-row"
                    }`}
                  >
                    <div className="p-2 bg-black/50 rounded-xl">
                      {achievement.icon}
                    </div>
                    <span className="text-[#DB6E1E] text-xl font-bold">
                      {achievement.year}
                    </span>
                  </div>
                  <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-white to-[#DB6E1E] bg-clip-text text-transparent">
                    {achievement.title}
                  </h3>
                  <p className="text-gray-400 text-lg">
                    {achievement.description}
                  </p>
                </motion.div>
              </div>
              <div className="absolute left-1/2 w-4 h-4 bg-[#DB6E1E] rounded-full transform -translate-x-1/2 shadow-lg shadow-[#DB6E1E]/50" />
              <div className="w-1/2 px-12" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
