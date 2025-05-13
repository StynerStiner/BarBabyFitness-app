/**
 * Script to test contract generation with sample data
 * 
 * This script sends test data to the contract generation API endpoint
 * to verify that PDF filling, signing, and storage are working correctly.
 * 
 * Usage:
 * node scripts/test-contract-generation.js
 */

import fs from 'fs';
import path from 'path';
import fetch from 'node-fetch';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Default server URL - make sure this matches your local environment
const SERVER_URL = process.env.SERVER_URL || 'http://localhost:3002';

// Sample form data matching the expected structure
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

// Sample signature as base64 data URL of a signature image
const sampleSignature = `data:image/png;base64,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`;

// Function to send the sample data to the contract API
async function testContractGeneration() {
  console.log('Testing contract generation with sample data...');
  
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
}

// Run the test
testContractGeneration();