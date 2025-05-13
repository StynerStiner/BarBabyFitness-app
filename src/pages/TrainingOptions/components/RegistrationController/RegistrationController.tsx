// src/pages/TrainingOptions/components/RegistrationController/RegistrationController.tsx
import { useState } from "react";
import { StepIndicator } from "../StepIndicator";
import { ContractForm } from "./Contract/ContractForm";
import { ContractSigning } from "./Contract/ContractSigning";
import { PaymentSelection } from "./Payment/PaymentSelection";
import { PlanSelection } from "./PlanSelection";
import type {
  Plan,
  RegistrationFormData,
  SignatureData,
  PaymentMethod,
} from "@/pages/TrainingOptions/components/types";
import { StepProps } from "@/pages/TrainingOptions/components/types";

const REGISTRATION_STEPS: StepProps[] = [
  {
    id: 1,
    title: "Plan Selection",
    description: "Choose your membership",
    status: "current",
  },
  {
    id: 2,
    title: "Registration",
    description: "Personal Information",
    status: "upcoming",
  },
  {
    id: 3,
    title: "Contract",
    description: "Review & Sign",
    status: "upcoming",
  },
  {
    id: 4,
    title: "Payment",
    description: "Complete Purchase",
    status: "upcoming",
  },
];

export const RegistrationController = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({});
  const [signatureData, setSignatureData] = useState<SignatureData | null>(
    null,
  );

  const handlePlanSelect = (plan: Plan) => {
    setSelectedPlan(plan);
    setCurrentStep(2);
    updateStepStatuses(2);
  };

  const handleFormSubmit = (data: Partial<RegistrationFormData>) => {
    setFormData(data);
    setCurrentStep(3);
    updateStepStatuses(3);
  };

  const handleContractSign = (data: SignatureData) => {
    setSignatureData(data);
    setCurrentStep(4);
    updateStepStatuses(4);
  };

  const handlePaymentComplete = (paymentMethod: PaymentMethod) => {
    console.log("Payment completed with:", paymentMethod);
  };

  const handleBack = () => {
    const newStep = Math.max(1, currentStep - 1);
    setCurrentStep(newStep);
    updateStepStatuses(newStep);
  };

  const updateStepStatuses = (currentStepId: number) => {
    REGISTRATION_STEPS.forEach((step) => {
      if (step.id < currentStepId) {
        step.status = "complete";
      } else if (step.id === currentStepId) {
        step.status = "current";
      } else {
        step.status = "upcoming";
      }
    });
  };

  const renderCurrentStep = () => {
    switch (currentStep) {
      case 1:
        return <PlanSelection onSelect={handlePlanSelect} />;
      case 2:
        return (
          <ContractForm
            selectedPlan={selectedPlan}
            onSubmit={handleFormSubmit}
            onBack={handleBack}
            initialData={formData}
          />
        );
      case 3:
        if (!formData || !selectedPlan) return null;
        return (
          <ContractSigning
            formData={formData as RegistrationFormData}
            selectedPlan={selectedPlan}
            onSubmit={handleContractSign}
            onBack={handleBack}
          />
        );
      case 4:
        if (!formData) return null;
        return (
          <PaymentSelection
            formData={formData as RegistrationFormData}
            selectedPlan={selectedPlan}
            onBack={handleBack}
            onComplete={handlePaymentComplete}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <StepIndicator
          currentStep={currentStep}
          steps={REGISTRATION_STEPS}
          selectedPlan={selectedPlan}
        />
        <div className="mt-12">{renderCurrentStep()}</div>
      </div>
    </div>
  );
};