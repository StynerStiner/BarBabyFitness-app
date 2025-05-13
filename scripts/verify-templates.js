import { S3Client, ListObjectsCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import fs from 'fs';
import path from 'path';

// Load environment variables
dotenv.config();

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Check required environment variables
const requiredEnvVars = [
  'CLOUDFLARE_R2_ENDPOINT',
  'CLOUDFLARE_R2_ACCESS_KEY_ID',
  'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
  'CLOUDFLARE_R2_BUCKET_NAME'
];

const missingEnvVars = requiredEnvVars.filter(varName => !process.env[varName]);
if (missingEnvVars.length > 0) {
  console.error('❌ Missing required environment variables:');
  missingEnvVars.forEach(varName => console.error(`  - ${varName}`));
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

// Templates to verify
const templates = [
  'templates/registration_form_template.pdf',
  'templates/liability_waiver_template.pdf',
  'templates/training_agreement_template.pdf'
];

// Folders to verify
const folders = [
  'templates/',
  'filled-contracts/'
];

/**
 * Check if folders exist in R2 bucket
 */
async function verifyFolders() {
  console.log('Verifying required folders in R2 bucket...');
  
  try {
    const command = new ListObjectsCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
    });
    
    const response = await r2.send(command);
    const existingPaths = response.Contents?.map(item => item.Key) || [];
    
    const missingFolders = folders.filter(folder => 
      !existingPaths.some(path => path === folder || path.startsWith(folder))
    );
    
    if (missingFolders.length > 0) {
      console.log('❌ Missing folders in R2 bucket:');
      missingFolders.forEach(folder => console.log(`  - ${folder}`));
    } else {
      console.log('✅ All required folders exist in R2 bucket');
    }
    
    return missingFolders.length === 0;
  } catch (error) {
    console.error('❌ Error verifying folders:', error.message);
    return false;
  }
}

/**
 * Check if template PDFs exist and are accessible
 */
async function verifyTemplates() {
  console.log('\nVerifying PDF templates in R2 bucket...');
  
  try {
    const command = new ListObjectsCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Prefix: 'templates/'
    });
    
    const response = await r2.send(command);
    const existingTemplates = response.Contents?.map(item => item.Key) || [];
    
    const missingTemplates = templates.filter(template => 
      !existingTemplates.includes(template)
    );
    
    if (missingTemplates.length > 0) {
      console.log('❌ Missing templates in R2 bucket:');
      missingTemplates.forEach(template => console.log(`  - ${template}`));
      return false;
    }
    
    // Check each template is accessible
    console.log('\nTesting template accessibility...');
    let allAccessible = true;
    
    for (const template of templates) {
      try {
        const getCommand = new GetObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: template,
        });
        
        const templateResponse = await r2.send(getCommand);
        const contentLength = templateResponse.ContentLength || 0;
        
        if (contentLength > 0) {
          console.log(`✅ Template accessible: ${template} (${contentLength} bytes)`);
        } else {
          console.log(`❌ Template empty: ${template}`);
          allAccessible = false;
        }
      } catch (error) {
        console.error(`❌ Cannot access template ${template}:`, error.message);
        allAccessible = false;
      }
    }
    
    return allAccessible;
  } catch (error) {
    console.error('❌ Error verifying templates:', error.message);
    return false;
  }
}

/**
 * Verify write access to the filled-contracts folder
 */
async function verifyWriteAccess() {
  console.log('\nVerifying write access to filled-contracts folder...');
  
  try {
    const testFile = 'filled-contracts/test-write-access.txt';
    const currentDate = new Date().toISOString();
    
    const command = new PutObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: testFile,
      Body: `Write test from verify-templates.js at ${currentDate}`,
      ContentType: 'text/plain',
    });
    
    await r2.send(command);
    console.log('✅ Successfully wrote test file to filled-contracts folder');
    
    return true;
  } catch (error) {
    console.error('❌ Error testing write access:', error.message);
    return false;
  }
}

/**
 * Main function to run all verifications
 */
async function verifyR2Setup() {
  console.log('Verifying Cloudflare R2 template setup...\n');
  
  try {
    // Check if we can connect to R2
    console.log(`Connecting to R2 bucket: ${process.env.CLOUDFLARE_R2_BUCKET_NAME}`);
    console.log(`R2 endpoint: ${process.env.CLOUDFLARE_R2_ENDPOINT}`);
    
    const foldersOk = await verifyFolders();
    const templatesOk = await verifyTemplates();
    const writeOk = await verifyWriteAccess();
    
    console.log('\n--- VERIFICATION SUMMARY ---');
    console.log(`Folders: ${foldersOk ? '✅ OK' : '❌ Issues found'}`);
    console.log(`Templates: ${templatesOk ? '✅ OK' : '❌ Issues found'}`);
    console.log(`Write access: ${writeOk ? '✅ OK' : '❌ Issues found'}`);
    
    if (foldersOk && templatesOk && writeOk) {
      console.log('\n✅ VERIFICATION SUCCESSFUL - Your R2 setup is working correctly!');
    } else {
      console.log('\n❌ VERIFICATION FAILED - Some issues need to be fixed.');
    }
  } catch (error) {
    console.error('Error in verification process:', error);
  }
}

// Run the verification
verifyR2Setup();