// src/pages/TrainingOptions/components/Hero.tsx

import { motion } from "framer-motion";
import { Dumbbell, ChevronDown } from "lucide-react";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-50"
        >
          <source src="/videos/1.lg.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/20" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#DB6E1E]/10 rounded-full filter blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#DB6E1E]/5 rounded-full filter blur-3xl animate-float"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      <div className="container relative z-10 px-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto"
        >
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="flex justify-center mb-8"
          >
            <div className="p-4 bg-[#DB6E1E]/20 rounded-full">
              <Dumbbell className="w-12 h-12 text-[#DB6E1E]" />
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-6xl md:text-8xl font-black mb-6"
          >
            <span className="text-stroke animate-pulse-glow">TRANSFORM</span>
            <br />
            <span className="bg-gradient-to-r from-[#DB6E1E] to-[#F17A2B] bg-clip-text text-transparent">
              YOUR JOURNEY
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-xl md:text-2xl text-gray-300 mb-24 font-light"
          >
            Choose your path to greatness with our flexible training options.
            Expert guidance, personalized attention, and a supportive community
            await.
          </motion.p>

          {/* ChevronDown moved further down */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
            className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce"
          >
            <ChevronDown className="w-16 h-16 text-[#DB6E1E] font-bold" />
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};
