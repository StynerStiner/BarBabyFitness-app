import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { formHandler } from './src/utils/formHandler.js';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 3003;

// Middleware
app.use(cors());
app.use(express.json({ limit: '10mb' })); // For JSON payloads
app.use(express.urlencoded({ extended: true, limit: '10mb' })); // For form submissions

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Configure form handler with email settings (if configured)
if (process.env.EMAIL_HOST) {
  formHandler.configure({
    email: {
      host: process.env.EMAIL_HOST,
      port: parseInt(process.env.EMAIL_PORT || '587'),
      secure: process.env.EMAIL_SECURE === 'true',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    }
  });
}

// ===== API Routes =====

// Registration Form (/register page)
app.post(
  '/api/registration',
  formHandler.parseForm(),
  formHandler.processRegistrationForm(),
  (req, res) => {
    res.json({
      success: true,
      message: 'Registration form processed successfully',
      form: req.processedForm
    });
  }
);

// Contract and Waiver (/registration-flow/contract-and-waiver page)
app.post(
  '/api/contract-and-waiver',
  formHandler.parseForm(),
  formHandler.processContractAndWaiver(),
  (req, res) => {
    res.json({
      success: true,
      message: 'Contract and waiver processed successfully',
      forms: req.contractAndWaiver.results
        .filter(result => result.success)
        .map(result => ({
          type: result.formType,
          url: result.pdfUrl
        }))
    });
  }
);

// Individual form endpoints (if needed)
app.post(
  '/api/training-agreement',
  formHandler.parseForm(),
  formHandler.processTrainingAgreement(),
  formHandler.sendResponse()
);

app.post(
  '/api/liability-waiver',
  formHandler.parseForm(),
  formHandler.processLiabilityWaiver(),
  formHandler.sendResponse()
);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    success: false,
    error: process.env.NODE_ENV === 'production' 
      ? 'An internal server error occurred' 
      : err.message
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ BarBaby Fitness Form Server running on port ${PORT}`);
  console.log(`📂 Using Cloudflare R2 bucket: ${process.env.CLOUDFLARE_R2_BUCKET_NAME || 'barbaby-contracts'}`);
  console.log(`📧 Business email notifications: ${process.env.BUSINESS_EMAIL || 'adm.barbabyfitness@gmail.com'}`);
});