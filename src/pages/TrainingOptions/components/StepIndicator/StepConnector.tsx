// src/pages/TrainingOptions/components/StepIndicator/StepConnector.tsx
import React from "react";
import type { StepConnectorProps } from "@/pages/TrainingOptions/components/types";

export const StepConnector: React.FC<StepConnectorProps> = ({ isComplete }) => {
  return (
    <div
      className={`flex-1 h-0.5 mx-2 ${
        isComplete ? "bg-orange-500" : "bg-gray-700"
      }`}
    />
  );
};
