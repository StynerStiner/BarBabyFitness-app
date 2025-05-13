/**
 * Script to download PDF templates from Cloudflare R2 for local development
 * 
 * Usage:
 * node scripts/download-templates.js
 * 
 * This script requires the following environment variables:
 * - CLOUDFLARE_R2_PUBLIC_URL
 * - CLOUDFLARE_R2_ACCESS_KEY_ID (optional for public buckets)
 * - CLOUDFLARE_R2_SECRET_ACCESS_KEY (optional for public buckets)
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Template names
const templates = [
  'registration_form_template.pdf',
  'training_agreement_template.pdf',
  'liability_waiver_template.pdf'
];

// Directory to save templates
const outputDir = path.join(__dirname, '..', 'public', 'templates');

// Ensure the output directory exists
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
  console.log(`Created directory: ${outputDir}`);
}

// Get the R2 public URL from environment variables
const r2PublicUrl = process.env.VITE_CLOUDFLARE_R2_PUBLIC_URL || 
                    'https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev';

/**
 * Download a file from a URL and save it to disk
 */
function downloadFile(url, outputPath) {
  return new Promise((resolve, reject) => {
    console.log(`Downloading: ${url}`);
    
    const file = fs.createWriteStream(outputPath);
    
    https.get(url, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download file: ${response.statusCode} ${response.statusMessage}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`Downloaded: ${outputPath}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(outputPath, () => {}); // Delete the file if there was an error
      reject(err);
    });
  });
}

/**
 * Main function to download all templates
 */
async function downloadTemplates() {
  console.log('Starting template download...');
  
  for (const template of templates) {
    const templateUrl = `${r2PublicUrl}/templates/${template}`;
    const outputPath = path.join(outputDir, template);
    
    try {
      await downloadFile(templateUrl, outputPath);
    } catch (error) {
      console.error(`Error downloading ${template}:`, error.message);
    }
  }
  
  console.log('Template download complete!');
}

// Run the download function
downloadTemplates().catch(error => {
  console.error('Error downloading templates:', error);
  process.exit(1);
});
