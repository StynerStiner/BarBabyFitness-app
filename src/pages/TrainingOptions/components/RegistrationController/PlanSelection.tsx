// src/pages/TrainingOptions/components/RegistrationController/PlanSelection.tsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import { PlanCard } from "../PlanSelection/PlanCard";
import { usePlans } from "../../hooks/usePlans";
import type { Plan } from "@/pages/TrainingOptions/components/types"; // Adjusted import path

interface PlanSelectionProps {
  onSelect: (plan: Plan) => void;
}

export const PlanSelection: React.FC<PlanSelectionProps> = ({ onSelect }) => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const { plans } = usePlans();

  const handleSelectPlan = (planId: string) => {
    setSelectedPlan(planId);
    const plan = plans.find((p) => p.id === planId);
    if (plan) {
      onSelect(plan); // Changed to match prop name
    }
  };

  return (
    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-black mb-6">
            <span className="bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
              CHOOSE YOUR PATH
            </span>
          </h2>
          <p className="text-xl text-gray-300">
            Select the training plan that aligns with your goals and schedule.
            All plans include expert guidance and support.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {plans.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={selectedPlan === plan.id}
              onSelect={() => handleSelectPlan(plan.id)}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
