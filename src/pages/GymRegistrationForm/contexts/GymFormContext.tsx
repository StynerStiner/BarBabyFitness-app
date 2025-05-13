import React, { createContext, useState, useContext, ReactNode, useCallback, useMemo } from "react";

// Export Plan interface
export interface Plan {
  id: string;
  title: string;
  duration: string; // Add this
  sessions: string; // Add this
  price: string;
  initiationFee: string;
  perks?: string; // Optional field
  icon?: React.ReactNode; // Optional field
}

// Export EmergencyContact interface
export interface EmergencyContact {
  firstName: string;
  lastName: string;
  phone: string;
  relationship: string;
}

// Export MedicalConditions interface
export interface MedicalConditions {
  heartCondition: boolean;
  asthma: boolean;
  diabetes: boolean;
  highBloodPressure: boolean;
  jointIssues: boolean;
  allergies: boolean;
}

// Export Addons interface
export interface Addons {
  lockerRental: boolean;
  towelService: boolean;
  guestPasses: boolean;
  freezeOption: boolean;
}

// Export ContractInfo interface
export interface ContractInfo {
  trainerName: string;
  trainerDate: string;
  trainerSignature: string;
  clientName: string;
  clientDate: string;
  clientSignature: string;
  participantName: string;
  participantSignature: string;
  contractUrl: string | null;
  dateAccepted: string;
}

// Export PaymentInfo interface
export interface PaymentInfo {
  paymentMethod: string;
  transactionId: string | null;
  sessionId: string | null;
  paymentStatus: string;
  paymentDate: string;
  totalAmount: number;
}

// Export FormState interface
export interface FormState {
  // Personal details
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  gender: string;
  dateOfBirth: string; // Added for TypeScript compatibility

  // Preferences & flags
  isFirstTime: boolean;
  wantsPersonalTraining: boolean;
  wantsGroupClasses: boolean;
  needsNutritionGuidance: boolean;

  // Address
  streetAddress: string;
  streetAddress2: string;
  city: string;
  state: string;
  zipCode: string;

  // Fitness details
  currentWeight: string;
  height: string;
  goalWeight: string;
  fitnessLevel: string; // Added for TypeScript compatibility

  // Emergency
  emergencyContact: EmergencyContact;
  emergencyContactFirstName: string; // Added for direct access
  emergencyContactLastName: string;  // Added for direct access
  emergencyContactPhone: string;     // Added for direct access
  emergencyContactRelationship: string; // Added for direct access
  hasMedicalConditions: string; // "yes" or "no"
  medicalConditions: MedicalConditions;
  // Direct access to medical conditions
  heartCondition: boolean; // Added for direct access
  asthma: boolean;         // Added for direct access
  diabetes: boolean;       // Added for direct access
  highBloodPressure: boolean; // Added for direct access
  jointIssues: boolean;    // Added for direct access
  allergies: boolean;      // Added for direct access
  medicalDetails: string;
  consentToMedicalTreatment: boolean;
  wearsMedicalAlert: boolean;

  // Membership
  selectedDuration: string;
  startDate: string;
  addons: Partial<Record<string, boolean>>;
  agreedToTerms: boolean;

  // Plan
  selectedPlan: Plan | null;

  // Contract Information
  contractInfo: ContractInfo | null;

  // Payment Information
  paymentInfo: PaymentInfo | null;

  // Registration completion status
  registrationComplete: boolean;

  // Registration date
  registrationDate: string;
}

// Export context type
export interface GymFormContextType {
  formState: FormState;
  updateField: <K extends keyof FormState>(field: K, value: FormState[K]) => void;
  updateNestedField: <K extends keyof FormState, NK extends keyof FormState[K]>(
    field: K,
    nestedField: NK,
    value: FormState[K][NK]
  ) => void;
  setContractInfo: (contractInfo: ContractInfo) => void;
  setPaymentInfo: (paymentInfo: PaymentInfo) => void;
  completeRegistration: () => void;
  resetForm: () => void;
}

