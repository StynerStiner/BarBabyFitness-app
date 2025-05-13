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

// Sample form data (this would normally come from your website)
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

// Utility function to convert a stream to a buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

// Map form data to PDF field names
function mapFormDataToPdf(field, fieldName, formData) {
  console.log(`Processing field: ${fieldName}`);
  let value = '';

  // Personal information
  if (fieldName.match(/full.*name|client.*name|participant.*name/i) && formData.firstName && formData.lastName) {
    value = `${formData.firstName} ${formData.lastName}`;
  } else if (fieldName.match(/first.*name/i) && formData.firstName) {
    value = formData.firstName;
  } else if (fieldName.match(/last.*name/i) && formData.lastName) {
    value = formData.lastName;
  } else if (fieldName.match(/email/i) && formData.email) {
    value = formData.email;
  } else if (fieldName.match(/phone|telephone|mobile/i) && formData.phone) {
    value = formData.phone;
  } else if (fieldName.match(/dob|birth|birthdate/i) && formData.dob) {
    value = formData.dob;
  } else if (fieldName.match(/gender/i) && formData.gender) {
    value = formData.gender;
  }

  // Address information
  else if (fieldName.match(/address|street/i) && formData.streetAddress) {
    value = formData.streetAddress;
  } else if (fieldName.match(/address.*2|street.*2/i) && formData.streetAddress2) {
    value = formData.streetAddress2;
  } else if (fieldName.match(/city/i) && formData.city) {
    value = formData.city;
  } else if (fieldName.match(/state|province/i) && formData.state) {
    value = formData.state;
  } else if (fieldName.match(/zip|postal/i) && formData.zipCode) {
    value = formData.zipCode;
  }

  // Emergency contact information
  else if (fieldName.match(/emergency.*name/i) && formData.emergencyContactFirstName && formData.emergencyContactLastName) {
    value = `${formData.emergencyContactFirstName} ${formData.emergencyContactLastName}`;
  } else if (fieldName.match(/emergency.*first/i) && formData.emergencyContactFirstName) {
    value = formData.emergencyContactFirstName;
  } else if (fieldName.match(/emergency.*last/i) && form
