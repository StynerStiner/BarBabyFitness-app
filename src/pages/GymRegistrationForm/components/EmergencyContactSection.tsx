import React from "react";
import { Heart } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { FormSection } from "./FormSection";
import { useGymForm } from "@/pages/GymRegistrationForm/contexts/GymFormContext";

export const EmergencyContactSection: React.FC = () => {
  const { formState, updateField } = useGymForm();

  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <Heart className="w-6 h-6 text-orange-400" />
        <h3 className="text-2xl font-semibold text-orange-400">
          Emergency Contact
        </h3>
      </div>

      {/* Name Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="mb-4">
          <label className="block mb-2">First Name</label>
          <input
            type="text"
            id="emergencyFirstName"
            name="emergencyFirstName"
            placeholder="Emergency contact's first name"
            className="w-full p-2 bg-white text-black"
            value={formState.emergencyContact?.firstName || ""}
            onChange={(e) =>
              updateField("emergencyContact", {
                ...formState.emergencyContact,
                firstName: e.target.value,
              })
            }
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Last Name</label>
          <input
            type="text"
            id="emergencyLastName"
            name="emergencyLastName"
            placeholder="Emergency contact's last name"
            className="w-full p-2 bg-white text-black"
            value={formState.emergencyContact?.lastName || ""}
            onChange={(e) =>
              updateField("emergencyContact", {
                ...formState.emergencyContact,
                lastName: e.target.value,
              })
            }
          />
        </div>
      </div>

      {/* Phone Number */}
      <div className="mb-4">
        <label className="block mb-2">Phone Number</label>
        <input
          type="tel"
          id="emergencyPhone"
          name="emergencyPhone"
          placeholder="(123) 456-7890"
          className="w-full p-2 bg-white text-black"
          value={formState.emergencyContact?.phone || ""}
          onChange={(e) =>
            updateField("emergencyContact", {
              ...formState.emergencyContact,
              phone: e.target.value,
            })
          }
        />
      </div>

      {/* Relationship */}
      <div className="mb-4">
        <label className="block mb-2">Relationship</label>
        <input
          type="text"
          id="emergencyRelationship"
          name="emergencyRelationship"
          placeholder="Relationship to emergency contact"
          className="w-full p-2 bg-white text-black"
          value={formState.emergencyContact?.relationship || ""}
          onChange={(e) =>
            updateField("emergencyContact", {
              ...formState.emergencyContact,
              relationship: e.target.value,
            })
          }
        />
      </div>
    </div>
  );
};

export default EmergencyContactSection;
