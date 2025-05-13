// src/pages/TrainingOptions/components/PlanSelection/PlanCard/index.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import type { Plan } from "@/pages/TrainingOptions/components/types";
// Explanation:
// index.tsx is in the "PlanCard" folder, which is inside "PlanSelection" which is inside "components".
// To reach "types.ts" in "components": One level up to "PlanSelection" => "../", then another level up to "components" => "../../"
// So the correct path would be: ../@/pages/TrainingOptions/components/types

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export const PlanCard = ({
  plan,
  isSelected,
  onSelect,
  index,
}: PlanCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`relative flex flex-col p-6 rounded-2xl border transition-all duration-300
        ${isSelected ? "border-[#DB6E1E] bg-[#DB6E1E]/10" : "border-zinc-800 hover:border-[#DB6E1E]/50 bg-zinc-900/50"}
        hover:transform hover:scale-105 hover:shadow-2xl
      `}
    >
      {plan.recommended && (
        <div className="absolute -top-4 right-4 bg-gradient-to-r from-[#DB6E1E] to-[#F17A2B] text-white px-4 py-1 rounded-full text-sm font-semibold">
          Recommended
        </div>
      )}
      <div className="p-3 bg-black/30 rounded-lg w-fit mb-4">{plan.icon}</div>
      <h3 className="text-2xl font-bold mb-2">{plan.title}</h3>
      <p className="text-sm text-gray-400 mb-1">{plan.duration}</p>
      <p className="text-2xl font-bold text-[#DB6E1E] mb-2">{plan.price}</p>
      <p className="text-gray-300 mb-4">{plan.perks}</p>

      <div className="space-y-2 mb-6 flex-grow">
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Initiation Fee:</span>
          <span className="text-white">{plan.initiationFee}</span>
        </div>
        <div className="flex justify-between text-sm">
          <span className="text-gray-400">Sessions:</span>
          <span className="text-white">{plan.sessions}</span>
        </div>
      </div>

      <Button
        onClick={onSelect}
        className={`
          w-full bg-gradient-to-r from-[#DB6E1E] to-[#F17A2B]
          hover:from-[#F17A2B] hover:to-[#DB6E1E] transition-all duration-300
          transform hover:scale-105 font-semibold
        `}
      >
        {isSelected ? "Selected" : "Choose Plan"}
      </Button>
    </motion.div>
  );
};
