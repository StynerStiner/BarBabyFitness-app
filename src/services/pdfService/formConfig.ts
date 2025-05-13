import { ContractFormData } from './index';

/**
 * Form field configuration interface
 */
export interface FormFieldConfig {
  // Map of form fields with optional transformations
  fields: {
    [key: string]: {
      pdfField: string;  // Name of the field in the PDF
      transform?: (value: any, formData: ContractFormData) => string;  // Optional transformation function
      required?: boolean;  // Whether the field is required
    };
  };
  
  // Default values for fields
  defaults?: { [key: string]: string };
  
  // Validation rules
  validations?: {
    [key: string]: (value: any) => boolean;
  };
}

/**
 * PDF form configurations
 * 
 * Maps camelCase field names from the form to the exact field names in the PDFs
 */
export const formConfigs: { [key: string]: FormFieldConfig } = {
  // Registration Form Configuration
  registration: {
    fields: {
      firstName: { pdfField: 'firstName', required: true },
      lastName: { pdfField: 'lastName', required: true },
      email: { pdfField: 'email', required: true },
      phoneNo: { pdfField: 'phoneNo' },
      dateOfBirth: { pdfField: 'dateOfBirth' },
      gender: { pdfField: 'gender' },
      streetAddress: { pdfField: 'streetAddress' },
      city: { pdfField: 'city' },
      state: { pdfField: 'state' },
      zipCode: { pdfField: 'zipCode' },
      'emergencyContact.name': { pdfField: 'emergencyContactName' },
      'emergencyContact.relationship': { pdfField: 'emergencyContactRelationship' },
      'emergencyContact.phone': { pdfField: 'emergencyContactPhone' },
      medicalConditions: { pdfField: 'medicalConditions' },
      allergies: { pdfField: 'allergies' },
      medications: { pdfField: 'medications' },
      injuries: { pdfField: 'injuries' },
      signedDate: { 
        pdfField: 'signedDate', 
        transform: () => new Date().toLocaleDateString() 
      },
      selectedPlanName: { 
        pdfField: 'membershipPlan', 
        transform: (_, formData) => formData.selectedPlan?.title || 'Not specified' 
      },
      selectedPlanPrice: { 
        pdfField: 'membershipFee', 
        transform: (_, formData) => formData.selectedPlan?.price || 'Not specified' 
      },
      signatureDataURL: { pdfField: 'clientSignature' }
    },
    defaults: {
      registrationDate: new Date().toLocaleDateString()
    }
  },

  // Personal Training Agreement Configuration
  agreement: {
    fields: {
      firstName: { pdfField: 'firstName', required: true },
      lastName: { pdfField: 'lastName', required: true },
      email: { pdfField: 'email', required: true },
      phoneNo: { pdfField: 'phoneNo' },
      streetAddress: { pdfField: 'streetAddress' },
      city: { pdfField: 'city' },
      state: { pdfField: 'state' },
      zipCode: { pdfField: 'zipCode' },
      selectedPlanName: { 
        pdfField: 'planName', 
        transform: (_, formData) => formData.selectedPlan?.title || 'Not specified' 
      },
      selectedPlanDuration: { 
        pdfField: 'planDuration', 
        transform: (_, formData) => formData.selectedPlan?.duration || 'Not specified' 
      },
      selectedPlanPrice: { 
        pdfField: 'planPrice', 
        transform: (_, formData) => formData.selectedPlan?.price || 'Not specified' 
      },
      selectedPlanSessions: { 
        pdfField: 'planSessions', 
        transform: (_, formData) => formData.selectedPlan?.sessions || 'Not specified' 
      },
      membershipStartDate: { 
        pdfField: 'startDate', 
        transform: (value) => value || new Date().toLocaleDateString() 
      },
      membershipEndDate: { pdfField: 'endDate' },
      signedDate: { 
        pdfField: 'agreementDate', 
        transform: () => new Date().toLocaleDateString() 
      },
      clientSignatureDataURL: { pdfField: 'clientSignature' },
      trainingSignature: { pdfField: 'trainerSignature' }
    },
    defaults: {
      trainerName: 'Barbara Robinson',
      companyName: 'BarBaby Fitness'
    }
  },

  // Liability Waiver Configuration
  waiver: {
    fields: {
      firstName: { pdfField: 'participantFirstName', required: true },
      lastName: { pdfField: 'participantLastName', required: true },
      email: { pdfField: 'participantEmail', required: true },
      phoneNo: { pdfField: 'participantPhone' },
      dateOfBirth: { pdfField: 'participantDOB' },
      streetAddress: { pdfField: 'participantAddress' },
      city: { pdfField: 'participantCity' },
      state: { pdfField: 'participantState' },
      zipCode: { pdfField: 'participantZip' },
      'emergencyContact.name': { pdfField: 'emergencyContactName' },
      'emergencyContact.phone': { pdfField: 'emergencyContactPhone' },
      signedDate: { 
        pdfField: 'waiverDate', 
        transform: () => new Date().toLocaleDateString() 
      },
      participantSignatureDataURL: { pdfField: 'participantSignature' },
      liabilitySignature: { pdfField: 'participantSignature' } // Backup signature field
    }
  }
};

/**
 * Helper function to flatten nested properties for mapping
 */
export function flattenFormData(formData: ContractFormData): Record<string, any> {
  const result: Record<string, any> = {};
  
  // Process all keys in the formData
  Object.keys(formData).forEach(key => {
    const value = formData[key];
    
    // If the value is an object and not null, flatten its properties
    if (value && typeof value === 'object' && !Array.isArray(value) && !(value instanceof Date)) {
      Object.keys(value).forEach(nestedKey => {
        result[`${key}.${nestedKey}`] = value[nestedKey];
      });
    } else {
      result[key] = value;
    }
  });
  
  return result;
}

/**
 * Map form data to PDF fields based on configuration
 */
export function mapFormDataToPdfFields(
  formData: ContractFormData, 
  formType: string
): Record<string, string> {
  const config = formConfigs[formType];
  if (!config) {
    throw new Error(`No configuration found for form type: ${formType}`);
  }
  
  const result: Record<string, string> = {};
  const flattenedData = flattenFormData(formData);
  
  // Apply default values
  if (config.defaults) {
    Object.entries(config.defaults).forEach(([key, value]) => {
      result[key] = value;
    });
  }
  
  // Map and transform fields
  Object.entries(config.fields).forEach(([formField, fieldConfig]) => {
    const { pdfField, transform } = fieldConfig;
    
    // Get the value from flattened data
    let value = flattenedData[formField];
    
    // Apply transformation if provided
    if (transform && (value !== undefined || formField.includes('selected'))) {
      value = transform(value, formData);
    }
    
    // Only add non-undefined values to result
    if (value !== undefined && value !== null) {
      result[pdfField] = String(value);
    }
  });
  
  return result;
}