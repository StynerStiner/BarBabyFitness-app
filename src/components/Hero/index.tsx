import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { HeroImage } from "./HeroImage";

export const Hero = () => {
  return (
    <div className="relative flex min-h-screen py-24 md:py-32 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#DB6E1E]/20 rounded-full filter blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#DB6E1E]/10 rounded-full filter blur-3xl animate-float"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      <div className="container mx-auto px-4 md:px-8 grid md:grid-cols-2 gap-12 items-center relative z-10">
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 1 }}
          className="space-y-8 text-center md:text-left"
        >
          <div className="space-y-4">
            <h1 className="text-6xl md:text-8xl font-black leading-none">
              <span className="text-stroke animate-pulse-glow">BAR</span>
              <br />
              <span className="text-gradient">BABY</span>
              <br />
              <span className="text-stroke-orange">FITNESS</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 font-light">
              Transform your fitness journey with expert guidance. Experience
              personalized training designed to help you achieve your goals.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
            <Button
              variant="outline"
              className="group relative overflow-hidden px-8 py-4 text-lg"
            >
              <span className="relative z-10 group-hover:text-black transition-colors duration-300">
                Get Started
              </span>
              <div className="absolute inset-0 bg-[#DB6E1E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
            <Button
              variant="solid"
              className="group relative overflow-hidden px-8 py-4 text-lg"
            >
              <span className="relative z-10">Discover More</span>
              <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
            </Button>
          </div>
        </motion.div>

        <HeroImage />
      </div>
    </div>
  );
};
