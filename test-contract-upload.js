// Test script to upload a contract and test PDF filling
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import FormData from 'form-data';
import { fileURLToPath } from 'url';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function testContractUpload() {
  try {
    console.log('Starting contract upload test...');
    
    // Create test data
    const contractData = {
      firstName: 'Test',
      lastName: 'User',
      email: 'test@example.com',
      phoneNo: '123-456-7890',
      selectedPlan: {
        title: 'Premium Plan',
        price: '99.99',
        sessions: 'Unlimited',
        duration: '1 Month',
        initiationFee: '50'
      },
      streetAddress: '123 Test St',
      city: 'Testville',
      state: 'TS',
      zipCode: '12345',
      emergencyContact: 'Emergency Contact',
      emergencyPhone: '987-654-3210'
    };

    // Generate a mock signature (base64 PNG)
    const mockSignature = fs.readFileSync(path.join(__dirname, 'public/images/logo.png')).toString('base64');
    const signatureBase64 = `data:image/png;base64,${mockSignature}`;

    // Create form data
    const formData = new FormData();
    formData.append('contractData', JSON.stringify(contractData));
    formData.append('clientSignature', signatureBase64);
    
    // Upload to the server
    console.log('Sending request to server...');
    const response = await axios.post(
      'http://localhost:3002/upload-contract',
      formData,
      {
        headers: {
          ...formData.getHeaders(),
        },
      }
    );

    console.log('Server response:', JSON.stringify(response.data, null, 2));

    if (response.data.documents && response.data.documents.length > 0) {
      console.log('Generated PDF documents:');
      response.data.documents.forEach(doc => {
        console.log(`- ${doc.type}: ${doc.url}`);
      });
      
      // Now test the email functionality
      console.log('\nTesting email with attachments...');
      const emailResponse = await axios.post('http://localhost:3002/emails/post-payment-actions', {
        clientEmail: 'test@example.com',
        clientName: 'Test User',
        contractUrl: response.data.url,
        planName: 'Premium Plan',
        paymentDetails: {
          method: 'Credit Card',
          transactionId: `test-${Date.now()}`,
          amount: '99.99'
        },
        registrationData: contractData
      });
      
      console.log('Email response:', JSON.stringify(emailResponse.data, null, 2));
    }
    
    console.log('Test complete!');
  } catch (error) {
    console.error('Error during test:', error.message);
    if (error.response) {
      console.error('Server response:', error.response.data);
    }
  }
}

testContractUpload();
