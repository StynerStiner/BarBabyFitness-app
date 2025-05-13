"use client";

import { motion } from "framer-motion";
import { Heart, Target, Users, Zap } from "lucide-react";

export const ValuesSection = () => {
  const values = [
    {
      icon: <Heart className="w-8 h-8" />,
      title: "PASSION",
      description: "Every rep, every set, fueled by pure passion for fitness",
    },
    {
      icon: <Target className="w-8 h-8" />,
      title: "PRECISION",
      description: "Detailed focus on form and technique for maximum results",
    },
    {
      icon: <Users className="w-8 h-8" />,
      title: "COMMUNITY",
      description: "Building strength through unity and shared goals",
    },
    {
      icon: <Zap className="w-8 h-8" />,
      title: "INTENSITY",
      description: "Push beyond limits, break through barriers",
    },
  ];

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black" />
      </div>

      <div className="container relative">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-black text-center mb-16"
        >
          <span className="bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
            OUR VALUES
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-8 rounded-2xl bg-black/50 border border-[#DB6E1E]/20 hover:border-[#DB6E1E] transition-colors"
            >
              <div className="inline-flex p-4 rounded-xl bg-[#DB6E1E]/10 text-[#DB6E1E] mb-6 group-hover:scale-110 transition-transform duration-300">
                {value.icon}
              </div>
              <h3 className="text-2xl font-bold mb-4">{value.title}</h3>
              <p className="text-gray-400">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
