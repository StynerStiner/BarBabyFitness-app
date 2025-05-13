// utils/validationUtils.ts
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: ValidationError[];
}

export const validateForm = async (
  data: Record<string, any>,
): Promise<ValidationResult> => {
  const errors: ValidationError[] = [];

  // Required field validation
  const requiredFields = {
    firstName: "First Name",
    lastName: "Last Name",
    email: "Email",
    phone: "Phone Number",
    streetAddress: "Street Address",
    city: "City",
    state: "State",
    zipCode: "ZIP Code",
    "emergencyContact.firstName": "Emergency Contact First Name",
    "emergencyContact.lastName": "Emergency Contact Last Name",
    "emergencyContact.phone": "Emergency Contact Phone",
  };

  Object.entries(requiredFields).forEach(([field, label]) => {
    const value = field.includes(".")
      ? field.split(".").reduce((obj, key) => obj?.[key], data)
      : data[field];

    if (!value || String(value).trim() === "") {
      errors.push({ field, message: `${label} is required` });
    }
  });

  // Email validation
  if (data.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email)) {
    errors.push({
      field: "email",
      message: "Please enter a valid email address",
    });
  }

  // Phone validation
  const phoneFields = ["phone", "emergencyContact.phone"];
  phoneFields.forEach((field) => {
    const phone = field.includes(".")
      ? field.split(".").reduce((obj, key) => obj?.[key], data)
      : data[field];
    if (phone && !/^\+?[\d\s-()]{10,}$/.test(phone.replace(/\s/g, ""))) {
      errors.push({ field, message: "Please enter a valid phone number" });
    }
  });

  // Required checkboxes
  if (!data.consentToMedicalTreatment) {
    errors.push({
      field: "consentToMedicalTreatment",
      message: "You must consent to medical treatment",
    });
  }

  if (!data.agreedToTerms) {
    errors.push({
      field: "agreedToTerms",
      message: "You must agree to the terms and conditions",
    });
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};
