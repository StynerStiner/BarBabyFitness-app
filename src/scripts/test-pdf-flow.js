/**
 * Test script for PDF generation flow
 * 
 * This script simulates the contract generation and upload flow
 * by creating sample form data and calling the fillAndUploadContractPdfs function.
 * 
 * To run:
 * npm run test-pdf
 * 
 * (This assumes you've added a script in package.json; see below)
 */

// Import required modules
import { fillAndUploadContractPdfs } from '../api/upload-filled-pdfs';

// Create sample form data
const sampleFormData = {
  // Personal details
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNo: '555-123-4567',
  
  // Address
  streetAddress: '123 Main Street',
  city: 'Anytown',
  state: 'CA',
  zipCode: '90210',
  
  // Plan details
  selectedPlan: {
    id: 'premium',
    title: 'Premium Plan',
    duration: '12 months',
    price: '$199.99',
    sessions: '12 sessions per month',
    initiationFee: '$99.99',
    perks: 'Access to all facilities',
    icon: null
  },
  
  // Signature
  signatureDate: new Date().toLocaleDateString(),
  signatureDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  
  // Alternative signature fields for different uses
  clientSignature: 'John Doe',
  clientSignatureDataURL: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  
  // Added specific signature fields for different documents
  trainingSignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII=',
  liabilitySignature: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNk+A8AAQUBAScY42YAAAAASUVORK5CYII='
};

// Function to test PDF generation
async function testPdfGeneration() {
  console.log('='.repeat(80));
  console.log('Starting PDF generation test');
  console.log('='.repeat(80));
  
  try {
    console.log('Using sample form data:');
    console.log(JSON.stringify({
      ...sampleFormData,
      signatureDataURL: '[Signature data present]',
      clientSignatureDataURL: '[Signature data present]',
      trainingSignature: '[Signature data present]',
      liabilitySignature: '[Signature data present]'
    }, null, 2));
    
    // Set environment variables for local testing if they're not already set
    if (!import.meta.env?.VITE_CLOUDFLARE_R2_ENDPOINT) {
      console.log('Setting up test environment variables...');
      // Default test values (these won't actually upload to R2 but will help test the flow)
      process.env.VITE_CLOUDFLARE_R2_ENDPOINT = 'https://8903e28602247a5bf0543b9dbe1c84e9.r2.cloudflarestorage.com';
      process.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID = 'test-access-key';
      process.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY = 'test-secret-key';
      process.env.VITE_CLOUDFLARE_R2_BUCKET_NAME = 'barbaby-contracts';
      process.env.VITE_CLOUDFLARE_R2_PUBLIC_URL = 'https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev';
    }
    
    console.log('\nCalling fillAndUploadContractPdfs...');
    const result = await fillAndUploadContractPdfs(sampleFormData);
    
    console.log('\n='.repeat(80));
    console.log('Test completed successfully!');
    console.log('='.repeat(80));
    console.log('\nGenerated PDF URLs:');
    console.log(`Registration form: ${result.registrationUrl}`);
    console.log(`Training agreement: ${result.trainingAgreementUrl}`);
    console.log(`Liability waiver: ${result.liabilityWaiverUrl}`);
    console.log('\nVerify the PDFs by opening these URLs in your browser.');
  } catch (error) {
    console.error('\n='.repeat(80));
    console.error('Test failed with error:');
    console.error('='.repeat(80));
    console.error(error);
  }
}

// Run the test
testPdfGeneration();
