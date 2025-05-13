// src/pages/TrainingOptions/components/utils/validation.ts
import { RegistrationFormData } from "../types";

export const validateRegistrationForm = (
  data: Partial<RegistrationFormData>,
): { isValid: boolean; errors?: Record<string, string> } => {
  const errors: Record<string, string> = {};

  // Validate required fields
  if (!data.firstName?.trim()) {
    errors.firstName = "First name is required";
  }

  if (!data.lastName?.trim()) {
    errors.lastName = "Last name is required";
  }

  if (!data.email?.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.email = "Invalid email format";
  }

  if (!data.phone?.trim()) {
    errors.phone = "Phone number is required";
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors: Object.keys(errors).length > 0 ? errors : undefined,
  };
};

export const validateStep = (
  step: number,
  data: Partial<RegistrationFormData>,
): boolean => {
  switch (step) {
    case 1: // Plan Selection
      return true;
    case 2: // Personal Info
      return !!(data.firstName && data.lastName && data.email && data.phone);
    case 3: // Contract
      return !!data.hasAgreedToTerms;
    case 4: // Payment
      return true;
    default:
      return false;
  }
};
