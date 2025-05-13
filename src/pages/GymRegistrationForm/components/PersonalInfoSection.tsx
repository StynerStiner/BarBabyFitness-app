// components/PersonalInfoSection.tsx
import React from "react";
import { User, Calendar } from "lucide-react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Select, SelectItem } from "@/components/ui/select";
import { FormSection } from "./FormSection";
import { PersonalDetails } from "./PersonalDetails"; // Importing PersonalDetails
import { ContactDetails } from "./ContactDetails";
import { AddressDetails } from "./AddressDetails";

export const PersonalInfoSection = () => {
  return (
    <FormSection>
      {/* Section Header */}
      <div className="flex items-center gap-2 mb-8">
        <User className="w-5 h-5 text-orange-500" />
        <h3 className="text-xl font-medium text-orange-500">
          Personal Information
        </h3>
      </div>

      <div className="space-y-4">
        {/* Name Fields */}
        <div className="grid grid-cols-2 gap-8">
          <div className="mb-4">
            <label className="block mb-2">First Name</label>
            <input
              type="text"
              placeholder="Enter your first name"
              className="w-full p-2 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Last Name</label>
            <input
              type="text"
              placeholder="Enter your last name"
              className="w-full p-2 bg-white text-black"
            />
          </div>
        </div>

        {/* Contact Fields */}
        <div className="grid grid-cols-2 gap-8">
          <div className="mb-4">
            <label className="block mb-2">Email Address</label>
            <input
              type="email"
              placeholder="example@example.com"
              className="w-full p-2 bg-white text-black"
            />
          </div>
          <div className="mb-4">
            <label className="block mb-2">Phone Number</label>
            <input
              type="tel"
              placeholder="(123) 456-7890"
              className="w-full p-2 bg-white text-black"
            />
          </div>
        </div>

        {/* Date of Birth */}
        <div className="mb-4">
          <label className="block mb-2">Date of Birth</label>
          <input
            type="date"
            placeholder="mm/dd/yyyy"
            className="w-full p-2 bg-white text-black"
          />
        </div>

        {/* Personal Details Section */}
        <PersonalDetails />

        {/* Address Fields */}
        <div className="bg-black text-white p-6 font-sans">
          <div className="mb-4">
            <label className="block mb-2">Street Address</label>
            <input
              type="text"
              placeholder="Enter your street address"
              className="w-full p-2 bg-white text-black"
            />
          </div>

          <div className="mb-4">
            <label className="block mb-2">Street Address Line 2</label>
            <input
              type="text"
              placeholder="Apartment, suite, etc. (optional)"
              className="w-full p-2 bg-white text-black"
            />
          </div>

          <div className="flex gap-4">
            <div className="flex-1">
              <label className="block mb-2">City</label>
              <input
                type="text"
                placeholder="Enter your city"
                className="w-full p-2 bg-white text-black"
              />
            </div>

            <div className="flex-1">
              <label className="block mb-2">State/Province</label>
              <select className="w-full p-2 bg-white text-black">
                <option value="" disabled>
                  Select state
                </option>
                <option value="AL">Alabama</option>
                <option value="AK">Alaska</option>
                <option value="AZ">Arizona</option>
                <option value="AR">Arkansas</option>
                <option value="CA">California</option>
                <option value="CO">Colorado</option>
                <option value="CT">Connecticut</option>
                <option value="DE">Delaware</option>
                <option value="FL">Florida</option>
                <option value="GA">Georgia</option>
                <option value="HI">Hawaii</option>
                <option value="ID">Idaho</option>
                <option value="IL">Illinois</option>
                <option value="IN">Indiana</option>
                <option value="IA">Iowa</option>
                <option value="KS">Kansas</option>
                <option value="KY">Kentucky</option>
                <option value="LA">Louisiana</option>
                <option value="ME">Maine</option>
                <option value="MD">Maryland</option>
                <option value="MA">Massachusetts</option>
                <option value="MI">Michigan</option>
                <option value="MN">Minnesota</option>
                <option value="MS">Mississippi</option>
                <option value="MO">Missouri</option>
                <option value="MT">Montana</option>
                <option value="NE">Nebraska</option>
                <option value="NV">Nevada</option>
                <option value="NH">New Hampshire</option>
                <option value="NJ">New Jersey</option>
                <option value="NM">New Mexico</option>
                <option value="NY">New York</option>
                <option value="NC">North Carolina</option>
                <option value="ND">North Dakota</option>
                <option value="OH">Ohio</option>
                <option value="OK">Oklahoma</option>
                <option value="OR">Oregon</option>
                <option value="PA">Pennsylvania</option>
                <option value="RI">Rhode Island</option>
                <option value="SC">South Carolina</option>
                <option value="SD">South Dakota</option>
                <option value="TN">Tennessee</option>
                <option value="TX">Texas</option>
                <option value="UT">Utah</option>
                <option value="VT">Vermont</option>
                <option value="VA">Virginia</option>
                <option value="WA">Washington</option>
                <option value="WV">West Virginia</option>
                <option value="WI">Wisconsin</option>
                <option value="WY">Wyoming</option>
              </select>
            </div>

            <div className="flex-1">
              <label className="block mb-2">Postal/Zip Code</label>
              <input
                type="text"
                placeholder="Enter zip code"
                className="w-full p-2 bg-white text-black"
              />
            </div>
          </div>
        </div>
      </div>
    </FormSection>
  );
};

export default PersonalInfoSection;
