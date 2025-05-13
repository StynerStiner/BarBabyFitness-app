import type { StepProps, Plan as ParentPlan } from "../types";

// Step Dot Props
export interface StepDotProps {
  step: StepProps;
  isFirst: boolean;
  isLast: boolean;
}

// Step Connector Props
export interface StepConnectorProps {
  isComplete: boolean;
}

// Step Indicator Props
export interface StepIndicatorProps {
  currentStep: number;
  steps: StepProps[];
  selectedPlan: ParentPlan | null;
}
