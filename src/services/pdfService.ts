import type { Plan } from '@/pages/TrainingOptions/components/types';

export interface ContractFormData {
  // Personal details
  firstName: string;
  lastName: string;
  email?: string;
  phoneNo?: string;
  
  // Address
  streetAddress?: string;
  city?: string;
  state?: string;
  zipCode?: string;
  
  // Plan details
  selectedPlan?: Plan;
  
  // Signature
  signatureDate?: string;
  signatureDataURL?: string;
  
  // Alternative signature fields for different uses
  clientSignature?: string;
  clientSignatureDataURL?: string;
  trainerSignature?: string;
  trainerSignatureDataURL?: string;
  participantSignature?: string;
  participantSignatureDataURL?: string;
  
  // Added specific signature fields for different documents
  trainingSignature?: string;
  liabilitySignature?: string;
}

// This is a simplified service that just exports the interface
// All PDF generation now happens in upload-filled-pdfs.ts using the R2 templates
const pdfService = {
  // Empty implementation since we're now using template PDFs from R2
};

export default pdfService;