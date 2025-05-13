import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

export const HeroSection = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/keeppushing.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <Dumbbell className="w-12 h-12 text-[#DB6E1E]" />
            <h1 className="text-6xl md:text-8xl font-black bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
              BAR BABY FITNESS
            </h1>
          </div>
          <p className="text-2xl md:text-3xl text-gray-300 mb-8">
            From street workouts to global movement. We're not just building
            bodies – we're creating legends. Welcome to the revolution.
          </p>
          <div className="flex flex-wrap gap-4">
            {["DEDICATION", "PASSION", "RESULTS"].map((word, index) => (
              <motion.span
                key={index}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.2 }}
                className="px-6 py-2 rounded-full border-2 border-[#DB6E1E] text-[#DB6E1E] font-bold hover:bg-[#DB6E1E] hover:text-white transition-colors duration-300"
              >
                {word}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};
