// components/RegistrationHeader.tsx
import React from "react";
import type { Plan } from "@/pages/TrainingOptions/components/types";
import { motion } from "framer-motion";
import { Dumbbell } from "lucide-react";

interface RegistrationHeaderProps {
  plan: Plan | null; // Allow `plan` to be `null`
}

// Helper function to ensure plan properties match expected types
const ensureValidPlan = (inputPlan: any): Plan | null => {
  if (!inputPlan) return null;

  // Create a valid Plan object with all required properties
  const validPlan: Plan = {
    id: inputPlan.id || "",
    title: inputPlan.title || "",
    duration: inputPlan.duration || "",
    initiationFee: inputPlan.initiationFee || "",
    sessions: inputPlan.sessions || "",
    price: inputPlan.price || "",
    perks: inputPlan.perks || "", // Ensure perks is always a string
    icon: inputPlan.icon || <Dumbbell className="w-6 h-6" /> // Provide a default icon if missing
  };

  // Copy over any optional properties that exist in the input
  if (inputPlan.recommended !== undefined) validPlan.recommended = inputPlan.recommended;
  if (inputPlan.features !== undefined) validPlan.features = inputPlan.features;

  return validPlan;
};

const RegistrationHeader: React.FC<RegistrationHeaderProps> = ({ plan: inputPlan }) => {
  // Convert the input plan to ensure it matches the expected type
  const plan = ensureValidPlan(inputPlan);

  if (!plan) {
    return (
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="relative h-[900px] w-full overflow-hidden rounded-xl"
        >
          <img
            src="https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=1920"
            alt="Fitness Journey"
            className="absolute inset-0 w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

          <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="mb-6"
            >
              <Dumbbell className="w-16 h-16 text-[#DB6E1E] mx-auto mb-6" />
              <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-[#DB6E1E] to-[#DB6E1E] bg-clip-text text-transparent mb-4">
                BEGIN YOUR JOURNEY
              </h1>
              <div className="w-32 h-1 bg-[#DB6E1E] mx-auto mt-6 rounded-full" />
            </motion.div>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.6 }}
              className="text-xl text-gray-300 max-w-2xl mx-auto mt-6"
            >
              Join our community of dedicated fitness enthusiasts and start your
              transformation today.
            </motion.p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="relative mt-12 space-y-4"
        >
          {/* Watermark Text */}
          <div className="absolute -top-52 left-1/2 -translate-x-1/2 w-full pointer-events-none select-none overflow-hidden">
            <h2 className="text-[180px] font-black text-white/[0.15] whitespace-nowrap tracking-tighter transform -rotate-2">
              TRAINING REGISTRATION
            </h2>
          </div>

          {/* Main Content */}
          <div className="relative z-10">
            <h2 className="text-4xl font-bold text-[#DB6E1E]">
              Registration Form
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-4">
              Please select a plan to begin your fitness journey.
            </p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="text-center">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative h-[900px] w-full overflow-hidden rounded-xl"
      >
        <img
          src="https://images.unsplash.com/photo-1577221084712-45b0445d2b00?q=80&w=1920"
          alt="Fitness Journey"
          className="absolute inset-0 w-full h-full object-cover object-center"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/60 to-transparent" />

        <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-6"
          >
            <Dumbbell className="w-16 h-16 text-[#DB6E1E] mx-auto mb-6" />
            <h1 className="text-5xl md:text-7xl font-black bg-gradient-to-r from-white via-[#DB6E1E] to-[#DB6E1E] bg-clip-text text-transparent mb-4">
              BEGIN YOUR JOURNEY
            </h1>
            <div className="w-32 h-1 bg-[#DB6E1E] mx-auto mt-6 rounded-full" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto mt-6"
          >
            Join our community of dedicated fitness enthusiasts and start your
            transformation today.
          </motion.p>
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.9 }}
        className="relative mt-12 space-y-4"
      >
        {/* Watermark Text */}
        <div className="absolute -top-52 left-1/2 -translate-x-1/2 w-full pointer-events-none select-none overflow-hidden">
          <h2 className="text-[180px] font-black text-white/[0.15] whitespace-nowrap tracking-tighter transform -rotate-2">
            TRAINING REGISTRATION
          </h2>
        </div>

        {/* Main Content */}
        <div className="relative z-10">
          <h2 className="text-4xl font-bold text-[#DB6E1E]">
            Registration Form
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-4">
            Complete the form below to begin your fitness journey with{" "}
            <span className="font-semibold text-[#DB6E1E]">{plan.title}</span>.
            Our expert trainers are ready to help you achieve your goals.
          </p>
          <p className="text-gray-400 max-w-2xl mx-auto text-lg mt-2">
            Price: <span className="font-semibold text-[#DB6E1E]">{plan.price}</span>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default RegistrationHeader;
