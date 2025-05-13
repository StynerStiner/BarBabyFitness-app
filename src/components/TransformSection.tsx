// TransformSection.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/image";

export const TransformSection = () => {
  return (
    <section className="relative bg-black overflow-hidden">
      <div className="absolute inset-0">
        <Image
          src="/images/academy_features.png"
          alt="Fighter in shadow"
          className="object-cover object-center w-full h-full"
        />
      </div>
      <div className="absolute inset-0 bg-black/50" />

      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-visible z-1">
        <span className="text-white text-[35vw] font-black opacity-[0.25] select-none whitespace-nowrap tracking-wider uppercase transform-gpu shadow-lg"></span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-4 md:py-8 relative z-10"
      >
        <div className="max-w-2xl space-y-6 p-6 md:p-8 bg-black/60 rounded-lg backdrop-blur-sm">
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold leading-tight text-center md:text-left text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#DB6E1E]">
            TRANSFORM WITH BARBABY FITNESS: CONNECT, SWEAT, INSPIRE, ACHIEVE.
          </h2>
          <h3 className="text-2xl md:text-3xl lg:text-4xl font-semibold mt-4 text-white">
            Flexible Plans. Real Results. Total Support.
          </h3>
          <p className="text-gray-300 text-base md:text-lg">
            At BarBaby Fitness, we believe in giving you options that work for
            your lifestyle. Whether you prefer a membership plan or
            pay-as-you-go flexibility, we've got you covered. Get access to
            personalized support, expert guidance, and a community that's all
            about achieving your fitness goals. Train at your own pace—at the
            gym, at home, or virtually—and see the real, lasting results you
            deserve. Let's make your fitness journey powerful, flexible, and
            uniquely yours.
          </p>
          <div className="flex flex-col sm:flex-row gap-4">
            <Button variant="outline" className="w-full sm:w-auto">
              Explore Our Programs
            </Button>
            <Button variant="solid" className="w-full sm:w-auto">
              Start Your Transformation Today
            </Button>
          </div>
        </div>
      </motion.div>
    </section>
  );
};
