// src/pages/TrainingOptions/components/PlanSelection/PlanCard.tsx
import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { useNavigate } from "react-router-dom";
import type { Plan } from "@/pages/TrainingOptions/components/types";
import { Check } from "lucide-react";

interface PlanCardProps {
  plan: Plan;
  isSelected: boolean;
  onSelect: () => void;
  index: number;
}

export const PlanCard: React.FC<PlanCardProps> = ({
  plan,
  isSelected,
  onSelect,
  index,
}) => {
  const navigate = useNavigate();

  const handleSelectPlan = () => {
    onSelect();

    // Create a serializable version of the plan without the React element
    const serializablePlan = {
      ...plan,
      icon: null // Remove the icon React element
    };

    navigate("/register", {
      state: { selectedPlan: serializablePlan },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className={`
        relative flex flex-row w-full p-6 md:p-8 rounded-2xl border transition-all duration-300
        border-zinc-800 bg-[#121212] hover:border-[#F17A2B]/50
        hover:shadow-xl
        mx-auto
        mb-8
      `}
    >
      {plan.recommended && (
        <div className="absolute bottom-6 -left-4 z-20">
          <div className="bg-[#FF8A3D] text-white font-extrabold py-3 px-8 shadow-lg">
            <span className="text-sm tracking-widest">RECOMMENDED</span>
          </div>
          <div className="absolute top-full left-0 w-0 h-0 border-t-[12px] border-r-[12px] border-l-0 border-t-[#C85A1B] border-r-transparent"></div>
        </div>
      )}

      <div className="flex flex-col lg:flex-row w-full">
        {/* Left Section - Icon and Title */}
        <div className="flex items-start lg:w-1/3 mb-6 lg:mb-0">
          <div className="flex-shrink-0 mr-4 md:mr-6">
            <div className="w-fit">
              {plan.icon}
            </div>
          </div>

          <div className="flex flex-col">
            <h3 className="text-xl md:text-2xl font-bold text-white mb-1">{plan.title}</h3>
            <p className="text-sm text-gray-400 mb-1">{plan.duration}</p>
            <p className="text-base md:text-lg text-white mb-1">{plan.sessions}</p>
            <p className="text-sm text-gray-300 mb-3">{plan.perks}</p>
          </div>
        </div>

        {/* Middle Section - Features */}
        <div className="lg:w-1/3 mb-6 lg:mb-0">
          <div className="grid grid-cols-1 gap-2">
            {plan.features?.map((feature, i) => (
              <div key={i} className="flex items-start">
                <Check className="h-4 w-4 md:h-5 md:w-5 text-[#F17A2B] shrink-0 mt-0.5 mr-2" />
                <span className="text-xs md:text-sm text-gray-300">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Right Section - Price & Button */}
        <div className="flex flex-row lg:flex-col items-center lg:items-end justify-between lg:w-1/4">
          <div className="text-left lg:text-right">
            <p className="text-2xl md:text-3xl font-bold text-[#F17A2B]">{plan.price}</p>
            <p className="text-xs md:text-sm text-gray-400">Initiation Fee: {plan.initiationFee}</p>
          </div>

          <Button
            onClick={handleSelectPlan}
            className={`
              w-[120px] md:w-[140px] bg-[#F17A2B] hover:bg-[#DB6E1E] transition-all duration-300
              rounded-full py-2 md:py-3 px-4 font-semibold text-center text-black
              lg:mt-8
            `}
          >
            Choose Plan
          </Button>
        </div>
      </div>
    </motion.div>
  );
};
