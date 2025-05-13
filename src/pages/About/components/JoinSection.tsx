"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export const JoinSection = () => {
  return (
    <section className="relative h-[80vh] bg-black flex flex-col items-center justify-center px-4 py-8 overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=1920&h=1080"
          alt="Gym background"
          className="w-full h-full object-cover opacity-30"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-black/50"></div>
      </div>
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-hidden pointer-events-none z-10">
        <span className="text-[14vw] font-black text-white/[0.12] whitespace-nowrap select-none tracking-widest">
          JOIN NOW
        </span>
      </div>

      {/* Main content */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative z-20 text-center max-w-4xl mx-auto"
      >
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-black tracking-tight mb-3">
          <span className="text-white">READY TO JOIN THE</span>
          <br />
          <span className="bg-gradient-to-r from-[#E8B298] to-[#DB6E1E] bg-clip-text text-transparent">
            MOVEMENT?
          </span>
        </h1>
        <p className="text-gray-300 text-base sm:text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Don't just watch the revolution – be part of it. Join Bar Baby Fitness
          and transform your life today.
        </p>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.8 }}
        >
          <Button className="bg-[#DB6E1E] hover:bg-[#C05E0E] text-white text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 rounded-full">
            Start Your Journey
          </Button>
          <Button
            variant="outline"
            className="border-white text-white hover:bg-white hover:text-black text-base sm:text-lg px-6 sm:px-8 py-4 sm:py-5 rounded-full"
          >
            Book a Tour
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
};
