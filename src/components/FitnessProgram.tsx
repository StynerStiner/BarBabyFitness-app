import { motion, useTransform, useScroll } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/image";

export const FitnessProgram = () => {
  const { scrollYProgress } = useScroll();

  return (
    <section
      className="container mx-auto px-4 pb-16 md:pb-24"
      style={{ marginTop: "-30px", paddingTop: "20px" }}
    >
      <div className="grid md:grid-cols-2 gap-8 md:gap-16 items-center">
        <div className="relative aspect-[4/5] w-full max-w-xl mx-auto md:max-w-none order-2 md:order-1">
          <Image
            src="/images/your_fitness_your_way.png"
            alt="Your Fitness Your Way"
            className="object-cover rounded-lg w-full h-full"
          />

          {/* Header WATER Text */}
          <div className="absolute inset-x-0 top-[-100px] z-20 flex justify-start">
            <motion.h2
              style={{
                opacity: useTransform(scrollYProgress, [0, 0.3], [0.2, 0.6]),
                y: useTransform(scrollYProgress, [0, 0.2], [50, 0]),
                x: useTransform(scrollYProgress, [0, 0.2], [0, 700]), // Moves slightly less to the right
              }}
              className="text-[#F0F0F0] text-[20vw] sm:text-[18vw] md:text-[16vw] lg:text-[14vw] font-black opacity-[0.4] select-none tracking-wider uppercase transform-gpu"
            >
              TODAY
            </motion.h2>
          </div>
        </div>
        <div className="flex flex-col items-center md:items-start space-y-6 md:space-y-8 order-1 md:order-2">
          <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold text-center md:text-left leading-tight">
            A FITNESS PROGRAM THAT WORKS WITH YOUR LIFESTYLE
          </h2>
          <p className="text-gray-400 text-base md:text-lg lg:text-xl text-center md:text-left">
            In-person or virtual, Lige Stiner's training service adapts to your
            lifestyle. Schedule sessions at your convenience and receive
            personalized guidance, whether at home or in the gym.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
            <Button variant="outline" className="w-full sm:w-auto">
              Book Now
            </Button>
            <Button variant="solid" className="w-full sm:w-auto">
              Virtual Tour
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
};
