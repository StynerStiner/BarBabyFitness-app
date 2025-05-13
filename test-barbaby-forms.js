import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { pdfManager } from './src/utils/pdfUtils.js';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create debug directory
const debugDir = path.join(__dirname, 'debug-pdfs');
if (!fs.existsSync(debugDir)) {
  fs.mkdirSync(debugDir, { recursive: true });
}

// Configure email if needed (for actual testing)
/* 
pdfManager.setEmailTransport({
  host: process.env.EMAIL_HOST,
  port: parseInt(process.env.EMAIL_PORT || '587'),
  secure: process.env.EMAIL_SECURE === 'true',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});
*/

// Sample client data with camelCase fields matching the PDF forms
const clientData = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'test@example.com',
  phoneNo: '555-987-6543',
  birthDate: '1990-01-15',
  gender: 'Female',
  streetAddress: '123 Fitness Street',
  city: 'Exercise',
  state: 'FL',
  zipCode: '12345',
  emergencyContact: 'John Smith',
  emergencyPhone: '555-123-4567',
  emergencyRelationship: 'Spouse',
  healthGoals: 'Weight loss and improved fitness',
  medicalConditions: 'None',
  signatureDate: new Date().toLocaleDateString(),
  selectedPlan: {
    title: 'Premium Plan',
    price: '$299',
    sessions: '16 sessions per month',
    duration: '3 months',
    initiationFee: '$75',
  },
  // Add any other fields that match your PDF form fields
};

/**
 * Test each form individually
 */
async function testForms() {
  console.log('🔍 Testing BarBaby Fitness PDF forms...\n');
  
  try {
    // 1. Test Registration Form
    console.log('📝 Testing registration_form_modern.pdf...');
    const registrationResult = await pdfManager.processForm('registration', clientData, {
      sendEmail: false,
      saveLocally: true,
      debugDir: debugDir
    });
    
    console.log(registrationResult.success
      ? `✅ Registration form processed: ${registrationResult.pdfUrl}`
      : `❌ Registration form failed: ${registrationResult.error}`
    );
    
    // 2. Test Personal Training Agreement
    console.log('\n📝 Testing personal_training_agreement.pdf...');
    const agreementResult = await pdfManager.processForm('agreement', clientData, {
      sendEmail: false,
      saveLocally: true,
      debugDir: debugDir
    });
    
    console.log(agreementResult.success
      ? `✅ Training agreement processed: ${agreementResult.pdfUrl}`
      : `❌ Training agreement failed: ${agreementResult.error}`
    );
    
    // 3. Test Liability Waiver
    console.log('\n📝 Testing liability_waiver.pdf...');
    const waiverResult = await pdfManager.processForm('waiver', clientData, {
      sendEmail: false,
      saveLocally: true,
      debugDir: debugDir
    });
    
    console.log(waiverResult.success
      ? `✅ Liability waiver processed: ${waiverResult.pdfUrl}`
      : `❌ Liability waiver failed: ${waiverResult.error}`
    );
    
    // 4. Test Batch Processing
    console.log('\n📝 Testing batch processing of all forms...');
    const batchResult = await pdfManager.processMultipleForms(
      ['registration', 'agreement', 'waiver'],
      clientData,
      {
        sendEmail: false,
        saveLocally: true,
        debugDir: debugDir
      }
    );
    
    console.log(batchResult.success
      ? `✅ Batch processing succeeded`
      : `❌ Batch processing failed`
    );
    
    batchResult.results.forEach(result => {
      console.log(`  ${result.success ? '✅' : '❌'} ${result.formType}: ${result.success ? result.pdfUrl : result.error}`);
    });
    
    console.log('\n📂 Saved PDF files can be found in:', debugDir);
    
    // Check local files
    const localFiles = fs.readdirSync(debugDir);
    console.log(`\n📄 Generated ${localFiles.length} local PDF files for inspection.`);
    
  } catch (error) {
    console.error('❌ Error during testing:', error);
  }
}

testForms().then(() => {
  console.log('\n🎉 Testing complete!');
}).catch(error => {
  console.error('❌ Fatal error:', error);
});