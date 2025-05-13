// Example script showing how to use the CloudflareR2PDFManager utility
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { pdfManager, CloudflareR2PDFManager } from '../src/utils/pdfUtils.js';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from root .env file
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Sample client data
const sampleClientData = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phoneNo: '555-987-6543',
  streetAddress: '456 Fitness Ave',
  city: 'Exercise',
  state: 'FL',
  zipCode: '54321',
  emergencyContact: 'John Smith',
  emergencyPhone: '555-123-4567',
  selectedPlan: {
    title: 'Gold Training Package',
    price: '$299',
    sessions: '16 sessions per month',
    duration: '3 months',
    initiationFee: '$75',
  },
};

// Example 1: Using the default singleton instance
async function fillAndSaveContractWithDefaultInstance() {
  console.log('Example 1: Using the default singleton instance of PDF Manager');
  
  try {
    // Process the training agreement
    const result = await pdfManager.processAndSavePdf(
      'training_agreement_template.pdf',
      sampleClientData,
      {
        documentType: 'training',
        // Path to local template file as fallback if R2 fetch fails
        localTemplatePath: path.join(__dirname, '..', 'template-pdfs', 'training_agreement_template.pdf'),
        // Save a local copy for debugging
        saveLocalCopy: true,
        debugDirectory: path.join(__dirname, 'output')
      }
    );
    
    if (result.success) {
      console.log('Training agreement filled and saved successfully!');
      console.log(`URL: ${result.url}`);
      if (result.localPath) {
        console.log(`Local copy: ${result.localPath}`);
      }
    } else {
      console.error('Failed to process training agreement:', result.error);
    }
  } catch (error) {
    console.error('Error in example 1:', error);
  }
}

// Example 2: Creating a custom instance with explicit configuration
async function fillAndSaveWaiverWithCustomInstance() {
  console.log('\nExample 2: Using a custom instance of PDF Manager with explicit config');
  
  // Create custom instance with explicit configuration
  const customPdfManager = new CloudflareR2PDFManager({
    bucketName: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    publicUrl: process.env.CLOUDFLARE_R2_PUBLIC_URL,
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  });
  
  try {
    // Get template - demonstrate the step-by-step approach
    const templateBuffer = await customPdfManager.getTemplateBuffer(
      'liability_waiver_template.pdf',
      path.join(__dirname, '..', 'template-pdfs', 'liability_waiver_template.pdf')
    );
    
    // Fill the PDF
    const filledPdfBytes = await customPdfManager.fillPdfForm(templateBuffer, sampleClientData);
    
    // Save to R2
    const saveResult = await customPdfManager.savePdfToR2(
      filledPdfBytes,
      'waiver',
      { clientName: `${sampleClientData.firstName} ${sampleClientData.lastName}` }
    );
    
    if (saveResult.success) {
      console.log('Liability waiver filled and saved successfully!');
      console.log(`URL: ${saveResult.url}`);
    } else {
      console.error('Failed to process liability waiver:', saveResult.error);
    }
  } catch (error) {
    console.error('Error in example 2:', error);
  }
}

// Example 3: Batch processing multiple documents
async function batchProcessDocuments() {
  console.log('\nExample 3: Batch processing multiple documents');
  
  const documentTypes = [
    { name: 'training_agreement_template.pdf', type: 'training' },
    { name: 'liability_waiver_template.pdf', type: 'waiver' },
    { name: 'registration_form_template.pdf', type: 'registration' },
  ];
  
  const results = [];
  
  for (const doc of documentTypes) {
    try {
      console.log(`Processing ${doc.name}...`);
      const result = await pdfManager.processAndSavePdf(
        doc.name,
        sampleClientData,
        {
          documentType: doc.type,
          localTemplatePath: path.join(__dirname, '..', 'template-pdfs', doc.name),
        }
      );
      
      results.push({
        type: doc.type,
        success: result.success,
        url: result.url,
        error: result.error,
      });
      
      if (result.success) {
        console.log(`✅ ${doc.type} document processed successfully`);
      } else {
        console.error(`❌ ${doc.type} document failed:`, result.error);
      }
    } catch (error) {
      console.error(`Error processing ${doc.name}:`, error);
      results.push({
        type: doc.type,
        success: false,
        error: error.message,
      });
    }
  }
  
  console.log('\nBatch processing results:');
  console.table(results);
}

// Run the examples
async function runExamples() {
  console.log('Starting PDF Manager examples...\n');
  
  await fillAndSaveContractWithDefaultInstance();
  await fillAndSaveWaiverWithCustomInstance();
  await batchProcessDocuments();
  
  console.log('\nAll examples completed!');
}

runExamples().catch(err => {
  console.error('Error running examples:', err);
  process.exit(1);
});