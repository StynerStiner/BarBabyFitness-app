// src/components/Video/VideoHeader.tsx
import { motion } from "framer-motion";

interface VideoHeaderProps {
  backgroundText: string;
  title: string;
  description: string;
}

export const VideoHeader = ({
  backgroundText,
  title,
  description,
}: VideoHeaderProps) => {
  return (
    <div className="relative w-full h-full overflow-hidden">
      {/* Background Text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="text-[#8B2B00] text-[12vw] font-black opacity-[0.35] select-none whitespace-nowrap tracking-widest uppercase transform-gpu">
          {backgroundText}
        </span>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 tracking-tight">
          {title}
        </h2>
        <p className="text-white/90 text-lg max-w-2xl mx-auto leading-relaxed">
          {description}
        </p>
      </motion.div>
    </div>
  );
};
