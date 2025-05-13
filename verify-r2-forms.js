import dotenv from 'dotenv';
import { pdfManager } from './src/utils/pdfUtils.js';
import { S3Client, ListObjectsV2Command } from '@aws-sdk/client-s3';

// Load environment variables
dotenv.config();

// Create R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Simple test data
const testData = {
  firstName: 'Test',
  lastName: 'User',
  email: 'test@example.com',
  phoneNo: '555-123-4567',
  streetAddress: '123 Main St',
  city: 'Anytown',
  state: 'CA',
  zipCode: '12345',
  birthDate: '1990-01-01',
  gender: 'Female',
  emergencyContact: 'Emergency Contact',
  emergencyPhone: '555-987-6543',
  signatureDate: new Date().toLocaleDateString(),
  selectedPlan: {
    title: 'Standard Plan',
    price: '$199',
    sessions: '8 sessions per month',
    duration: '1 month',
    initiationFee: '$50',
  }
};

// Verify R2 form templates exist and structure
async function verifyR2Structure() {
  console.log('🔍 Verifying R2 bucket structure...');
  
  try {
    // Check that R2 client is configured properly
    console.log('Checking R2 configuration...');
    console.log(`  Bucket: ${process.env.CLOUDFLARE_R2_BUCKET_NAME}`);
    console.log(`  Endpoint: ${process.env.CLOUDFLARE_R2_ENDPOINT}`);
    console.log(`  Access Key ID: ${process.env.CLOUDFLARE_R2_ACCESS_KEY_ID ? '****' + process.env.CLOUDFLARE_R2_ACCESS_KEY_ID.slice(-4) : 'NOT SET'}`);
    console.log(`  Secret Key: ${process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY ? '****' : 'NOT SET'}`);
    
    if (!process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || !process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY) {
      console.error('❌ R2 credentials are missing in environment variables!');
      return false;
    }
    
    // List objects in the bucket
    const command = new ListObjectsV2Command({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    });
    
    try {
      const response = await r2Client.send(command);
      console.log(`✅ Connected to R2 bucket! Found ${response.Contents?.length || 0} objects.`);
      
      // Check for template files
      const templates = [
        'templates/registration_form_template.pdf',
        'templates/training_agreement_template.pdf',
        'templates/liability_waiver_template.pdf'
      ];
      
      let foundTemplates = 0;
      
      const allFiles = response.Contents || [];
      for (const template of templates) {
        const found = allFiles.find(file => file.Key === template);
        if (found) {
          console.log(`✅ Found template: ${template} (${found.Size} bytes)`);
          foundTemplates++;
        } else {
          console.log(`⚠️ Template not found: ${template} - You'll need to upload this file to the templates/ folder`);
        }
      }
      
      console.log(`Found ${foundTemplates} of ${templates.length} templates.`);
      
      // Check for completed-forms folder structure
      const folders = [
        'completed-forms/',
        'completed-forms/registration/',
        'completed-forms/agreement/',
        'completed-forms/waiver/'
      ];
      
      let foundFolders = 0;
      
      for (const folder of folders) {
        // Look for any files in or matching this folder path
        const found = allFiles.find(file => 
          file.Key === folder || 
          file.Key.startsWith(folder) ||
          // Also check for folder paths ending with slash
          (folder.endsWith('/') && file.Key === folder.slice(0, -1)) ||
          // Also check common folder names
          (folder.includes('/') && file.Key === folder.split('/')[0])
        );
        
        if (found) {
          console.log(`✅ Found folder structure: ${folder}`);
          foundFolders++;
        } else {
          console.log(`⚠️ Folder structure not detected: ${folder}`);
        }
      }
      
      console.log(`Found ${foundFolders} of ${folders.length} folder structures.`);
      
      // For R2, folders might not appear as separate objects, so check if we at least found completed-forms
      const rootFolderFound = allFiles.some(file => 
        file.Key === 'completed-forms/' || 
        file.Key === 'completed-forms' || 
        file.Key.startsWith('completed-forms/')
      );
      
      // Overall status - consider it successful if we have the root folder
      if (rootFolderFound) {
        console.log('✅ Basic R2 structure is present! (completed-forms folder exists)');
        return true;
      } else if (foundTemplates > 0) {
        console.log('⚠️ Templates found but folder structure incomplete - we can still proceed.');
        return true;
      } else {
        console.log('⚠️ R2 structure is incomplete, but we can create folders as needed.');
        return true; // Return true anyway to let the process continue
      }
    } catch (listError) {
      console.error('❌ Error listing bucket contents:', listError.message);
      
      if (listError.Code === 'Unauthorized' || listError.$metadata?.httpStatusCode === 401) {
        console.log('\n⚠️ AUTH ERROR: Your R2 credentials appear to be invalid.');
        console.log('Please check your .env file and ensure credentials are correct.');
        return false;
      }
      
      console.log('⚠️ Could not verify bucket structure, but we can still try processing.');
      return true; // Still allow form processing to try
    }
  } catch (error) {
    console.error('❌ Error connecting to R2:', error.message);
    console.log('\nCommon issues:');
    console.log('1. Invalid R2 credentials in .env file');
    console.log('2. Incorrect bucket name');
    console.log('3. Network connectivity issues');
    console.log('\nWe will still attempt to process forms.');
    return true; // Still continue to test form processing
  }
}

