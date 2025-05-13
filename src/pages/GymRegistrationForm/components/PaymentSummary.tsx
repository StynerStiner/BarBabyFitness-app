import React from "react";
import { Plan } from "@/pages/TrainingOptions/components/types";
import { Dumbbell } from "lucide-react";

interface PaymentSummaryProps {
  plan: Plan;
}

/**
 * Displays only the selected plan details.
 * Payment summary has been removed as it will be shown on the Zelle payment page.
 * 
 * @param {{ plan: Plan }} props - The selected plan.
 * @returns {ReactElement} The plan details component.
 */
export const PaymentSummary: React.FC<PaymentSummaryProps> = ({ plan }) => {
  if (!plan) return null;

  // Ensure we have values for all fields with fallbacks
  const sessions = plan.sessions || "12 sessions per month";
  const initiationFee = plan.initiationFee || "$100";

  return (
    <div className="mt-8 p-6 bg-gradient-to-r from-orange-500/10 to-orange-500/5 rounded-xl border border-orange-500/20 shadow-lg">
      <h3 className="text-xl font-semibold text-orange-400 mb-4 flex items-center gap-2">
        <Dumbbell className="w-5 h-5" />
        Selected Plan: {plan.title}
      </h3>

      <div className="grid md:grid-cols-2 gap-4 text-sm">
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-gray-400">Duration:</span>
            <span className="text-orange-400 font-medium">{plan.duration}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-gray-400">Price:</span>
            <span className="text-orange-400 font-medium">{plan.price}</span>
          </div>
        </div>
        <div className="space-y-3">
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-gray-400">Sessions:</span>
            <span className="text-orange-400 font-medium">{sessions}</span>
          </div>
          <div className="flex justify-between items-center p-2 bg-white/5 rounded">
            <span className="text-gray-400">Initiation Fee:</span>
            <span className="text-orange-400 font-medium">{initiationFee}</span>
          </div>
        </div>
      </div>

      {plan.perks && (
        <p className="text-gray-400 mt-4 p-3 bg-white/5 rounded">
          {plan.perks}
        </p>
      )}
    </div>
  );
};

export default PaymentSummary;
