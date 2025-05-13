// components/PersonalInfoForm.tsx
import React from "react";
import { User } from "lucide-react";
import { Label } from "@/components/ui/Label"; // Correct import path
import { Input } from "@/components/ui/Input"; // Correct import path (case-sensitive!)
import { FormSection } from "./FormSection";
import { ContactDetails } from "./ContactDetails";
import { PersonalDetails } from "./PersonalDetails";
import { AddressDetails } from "./AddressDetails";
import { HealthMetrics } from "./HealthMetrics";

import { useGymForm } from "../contexts/GymFormContext";

export const PersonalInfoForm = () => {
  const { formState, updateField } = useGymForm();

  return (
    <FormSection>
      <div className="flex items-center gap-3 mb-6">
        <User className="w-6 h-6 text-orange-400" />
        <h3 className="text-2xl font-semibold text-orange-400">
          Personal Information
        </h3>
      </div>

      <div className="grid gap-6">
        {/* Name Fields */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-white">
              First Name
            </Label>
            <Input
              id="firstName"
              value={formState.firstName}
              onChange={(e) => updateField("firstName", e.target.value)}
              className="bg-white border-white text-black placeholder:text-gray-500 focus:border-orange-500"
              placeholder="Enter your first name"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-white">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formState.lastName}
              onChange={(e) => updateField("lastName", e.target.value)}
              className="bg-white border-white text-black placeholder:text-gray-500 focus:border-orange-500"
              placeholder="Enter your last name"
            />
          </div>
        </div>

        {/* Sub-components */}
        <ContactDetails />
        <PersonalDetails />
        <AddressDetails />
        <HealthMetrics />
      </div>
    </FormSection>
  );
};

export default PersonalInfoForm;
