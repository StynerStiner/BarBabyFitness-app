const fetch = require('node-fetch');
const fs = require('fs');
const path = require('path');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Default server URL
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
const sampleSignature = `data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAASwAAACWCAYAAABkW7XSAAAQxUlEQVR4Xu2dCawlRRWG/9kYZ2YYYNiGxV0EREEREUVFUUQRjYiKuEVciBq3qBiXoFETd9xxCRKXCKJxASOKgsgiyCI7AsMywzLAsAwMM8P8JzSXN+/16+qq7r7dt/vkJJN5r7urTp36+p6qU11dXRgzM30TwAEAdgJwIIAFA6Q4AuBnAH4MYA7AlQD+DmA5gAvC/zcKOZyILg8/3gLABgDWA7B+CLtO+LsugA0BbBTC42MAawDwcEsArAKwGsCLAF4I//4bwEsAXg7/fwrAkwCeCOGPh/8/B+BZAE8N8e/xAAC3hpVBIuqmyMdMzwH4I4DzATwayhtdx10ArgoOvxTAM+E3CfsbwN8EXAbgwVHRRcJMdQCUP8M+A+CHhU9YA+AXAL4aCnBpZ8wBeAzAI+H/fw5O7MowexQ3fSDA8eHeEh5u3YTnrp2ce5iJn5m4UPi7GIALgwuOC5ALkZ9ciFxYXKA/CZ/5FXoVgFcBeBmAF4e/LkwuJC5s5eLC5ULmwufC6MLoQtl3w0OYf3Mh9W8uvP7dv/szAjECMQIxAn1GYE2rXjDTPgAOD8LrMwCSXxLzKJCXrYqnTweJvKw8Mjx8MwtQP2f3xicAPDk8fNb4YHLlM9NB4QF8RXLEIjRBBCpdsMz0ltByXxlgsoNUqUMicrXhQvuO0FJ9pKKCPipnp/aOoFDRYQYjUNmCZaYHgJnlzZ96SxKVVz25kU8GRXammmLHiIpAZQqWmXYJCmMvTTaLyq0S9CiV1rcBeHc5eYuppoTAWBcsM7FHWG5Q/gYz7RM0DXvE9d1YXXCmcZ/cO69vBg2Md1RZlcSZpghUqWB5X9U3g4I9D1vnuDzq+kHQk+QdYc6omQh0L1h9HBYw0+tDi+D/6+pkDkPdtMKH/iYImtO+lKaHa5jp6KD5qeN+s8rjlwC8MwzrVP1sVdeqX7DCNPT7Quva9FlMrMYLcYaJfK/gMW5xGjuHR7gWiO8JyqxPJL7tJsWO1YhAnQqWp/zvBkCFZf+e7jbOhpN5Jp4Hf2LQwf0+KMK7jtDnQ4aOGmLFOi+I4Ovyva+Gy3p7qHtK3ejvcU514q1TwTLD3wFw9+qFZ3Zq6i9BNzabWRMiLNO+QqCvgunYfzJ5D5ZNvDPHzHGKV4yA53X3LCqVuiGlr3+YyTr3j1WhYL0pvN5Yp3k52mUMdFnL6J1O0gq1+YuZ/Jbx5qSYcSICsSVNiuZ/Qd8AoB3y