const initialState: FormState = {
  firstName: "",
  lastName: "",
  email: "",
  phone: "",
  dob: "",
  gender: "male",
  dateOfBirth: "",
  isFirstTime: false,
  wantsPersonalTraining: false,
  wantsGroupClasses: false,
  needsNutritionGuidance: false,
  streetAddress: "",
  streetAddress2: "",
  city: "",
  state: "",
  zipCode: "",
  currentWeight: "",
  height: "",
  goalWeight: "",
  fitnessLevel: "",
  emergencyContact: {
    firstName: "",
    lastName: "",
    phone: "",
    relationship: "",
  },
  emergencyContactFirstName: "",
  emergencyContactLastName: "",
  emergencyContactPhone: "",
  emergencyContactRelationship: "",
  hasMedicalConditions: "no",
  medicalConditions: {
    heartCondition: false,
    asthma: false,
    diabetes: false,
    highBloodPressure: false,
    jointIssues: false,
    allergies: false,
  },
  heartCondition: false,
  asthma: false,
  diabetes: false,
  highBloodPressure: false,
  jointIssues: false,
  allergies: false,
  medicalDetails: "",
  consentToMedicalTreatment: false,
  wearsMedicalAlert: false,
  selectedDuration: "12",
  startDate: "",
  addons: {
    lockerRental: false,
    towelService: false,
    guestPasses: false,
    freezeOption: false,
  },
  agreedToTerms: false,
  selectedPlan: null,
  contractInfo: null,
  paymentInfo: null,
  registrationComplete: false,
  registrationDate: "",
};

export const GymFormContext = createContext<GymFormContextType | undefined>(undefined);

export const GymFormProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [formState, setFormState] = useState<FormState>(initialState);

  const updateField = useCallback(<K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormState(prev => ({ ...prev, [field]: value }));
  }, []);

  const updateNestedField = useCallback(<K extends keyof FormState, NK extends keyof FormState[K]>(
    field: K,
    nestedField: NK,
    value: FormState[K][NK]
  ) => {
    setFormState(prev => ({
      ...prev,
      [field]: {
        ...(prev[field] as Record<string, any>),
        [nestedField]: value,
      },
    }));
  }, []);

  const setContractInfo = useCallback((contractInfo: ContractInfo) => {
    setFormState(prev => ({
      ...prev,
      contractInfo,
    }));
  }, []);

  const setPaymentInfo = useCallback((paymentInfo: PaymentInfo) => {
    setFormState(prev => ({
      ...prev,
      paymentInfo,
    }));
  }, []);

  const completeRegistration = useCallback(() => {
    setFormState(prev => ({
      ...prev,
      registrationComplete: true,
      registrationDate: new Date().toISOString(),
    }));

    // Optional: Save the complete registration data to localStorage or your backend
    try {
      const registrationData = {
        ...formState,
        registrationComplete: true,
        registrationDate: new Date().toISOString(),
      };

      // Store in localStorage as a backup
      localStorage.setItem('bbf_registration_data', JSON.stringify(registrationData));

      // You could also send this data to your backend
      // fetch('/api/save-registration', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify(registrationData),
      // });
    } catch (error) {
      console.error('Error saving registration data:', error);
    }
  }, [formState]);

  const resetForm = useCallback(() => {
    setFormState(initialState);
  }, []);

  const value = useMemo(() => ({
    formState,
    updateField,
    updateNestedField,
    setContractInfo,
    setPaymentInfo,
    completeRegistration,
    resetForm,
  }), [formState, updateField, updateNestedField, setContractInfo, setPaymentInfo, completeRegistration, resetForm]);

  return (
    <GymFormContext.Provider value={value}>
      {children}
    </GymFormContext.Provider>
  );
};

export const useGymForm = () => {
  const context = useContext(GymFormContext);
  if (context === undefined) {
    throw new Error('useGymForm must be used within a GymFormProvider');
  }
  return context;
};