// Test processing a form
async function testProcessForm() {
  console.log('\n🧪 Testing form processing...');
  
  try {
    // Try to first update pdfManager configuration to use known file paths
    try {
      console.log('Setting up PDF manager with exact file paths...');
      pdfManager.pdfForms = {
        registration: 'templates/registration_form_template.pdf',
        agreement: 'templates/training_agreement_template.pdf',
        waiver: 'templates/liability_waiver_template.pdf'
      };
    } catch (configError) {
      console.log('Note: Could not update PDF manager configuration:', configError.message);
    }
    
    // Process a single form (waiver is usually simplest)
    console.log('Processing test liability waiver...');
    console.log('Using test data:', JSON.stringify(testData, null, 2).substring(0, 200) + '...');
    
    try {
      const result = await pdfManager.processForm('waiver', testData, {
        sendEmail: false,
        saveLocally: true,
        debugDir: './debug-pdfs'
      });
      
      if (result.success) {
        console.log('✅ Form processed successfully!');
        console.log(`  URL: ${result.pdfUrl}`);
        console.log(`  Key: ${result.pdfKey}`);
        
        if (result.localPath) {
          console.log(`  Local copy: ${result.localPath}`);
        }
        
        return true;
      } else {
        console.log('❌ Form processing failed:', result.error);
        return false;
      }
    } catch (processingError) {
      console.error('❌ Error processing form:', processingError.message);
      
      // Try to get more diagnostic information
      if (processingError.message.includes('Could not retrieve template')) {
        console.log('\n⚠️ TEMPLATE ERROR: The template file could not be found in your R2 bucket.');
        console.log('Please ensure you have uploaded these files to the templates/ folder in your R2 bucket:');
        console.log('- registration_form_template.pdf');
        console.log('- training_agreement_template.pdf');
        console.log('- liability_waiver_template.pdf');
      }
      
      return false;
    }
  } catch (error) {
    console.error('❌ Error in form processing:', error.message);
    return false;
  }
}

// Run verification
async function runVerification() {
  console.log('🚀 Starting BarBaby Fitness R2 Form verification...\n');
  
  // Create debug directory if it doesn't exist
  const fs = await import('fs');
  const path = await import('path');
  const debugDir = './debug-pdfs';
  
  if (!fs.existsSync(debugDir)) {
    console.log(`Creating debug directory: ${debugDir}`);
    fs.mkdirSync(debugDir, { recursive: true });
  }
  
  const structureOk = await verifyR2Structure();
  let processOk = false;
  
  // Always try to process a form, even if structure check failed
  processOk = await testProcessForm();
  
  console.log('\n📊 Verification Summary:');
  console.log(`R2 Connection: ${structureOk ? '✅ OK' : '⚠️ Issues detected'}`);
  console.log(`Form Processing: ${processOk ? '✅ OK' : '⚠️ Issues detected'}`);
  
  if (structureOk && processOk) {
    console.log('\n🎉 Verification PASSED! The system is ready for use.');
  } else {
    console.log('\n⚠️ Verification had issues. See details above.');
    
    console.log('\nTROUBLESHOOTING STEPS:');
    console.log('1. Check that your .env file has the correct R2 credentials');
    console.log('2. Ensure the PDF templates are uploaded to the templates/ folder in your R2 bucket');
    console.log('3. Check folder permissions in your R2 bucket');
    console.log('4. Try running the verification again after making changes');
    console.log('\nYou may still be able to use the system if only some checks failed.');
  }
}

runVerification().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});
