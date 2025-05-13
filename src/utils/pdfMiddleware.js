import { pdfManager } from './pdfUtils.js';
import multer from 'multer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, '../../temp-uploads');
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

/**
 * Express middleware for handling PDF form submissions
 */
export const pdfProcessor = {
  /**
   * Middleware for handling multipart form data including signatures
   * @returns {Function} - Express middleware
   */
  handleFormUpload() {
    return upload.fields([
      { name: 'clientSignature', maxCount: 1 },
      { name: 'trainerSignature', maxCount: 1 }
    ]);
  },
  
  /**
   * Process uploaded form data and generate PDF contracts
   * @returns {Function} - Express middleware
   */
  processContracts() {
    return async (req, res, next) => {
      try {
        // Parse the contract data from the request
        let contractData;
        
        if (typeof req.body.contractData === 'string') {
          contractData = JSON.parse(req.body.contractData);
        } else {
          contractData = req.body.contractData || req.body;
        }
        
        if (!contractData) {
          return res.status(400).json({ 
            success: false, 
            error: 'No contract data provided' 
          });
        }
        
        // Collect any signature data
        const clientSignature = req.body.clientSignature || null;
        const trainerSignature = req.body.trainerSignature || null;
        
        // Define templates to process
        const templates = [
          { name: 'training_agreement_template.pdf', type: 'agreement' },
          { name: 'liability_waiver_template.pdf', type: 'waiver' },
          { name: 'registration_form_template.pdf', type: 'registration' }
        ];
        
        // Process all templates
        const documents = [];
        let anySuccess = false;
        
        for (const template of templates) {
          const result = await pdfManager.processAndSavePdf(
            template.name,
            contractData,
            {
              documentType: template.type,
              clientSignature,
              trainerSignature,
              localTemplatePath: path.join(__dirname, '../../template-pdfs', template.name),
            }
          );
          
          documents.push({
            type: template.type,
            url: result.url,
            success: result.success,
            error: result.error
          });
          
          if (result.success) anySuccess = true;
        }
        
        if (!anySuccess) {
          return res.status(500).json({
            success: false,
            error: 'Failed to process any documents',
            documents
          });
        }
        
        // Add results to request for later middlewares
        req.processedDocuments = documents;
        req.contractData = contractData;
        
        next();
      } catch (error) {
        console.error('Error in PDF middleware:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    };
  },
  
  /**
   * Sends the response with the processed documents
   * @returns {Function} - Express middleware
   */
  sendResponse() {
    return (req, res) => {
      res.json({
        success: true,
        documents: req.processedDocuments,
        clientData: req.contractData
      });
    };
  },
  
  /**
   * Process a single PDF template
   * @param {string} templateName - Template name to process
   * @returns {Function} - Express middleware
   */
  processSingleTemplate(templateName) {
    return async (req, res, next) => {
      try {
        const contractData = req.body;
        
        if (!contractData) {
          return res.status(400).json({ 
            success: false, 
            error: 'No data provided' 
          });
        }
        
        const documentType = pdfManager.detectDocumentType(templateName);
        
        const result = await pdfManager.processAndSavePdf(
          templateName,
          contractData,
          {
            documentType,
            localTemplatePath: path.join(__dirname, '../../template-pdfs', templateName),
          }
        );
        
        if (!result.success) {
          return res.status(500).json({
            success: false,
            error: result.error
          });
        }
        
        req.processedDocument = {
          type: documentType,
          url: result.url,
          key: result.key
        };
        
        next();
      } catch (error) {
        console.error('Error in PDF middleware:', error);
        res.status(500).json({
          success: false,
          error: error.message
        });
      }
    };
  }
};

export default pdfProcessor;