/**
 * Simple test script to // Configure Cloudflare R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
}); generation and filling
 */
import { PDFDocument } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { S3Client, GetObjectCommand, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, 'server', '.env') });

console.log('Testing PDF generation and filling...');

// Helper function to convert stream to buffer
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

// Configure Cloudflare R2 client
const r2Client = new AWS.S3({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
  s3ForcePathStyle: true, // Required for R2
});

// Sample contract data
const sampleContractData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phoneNo: '555-123-4567',
  streetAddress: '123 Main Street',
  city: 'Anytown',
  state: 'CA',
  zipCode: '12345',
  selectedPlan: {
    title: 'Premium Plan',
    price: '$195',
    sessions: '12 sessions per month',
    duration: '1 month',
    initiationFee: '$100',
  },
  signatureDate: new Date().toLocaleDateString()
};

// Load and fill PDF
async function testPdfFilling() {
  try {
    console.log('📃 Starting PDF test...');
    
    // Step 1: Try to fetch template from Cloudflare R2
    console.log('Fetching template from R2...');

    try {
      const getCommand = new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: 'templates/training_agreement_template.pdf',
      });
      
      const templateResponse = await r2Client.send(getCommand);
      const templateStream = templateResponse.Body;
      const templateBuffer = await streamToBuffer(templateStream);
      
      console.log(`✓ Template fetched from R2! Size: ${templateBuffer.length} bytes`);
      
      // Step 2: Load the PDF document
      console.log('Loading PDF document...');
      const pdfDoc = await PDFDocument.load(templateBuffer);
      console.log('✓ PDF document loaded successfully');
      
      // Step 3: Get form fields
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      console.log(`Found ${fields.length} form fields in the PDF`);
      
      // Log all field names
      console.log('Field names:');
      fields.forEach(field => {
        console.log(`- ${field.getName()} (${field.constructor.name})`);
      });
      
      // Step 4: Fill the form fields
      console.log('Filling form fields...');
      
      fields.forEach(field => {
        const fieldName = field.getName();
        
        // Skip non-text fields
        if (field.constructor.name !== 'PDFTextField') return;
        
        // Fill in based on field name
        let value = '';
        
        if (fieldName.toLowerCase().includes('name')) {
          if (fieldName.toLowerCase().includes('first')) {
            value = sampleContractData.firstName;
          } else if (fieldName.toLowerCase().includes('last')) {
            value = sampleContractData.lastName;
          } else {
            value = `${sampleContractData.firstName} ${sampleContractData.lastName}`;
          }
        } else if (fieldName.toLowerCase().includes('email')) {
          value = sampleContractData.email;
        } else if (fieldName.toLowerCase().includes('phone')) {
          value = sampleContractData.phoneNo;
        } else if (fieldName.toLowerCase().includes('plan')) {
          value = sampleContractData.selectedPlan.title;
        } else if (fieldName.toLowerCase().includes('amount') || fieldName.toLowerCase().includes('pay')) {
          value = sampleContractData.selectedPlan.price;
        } else if (fieldName.toLowerCase().includes('date')) {
          value = sampleContractData.signatureDate;
        }
        
        try {
          field.setText(value);
          console.log(`Field ${fieldName} set to "${value}"`);
        } catch (error) {
          console.error(`Error setting field ${fieldName}:`, error.message);
        }
      });
      
      // Step 5: Flatten form fields
      console.log('Flattening form fields...');
      form.flatten();
      
      // Step 6: Save the filled PDF
      console.log('Saving filled PDF...');
      const filledPdfBytes = await pdfDoc.save();
      
      // Save locally for testing
      const outputPath = path.join(__dirname, 'filled_test.pdf');
      fs.writeFileSync(outputPath, Buffer.from(filledPdfBytes));
      console.log(`✓ Filled PDF saved to ${outputPath}`);
      
      // Step 7: Upload to Cloudflare R2
      console.log('Uploading filled PDF to R2...');
      
      const uploadResult = await r2Client.putObject({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: `filled-contracts/test_${Date.now()}.pdf`,
        Body: Buffer.from(filledPdfBytes),
        ContentType: 'application/pdf'
      }).promise();
      
      console.log('✓ PDF uploaded to Cloudflare R2 successfully!', uploadResult);
      
      console.log('PDF test completed successfully! 🎉');
      
    } catch (r2Error) {
      console.error('Error fetching template from R2:', r2Error);
      
      // Step 1 Alternative: Try to load from local templates folder
      console.log('Trying to load template from local folder...');
      
      const localTemplatePath = path.join(__dirname, 'templates', 'training_agreement_template.pdf');
      
      if (fs.existsSync(localTemplatePath)) {
        const templateBuffer = fs.readFileSync(localTemplatePath);
        console.log(`✓ Template loaded from local path: ${localTemplatePath}`);
        
        // Rest of the steps would be the same as above...
        // For brevity, we'll just indicate success
        console.log('✓ Local template loaded successfully!');
        
        // Step 2: Load the PDF document
        console.log('Loading PDF document from local file...');
        const pdfDoc = await PDFDocument.load(templateBuffer);
        console.log('✓ PDF document loaded successfully');
        
        // Step 3: Get form fields
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        console.log(`Found ${fields.length} form fields in the PDF`);
        
        // Log all field names
        console.log('Field names:');
        fields.forEach(field => {
          console.log(`- ${field.getName()} (${field.constructor.name})`);
        });
        
        // Step 4: Fill the form fields
        console.log('Filling form fields...');
        
        fields.forEach(field => {
          const fieldName = field.getName();
          
          // Skip non-text fields
          if (field.constructor.name !== 'PDFTextField') return;
          
          // Fill in based on field name
          let value = '';
          
          if (fieldName.toLowerCase().includes('name')) {
            if (fieldName.toLowerCase().includes('first')) {
              value = sampleContractData.firstName;
            } else if (fieldName.toLowerCase().includes('last')) {
              value = sampleContractData.lastName;
            } else {
              value = `${sampleContractData.firstName} ${sampleContractData.lastName}`;
            }
          } else if (fieldName.toLowerCase().includes('email')) {
            value = sampleContractData.email;
          } else if (fieldName.toLowerCase().includes('phone')) {
            value = sampleContractData.phoneNo;
          } else if (fieldName.toLowerCase().includes('plan')) {
            value = sampleContractData.selectedPlan.title;
          } else if (fieldName.toLowerCase().includes('amount') || fieldName.toLowerCase().includes('pay')) {
            value = sampleContractData.selectedPlan.price;
          } else if (fieldName.toLowerCase().includes('date')) {
            value = sampleContractData.signatureDate;
          }
          
          try {
            field.setText(value);
            console.log(`Field ${fieldName} set to "${value}"`);
          } catch (error) {
            console.error(`Error setting field ${fieldName}:`, error.message);
          }
        });
        
        // Step 5: Flatten form fields
        console.log('Flattening form fields...');
        form.flatten();
        
        // Step 6: Save the filled PDF
        console.log('Saving filled PDF...');
        const filledPdfBytes = await pdfDoc.save();
        
        // Save locally for testing
        const outputPath = path.join(__dirname, 'filled_test_local.pdf');
        fs.writeFileSync(outputPath, Buffer.from(filledPdfBytes));
        console.log(`✓ Filled PDF saved to ${outputPath}`);
        
      } else {
        console.error('❌ Template not found in local folder either');
      }
    }
  } catch (error) {
    console.error('❌ Error in PDF test:', error);
  }
}

// Run the test
testPdfFilling().then(() => {
  console.log('Test completed');
}).catch(error => {
  console.error('Error running test:', error);
});
