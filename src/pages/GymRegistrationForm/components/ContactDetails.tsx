import React from "react";
import { Mail, Phone } from "lucide-react";
import { Label } from "@/components/ui/Label"; // Correct import path
import { Input } from "@/components/ui/Input"; // Correct import path (case-sensitive!)
import { useGymForm } from "../contexts/GymFormContext";

export const ContactDetails = () => {
  const { formState, updateField } = useGymForm();

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="space-y-2">
        <Label htmlFor="email" className="text-white flex items-center gap-2">
          <Mail className="w-4 h-4 text-orange-400" />
          Email Address
        </Label>
        <Input
          id="email"
          type="email"
          value={formState.email}
          onChange={(e) => updateField("email", e.target.value)}
          className="bg-white border-white text-black placeholder:text-gray-500 focus:border-orange-500"
          placeholder="example@email.com"
          required
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone" className="text-white flex items-center gap-2">
          <Phone className="w-4 h-4 text-orange-400" />
          Phone Number
        </Label>
        <Input
          id="phone"
          type="tel"
          value={formState.phone}
          onChange={(e) => updateField("phone", e.target.value)}
          className="bg-white border-white text-black placeholder:text-gray-500 focus:border-orange-500"
          placeholder="(123) 456-7890"
          required
        />
      </div>
    </div>
  );
};

export default ContactDetails;
