import React from "react";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Scale } from "lucide-react";

export const HealthMetrics: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Section Header */}
      <div className="flex items-center gap-3 mb-4">
        <Scale className="w-6 h-6 text-orange-400" />
        <h3 className="text-2xl font-semibold text-orange-400">
          Health Metrics
        </h3>
      </div>

      {/* Metrics Input Fields */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="mb-4">
          <label className="block mb-2">Current Weight (lbs)</label>
          <input
            type="number"
            id="currentWeight"
            name="currentWeight"
            placeholder="Enter your current weight"
            className="w-full p-2 bg-white text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Goal Weight (lbs)</label>
          <input
            type="number"
            id="goalWeight"
            name="goalWeight"
            placeholder="Enter your goal weight"
            className="w-full p-2 bg-white text-black"
          />
        </div>
        <div className="mb-4">
          <label className="block mb-2">Height (cm)</label>
          <input
            type="number"
            id="height"
            name="height"
            min="0"
            placeholder="Enter your height"
            className="w-full p-2 bg-white text-black"
          />
        </div>
      </div>

      {/* Fitness Level Dropdown */}
      <div className="mb-4">
        <label className="block mb-2">Fitness Level</label>
        <select className="w-full p-2 bg-white text-black">
          <option>Select your fitness level</option>
          <option value="beginner">Beginner</option>
          <option value="intermediate">Intermediate</option>
          <option value="advanced">Advanced</option>
        </select>
      </div>

      {/* Motivational Note */}
      <div className="mt-2 text-sm text-gray-400">
        <p>
          These metrics help us customize your fitness journey and track your
          progress effectively.
        </p>
      </div>
    </div>
  );
};

export default HealthMetrics;
