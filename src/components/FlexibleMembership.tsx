// FlexibleMembership.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/image";

export const FlexibleMembership = () => {
  return (
    <section className="relative bg-black overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-visible z-1">
        <span className="text-white text-[35vw] font-black opacity-[0.25] select-none whitespace-nowrap tracking-wider uppercase transform-gpu shadow-lg">
          FLOW
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-12 md:py-16 pb-0 mb-0 relative z-10"
      >
        <div className="grid md:grid-cols-2 gap-8 md:gap-12 items-center">
          <div className="space-y-6 md:space-y-8 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl lg:text-6xl font-bold leading-tight text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#DB6E1E]">
              FLEXIBLE MEMBERSHIP, PERSONAL ATTENTION
            </h2>
            <p className="text-gray-400 text-base md:text-lg lg:text-xl">
              No long-term contracts here. For an annual fee of $350, access our
              exclusive training services and schedule sessions as you need.
              Each session is tailored to your needs and billed per hour,
              offering you flexibility and value.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center md:justify-start">
              <Button variant="outline" className="w-full sm:w-auto">
                Join Us
              </Button>
              <Button variant="solid" className="w-full sm:w-auto">
                Explore Benefits
              </Button>
            </div>
          </div>
          <div className="relative aspect-[4/5] w-full max-w-xl mx-auto md:max-w-none">
            <Image
              src="/images/flexiblemembership.png"
              alt="Flexible Membership"
              className="object-cover rounded-lg shadow-lg w-full h-full"
            />
          </div>
        </div>
      </motion.div>

      {/* Gradient Transition at the Bottom */}
      <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#DB6E1E] via-transparent to-transparent z-10"></div>
    </section>
  );
};
