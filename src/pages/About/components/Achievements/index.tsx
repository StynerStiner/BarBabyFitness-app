import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { AchievementCard } from "./AchievementCard";
import { BackgroundVideo } from "./BackgroundVideo";
import { achievements, currentStats } from "./data";

export const AchievementsSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const scale = useTransform(scrollYProgress, [0, 0.5], [0.8, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  const getCurrentValue = (label: string) => {
    switch (label) {
      case "ACTIVE MEMBERS":
        return currentStats.members;
      case "COUNTRIES":
        return currentStats.countries;
      case "COMPETITIONS":
        return currentStats.competitions;
      default:
        return undefined;
    }
  };

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen flex items-center py-24 overflow-hidden"
    >
      <BackgroundVideo />

      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5"
          style={{ y }}
        />
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black"
          style={{ opacity }}
        />
      </div>

      {/* Background Image Layer */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 w-full h-full bg-cover bg-center"
          style={{
            backgroundImage: "url('/images/2.motivation_delivered.png')",
            filter: "brightness(1.2)",
          }}
        ></div>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/60 to-black" />
      </div>

      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <motion.div
          className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black"
          style={{ opacity }}
        />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
              OUR IMPACT & GOALS
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Tracking our progress and setting ambitious targets for the future
          </p>
        </motion.div>

        <motion.div
          style={{ scale, opacity }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8"
        >
          {achievements.map((achievement, index) => (
            <AchievementCard
              key={index}
              {...achievement}
              index={index}
              currentValue={getCurrentValue(achievement.label)}
            />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16 max-w-2xl mx-auto"
        >
          <p className="text-lg text-gray-300">
            While we're proud of our current success rate of 98%, we're
            constantly pushing boundaries to expand our reach and impact in the
            fitness community.
          </p>
        </motion.div>
      </div>
    </section>
  );
};
