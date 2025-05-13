import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ValueCard } from "./ValueCard";
import { values } from "./data";

export const ValuesSection = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  const y = useTransform(scrollYProgress, [0, 1], ["0%", "100%"]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <section
      ref={containerRef}
      className="relative min-h-screen py-24 overflow-hidden"
    >
      {/* Background Video */}
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-10"
        >
          <source src="/videos/motivation-delivered.mp4" type="video/mp4" />
        </video>

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
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-6xl md:text-7xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
              OUR VALUES
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            The core principles that drive our commitment to your fitness
            journey
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {values.map((value, index) => (
            <ValueCard key={index} {...value} index={index} />
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="text-center mt-16"
        >
          <p className="text-xl text-[#DB6E1E] font-semibold">
            Join us and experience the difference these values make
          </p>
        </motion.div>
      </div>
    </section>
  );
};
