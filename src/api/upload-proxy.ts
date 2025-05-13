/**
 * API functions for uploading filled PDF documents to R2 through server proxy
 */
import { ContractFormData } from '../services/pdfService';
import { PDFDocument, PDFTextField } from 'pdf-lib';

/**
 * Upload a PDF to R2 storage through server proxy
 */
const uploadPdfToR2 = async (
  pdfBytes: Uint8Array,
  formType: string,
  clientName: string,
  metadata: Record<string, string> = {}
): Promise<string> => {
  try {
    // Create a unique file name with timestamp
    const timestamp = Date.now();
    const sanitizedClientName = clientName.replace(/\s+/g, '-').toLowerCase();
    
    // Determine the folder path based on form type
    let folderPath;
    if (formType === 'registration') {
      folderPath = 'filled-contracts/registration-forms/';
    } else if (formType === 'trainingAgreement') {
      folderPath = 'filled-contracts/training-agreements/';
    } else if (formType === 'liabilityWaiver') {
      folderPath = 'filled-contracts/liability-waivers/';
    } else {
      folderPath = 'filled-contracts/other/';
    }
    
    // Construct full file path
    const filePath = `${folderPath}${sanitizedClientName}-${formType}-${timestamp}.pdf`;
    
    console.log('===== UPLOAD DETAILS =====');
    console.log(`Uploading ${formType} PDF through server proxy`);
    console.log(`File path: ${filePath}`);
    console.log(`File size: ${pdfBytes.length} bytes`);
    
    // Convert Uint8Array to Base64 for transport
    const pdfBase64 = btoa(String.fromCharCode.apply(null, Array.from(pdfBytes)));
    
    // Create the upload data object for the server
    const uploadData = {
      filePath: filePath,
      pdfContent: pdfBase64,
      contentType: 'application/pdf',
      clientName: clientName,
      formType: formType,
      timestamp: timestamp.toString(),
      additionalMetadata: metadata
    };
    
    // Determine the server URL - handle both development and production
    const serverBaseUrl = import.meta.env.VITE_SERVER_URL || 
                         (window.location.hostname === 'localhost' ? 'http://localhost:3003' : '/api');
    
    // Server endpoint to handle PDF uploads
    const uploadEndpoint = `${serverBaseUrl}/api/upload-contract/upload-pdf`;
    console.log(`Using server proxy endpoint: ${uploadEndpoint}`);
    
    // Send the PDF to the server
    const response = await fetch(uploadEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(uploadData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server responded with ${response.status}: ${errorText}`);
    }
    
    // Parse the response
    const result = await response.json();
    
    if (result.success) {
      console.log(`PDF successfully uploaded through server proxy`);
      return result.url;
    } else {
      throw new Error(result.message || 'Failed to upload PDF through server proxy');
    }
  } catch (error) {
    console.log('===== UPLOAD ERROR DETAILS =====');
    console.log('Error type:', error instanceof Error ? error.constructor.name : typeof error);
    console.log('Error message:', error instanceof Error ? error.message : 'Unknown error');
    console.log('Error stack:', error instanceof Error ? error.stack : 'No stack trace available');
    
    // Attempt to save to local storage as fallback
    console.log('Attempting fallback storage solution - saving to local storage');
    try {
      // Convert the PDF to a Base64 string for storage
      const pdfBase64 = btoa(String.fromCharCode.apply(null, Array.from(pdfBytes)));
      const pdfKey = `pdf_${formType}_${Date.now()}`;
      localStorage.setItem(pdfKey, pdfBase64);
      console.log(`PDF temporarily saved to local storage with key: ${pdfKey}`);
      console.log('Warning: This is a temporary solution and PDFs will be lost when browser storage is cleared');
      
      // Return a data URI which can be used in the app, but isn't a persistent URL
      const fallbackUrl = `data:application/pdf;base64,${pdfBase64}`;
      console.log('Fallback URL generated. This is NOT a persistent URL.');
      return fallbackUrl;
    } catch (fallbackError) {
      console.log('Fallback storage also failed:', fallbackError);
    }
    
    console.log(`Error uploading ${formType} PDF:`, error);
    throw new Error(`Failed to upload PDF: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Re-export the modified function to maintain compatibility with existing code
export { uploadPdfToR2 };
