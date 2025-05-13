// src/pages/TrainingOptions/components/StepIndicator/StepIndicator.tsx
import { motion } from "framer-motion";
import type { StepIndicatorProps } from "@/pages/TrainingOptions/components/types";

export const StepIndicator = ({ currentStep, steps }: StepIndicatorProps) => {
  return (
    <div className="flex justify-center items-center mb-12">
      {steps.map((step, index) => (
        <div key={step.id} className="flex items-center">
          <div className="flex flex-col items-center">
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: index * 0.2 }}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 ${
                step.status !== "upcoming"
                  ? "border-[#DB6E1E] bg-[#DB6E1E]/10 text-[#DB6E1E]"
                  : "border-gray-600 text-gray-600"
              }`}
            >
              {step.id}
            </motion.div>
            <span
              className={`mt-2 text-sm ${
                step.status !== "upcoming" ? "text-[#DB6E1E]" : "text-gray-600"
              }`}
            >
              {step.title}
            </span>
            <span className="text-xs text-gray-500">{step.description}</span>
          </div>
          {index < steps.length - 1 && (
            <div
              className={`w-24 h-[2px] mx-4 ${
                step.status === "complete" ? "bg-[#DB6E1E]" : "bg-gray-600"
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};
