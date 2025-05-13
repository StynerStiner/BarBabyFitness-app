const fs = require('fs');
const path = require('path');
const { S3Client, PutObjectCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const { PDFDocument } = require('pdf-lib');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Configure Cloudflare R2 client
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Sample data to fill in the PDF
const sampleData = {
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@example.com',
  phone: '555-123-4567',
  streetAddress: '123 Main St',
  city: 'Boston',
  state: 'MA',
  zipCode: '02108',
  selectedPlan: {
    title: 'Barbaby Steady Climb',
    price: '$240',
    sessions: '4 sessions',
    initiationFee: '$100'
  }
};

// Function to convert a stream to a buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// Function to fill PDF template with data
async function fillPdfTemplate(templateName, data) {
  console.log(`Processing template: ${templateName}`);
  
  try {
    // Fetch template from R2
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: `templates/${templateName}`,
    });
    
    const response = await r2.send(command);
    const templateBuffer = await streamToBuffer(response.Body);
    console.log(`Template fetched: ${templateName} (${templateBuffer.length} bytes)`);
    
    // Load PDF document
    const pdfDoc = await PDFDocument.load(templateBuffer);
    const form = pdfDoc.getForm();
    const fields = form.getFields();
    console.log(`Found ${fields.length} form fields in PDF`);
    
    // Log all field names for debugging
    fields.forEach(field => {
      console.log(`Field: ${field.getName()}`);
    });
    
    // Fill form fields
    fields.forEach(field => {
      const fieldName = field.getName();
      
      try {
        // Only process text fields
        if (field.constructor.name === 'PDFTextField') {
          // Map form data to PDF fields - customize these mappings as needed
          let value = '';
          
          if (fieldName.match(/first.*name/i)) {
            value = data.firstName;
          } else if (fieldName.match(/last.*name/i)) {
            value = data.lastName;
          } else if (fieldName.match(/full.*name|client.*name/i)) {
            value = `${data.firstName} ${data.lastName}`;
          } else if (fieldName.match(/email/i)) {
            value = data.email;
          } else if (fieldName.match(/phone/i)) {
            value = data.phone;
          } else if (fieldName.match(/address|street/i)) {
            value = data.streetAddress;
          } else if (fieldName.match(/city/i)) {
            value = data.city;
          } else if (fieldName.match(/state/i)) {
            value = data.state;
          } else if (fieldName.match(/zip/i)) {
            value = data.zipCode;
          } else if (fieldName.match(/plan/i) && data.selectedPlan) {
            value = data.selectedPlan.title;
          } else if (fieldName.match(/session/i) && data.selectedPlan) {
            value = data.selectedPlan.sessions;
          } else if (fieldName.match(/price|cost|fee/i) && data.selectedPlan) {
            value = data.selectedPlan.price;
          } else if (fieldName.match(/date/i)) {
            value = new Date().toLocaleDateString();
          }
          
          if (value) {
            field.setText(value);
            console.log(`Set field "${fieldName}" to "${value}"`);
          }
        }
      } catch (fieldError) {
        console.error(`Error setting field ${fieldName}:`, fieldError.message);
      }
    });
    
    // Flatten form fields
    form.flatten();
    
    // Save filled PDF
    const filledPdfBytes = await pdfDoc.save();
    console.log(`PDF filled successfully, size: ${filledPdfBytes.length} bytes`);
    
    return filledPdfBytes;
  } catch (error) {
    console.error(`Error filling PDF template ${templateName}:`, error);
    throw error;
  }
}

// Function to upload filled PDF to R2
async function uploadFilledPdf(pdfBytes, outputKey) {
  try {
    console.log(`Uploading filled PDF to: ${outputKey}`);
    
    const params = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: outputKey,
      Body: pdfBytes,
      ContentType: 'application/pdf',
    };
    
    await r2.send(new PutObjectCommand(params));
    
    console.log(`Successfully uploaded to: ${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${outputKey}`);
    return `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${outputKey}`;
  } catch (error) {
    console.error('Error uploading filled PDF:', error);
    throw error;
  }
}

// Main function to process all templates
async function processAllTemplates() {
  console.log('Starting PDF filling process...');
  console.log('Using R2 bucket:', process.env.CLOUDFLARE_R2_BUCKET_NAME);
  console.log('Using R2 endpoint:', process.env.CLOUDFLARE_R2_ENDPOINT);
  
  // Generate a unique ID for this batch
  const timestamp = Date.now();
  const clientName = `${sampleData.firstName.toLowerCase()}-${sampleData.lastName.toLowerCase()}`;
  
  const templates = [
    'registration_form_template.pdf',
    'liability_waiver_template.pdf',
    'training_agreement_template.pdf'
  ];
  
  const results = [];
  
  for (const template of templates) {
    try {
      // Get document type from filename
      let docType = 'contract';
      if (template.includes('registration')) docType = 'registration';
      if (template.includes('liability') || template.includes('waiver')) docType = 'waiver';
      if (template.includes('training') || template.includes('agreement')) docType = 'agreement';
      
      // Generate output key
      const outputKey = `filled-contracts/${docType}_${clientName}_${timestamp}.pdf`;
      
      // Fill the PDF
      console.log(`\nProcessing template: ${template}`);
      const filledPdfBytes = await fillPdfTemplate(template, sampleData);
      
      // Upload the filled PDF
      const pdfUrl = await uploadFilledPdf(filledPdfBytes, outputKey);
      
      results.push({
        template,
        docType,
        url: pdfUrl,
        success: true
      });
    } catch (error) {
      console.error(`Failed to process template ${template}:`, error);
      results.push({
        template,
        success: false,
        error: error.message
      });
    }
  }
  
  console.log('\nResults summary:');
  results.forEach(result => {
    if (result.success) {
      console.log(`✅ ${result.template} -> ${result.url}`);
    } else {
      console.log(`❌ ${result.template} failed: ${result.error}`);
    }
  });
}

// Run the script
processAllTemplates().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});