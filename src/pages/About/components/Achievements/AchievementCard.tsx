import { motion } from "framer-motion";
import { Target } from "lucide-react";

interface AchievementCardProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  gradient: string;
  index: number;
  isGoal: boolean;
  description: string;
  currentValue?: string;
}

export const AchievementCard = ({
  icon,
  value,
  label,
  gradient,
  index,
  isGoal,
  description,
  currentValue,
}: AchievementCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="relative group"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 to-transparent rounded-2xl blur-xl group-hover:opacity-100 transition-opacity" />
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative p-8 rounded-2xl border border-[#DB6E1E]/20 hover:border-[#DB6E1E] transition-all bg-black/50 backdrop-blur-sm text-center"
      >
        <div
          className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient} mb-6 text-white transform group-hover:scale-110 transition-transform duration-300`}
        >
          {icon}
        </div>
        <motion.div
          initial={{ scale: 0 }}
          whileInView={{ scale: 1 }}
          transition={{
            type: "spring",
            stiffness: 100,
            delay: index * 0.2,
          }}
          className="relative"
        >
          {isGoal && (
            <div className="absolute -top-6 right-0 flex items-center gap-1 text-sm text-[#DB6E1E] font-semibold">
              <Target className="w-4 h-4" />
              <span>Goal</span>
            </div>
          )}

          <h3 className="text-5xl font-black mb-2 bg-gradient-to-r from-white to-[#DB6E1E] bg-clip-text text-transparent">
            {value}
          </h3>

          {isGoal && currentValue && (
            <div className="text-sm text-gray-400 mb-2">
              Currently: {currentValue}
            </div>
          )}

          <p className="text-sm font-bold tracking-wider text-gray-400 mb-2">
            {label}
          </p>

          <p className="text-xs text-gray-500">{description}</p>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};
