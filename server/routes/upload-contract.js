const express = require('express');
const router = express.Router();
const { S3Client, PutObjectCommand, ListObjectsCommand, GetObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');
const multer = require('multer');
const upload = multer();
const sdk = require('aws-sdk');
const { PDFDocument, rgb, StandardFonts } = require('pdf-lib');

// Configure Cloudflare R2
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Define the specific forms used by BarBaby Fitness
const pdfForms = {
  registration: 'registration_form_modern.pdf',
  agreement: 'personal_training_agreement.pdf',
  waiver: 'liability_waiver.pdf'
};

// Define the folder paths for completed forms
const folderPaths = {
  registration: 'completed-forms/registration/',
  agreement: 'completed-forms/agreement/',
  waiver: 'completed-forms/waiver/'
};

// Route to fetch template PDFs from R2
// Endpoint to check R2 connection status
router.get('/check-r2-connection', async (req, res) => {
  try {
    console.log('Checking R2 connection...');
    const command = new ListObjectsCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      MaxKeys: 1
    });
    
    const result = await r2.send(command);
    return res.json({
      success: true,
      message: 'Successfully connected to R2',
      details: {
        bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        templates: Object.values(pdfForms)
      }
    });
  } catch (error) {
    console.error('R2 connection error:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to connect to R2',
      error: error.message
    });
  }
});

