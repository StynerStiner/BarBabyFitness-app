/**
 * Script to upload PDF templates to Cloudflare R2 for contract generation
 * 
 * Usage:
 * node scripts/upload-templates.js
 * 
 * This script requires the following environment variables:
 * - CLOUDFLARE_R2_ENDPOINT
 * - CLOUDFLARE_R2_ACCESS_KEY_ID
 * - CLOUDFLARE_R2_SECRET_ACCESS_KEY
 * - CLOUDFLARE_R2_BUCKET_NAME
 */

import fs from 'fs';
import path from 'path';
import { S3Client, PutObjectCommand, ListObjectsCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Check required environment variables
const requiredEnvVars = [
  'CLOUDFLARE_R2_ENDPOINT',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('Error: Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`- ${varName}`));
  process.exit(1);
}

// Configure Cloudflare R2 client
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

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

/**
 * Check if template files exist in Cloudflare R2
 */
async function checkExistingTemplates() {
  try {
    console.log('Checking for existing templates in R2...');
    
    const command = new ListObjectsCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Prefix: 'templates/'
    });
    
    const { Contents = [] } = await r2.send(command);
    
    return Contents.map(item => item.Key);
  } catch (error) {
    console.error('Error checking existing templates:', error);
    return [];
  }
}

/**
 * Upload a template file to Cloudflare R2
 */
async function uploadTemplate(template) {
  try {
    // Check if file exists locally
    if (!fs.existsSync(template.localPath)) {
      console.error(`Template file not found: ${template.localPath}`);
      return false;
    }
    
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
    
    console.log(`✓ Successfully uploaded ${template.name}`);
    return true;
  } catch (error) {
    console.error(`✗ Error uploading ${template.name}:`, error.message);
    return false;
  }
}

/**
 * Create folders in R2 if they don't exist
 */
async function ensureFoldersExist() {
  try {
    // R2 doesn't actually need folder creation, but we'll create
    // empty objects to represent folders for organization
    const folders = ['templates/', 'filled-contracts/'];
    
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
    
    console.log('✓ Folder structure verified');
    return true;
  } catch (error) {
    console.error('Error creating folder structure:', error.message);
    return false;
  }
}

/**
 * Main function to upload all templates
 */
async function uploadTemplates() {
  console.log('Starting template upload to Cloudflare R2...');
  
  try {
    // First ensure folders exist
    await ensureFoldersExist();
    
    // Check existing templates
    const existingTemplates = await checkExistingTemplates();
    
    // Upload each template
    const results = [];
    for (const template of templates) {
      // Skip if template already exists (unless forced)
      if (existingTemplates.includes(template.r2Key)) {
        console.log(`Template ${template.name} already exists in R2. Updating...`);
      }
      
      const result = await uploadTemplate(template);
      results.push({ template: template.name, success: result });
    }
    
    // Print summary
    console.log('\nUpload Summary:');
    console.log('---------------');
    let successCount = 0;
    results.forEach(result => {
      if (result.success) {
        successCount++;
        console.log(`✓ ${result.template}: Success`);
      } else {
        console.log(`✗ ${result.template}: Failed`);
      }
    });
    
    console.log(`\nUploaded ${successCount} of ${templates.length} templates`);
    
    if (successCount === templates.length) {
      console.log('\n✅ All templates successfully uploaded to Cloudflare R2!');
      console.log(`Templates are now available in the '${process.env.CLOUDFLARE_R2_BUCKET_NAME}' bucket.`);
    } else {
      console.log('\n⚠️ Some templates failed to upload. Check the errors above.');
    }
  } catch (error) {
    console.error('Error in upload process:', error);
  }
}

// Run the upload function
uploadTemplates().catch(error => {
  console.error('Error uploading templates:', error);
  process.exit(1);
});