// src/pages/TrainingOptions/components/StepIndicator/StepDot.tsx
import React from "react";
import type { StepDotProps } from "@/pages/TrainingOptions/components/types";

export const StepDot: React.FC<StepDotProps> = ({ step, isFirst, isLast }) => {
  return (
    <div className="relative">
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center ${
          step.status === "complete"
            ? "bg-orange-500"
            : step.status === "current"
              ? "bg-orange-500/20 border-2 border-orange-500"
              : "bg-gray-700 border-2 border-gray-600"
        }`}
      >
        {step.status === "complete" ? (
          <CheckIcon className="w-4 h-4 text-white" />
        ) : (
          <span
            className={
              step.status === "current" ? "text-orange-500" : "text-gray-400"
            }
          >
            {step.id}
          </span>
        )}
      </div>
      <div className="mt-2 text-center">
        <div
          className={`text-sm ${
            step.status !== "upcoming" ? "text-orange-500" : "text-gray-400"
          }`}
        >
          {step.title}
        </div>
        <div className="text-xs text-gray-500">{step.description}</div>
      </div>
    </div>
  );
};

const CheckIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);
