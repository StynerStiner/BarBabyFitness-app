import { Plan } from '@/pages/TrainingOptions/components/types';

/**
 * Types for the PDF Service
 */
export interface ContractFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phoneNo?: string;
  dateOfBirth?: string;
  gender?: string;
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Emergency Contact
  emergencyContact?: {
    name?: string;
    relationship?: string;
    phone?: string;
  };
  
  // Medical Information
  medicalConditions?: string;
  allergies?: string;
  medications?: string;
  injuries?: string;
  
  // Plan Information
  selectedPlan?: Plan;
  membershipStartDate?: string;
  membershipEndDate?: string;
  
  // Signatures
  signatureDataURL?: string;
  clientSignatureDataURL?: string;
  participantSignatureDataURL?: string;
  trainingSignature?: string;
  liabilitySignature?: string;
  
  // Date fields
  signedDate?: string;
  
  // Internal processing
  processedAt?: string;
  [key: string]: any; // Allow for additional fields
}

export interface FormSubmissionResult {
  success: boolean;
  message: string;
  forms?: Array<{
    type: string;
    url: string;
  }>;
  error?: string;
}

/**
 * PDF Service for handling contract form submissions
 * 
 * This service handles different form types:
 * - Registration Form (registration_form_modern.pdf)
 * - Personal Training Agreement (personal_training_agreement.pdf)
 * - Liability Waiver (liability_waiver.pdf)
 */
export class PDFService {
  private apiEndpoint: string;
  
  constructor(apiEndpoint = 'http://localhost:3003') {
    this.apiEndpoint = apiEndpoint;
  }
  
  /**
   * Submit the registration form
   * @param formData The form data to submit
   * @returns A promise with the submission result
   */
  async submitRegistrationForm(formData: ContractFormData): Promise<FormSubmissionResult> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/registration`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        success: result.success,
        message: result.message || 'Registration form submitted successfully',
        forms: result.form ? [{ type: 'registration', url: result.form.pdfUrl }] : undefined,
        error: result.error
      };
    } catch (error) {
      console.error('Error submitting registration form:', error);
      return {
        success: false,
        message: 'Failed to submit registration form',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Submit both training agreement and liability waiver
   * @param formData The form data to submit
   * @returns A promise with the submission result
   */
  async submitContractAndWaiver(formData: ContractFormData): Promise<FormSubmissionResult> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/contract-and-waiver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        success: result.success,
        message: result.message || 'Contract and waiver submitted successfully',
        forms: result.forms,
        error: result.error
      };
    } catch (error) {
      console.error('Error submitting contract and waiver:', error);
      return {
        success: false,
        message: 'Failed to submit contract and waiver',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Submit individual training agreement
   * @param formData The form data to submit
   * @returns A promise with the submission result
   */
  async submitTrainingAgreement(formData: ContractFormData): Promise<FormSubmissionResult> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/training-agreement`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        success: result.success,
        message: result.message || 'Training agreement submitted successfully',
        forms: result.forms,
        error: result.error
      };
    } catch (error) {
      console.error('Error submitting training agreement:', error);
      return {
        success: false,
        message: 'Failed to submit training agreement',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
  
  /**
   * Submit individual liability waiver
   * @param formData The form data to submit
   * @returns A promise with the submission result
   */
  async submitLiabilityWaiver(formData: ContractFormData): Promise<FormSubmissionResult> {
    try {
      const response = await fetch(`${this.apiEndpoint}/api/liability-waiver`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      
      if (!response.ok) {
        throw new Error(`Server responded with status ${response.status}`);
      }
      
      const result = await response.json();
      
      return {
        success: result.success,
        message: result.message || 'Liability waiver submitted successfully',
        forms: result.forms,
        error: result.error
      };
    } catch (error) {
      console.error('Error submitting liability waiver:', error);
      return {
        success: false,
        message: 'Failed to submit liability waiver',
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }
}

// Export a singleton instance
export const pdfService = new PDFService();
export default pdfService;