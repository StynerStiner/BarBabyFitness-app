import { motion } from "framer-motion";
import { LucideIcon } from "lucide-react";

interface JourneyItemProps {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
  index: number;
  isActive: boolean;
}

export const JourneyItem = ({
  year,
  title,
  description,
  icon: Icon,
  index,
  isActive,
}: JourneyItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: index * 0.2 }}
      className={`flex items-center mb-24 ${
        index % 2 === 0 ? "flex-row" : "flex-row-reverse"
      }`}
    >
      <div className="w-1/2 px-12">
        <motion.div
          whileHover={{ scale: 1.05 }}
          className={`${
            index % 2 === 0 ? "text-right" : "text-left"
          } bg-black/50 p-6 rounded-2xl border border-[#DB6E1E]/20 hover:border-[#DB6E1E] transition-colors`}
        >
          <div
            className={`flex items-center gap-4 mb-4 ${
              index % 2 === 0 ? "flex-row-reverse" : "flex-row"
            }`}
          >
            <div className="p-2 bg-black/50 rounded-xl">
              <Icon className="w-8 h-8 text-[#DB6E1E]" />
            </div>
            <span className="text-[#DB6E1E] text-xl font-bold">{year}</span>
          </div>
          <h3 className="text-3xl font-black mb-4 bg-gradient-to-r from-white to-[#DB6E1E] bg-clip-text text-transparent">
            {title}
          </h3>
          <p className="text-gray-400 text-lg">{description}</p>
        </motion.div>
      </div>
      <div
        className={`absolute left-1/2 w-4 h-4 ${
          isActive ? "bg-[#DB6E1E]" : "bg-[#DB6E1E]/30"
        } rounded-full transform -translate-x-1/2 transition-colors duration-300`}
      />
      <div className="w-1/2 px-12" />
    </motion.div>
  );
};
