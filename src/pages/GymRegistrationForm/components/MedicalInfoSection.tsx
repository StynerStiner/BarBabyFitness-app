// components/MedicalInfoSection.tsx
import React from "react";
import { AlertCircle } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { FormSection } from "./FormSection";
import { useGymForm } from "../contexts/GymFormContext";

interface MedicalConditions {
  heartCondition: boolean;
  asthma: boolean;
  diabetes: boolean;
  highBloodPressure: boolean;
  jointIssues: boolean;
  allergies: boolean;
}

export const MedicalInfoSection = () => {
  const { formState, updateField, updateNestedField } = useGymForm();

  return (
    <FormSection>
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-6">
        <AlertCircle className="w-6 h-6 text-[#DB6E1E]" />
        <h3 className="text-2xl font-semibold text-[#DB6E1E]">
          Medical Information
        </h3>
      </div>

      <div className="space-y-6">
        {/* Medical Conditions Radio Buttons */}
        <div className="space-y-4">
          <Label className="text-white">
            Do you have any medical conditions or allergies?
          </Label>
          <div className="flex gap-4">
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="medical-yes"
                value="yes"
                checked={formState.hasMedicalConditions === "yes"}
                onChange={() => updateField("hasMedicalConditions", "yes")}
                className="w-5 h-5 border border-[#DB6E1E] accent-[#DB6E1E]"
              />
              <Label
                htmlFor="medical-yes"
                className="text-white cursor-pointer"
              >
                Yes
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <input
                type="radio"
                id="medical-no"
                value="no"
                checked={formState.hasMedicalConditions === "no"}
                onChange={() => updateField("hasMedicalConditions", "no")}
                className="w-5 h-5 border border-[#DB6E1E] accent-[#DB6E1E]"
              />
              <Label htmlFor="medical-no" className="text-white cursor-pointer">
                No
              </Label>
            </div>
          </div>
        </div>

        {/* Medical Conditions Checkboxes */}
        <div className="space-y-4">
          <Label className="text-white">Please check any that apply:</Label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries({
              heartCondition: "Heart Condition",
              asthma: "Asthma",
              diabetes: "Diabetes",
              highBloodPressure: "High Blood Pressure",
              jointIssues: "Joint Issues",
              allergies: "Allergies",
            }).map(([key, label]) => (
              <div key={key} className="flex items-center space-x-2">
                <Checkbox
                  id={key}
                  checked={
                    !!formState.medicalConditions[
                    key as keyof MedicalConditions
                    ]
                  }
                  onChange={(e) =>
                    updateNestedField(
                      "medicalConditions",
                      key as keyof MedicalConditions,
                      e.target.checked,
                    )
                  }
                  className="w-5 h-5 border border-[#DB6E1E] accent-[#DB6E1E]"
                />
                <Label htmlFor={key} className="text-white cursor-pointer">
                  {label}
                </Label>
              </div>
            ))}
          </div>
        </div>

        {/* Additional Medical Details Textarea */}
        <div className="space-y-2">
          <Label
            htmlFor="medicalDetails"
            className="text-white text-sm font-medium"
          >
            Additional Medical Details
          </Label>
          <Textarea
            id="medicalDetails"
            value={formState.medicalDetails}
            onChange={(e) => updateField("medicalDetails", e.target.value)}
            className="w-full bg-black border border-[#DB6E1E] rounded-lg text-white placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#DB6E1E] focus:border-transparent p-4 min-h-[120px]"
            placeholder="Please provide any additional details about your medical conditions, allergies, or other health concerns"
          />
        </div>

        {/* Emergency Preferences */}
        <div className="space-y-4">
          <Label className="text-white">Emergency Preferences:</Label>
          <div className="grid grid-cols-1 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id="medicalConsent"
                checked={formState.consentToMedicalTreatment}
                onChange={(e) =>
                  updateField("consentToMedicalTreatment", e.target.checked)
                }
                className="w-5 h-5 border border-[#DB6E1E] accent-[#DB6E1E]"
              />
              <Label
                htmlFor="medicalConsent"
                className="text-white cursor-pointer"
              >
                I consent to emergency medical treatment if necessary
              </Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="allergyAlert"
                checked={formState.wearsMedicalAlert}
                onChange={(e) =>
                  updateField("wearsMedicalAlert", e.target.checked)
                }
                className="w-5 h-5 border border-[#DB6E1E] accent-[#DB6E1E]"
              />
              <Label
                htmlFor="allergyAlert"
                className="text-white cursor-pointer"
              >
                I wear a medical alert bracelet/necklace
              </Label>
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default MedicalInfoSection;
