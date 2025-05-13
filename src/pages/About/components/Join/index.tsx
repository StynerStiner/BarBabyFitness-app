"use client";

import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { BackgroundText } from "./BackgroundText";

export const JoinSection = () => {
  return (
    <section className="py-24 relative overflow-hidden bg-black">
      <BackgroundText
        backgroundText="JOIN NOW"
        title="READY TO JOIN THE MOVEMENT?"
        description="Don't just watch the revolution – be part of it. Join Bar Baby Fitness and transform your life today."
      />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="flex flex-col sm:flex-row gap-4 justify-center container relative z-20"
      >
        <Button
          variant="solid"
          className="text-lg px-8 py-4 bg-[#DB6E1E] hover:bg-[#C05E0E] text-white"
        >
          Start Your Journey
        </Button>
        <Button
          variant="outline"
          className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-black"
        >
          Book a Tour
        </Button>
      </motion.div>
    </section>
  );
};
