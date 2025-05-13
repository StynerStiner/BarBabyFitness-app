import { motion } from "framer-motion";

interface MerchHeaderProps {
  backgroundText: string;
  title: string;
  description: string;
}

export const MerchHeader = ({
  backgroundText,
  title,
  description,
}: MerchHeaderProps) => {
  return (
    <div className="relative w-full min-h-[300px] sm:min-h-[400px] lg:min-h-[500px] py-12 sm:py-16 lg:py-24">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center overflow-visible">
        <span className="text-[#333333] text-[30vw] sm:text-[25vw] md:text-[20vw] font-black opacity-[0.4] select-none whitespace-nowrap tracking-widest uppercase transform-gpu">
          {backgroundText}
        </span>
      </div>

      {/* Content */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 text-center max-w-[90%] sm:max-w-2xl md:max-w-4xl lg:max-w-6xl mx-auto px-4"
      >
        <h2 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-white to-[#DB6E1E] mb-4 sm:mb-6 lg:mb-8 tracking-tight leading-tight">
          {title}
        </h2>
        <p className="text-base sm:text-lg md:text-xl text-gray-400 max-w-sm sm:max-w-xl md:max-w-2xl mx-auto">
          {description}
        </p>
      </motion.div>
    </div>
  );
};
