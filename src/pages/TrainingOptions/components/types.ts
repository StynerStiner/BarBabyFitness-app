import { ReactNode } from "react";

// Step Status Type
export type StepStatus = "complete" | "current" | "upcoming";

// Plan Interface
export interface Plan {
  id: string;
  title: string;
  duration: string;
  initiationFee: string;
  sessions: string;
  price: string;
  perks: string;
  icon: React.ReactNode;
  recommended?: boolean;
  features?: string[];
}

// Plan Category
export interface PlanCategory {
  id: string;
  name: string;
  options: Plan[];
}

// Step Properties
export interface StepProps {
  id: number;
  title: string;
  description: string;
  status: StepStatus;
}

// Step Indicator Props
export interface StepIndicatorProps {
  currentStep: number;
  steps: StepProps[];
  selectedPlan: Plan | null;
}

// Step Connector Props
export interface StepConnectorProps {
  isComplete: boolean;
}

// Step Dot Props
export interface StepDotProps {
  step: StepProps;
  isFirst: boolean;
  isLast: boolean;
}

// Registration Form Data
export interface RegistrationFormData {
  fullName: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  streetAddress: string;
  streetAddress2?: string;
  city: string;
  state: string;
  zip: string;
  currentWeight: number;
  height: number;
  goalWeight: number;
  emergencyContact: {
    firstName: string;
    lastName: string;
    relationship: string;
    phone: string;
  };
  medicalInfo: {
    hasMedicalConditions: boolean;
    details?: string;
  };
  membershipInfo: {
    duration: string;
    startDate: string;
  };
  termsAccepted: boolean;
  hasAgreedToTerms: boolean;
}

// Signature Data
export interface SignatureData {
  acceptedTerms: boolean;
  signature: string;
  date?: string;
}

// Payment Types
export type PaymentMethodType = "venmo" | "cashapp" | "zelle";

export interface PaymentMethod {
  type: PaymentMethodType;
  details?: Record<string, string>;
  expiryDate?: string;
  billingZip?: string;
}

// Props for GymRegistrationForm
export interface GymRegistrationFormProps {
  selectedPlan: Plan | null;
  onSubmit: (data: RegistrationFormData) => void;
  onBack: () => void;
  initialData?: Partial<RegistrationFormData>;
}

// Props for Payment Selection
export interface PaymentSelectionProps {
  selectedPlan: Plan | null;
  formData: RegistrationFormData;
  onBack: () => void;
  onComplete: (paymentData: PaymentMethod) => void;
}

// Props for ContractForm
export interface ContractFormProps {
  selectedPlan: Plan | null;
  onSubmit: (data: Partial<RegistrationFormData>) => void;
  onBack: () => void;
  initialData?: Partial<RegistrationFormData>;
}