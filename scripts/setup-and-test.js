// Using CommonJS since your project doesn't fully support ES modules with scripts
const { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fetch = require('node-fetch');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');
const { createWriteStream } = require('fs');

// __dirname is already available in CommonJS

// Load environment variables
dotenv.config();

// Default server URL
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3002';

// Check required environment variables
const requiredEnvVars = [
  'CLOUDFLARE_R2_ENDPOINT',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME'
];

// Template information
const templates = [
  {
    name: 'liability_waiver_template.pdf',
    localPath: path.join(__dirname, '..', 'template-pdfs', 'liability_waiver_template.pdf'),
    r2Key: 'templates/liability_waiver_template.pdf',
    contentType: 'application/pdf'
  },
  {
    name: 'registration_form_template.pdf',
    localPath: path.join(__dirname, '..', 'template-pdfs', 'registration_form_template.pdf'),
    r2Key: 'templates/registration_form_template.pdf',
    contentType: 'application/pdf'
  },
  {
    name: 'training_agreement_template.pdf',
    localPath: path.join(__dirname, '..', 'template-pdfs', 'training_agreement_template.pdf'),
    r2Key: 'templates/training_agreement_template.pdf',
    contentType: 'application/pdf'
  }
];

// Sample form data for testing
const sampleFormData = {
  firstName: 'Jane',
  lastName: 'Smith',
  email: 'jane.smith@example.com',
  phone: '555-123-4567',
  dob: '1985-06-15',
  gender: 'female',
  
  // Address
  streetAddress: '123 Main Street',
  streetAddress2: 'Apt 456',
  city: 'Boston',
  state: 'MA',
  zipCode: '02101',
  
  // Physical information
  currentWeight: '150',
  height: '5\'6"',
  goalWeight: '140',
  fitnessLevel: 'Intermediate',

  // Emergency contact
  emergencyContactFirstName: 'John',
  emergencyContactLastName: 'Smith',
  emergencyContactPhone: '555-987-6543',
  emergencyContactRelationship: 'Spouse',
  
  // Medical information
  hasMedicalConditions: 'no',
  medicalDetails: '',
  consentToMedicalTreatment: true,
  
  // Selected plan
  selectedPlan: {
    id: 'steady-climb',
    title: 'Barbaby Steady Climb',
    duration: 'Valid for 30 days',
    initiationFee: '$100',
    sessions: '4 sessions',
    price: '$240',
    perks: 'Structured progression plan'
  },
  
  // Start date
  startDate: new Date().toISOString().split('T')[0]
};

// Sample signature
const sampleSignature = `data:image/png;base64,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`;

/**
 * Main function to check environment, upload templates, and test contract generation
 */
async function setupAndTest() {
  console.log('--- BarBaby Fitness Contract PDF Setup and Test ---');

  // 1. Check environment variables
  const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
  if (missingEnvVars.length > 0) {
    console.error('\n❌ Missing required environment variables:');
    missingEnvVars.forEach(varName => console.error(`  - ${varName}`));
    process.exit(1);
  }
  
  console.log('\n✅ Environment variables loaded successfully');
  console.log(`Cloudflare R2 Endpoint: ${process.env.CLOUDFLARE_R2_ENDPOINT}`);
  console.log(`Cloudflare R2 Bucket: ${process.env.CLOUDFLARE_R2_BUCKET_NAME}`);

  // Configure Cloudflare R2 client
  const r2 = new S3Client({
    region: 'auto',
    endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
    credentials: {
      accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
      secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
    },
  });

  // 2. Create folders in R2 if they don't exist
  try {
    // R2 doesn't actually need folder creation, but we'll create
    // empty objects to represent folders for organization
    const folders = ['templates/', 'filled-contracts/'];
    
    console.log('\nCreating folder structure in R2...');
    for (const folder of folders) {
      const params = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: folder,
        Body: '',
        ContentType: 'application/x-directory',
      };
      
      console.log(`Ensuring folder exists: ${folder}`);
      const command = new PutObjectCommand(params);
      await r2.send(command);
    }
    
    console.log('✅ Folder structure created successfully');
  } catch (error) {
    console.error('❌ Error creating folder structure:', error.message);
    console.error('Will attempt to continue anyway');
  }

  // 3. Check and download templates if needed
  console.log('\nChecking for templates locally...');
  let needsUpload = false;
  
  for (const template of templates) {
    if (!fs.existsSync(template.localPath)) {
      console.log(`Template not found locally: ${template.name}`);
      try {
        // Try to download from R2
        console.log(`Attempting to download from R2: ${template.r2Key}`);
        
        const getCommand = new GetObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: template.r2Key,
        });
        
        const response = await r2.send(getCommand);
        
        // Ensure the template-pdfs directory exists
        const templateDir = path.join(__dirname, '..', 'template-pdfs');
        if (!fs.existsSync(templateDir)) {
          console.log(`Creating template-pdfs directory: ${templateDir}`);
          fs.mkdirSync(templateDir, { recursive: true });
        }
        
        // Save to local file
        const fileStream = createWriteStream(template.localPath);
        response.Body.pipe(fileStream);
        
        await new Promise((resolve, reject) => {
          fileStream.on('finish', resolve);
          fileStream.on('error', reject);
        });
        
        console.log(`✅ Downloaded template from R2: ${template.name}`);
      } catch (error) {
        console.error(`❌ Error downloading template ${template.name}:`, error.message);
        console.log('✋ Will need to upload templates from scratch');
        needsUpload = true;
        break;
      }
    } else {
      console.log(`✅ Template found locally: ${template.name}`);
    }
  }
  
  // 4. Upload templates to R2
  if (needsUpload) {
    console.log('\nUploading templates to R2...');
    
    for (const template of templates) {
      if (!fs.existsSync(template.localPath)) {
        console.error(`❌ Cannot upload missing template: ${template.localPath}`);
        continue;
      }
      
      try {
        // Read file content
        const fileContent = fs.readFileSync(template.localPath);
        
        // Create upload parameters
        const params = {
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: template.r2Key,
          Body: fileContent,
          ContentType: template.contentType,
        };
        
        // Upload to R2
        console.log(`Uploading ${template.name} to R2...`);
        const command = new PutObjectCommand(params);
        await r2.send(command);
        
        console.log(`✅ Successfully uploaded ${template.name}`);
      } catch (error) {
        console.error(`❌ Error uploading ${template.name}:`, error.message);
      }
    }
  }
  
  // 5. Check if server is running
  console.log('\nChecking if server is running at', SERVER_URL);
  try {
    const response = await fetch(`${SERVER_URL}/`);
    if (response.ok) {
      console.log('✅ Server is running');
    } else {
      console.log(`⚠️ Server returned status ${response.status}`);
    }
  } catch (error) {
    console.error('❌ Server is not running! Please start the server:');
    console.error('   npm run dev:server');
    console.error('   Error:', error.message);
    process.exit(1);
  }
  
  // 6. Test contract generation
  console.log('\n------------- Testing Contract Generation -------------');
  try {
    // Create URL to the upload-contract endpoint
    const url = `${SERVER_URL}/api/upload-contract`;
    
    // Prepare form data
    const formData = {
      contractData: JSON.stringify(sampleFormData),
      clientSignature: sampleSignature
    };
    
    console.log(`Sending request to: ${url}`);
    
    // Make the API request
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(formData)
    });
    
    // Parse response
    const result = await response.json();
    
    if (result.success) {
      console.log('\n✅ Contract generation successful!');
      console.log('Contract URLs:');
      if (Array.isArray(result.filledPdfUrls)) {
        result.filledPdfUrls.forEach((url, index) => {
          console.log(`  ${index + 1}. ${url}`);
        });
      } else if (result.contractUrl) {
        console.log(`  ${result.contractUrl}`);
      }
      
      // Log storage method
      console.log(`\nStorage: ${result.storageMethod || 'Cloudflare R2'}`);
    } else {
      console.error('\n❌ Contract generation failed:');
      console.error(result.message || 'Unknown error');
      if (result.error) console.error('Error details:', result.error);
    }
  } catch (error) {
    console.error('\n❌ Error testing contract generation:');
    console.error(error.message);
    console.error('Make sure your server is running at', SERVER_URL);
  }
  
  console.log('\n--------------------------------------------------------');
  console.log('Setup and test completed!');
  console.log('If contract generation was successful, your system is ready to go.');
  console.log('--------------------------------------------------------');
}

// Run the main function
setupAndTest().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

// Export for module usage
module.exports = setupAndTest;