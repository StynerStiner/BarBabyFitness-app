import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { Dumbbell, Brain, Heart, Target } from "lucide-react";

const philosophies = [
  {
    icon: <Brain className="w-8 h-8" />,
    title: "MIND OVER MATTER",
    description:
      "Mental strength is just as important as physical. We train both.",
  },
  {
    icon: <Heart className="w-8 h-8" />,
    title: "PASSION DRIVEN",
    description:
      "Every rep, every set, fueled by pure dedication to excellence.",
  },
  {
    icon: <Target className="w-8 h-8" />,
    title: "GOAL FOCUSED",
    description: "Set targets, crush them, repeat. That's the Bar Baby way.",
  },
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: "STRENGTH FIRST",
    description: "Build your foundation with proper form and technique.",
  },
];

export const PhilosophySection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);

  return (
    <section ref={containerRef} className="relative py-24 overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute w-full h-full object-cover opacity-20"
        >
          <source src="/videos/motivation-delivered.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-b from-black via-black/95 to-black" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
              OUR PHILOSOPHY
            </span>
          </h2>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto">
            More than just a gym - we're a movement dedicated to transforming
            lives through fitness, community, and unwavering determination.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {philosophies.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <motion.div
                style={{ y }}
                className="absolute inset-0 bg-gradient-to-b from-[#DB6E1E]/20 to-transparent rounded-2xl -z-10"
              />
              <div className="p-8 rounded-2xl border border-[#DB6E1E]/20 hover:border-[#DB6E1E] transition-colors bg-black/50 backdrop-blur-sm">
                <div className="p-4 bg-[#DB6E1E]/10 rounded-xl w-fit mb-6 text-[#DB6E1E] group-hover:scale-110 transition-transform duration-300">
                  {item.icon}
                </div>
                <h3 className="text-2xl font-bold mb-4">{item.title}</h3>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
