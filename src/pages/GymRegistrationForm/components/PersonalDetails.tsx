// src/pages/GymRegistrationForm/components/PersonalDetails.tsx
import React from "react";
import { User } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { FormSection } from "./FormSection";
import { useGymForm } from "../contexts/GymFormContext";

export const PersonalDetails = () => {
  const { formState, updateField } = useGymForm();

  const checkboxFields = [
    { id: "isFirstTime", label: "First time at a gym" },
    { id: "wantsPersonalTraining", label: "Interested in personal training" },
    { id: "wantsGroupClasses", label: "Interested in group classes" },
    { id: "needsNutritionGuidance", label: "Need nutrition guidance" },
  ] as const;

  return (
    <FormSection>
      <div className="flex items-center gap-2 mb-8">
        <User className="w-5 h-5 text-orange-500" />
        <h3 className="text-xl font-medium text-orange-500">
          Personal Details
        </h3>
      </div>

      <div className="space-y-4">
        {/* Gender Selection */}
        <div className="space-y-2">
          <Label className="text-white">Gender</Label>
          <div className="flex gap-8">
            {["Male", "Female", "Other"].map((gender) => (
              <div key={gender} className="flex items-center gap-2">
                <input
                  type="radio"
                  id={gender.toLowerCase()}
                  name="gender"
                  value={gender.toLowerCase()}
                  checked={formState.gender === gender.toLowerCase()}
                  onChange={(e) => updateField("gender", e.target.value)}
                  className="w-4 h-4 border-2 border-white accent-orange-500"
                />
                <Label htmlFor={gender.toLowerCase()} className="text-white">
                  {gender}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Information */}
        <div className="space-y-4">
          <Label className="text-white">Additional Information</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {checkboxFields.map(({ id, label }) => (
              <div key={id} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id={id}
                  checked={Boolean(formState[id])}
                  onChange={(e) => updateField(id, e.target.checked)}
                  className="w-4 h-4 border-2 border-white accent-orange-500"
                />
                <Label htmlFor={id} className="text-white">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default PersonalDetails;
