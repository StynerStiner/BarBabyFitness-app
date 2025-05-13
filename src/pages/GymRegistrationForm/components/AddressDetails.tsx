import React from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input"; // Correct case
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export const AddressDetails: React.FC = () => {
  return (
    <div className="space-y-4">
      {/* Street Address */}
      <div>
        <Label htmlFor="streetAddress">Street Address</Label>
        <Input
          id="streetAddress"
          name="streetAddress"
          className="mt-1 block w-full bg-white border-white text-black rounded-md"
          placeholder="Enter your street address"
          required
        />
      </div>

      {/* Street Address Line 2 */}
      <div>
        <Label htmlFor="streetAddress2">Street Address Line 2</Label>
        <Input
          id="streetAddress2"
          name="streetAddress2"
          className="mt-1 block w-full bg-white border-white text-black rounded-md"
          placeholder="Apartment, suite, etc. (optional)"
        />
      </div>

      {/* City, State, ZIP */}
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        <div>
          <Label htmlFor="city">City</Label>
          <Input
            id="city"
            name="city"
            className="mt-1 block w-full bg-white border-white text-black rounded-md"
            placeholder="Enter your city"
            required
          />
        </div>

        <div>
          <Label htmlFor="state">State/Province</Label>
          <Select>
            <SelectTrigger className="mt-1 block w-full bg-white border-white text-black rounded-md">
              <SelectValue placeholder="Select state" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="ny">New York</SelectItem>
              <SelectItem value="ca">California</SelectItem>
              {/* Add more states as needed */}
            </SelectContent>
          </Select>
        </div>

        <div>
          <Label htmlFor="zip">Postal/ZIP Code</Label>
          <Input
            id="zip"
            name="zip"
            className="mt-1 block w-full bg-white border-white text-black rounded-md"
            placeholder="Enter ZIP code"
            required
          />
        </div>
      </div>
    </div>
  );
};

export default AddressDetails;
