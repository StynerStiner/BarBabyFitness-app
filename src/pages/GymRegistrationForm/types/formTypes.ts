// types/formTypes.ts
import { ReactNode } from "react";

export interface PersonalDetailsType {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  preferredContact: "email" | "phone";
}

export interface AddressType {
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface HealthMetricsType {
  height: string;
  currentWeight: string;
  goalWeight: string;
  fitnessLevel: "beginner" | "intermediate" | "advanced";
  isFirstTime: boolean;
  wantsPersonalTraining: boolean;
  wantsGroupClasses: boolean;
  needsNutritionGuidance: boolean;
}

export interface EmergencyContactType {
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
}

export interface MedicalConditionsType {
  heartCondition: boolean;
  asthma: boolean;
  diabetes: boolean;
  highBloodPressure: boolean;
  jointIssues: boolean;
  allergies: boolean;
}

export interface MedicalInfoType {
  hasMedicalConditions: string;
  medicalConditions: MedicalConditionsType;
  medicalDetails: string;
  consentToMedicalTreatment: boolean;
  wearsMedicalAlert: boolean;
}

export interface AddonsType {
  lockerRental: boolean;
  towelService: boolean;
  guestPasses: boolean;
  freezeOption: boolean;
}

export interface MembershipType {
  selectedDuration: string;
  startDate: string;
  addons: AddonsType;
}

export interface FormSectionProps {
  title?: string;
  className?: string;
  children: ReactNode;
}
