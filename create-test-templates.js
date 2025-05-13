import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Set up R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Directory to save local copies
const debugDir = './debug-pdfs';
if (!fs.existsSync(debugDir)) {
  fs.mkdirSync(debugDir, { recursive: true });
}

// Templates to create
const templates = [
  {
    name: 'registration_form_modern.pdf',
    title: 'Registration Form',
    fields: [
      'firstName', 'lastName', 'email', 'phoneNo', 'birthDate', 'gender',
      'streetAddress', 'city', 'state', 'zipCode',
      'emergencyContact', 'emergencyPhone', 'healthGoals', 'signatureDate'
    ]
  },
  {
    name: 'personal_training_agreement.pdf',
    title: 'Personal Training Agreement',
    fields: [
      'firstName', 'lastName', 'email', 'phoneNo', 'streetAddress', 'city', 'state', 'zipCode',
      'selectedPlan.title', 'selectedPlan.price', 'selectedPlan.sessions', 'selectedPlan.duration',
      'selectedPlan.initiationFee', 'signatureDate'
    ]
  },
  {
    name: 'liability_waiver.pdf',
    title: 'Liability Waiver',
    fields: [
      'firstName', 'lastName', 'email', 'phoneNo', 'birthDate',
      'medicalConditions', 'signatureDate'
    ]
  }
];

/**
 * Create a PDF with form fields
 */
async function createTestTemplate(template) {
  console.log(`Creating test template: ${template.name}`);
  
  // Create a new PDF document
  const pdfDoc = await PDFDocument.create();
  
  // Add a page
  const page = pdfDoc.addPage([600, 800]);
  
  // Embed font
  const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
  const boldFont = await pdfDoc.embedFont(StandardFonts.HelveticaBold);
  
  // Add title
  page.drawText(`BARBABY FITNESS: ${template.title}`, {
    x: 50,
    y: page.getHeight() - 50,
    size: 24,
    font: boldFont,
    color: rgb(0, 0, 0),
  });
  
  // Add explanation
  page.drawText('This form has camelCase field names that match the online form fields.', {
    x: 50,
    y: page.getHeight() - 80,
    size: 10,
    font,
    color: rgb(0.3, 0.3, 0.3),
  });
  
  // Add form fields
  const form = pdfDoc.getForm();
  
  let yPosition = page.getHeight() - 130;
  let currentPage = page;
  
  for (const fieldName of template.fields) {
    // Draw field label
    currentPage.drawText(fieldName + ':', {
      x: 50,
      y: yPosition,
      size: 12,
      font: boldFont,
      color: rgb(0, 0, 0),
    });
    
    // Create text field
    const textField = form.createTextField(fieldName);
    textField.setText('');
    textField.addToPage(currentPage, {
      x: 200,
      y: yPosition - 15,
      width: 300,
      height: 20,
      borderWidth: 1,
      borderColor: rgb(0, 0, 0),
    });
    
    yPosition -= 40;
    
    // Add another page if needed
    if (yPosition < 50) {
      const newPage = pdfDoc.addPage([600, 800]);
      currentPage = newPage;
      yPosition = currentPage.getHeight() - 50;
    }
  }
  
  // Save the PDF
  const pdfBytes = await pdfDoc.save();
  
  // Save locally
  const localPath = path.join(debugDir, template.name);
  fs.writeFileSync(localPath, pdfBytes);
  console.log(`✅ Saved locally to: ${localPath}`);
  
  // Upload to R2 root bucket
  try {
    await r2Client.send(new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: template.name,
      Body: pdfBytes,
      ContentType: 'application/pdf',
    }));
    console.log(`✅ Uploaded to R2 bucket root: ${template.name}`);
  } catch (error) {
    console.error(`❌ Failed to upload to R2: ${error.message}`);
  }
  
  return localPath;
}

/**
 * Ensure output folder structure exists in R2
 */
async function ensureFolderStructure() {
  console.log('Ensuring folder structure exists in R2...');
  
  const folders = [
    'completed-forms/',
    'completed-forms/registration/',
    'completed-forms/agreement/',
    'completed-forms/waiver/'
  ];
  
  // Create an empty file in each folder to ensure it exists
  for (const folder of folders) {
    try {
      await r2Client.send(new PutObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: folder + '.keep',
        Body: Buffer.from('This file ensures the folder exists'),
        ContentType: 'text/plain',
      }));
      console.log(`✅ Ensured folder exists: ${folder}`);
    } catch (error) {
      console.error(`❌ Failed to create folder: ${folder} - ${error.message}`);
    }
  }
}

/**
 * Create all templates
 */
async function createAllTemplates() {
  console.log('🔧 Creating test templates for BarBaby Fitness PDF forms...\n');
  
  // First ensure folder structure exists
  await ensureFolderStructure();
  
  for (const template of templates) {
    try {
      const path = await createTestTemplate(template);
      console.log(`Created ${template.name} at ${path}\n`);
    } catch (error) {
      console.error(`Error creating ${template.name}: ${error.message}\n`);
    }
  }
  
  console.log('🎉 Template creation complete!');
  console.log(`Local templates are saved in: ${debugDir}`);
  console.log('Templates have been uploaded to your R2 bucket root');
  console.log('\nTo test the system:');
  console.log('1. Run: node verify-r2-forms.js');
  console.log('2. Start the server: node form-server.js');
  console.log('3. Use your frontend forms to test submissions');
}

createAllTemplates().catch(err => {
  console.error('Fatal error:', err);
});