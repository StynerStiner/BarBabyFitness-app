// src/pages/TrainingOptions/components/StepIndicator/index.tsx

import React from "react";
import { StepDot } from "./StepDot";
import { StepConnector } from "./StepConnector";
import type {
  StepIndicatorProps,
  StepProps,
} from "@/pages/TrainingOptions/components/types";

export const StepIndicator: React.FC<StepIndicatorProps> = ({
  currentStep,
  steps,
  selectedPlan,
}) => {
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <StepDot
              step={{
                ...step,
                status:
                  step.id < currentStep
                    ? "complete"
                    : step.id === currentStep
                      ? "current"
                      : "upcoming",
              }}
              isFirst={index === 0}
              isLast={index === steps.length - 1}
            />
            {index < steps.length - 1 && (
              <StepConnector isComplete={step.id < currentStep} />
            )}
          </React.Fragment>
        ))}
      </div>
      {selectedPlan && (
        <div className="mt-4 text-center text-gray-300">
          Selected Plan: {selectedPlan.title}
        </div>
      )}
    </div>
  );
};
