// MembershipSection.tsx
import React, { useEffect } from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "@radix-ui/react-radio-group";
import { Clock } from "lucide-react";
import { FormSection } from "./FormSection";
import { motion } from "framer-motion";
import { useGymForm } from "@/pages/GymRegistrationForm/contexts/GymFormContext";
import { Plan } from "@/pages/TrainingOptions/components/types";

interface MembershipSectionProps {
  plan: Plan;
}

export const MembershipSection: React.FC<MembershipSectionProps> = ({
  plan,
}) => {
  const { formState, updateField } = useGymForm();

  // Set default duration to 12 months on component mount
  useEffect(() => {
    updateField("selectedDuration", "12");
  }, [updateField]);

  return (
    <FormSection>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-6 h-6 text-orange-400" />
        <h3 className="text-2xl font-semibold text-orange-400">
          Membership Duration
        </h3>
      </div>

      <div className="space-y-8">
        {/* Duration Selection */}
        <div className="space-y-4">
          <div className="flex flex-col gap-1">
            <Label className="text-white text-lg">Choose Duration</Label>
            <span className="text-sm text-orange-300 italic">Subscription renewal coming soon!</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {["3", "6", "12"].map((duration) => (
              <motion.div
                key={duration}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: parseInt(duration) * 0.1 }}
                className="relative"
              >
                <Label
                  className={`flex flex-col items-center justify-center p-4 h-full rounded-lg border-2 
                  ${duration === "12"
                      ? "border-orange-500 bg-orange-500/20 shadow-lg shadow-orange-500/20"
                      : "border-orange-400 bg-black/10"}
                  ${duration !== "12" ? "cursor-not-allowed" : "cursor-default"}`}
                >
                  <span className={`text-2xl font-bold ${duration === "12" ? "text-orange-400" : "text-white"}`}>
                    {duration} Months
                  </span>
                  {duration === "12" && (
                    <span className="mt-2 text-sm text-white bg-orange-500 px-3 py-1 rounded-full font-semibold">
                      Best Value!
                    </span>
                  )}
                  {duration !== "12" && (
                    <span className="mt-2 text-xs text-orange-300 font-medium">
                      Coming Soon
                    </span>
                  )}
                </Label>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Preferred Start Date */}
        <div className="space-y-6">
          <Label htmlFor="startDate" className="text-white mb-2 block">
            Preferred Start Date
          </Label>
          <div className="flex items-center gap-4">
            <Input
              id="startDate"
              type="date"
              value={formState.startDate || ""}
              onChange={(e) => updateField("startDate", e.target.value)}
              className="bg-white border-white text-black focus:border-orange-500 p-2.5 rounded-md shadow-md"
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default MembershipSection;
