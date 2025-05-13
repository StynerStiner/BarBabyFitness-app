import { pdfManager } from './pdfUtils.js';
import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

// Get dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for temp file storage
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
 * BarBaby Fitness Form Handler
 * Handles form submissions and PDF processing for the three official forms:
 * - registration_form_modern.pdf
 * - personal_training_agreement.pdf
 * - liability_waiver.pdf
 */
export const formHandler = {
  /**
   * Configure formHandler with email settings
   */
  configure(config = {}) {
    if (config.email) {
      pdfManager.setEmailTransport(config.email);
    }
    return this;
  },
  
  /**
   * Middleware to parse multipart form data
   */
  parseForm() {
    return upload.fields([
      { name: 'clientSignature', maxCount: 1 },
      { name: 'trainerSignature', maxCount: 1 }
    ]);
  },
  
  /**
   * Process registration form (registration_form_modern.pdf)
   */
  processRegistrationForm() {
    return async (req, res, next) => {
      try {
        // Parse form data (handle both JSON and form data)
        let formData;
        if (typeof req.body.formData === 'string') {
          formData = JSON.parse(req.body.formData);
        } else {
          formData = req.body.formData || req.body;
        }
        
        if (!formData) {
          return res.status(400).json({ 
            success: false, 
            error: 'No form data provided' 
          });
        }
        
        // Process registration form
        const result = await pdfManager.processForm('registration', formData, {
          sendEmail: true,
          saveLocally: process.env.NODE_ENV === 'development'
        });
        
        if (!result.success) {
          return res.status(500).json({
            success: false,
            error: result.error || 'Failed to process registration form'
          });
        }
        
        // Store result for next middleware
        req.processedForm = result;
        next();
      } catch (error) {
        console.error('Error processing registration form:', error);
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error'
        });
      }
    };
  },
  
  /**
   * Process training agreement form (personal_training_agreement.pdf)
   */
  processTrainingAgreement() {
    return async (req, res, next) => {
      try {
        // Parse form data
        let formData;
        if (typeof req.body.formData === 'string') {
          formData = JSON.parse(req.body.formData);
        } else {
          formData = req.body.formData || req.body;
        }
        
        if (!formData) {
          return res.status(400).json({ 
            success: false, 
            error: 'No form data provided' 
          });
        }
        
        // Get client signature if provided
        const options = {
          sendEmail: true,
          saveLocally: process.env.NODE_ENV === 'development'
        };
        
        // Process agreement form
        const result = await pdfManager.processForm('agreement', formData, options);
        
        if (!result.success) {
          return res.status(500).json({
            success: false,
            error: result.error || 'Failed to process training agreement'
          });
        }
        
        // Store result for next middleware
        req.trainingAgreement = result;
        next();
      } catch (error) {
        console.error('Error processing training agreement:', error);
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error'
        });
      }
    };
  },
  
  /**
   * Process liability waiver form (liability_waiver.pdf)
   */
  processLiabilityWaiver() {
    return async (req, res, next) => {
      try {
        // Parse form data
        let formData;
        if (typeof req.body.formData === 'string') {
          formData = JSON.parse(req.body.formData);
        } else {
          formData = req.body.formData || req.body;
        }
        
        if (!formData) {
          return res.status(400).json({ 
            success: false, 
            error: 'No form data provided' 
          });
        }
        
        // Process waiver form
        const result = await pdfManager.processForm('waiver', formData, {
          sendEmail: true,
          saveLocally: process.env.NODE_ENV === 'development'
        });
        
        if (!result.success) {
          return res.status(500).json({
            success: false,
            error: result.error || 'Failed to process liability waiver'
          });
        }
        
        // Store result for next middleware
        req.liabilityWaiver = result;
        next();
      } catch (error) {
        console.error('Error processing liability waiver:', error);
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error'
        });
      }
    };
  },
  
  /**
   * Process both training agreement and liability waiver together
   * (For the contract-and-waiver page)
   */
  processContractAndWaiver() {
    return async (req, res, next) => {
      try {
        // Parse form data
        let formData;
        if (typeof req.body.formData === 'string') {
          formData = JSON.parse(req.body.formData);
        } else {
          formData = req.body.formData || req.body;
        }
        
        if (!formData) {
          return res.status(400).json({ 
            success: false, 
            error: 'No form data provided' 
          });
        }
        
        // Process both forms together
        const result = await pdfManager.processMultipleForms(
          ['agreement', 'waiver'],
          formData,
          {
            sendEmail: true,
            saveLocally: process.env.NODE_ENV === 'development'
          }
        );
        
        if (!result.success) {
          return res.status(500).json({
            success: false,
            error: 'Failed to process one or more forms',
            details: result.results
          });
        }
        
        // Store results for next middleware
        req.contractAndWaiver = result;
        next();
      } catch (error) {
        console.error('Error processing contract and waiver:', error);
        res.status(500).json({
          success: false,
          error: error.message || 'Internal server error'
        });
      }
    };
  },
  
  /**
   * Send standard success response
   */
  sendResponse() {
    return (req, res) => {
      // Combine all processed forms
      const forms = [];
      
      if (req.processedForm) {
        forms.push({
          type: req.processedForm.formType,
          url: req.processedForm.pdfUrl
        });
      }
      
      if (req.trainingAgreement) {
        forms.push({
          type: 'agreement',
          url: req.trainingAgreement.pdfUrl
        });
      }
      
      if (req.liabilityWaiver) {
        forms.push({
          type: 'waiver',
          url: req.liabilityWaiver.pdfUrl
        });
      }
      
      if (req.contractAndWaiver) {
        req.contractAndWaiver.results.forEach(result => {
          if (result.success) {
            forms.push({
              type: result.formType,
              url: result.pdfUrl
            });
          }
        });
      }
      
      res.json({
        success: true,
        message: 'Forms processed successfully',
        forms: forms
      });
    };
  }
};

export default formHandler;