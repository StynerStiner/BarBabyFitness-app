import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

export const HeroImage = () => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 1 }}
      className="relative h-[300px] sm:h-[500px] md:h-[600px] lg:h-[850px] w-full"
    >
      <div className="absolute inset-0 gradient-border rounded-3xl overflow-hidden">
        <Image
          src="/images/Heroimage.png"
          alt="Bar Baby Trainer Fighter"
          className="object-cover w-full h-full transform hover:scale-105 transition-transform duration-700"
        />
        {/* Overlay Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
      </div>

      {/* Decorative Elements */}
      <div
        className="absolute -top-4 -right-4 w-24 h-24 border-2 border-[#DB6E1E] rounded-full animate-float"
        style={{ animationDelay: "-0.5s" }}
      />
      <div
        className="absolute -bottom-4 -left-4 w-32 h-32 border-2 border-[#DB6E1E] rounded-full animate-float"
        style={{ animationDelay: "-1s" }}
      />
    </motion.div>
  );
};
