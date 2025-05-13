"use client";

import { motion } from "framer-motion";
import { Users, Trophy, Globe, Star } from "lucide-react";

export const StatsSection = () => {
  const stats = [
    {
      icon: <Users className="w-8 h-8" />,
      value: "10K+",
      label: "ACTIVE MEMBERS",
    },
    {
      icon: <Trophy className="w-8 h-8" />,
      value: "500+",
      label: "COMPETITIONS WON",
    },
    { icon: <Globe className="w-8 h-8" />, value: "20+", label: "COUNTRIES" },
    { icon: <Star className="w-8 h-8" />, value: "98%", label: "SUCCESS RATE" },
  ];

  return (
    <section className="py-24 bg-[#DB6E1E]/5">
      <div className="container">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center group"
            >
              <div className="inline-flex p-4 rounded-2xl bg-black/50 text-[#DB6E1E] mb-4 group-hover:scale-110 transition-transform duration-300">
                {stat.icon}
              </div>
              <motion.div
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{
                  type: "spring",
                  stiffness: 100,
                  delay: index * 0.2,
                }}
                className="text-4xl font-black mb-2 bg-gradient-to-r from-white to-[#DB6E1E] bg-clip-text text-transparent"
              >
                {stat.value}
              </motion.div>
              <div className="text-sm font-bold text-gray-400">
                {stat.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
