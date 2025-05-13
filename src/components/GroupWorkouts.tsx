import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export const GroupWorkouts = () => {
  return (
    <section className="relative min-h-screen overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 w-full h-full">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/keeppushing.mp4" type="video/mp4" />
          Your browser does not support the video tag.
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-[2px]" />
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="relative container mx-auto px-4 h-full flex items-center py-24 md:py-32"
      >
        <div className="max-w-3xl md:max-w-4xl space-y-8 p-8 md:p-12 bg-black/40 rounded-2xl backdrop-blur-sm border border-white/10">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black leading-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-[#DB6E1E]"
          >
            PUSH YOUR LIMITS, MAKE A DIFFERENCE, JOIN A COMMUNITY OF
            CHANGE-MAKERS
          </motion.h2>

          <motion.h3
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4 }}
            className="text-2xl md:text-3xl lg:text-4xl font-bold text-[#DB6E1E]"
          >
            GROUP WORKOUTS & COMMUNITY MARATHONS
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6 }}
            className="text-gray-300 text-lg md:text-xl leading-relaxed"
          >
            Engage with like-minded individuals in group workouts and marathons
            that combine fitness with purpose. Every session and every step
            brings us closer to a healthier, more connected world. Challenge
            yourself, support charitable causes, and become part of a community
            that's making a real impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.8 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Button
              variant="outline"
              className="group relative overflow-hidden w-full sm:w-auto text-lg"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                See Marathons
              </span>
              <div className="absolute inset-0 bg-[#DB6E1E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
            <Button
              variant="solid"
              className="group relative overflow-hidden w-full sm:w-auto text-lg"
            >
              <span className="relative z-10">Host Your Own</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
          </motion.div>
        </div>
      </motion.div>

      {/* Decorative Elements */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
      <div className="absolute top-0 left-0 w-full h-32 bg-gradient-to-b from-black to-transparent" />
    </section>
  );
};
