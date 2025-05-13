import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";

interface LoyaltyProgramProps {
  items: string[];
}

export function LoyaltyProgram({ items }: LoyaltyProgramProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-2xl mx-auto my-16 bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 shadow-lg"
    >
      <h2 className="text-3xl font-bold mb-6 flex items-center gap-3">
        <Star className="w-6 h-6 text-[#DB6E1E]" />
        <span className="bg-gradient-to-r from-[#DB6E1E] to-[#F17A2B] bg-clip-text text-transparent">
          Loyalty &amp; Rewards
        </span>
      </h2>
      <ul className="list-disc text-gray-300 space-y-4 ml-5 text-lg leading-relaxed">
        {items.map((item, index) => (
          <li key={index}>{item}</li>
        ))}
      </ul>
    </motion.div>
  );
}
