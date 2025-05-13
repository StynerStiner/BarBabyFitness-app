import { exec } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Create debug directory if it doesn't exist
const debugDir = path.join(__dirname, 'debug-pdfs');
if (!fs.existsSync(debugDir)) {
  fs.mkdirSync(debugDir, { recursive: true });
}

/**
 * Execute a command and return promise
 */
function runCommand(command) {
  return new Promise((resolve, reject) => {
    console.log(`\n🔄 Running: ${command}\n`);
    
    const childProcess = exec(command);
    
    // Stream output to console
    childProcess.stdout.pipe(process.stdout);
    childProcess.stderr.pipe(process.stderr);
    
    childProcess.on('close', (code) => {
      if (code === 0) {
        resolve();
      } else {
        reject(new Error(`Command failed with exit code ${code}`));
      }
    });
  });
}

/**
 * Update environment variables
 */
function checkEnvironment() {
  console.log('\n🔑 Checking environment variables...');
  
  const requiredVars = [
    'CLOUDFLARE_R2_ACCESS_KEY_ID',
    'CLOUDFLARE_R2_SECRET_ACCESS_KEY',
    'CLOUDFLARE_R2_ENDPOINT',
    'CLOUDFLARE_R2_BUCKET_NAME',
    'CLOUDFLARE_R2_PUBLIC_URL'
  ];
  
  let allPresent = true;
  
  for (const varName of requiredVars) {
    if (!process.env[varName]) {
      console.error(`❌ Missing environment variable: ${varName}`);
      allPresent = false;
    } else {
      console.log(`✅ Found ${varName}: ${varName.includes('SECRET') ? '********' : process.env[varName]}`);
    }
  }
  
  if (!allPresent) {
    throw new Error('Missing required environment variables. Please check your .env file.');
  }
  
  console.log('✅ All required environment variables are present.');
}

/**
 * Run setup steps in sequence
 */
async function runSetup() {
  console.log('🚀 Starting BarBaby Fitness PDF System Setup\n');
  
  try {
    // Step 1: Check environment
    checkEnvironment();
    
    // Step 2: Create PDF templates and upload to R2
    console.log('\n📝 Step 1: Create and upload PDF templates...');
    await runCommand('node create-test-templates.js');
    
    // Step 3: Verify the setup
    console.log('\n🔍 Step 2: Verify the setup...');
    await runCommand('node verify-r2-forms.js');
    
    // Step 4: Start the server
    console.log('\n🖥️ Step 3: Start the server (press Ctrl+C to stop)...');
    await runCommand('node form-server.js');
    
  } catch (error) {
    console.error(`\n❌ Setup failed: ${error.message}`);
    console.log('\n📋 Troubleshooting tips:');
    console.log('1. Check that your .env file has the correct R2 credentials');
    console.log('2. Make sure your R2 bucket exists and is accessible');
    console.log('3. Check that port 3003 is not in use');
    console.log('4. Try running each step individually:');
    console.log('   - node create-test-templates.js');
    console.log('   - node verify-r2-forms.js');
    console.log('   - node form-server.js');
    process.exit(1);
  }
}

// Run the setup
runSetup();