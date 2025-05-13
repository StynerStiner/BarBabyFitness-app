import express from 'express';
import { formHandler } from '../src/utils/formHandler.js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Configure form handler with email settings
formHandler.configure({
  email: {
    host: process.env.EMAIL_HOST || 'smtp.example.com',
    port: parseInt(process.env.EMAIL_PORT || '587'),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER || 'user@example.com',
      pass: process.env.EMAIL_PASSWORD || 'password'
    }
  }
});

// Create router for form endpoints
const router = express.Router();

/**
 * Registration Form Endpoint - used on /register page
 * Processes the registration_form_modern.pdf
 */
router.post(
  '/registration',
  express.json(),
  formHandler.processRegistrationForm(),
  formHandler.sendResponse()
);

/**
 * Contract and Waiver Endpoint - used on /registration-flow/contract-and-waiver page
 * Processes both personal_training_agreement.pdf and liability_waiver.pdf
 */
router.post(
  '/contract-and-waiver',
  express.json(),
  formHandler.processContractAndWaiver(),
  formHandler.sendResponse()
);

/**
 * Individual Endpoints
 * These can be used if you want to process forms separately
 */

// Process just the training agreement
router.post(
  '/training-agreement',
  express.json(),
  formHandler.processTrainingAgreement(),
  formHandler.sendResponse()
);

// Process just the liability waiver
router.post(
  '/liability-waiver',
  express.json(),
  formHandler.processLiabilityWaiver(),
  formHandler.sendResponse()
);

/**
 * Custom Response Handler Example
 * Shows how to add a custom response with additional data
 */
router.post(
  '/registration-with-extras',
  express.json(),
  formHandler.processRegistrationForm(),
  (req, res) => {
    // Access the processed form result
    const formResult = req.processedForm;
    
    // Add custom response data
    res.json({
      success: true,
      message: 'Registration form processed successfully',
      formUrl: formResult.pdfUrl,
      welcomeMessage: `Welcome to BarBaby Fitness, ${req.body.firstName}!`,
      nextSteps: [
        'Check your email for a copy of your registration form',
        'Schedule your first training session',
        'Complete the health assessment form'
      ]
    });
  }
);

export default router;

// Example of how to use in Express app:
/*
import express from 'express';
import formRoutes from './examples/form-routes.js';

const app = express();

// Use form routes with /api prefix
app.use('/api', formRoutes);

app.listen(3002, () => {
  console.log('Server running on port 3002');
});
*/