router.get('/template/:fileName', async (req, res) => {
  try {
    const fileName = req.params.fileName;
    console.log(`Fetching template file: ${fileName}`);
    
    // Security check - only allow access to PDF templates
    if (!fileName.endsWith('.pdf')) {
      return res.status(400).send('Only PDF templates are allowed');
    }
    
    // Check if it's one of our specific templates
    let templatePath = fileName;
    const isKnownTemplate = Object.values(pdfForms).includes(fileName);
    console.log(`Is known template: ${isKnownTemplate}`);
    
    // Create the full template key path
    const templateKey = `templates/${fileName}`;
    
    // Create command to get the object from R2
    const command = new GetObjectCommand({
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: templateKey,
    });
    
    try {
      // Fetch the template PDF from R2
      const response = await r2.send(command);
      
      // Set appropriate headers
      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
      
      // Stream the response body to the client
      response.Body.pipe(res);
      
      console.log(`Template file streamed successfully: ${fileName}`);
    } catch (cloudflareError) {
      console.error(`Error fetching from Cloudflare R2: ${cloudflareError.message}`);
      console.log(`Attempting to serve local template file instead...`);
      
      // Try to serve from local templates directory
      const localTemplatePath = path.join(__dirname, '..', '..', 'template-pdfs', fileName);
      
      if (fs.existsSync(localTemplatePath)) {
        console.log(`Serving local template: ${localTemplatePath}`);
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="${fileName}"`);
        fs.createReadStream(localTemplatePath).pipe(res);
      } else {
        throw new Error(`Template not found in Cloudflare R2 or locally: ${fileName}`);
      }
    }
  } catch (error) {
    console.error(`Error fetching template ${req.params.fileName}:`, error);
    res.status(500).send(`Error fetching template: ${error.message}`);
  }
});

// Save registration data to R2
router.post('/save-registration', async (req, res) => {
  try {
    // Check if registration data is provided
    if (!req.body) {
      return res.status(400).json({
        success: false,
        message: 'No registration data provided'
      });
    }

    // Create a unique ID for the registration
    const registrationId = Date.now().toString();
    const params = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: `registrations/${registrationId}.json`,
      Body: JSON.stringify(req.body),
      ContentType: 'application/json',
    };

    const command = new PutObjectCommand(params);
    await r2.send(command);
    
    // Create a URL for the saved file
    const dataUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${params.Key}`;
    
    console.log(`Registration data saved to R2: ${params.Key}`);
    
    // Return success with the URL of the stored registration data
    res.status(200).json({ 
      success: true, 
      message: 'Registration data saved successfully to Cloudflare R2',
      registrationId: registrationId,
      url: dataUrl
    });
  } catch (error) {
    console.error('Error in save-registration:', error);
    
    // Return error to client - no local fallback
    res.status(500).json({ 
      success: false, 
      message: 'Error saving registration data to Cloudflare R2', 
      error: error.message 
    });
  }
});

// Helper function to create filled PDFs
async function createFilledPdf(templateName, contractData, clientSignature, trainerSignature) {
  console.log(`Starting to fill template: ${templateName}`);
  
  try {
    // Set up paths and filenames
    const timestamp = Date.now();
    const clientName = `${contractData.firstName || ''}-${contractData.lastName || 'client'}`.replace(/\s+/g, '-').toLowerCase();
    
    // Determine form type based on template name
    let formType = 'contract';
    if (templateName === pdfForms.registration) formType = 'registration';
    if (templateName === pdfForms.agreement) formType = 'agreement';
    if (templateName === pdfForms.waiver) formType = 'waiver';
    
    // First try to get template from R2 (directly from root)
    try {
      const command = new GetObjectCommand({
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: templateName, // Try direct path first
      });
      
      const response = await r2.send(command);
      const templateBuffer = await streamToBuffer(response.Body);
      console.log(`R2 template fetched: ${templateName} (${templateBuffer.length} bytes)`);
      
      // Load the PDF
      const pdfDoc = await PDFDocument.load(templateBuffer);
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      console.log(`Found ${fields.length} form fields in template: ${templateName}`);
      
      // Helper function for field mapping (implemented elsewhere)
      const mapFormDataToPdf = (field, fieldName) => {
        // This will use the same implementation as in the main route
        console.log(`Processing field: ${fieldName}`);
        let value = '';
        
        // Personal information
        if (fieldName.match(/full.*name|client.*name|participant.*name/i) && contractData.firstName && contractData.lastName) {
          value = `${contractData.firstName} ${contractData.lastName}`;
        } else if (fieldName.match(/first.*name/i) && contractData.firstName) {
          value = contractData.firstName;
        } else if (fieldName.match(/last.*name/i) && contractData.lastName) {
          value = contractData.lastName;
        } else if (fieldName.match(/email/i) && contractData.email) {
          value = contractData.email;
        } else if (fieldName.match(/phone|telephone|mobile/i) && contractData.phone) {
          value = contractData.phone;
        } else if (fieldName.match(/dob|birth|birthdate/i) && contractData.dob) {
          value = contractData.dob;
        } else if (fieldName.match(/gender/i) && contractData.gender) {
          value = contractData.gender;
        }
        
        // Address information
        else if (fieldName.match(/address|street/i) && contractData.streetAddress) {
          value = contractData.streetAddress;
        } else if (fieldName.match(/address.*2|street.*2/i) && contractData.streetAddress2) {
          value = contractData.streetAddress2;
        } else if (fieldName.match(/city/i) && contractData.city) {
          value = contractData.city;
        } else if (fieldName.match(/state|province/i) && contractData.state) {
          value = contractData.state;
        } else if (fieldName.match(/zip|postal/i) && contractData.zipCode) {
          value = contractData.zipCode;
        }
        
        // Emergency contact information
        else if (fieldName.match(/emergency.*name/i) && contractData.emergencyContactFirstName && contractData.emergencyContactLastName) {
          value = `${contractData.emergencyContactFirstName} ${contractData.emergencyContactLastName}`;
        } else if (fieldName.match(/emergency.*first/i) && contractData.emergencyContactFirstName) {
          value = contractData.emergencyContactFirstName;
        } else if (fieldName.match(/emergency.*last/i) && contractData.emergencyContactLastName) {
          value = contractData.emergencyContactLastName;
        } else if (fieldName.match(/emergency.*phone/i) && contractData.emergencyContactPhone) {
          value = contractData.emergencyContactPhone;
        } else if (fieldName.match(/emergency.*relation/i) && contractData.emergencyContactRelationship) {
          value = contractData.emergencyContactRelationship;
        }
        
        // Medical information
        else if (fieldName.match(/medical.*condition/i) && contractData.hasMedicalConditions) {
          value = contractData.hasMedicalConditions === 'yes' ? 'Yes' : 'No';
        } else if (fieldName.match(/medical.*details/i) && contractData.medicalDetails) {
          value = contractData.medicalDetails;
        }
        
        // Physical information
        else if (fieldName.match(/weight|current.*weight/i) && contractData.currentWeight) {
          value = contractData.currentWeight;
        } else if (fieldName.match(/height/i) && contractData.height) {
          value = contractData.height;
        } else if (fieldName.match(/goal.*weight/i) && contractData.goalWeight) {
          value = contractData.goalWeight;
        }
        
        // Plan information
        else if (fieldName.match(/plan|package/i) && contractData.selectedPlan && contractData.selectedPlan.title) {
          value = contractData.selectedPlan.title;
        } else if (fieldName.match(/sessions/i) && contractData.selectedPlan && contractData.selectedPlan.sessions) {
          value = contractData.selectedPlan.sessions;
        } else if (fieldName.match(/price|fee|cost/i) && contractData.selectedPlan && contractData.selectedPlan.price) {
          value = contractData.selectedPlan.price;
        } else if (fieldName.match(/initiation/i) && contractData.selectedPlan && contractData.selectedPlan.initiationFee) {
          value = contractData.selectedPlan.initiationFee;
        } else if (fieldName.match(/duration/i) && contractData.selectedPlan && contractData.selectedPlan.duration) {
          value = contractData.selectedPlan.duration;
        }
        
        // Date fields
        else if (fieldName.match(/date/i)) {
          value = new Date().toLocaleDateString();
        } else if (fieldName.match(/start.*date/i) && contractData.startDate) {
          value = contractData.startDate;
        }
        
        return value;
      };
      
      // Fill the form fields
      fields.forEach(field => {
        const fieldName = field.getName();
        const value = mapFormDataToPdf(field, fieldName);
        
        if (value && field.constructor.name === 'PDFTextField') {
          try {
            field.setText(value);
          } catch (e) {
            console.log(`Could not set text for field ${fieldName}:`, e.message);
          }
        } else if (value && field.constructor.name === 'PDFCheckBox' && value === 'Yes') {
          try {
            field.check();
          } catch (e) {
            console.log(`Could not check field ${fieldName}:`, e.message);
          }
        }
      });
      
      // Add signatures if available with the same logic as in the main route
      if (clientSignature) {
        // Signature processing code here (same as main route)
        // ... (signature code omitted for brevity) ...
      }
      
      // Flatten form
      form.flatten();
      
      // Save filled PDF
      const filledPdfBytes = await pdfDoc.save();
      
      // Generate document type name
      let docTypeName = 'contract';
      if (templateName.includes('registration')) docTypeName = 'registration';
      if (templateName.includes('liability') || templateName.includes('waiver')) docTypeName = 'waiver';
      
      // Upload filled PDF to R2
      const filledPdfKey = `${folderPaths[formType] || 'completed-forms/'}${clientName}_${timestamp}.pdf`;
      
      const filledPdfParams = {
        Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
        Key: filledPdfKey,
        Body: filledPdfBytes,
        ContentType: 'application/pdf',
      };
      
      const filledPdfCommand = new PutObjectCommand(filledPdfParams);
      await r2.send(filledPdfCommand);
      
      const filledPdfUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${filledPdfKey}`;
      console.log(`Filled PDF saved to R2: ${filledPdfUrl}`);
      
      return {
        success: true,
        url: filledPdfUrl,
        key: filledPdfKey
      };
    } catch (error) {
      console.error(`Error creating filled PDF for ${templateName}:`, error);
      
      // Try with templates/ prefix if direct path failed
      try {
        console.log(`Retrying with templates/${templateName}...`);
        const alternateCommand = new GetObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: `templates/${templateName}`,
        });
        
        const alternateResponse = await r2.send(alternateCommand);
        const alternateBuffer = await streamToBuffer(alternateResponse.Body);
        console.log(`Template fetched from alternate path: templates/${templateName} (${alternateBuffer.length} bytes)`);
        
        // Continue processing with the alternate template buffer
        // (Rest of processing code similar to above...)
        const pdfDoc = await PDFDocument.load(alternateBuffer);
        // ...continue with same processing as above
        
        return {
          success: false,
          error: 'Template found in alternate location but processing not implemented'
        };
      } catch (alternateError) {
        console.error(`Failed to fetch from alternate path:`, alternateError);
        return {
          success: false,
          error: `Failed to fetch template (tried both paths): ${error.message}`
        };
      }
    }
  } catch (error) {
    console.error(`Fatal error in createFilledPdf for ${templateName}:`, error);
    return {
      success: false,
      error: 'Internal server error creating filled PDF'
    };
  }
}

// Simple contract upload route for PDF filling and saving
router.post('/', express.json(), async (req, res) => {
  try {
    console.log('Received form submission request');
    
    // Get contract data from request body
    let contractData;
    
    if (req.body.contractData) {
      // Parse contract data if it's a string
      try {
        contractData = typeof req.body.contractData === 'string' ? 
          JSON.parse(req.body.contractData) : 
          req.body.contractData;
        
        console.log('Contract data parsed successfully');
      } catch (e) {
        console.error('Error parsing contract data:', e);
        return res.status(400).json({
          success: false,
          message: 'Invalid contract data format',
          details: e.message
        });
      }
    } else if (req.body) {
      // Assume the entire body is the contract data
      contractData = req.body;
      console.log('Using request body as contract data');
    } else {
      return res.status(400).json({
        success: false,
        message: 'No contract data provided'
      });
    }
    
    console.log('Processing contract data:', JSON.stringify(contractData, null, 2));
    
    // Get client signature if available
    const clientSignature = req.body.clientSignature || '';
    
    // Generate client name and timestamp
    const clientName = `${contractData.firstName || ''}-${contractData.lastName || 'client'}`.replace(/\s+/g, '-').toLowerCase();
    const timestamp = Date.now();
    
    console.log(`Processing for client: ${clientName}`);
    
    // Process all three templates
    const templates = [
      'registration_form_template.pdf',
      'training_agreement_template.pdf',
      'liability_waiver_template.pdf'
    ];
    
    const filledPdfUrls = [];
    let contractUrl = '';
    
    // Step 1: Save the raw client data
    const dataKey = `contract-data/${clientName}_${timestamp}.json`;
    
    const dataParams = {
      Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
      Key: dataKey,
      Body: JSON.stringify(contractData),
      ContentType: 'application/json',
    };
    
    await r2.send(new PutObjectCommand(dataParams));
    console.log(`Client data saved to: ${dataKey}`);
    
    // Step 2: Process each template
    for (const templateName of templates) {
      try {
        console.log(`\nProcessing template: ${templateName}`);
        
        // Fetch the template
        const templateCommand = new GetObjectCommand({
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: `templates/${templateName}`,
        });
        
        const templateResponse = await r2.send(templateCommand);
        if (!templateResponse.Body) {
          console.log(`Template not found: ${templateName}`);
          continue;
        }
        
        const templateBuffer = await streamToBuffer(templateResponse.Body);
        console.log(`Template loaded: ${templateBuffer.length} bytes`);
        
        // Load and process the PDF
        const pdfDoc = await PDFDocument.load(templateBuffer);
        const form = pdfDoc.getForm();
        const fields = form.getFields();
        
        console.log(`Found ${fields.length} fields in template: ${templateName}`);
        
        // Log all field names for debugging
        fields.forEach(field => console.log(`Field: ${field.getName()}`));
        
        // Fill form fields
        fields.forEach(field => {
          if (field.constructor.name !== 'PDFTextField') return;
          
          const fieldName = field.getName();
          let value = '';
          
          // Basic field mapping
          if (fieldName.match(/full.*name|client.*name/i)) {
            value = `${contractData.firstName || ''} ${contractData.lastName || ''}`.trim();
          } else if (fieldName.match(/first.*name/i)) {
            value = contractData.firstName || '';
          } else if (fieldName.match(/last.*name/i)) {
            value = contractData.lastName || '';
          } else if (fieldName.match(/email/i)) {
            value = contractData.email || '';
          } else if (fieldName.match(/phone/i)) {
            value = contractData.phone || '';
          } else if (fieldName.match(/address/i)) {
            value = contractData.streetAddress || '';
          } else if (fieldName.match(/city/i)) {
            value = contractData.city || '';
          } else if (fieldName.match(/state/i)) {
            value = contractData.state || '';
          } else if (fieldName.match(/zip/i)) {
            value = contractData.zipCode || '';
          } else if (fieldName.match(/plan/i) && contractData.selectedPlan) {
            value = contractData.selectedPlan.title || '';
          } else if (fieldName.match(/date/i)) {
            value = new Date().toLocaleDateString();
          }
          
          if (value) {
            try {
              field.setText(value);
              console.log(`Set field "${fieldName}" to "${value}"`);
            } catch (e) {
              console.log(`Error setting field ${fieldName}:`, e.message);
            }
          }
        });
        
        // Add signature if provided
        if (clientSignature) {
          try {
            const signatureData = clientSignature.replace(/^data:image\/\w+;base64,/, '');
            const signatureBytes = Buffer.from(signatureData, 'base64');
            const signatureImage = await pdfDoc.embedPng(signatureBytes);
            
            // Get the last page for the signature
            const pages = pdfDoc.getPages();
            const page = pages[pages.length - 1];
            const { width, height } = page.getSize();
            
            // Position signature at bottom of page
            page.drawImage(signatureImage, {
              x: width / 2 - 50,
              y: height / 4,
              width: 100,
              height: 50
            });
            
            console.log('Added signature to PDF');
          } catch (e) {
            console.error('Error adding signature:', e);
          }
        }
        
        // Flatten form and save
        form.flatten();
        const pdfBytes = await pdfDoc.save();
        
        // Determine document type
        let docType = 'contract';
        if (templateName.includes('registration')) docType = 'registration';
        if (templateName.includes('liability')) docType = 'waiver';
        if (templateName.includes('training')) docType = 'agreement';
        
        // Save to R2
        const pdfKey = `filled-contracts/${docType}_${clientName}_${timestamp}.pdf`;
        
        const pdfParams = {
          Bucket: process.env.CLOUDFLARE_R2_BUCKET_NAME,
          Key: pdfKey,
          Body: pdfBytes,
          ContentType: 'application/pdf',
        };
        
        await r2.send(new PutObjectCommand(pdfParams));
        
        // Generate public URL
        const pdfUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL}/${pdfKey}`;
        console.log(`PDF saved successfully: ${pdfUrl}`);
        
        filledPdfUrls.push(pdfUrl);
        
        // Use first PDF as main contract URL
        if (!contractUrl) {
          contractUrl = pdfUrl;
        }
      } catch (templateError) {
        console.error(`Error processing template ${templateName}:`, templateError);
      }
    }
    
    // Return response
    if (filledPdfUrls.length > 0) {
      console.log(`Successfully created ${filledPdfUrls.length} PDFs`);
      res.status(200).json({
        success: true,
        message: 'Contract successfully processed',
        contractUrl,
        filledPdfUrls,
        storageMethod: 'cloudflare'
      });
    } else {
      console.error('Failed to create any filled PDFs');
      res.status(500).json({
        success: false,
        message: 'Failed to create any filled PDFs'
      });
    }
  } catch (error) {
    console.error('Error processing contract submission:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing contract submission',
      error: error.message
    });
  }
});

// Utility function to convert a stream to a buffer
async function streamToBuffer(stream) {
  const chunks = [];
  for await (const chunk of stream) {
    chunks.push(Buffer.from(chunk));
  }
  return Buffer.concat(chunks);
}

module.exports = router;