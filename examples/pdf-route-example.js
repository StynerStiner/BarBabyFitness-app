import express from 'express';
import { pdfProcessor } from '../src/utils/pdfMiddleware.js';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

// Create Express router
const router = express.Router();

// Example route for full contract processing
router.post(
  '/create-contracts',
  // Parse the multipart form data including signatures
  pdfProcessor.handleFormUpload(),
  // Process all contract templates
  pdfProcessor.processContracts(),
  // Send response with document URLs
  pdfProcessor.sendResponse()
);

// Example route for processing a single template
router.post(
  '/create-single-document',
  express.json(),
  // Process only the specified template
  pdfProcessor.processSingleTemplate('training_agreement_template.pdf'),
  // Custom response handler
  (req, res) => {
    res.json({
      success: true,
      document: req.processedDocument,
      message: 'Document created successfully'
    });
  }
);

// Example route that shows passing to the next middleware
router.post(
  '/process-and-email',
  express.json(),
  // Process the document
  pdfProcessor.processSingleTemplate('liability_waiver_template.pdf'),
  // Then handle emails or other actions
  (req, res) => {
    // Here you would typically send an email with the document
    const documentUrl = req.processedDocument.url;
    
    // Just sending a mock response for this example
    res.json({
      success: true,
      message: 'Document processed and email would be sent',
      documentUrl: documentUrl
    });
  }
);

// Error handling middleware
router.use((err, req, res, next) => {
  console.error('Route error:', err);
  res.status(500).json({
    success: false,
    error: err.message || 'An unexpected error occurred'
  });
});

export default router;

// Example of how to use this router in your main Express app:
/*
import express from 'express';
import pdfRoutes from './examples/pdf-route-example.js';

const app = express();

// Use the PDF routes
app.use('/api/pdfs', pdfRoutes);

app.listen(3000, () => {
  console.log('Server running on port 3000');
});
*/