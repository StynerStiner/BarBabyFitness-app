import { S3Client, PutObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3';
import { PDFDocument } from 'pdf-lib';
import nodemailer from 'nodemailer';
import fs from 'fs';
import path from 'path';

/**
 * BarBabyFitness PDF Manager
 * Handles PDF form filling and storage in Cloudflare R2 for the specific forms:
 * - registration_form_modern.pdf
 * - personal_training_agreement.pdf
 * - liability_waiver.pdf
 */
export class PDFManager {
  constructor(config = {}) {
    // Initialize with environment variables or provided config
    this.bucketName = config.bucketName || process.env.CLOUDFLARE_R2_BUCKET_NAME || 'barbaby-contracts';
    this.publicUrl = config.publicUrl || process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev';
    this.businessEmail = config.businessEmail || 'adm.barbabyfitness@gmail.com';
    
    // Initialize R2 client with hardcoded or provided credentials
    this.r2Client = new S3Client({
      region: 'auto',
      endpoint: config.endpoint || process.env.CLOUDFLARE_R2_ENDPOINT || 'https://8903e28602247a5bf0543b9dbe1c84e9.r2.cloudflarestorage.com',
      credentials: {
        accessKeyId: config.accessKeyId || process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || 'f78f5384df6b4672ae21e9ecb2c8508b',
        secretAccessKey: config.secretAccessKey || process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '***REMOVED***',
      },
      forcePathStyle: true // Required for Cloudflare R2
    });
    
    // Initialize email transporter if config provided
    if (config.email) {
      this.emailTransporter = nodemailer.createTransport(config.email);
    }
    
    // Specific PDF forms used by BarBaby Fitness - paths in R2 bucket
    this.pdfForms = {
      // The exact PDF file names as stored in the templates/ folder of the R2 bucket
      registration: 'templates/registration_form_template.pdf',
      agreement: 'templates/training_agreement_template.pdf',
      waiver: 'templates/liability_waiver_template.pdf'
    };
    
    // Completed forms folder structure
    this.folderPaths = {
      registration: 'completed-forms/registration/',
      agreement: 'completed-forms/agreement/',
      waiver: 'completed-forms/waiver/'
    };
  }

  /**
   * Helper function to convert stream to buffer
   */
  async streamToBuffer(stream) {
    const chunks = [];
    for await (const chunk of stream) {
      chunks.push(Buffer.from(chunk));
    }
    return Buffer.concat(chunks);
  }

  /**
   * Get a PDF template from R2
   */
  async getTemplate(templateName) {
    try {
      // Get template from R2 - use direct path with no folder prefix
      const command = new GetObjectCommand({
        Bucket: this.bucketName,
        Key: templateName,
      });
      
      console.log(`Fetching template from: ${this.bucketName}/${templateName}`);
      
      const response = await this.r2Client.send(command);
      const templateBuffer = await this.streamToBuffer(response.Body);
      console.log(`Template fetched from R2: ${templateName} (${templateBuffer.length} bytes)`);
      return templateBuffer;
    } catch (error) {
      console.error(`Error fetching template ${templateName} from R2:`, error);
      
      // Try with different path formats if the direct path failed
      try {
        // First try with a templates/ prefix
        console.log(`Retrying with templates/${templateName}...`);
        const alternateCommand = new GetObjectCommand({
          Bucket: this.bucketName,
          Key: `templates/${templateName}`,
        });
        
        const alternateResponse = await this.r2Client.send(alternateCommand);
        const alternateBuffer = await this.streamToBuffer(alternateResponse.Body);
        console.log(`Template fetched from alternate path: templates/${templateName} (${alternateBuffer.length} bytes)`);
        return alternateBuffer;
      } catch (alternateError) {
        console.error(`Error fetching from templates/ path:`, alternateError);
        // Try one more path variation
        try {
          console.log(`Retrying with completed-forms/${templateName}...`);
          const secondAlternateCommand = new GetObjectCommand({
            Bucket: this.bucketName,
            Key: `completed-forms/${templateName}`,
          });
            
          const secondAlternateResponse = await this.r2Client.send(secondAlternateCommand);
          const secondAlternateBuffer = await this.streamToBuffer(secondAlternateResponse.Body);
          console.log(`Template fetched from second alternate path: completed-forms/${templateName} (${secondAlternateBuffer.length} bytes)`);
          return secondAlternateBuffer;
        } catch (secondAlternateError) {
          console.error(`Error fetching from completed-forms/ path:`, secondAlternateError);
          throw new Error(`Failed to fetch template (tried all paths): ${error.message}`);
        }
      }
    }
  }

  /**
   * Fill PDF form with client data
   */
  async fillPdfForm(templateBuffer, clientData) {
    try {
      // Load the PDF document
      const pdfDoc = await PDFDocument.load(templateBuffer);
      const form = pdfDoc.getForm();
      const fields = form.getFields();
      
      console.log(`Found ${fields.length} form fields in PDF`);
      
      // Fill all available fields that match client data
      fields.forEach(field => {
        // Skip if not a text field
        if (field.constructor.name !== 'PDFTextField') return;
        
        const fieldName = field.getName();
        // Check if we have matching data using the exact camelCase field name
        if (clientData[fieldName] !== undefined) {
          try {
            field.setText(clientData[fieldName].toString());
            console.log(`Field '${fieldName}' set to "${clientData[fieldName]}"`);
          } catch (error) {
            console.warn(`Error setting field '${fieldName}':`, error.message);
          }
        }
      });
      
      // Flatten form to make it non-editable
      form.flatten();
      
      // Save filled PDF
      return await pdfDoc.save();
    } catch (error) {
      console.error('Error filling PDF form:', error);
      throw new Error(`Failed to fill PDF form: ${error.message}`);
    }
  }

  /**
   * Save filled PDF to R2 storage
   */
  async savePdfToR2(pdfBytes, formType, clientData) {
    try {
      const timestamp = Date.now();
      const clientName = `${clientData.firstName || ''}-${clientData.lastName || ''}`.trim().replace(/\s+/g, '-').toLowerCase();
      // Use the exact folder structure created in R2
      const key = `${this.folderPaths[formType]}${clientName}_${timestamp}.pdf`;
      
      // Save local copy for debugging before attempting upload
      if (process.env.NODE_ENV === 'development') {
        try {
          const fs = await import('fs');
          const path = await import('path');
          const debugDir = './debug-pdfs';
          if (!fs.existsSync(debugDir)) {
            fs.mkdirSync(debugDir, { recursive: true });
          }
          const localPath = path.join(debugDir, `${formType}_${clientName}_${timestamp}.pdf`);
          fs.writeFileSync(localPath, Buffer.from(pdfBytes));
          console.log(`Debug copy saved locally at: ${localPath}`);
        } catch (fsError) {
          console.warn('Could not save local debug copy:', fsError.message);
        }
      }
      
      const params = {
        Bucket: this.bucketName,
        Key: key,
        Body: Buffer.from(pdfBytes),
        ContentType: 'application/pdf',
        Metadata: {
          clientName: `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim(),
          clientEmail: clientData.email || '',
          formType: formType,
          timestamp: timestamp.toString()
        }
      };
      
      await this.r2Client.send(new PutObjectCommand(params));
      const publicUrl = `${this.publicUrl}/${key}`;
      
      return {
        success: true,
        url: publicUrl,
        key: key,
        localPath: process.env.NODE_ENV === 'development' ? `./debug-pdfs/${formType}_${clientName}_${timestamp}.pdf` : null
      };
    } catch (error) {
      console.error('Error saving PDF to R2:', error);
      
      // Still return partial success with local path if available
      if (process.env.NODE_ENV === 'development') {
        const clientName = `${clientData.firstName || ''}-${clientData.lastName || ''}`.trim().replace(/\s+/g, '-').toLowerCase();
        const timestamp = Date.now();
        return {
          success: false,
          error: error.message,
          localPath: `./debug-pdfs/${formType}_${clientName}_${timestamp}.pdf`
        };
      }
      
      throw new Error(`Failed to save PDF to R2: ${error.message}`);
    }
  }

  /**
   * Email the completed form to client and business owner (adm.barbabyfitness@gmail.com)
   */
  async emailCompletedForm(pdfBytes, formType, clientData) {
    if (!this.emailTransporter) {
      console.warn('Email transporter not configured, skipping email sending');
      return { success: false, error: 'Email transporter not configured' };
    }
    
    try {
      // User-friendly form names for emails
      const formTypeNames = {
        'registration': 'Registration Form',
        'agreement': 'Personal Training Agreement',
        'waiver': 'Liability Waiver'
      };
      
      const formName = formTypeNames[formType] || 'Form';
      const clientName = `${clientData.firstName || ''} ${clientData.lastName || ''}`.trim();
      const clientEmail = clientData.email;
      
      if (!clientEmail) {
        return { success: false, error: 'Client email not provided' };
      }
      
      // Email to client
      await this.emailTransporter.sendMail({
        from: `"BarBaby Fitness" <noreply@barbabyfitness.com>`,
        to: clientEmail,
        subject: `Your BarBaby Fitness ${formName}`,
        text: `Dear ${clientName},\n\nThank you for completing the ${formName}. Please find your completed form attached.\n\nRegards,\nBarBaby Fitness Team`,
        html: `<p>Dear ${clientName},</p><p>Thank you for completing the ${formName}. Please find your completed form attached.</p><p>Regards,<br>BarBaby Fitness Team</p>`,
        attachments: [
          {
            filename: `${formType.replace(/_/g, '-')}.pdf`,
            content: Buffer.from(pdfBytes)
          }
        ]
      });
      
      // Email to business owner (adm.barbabyfitness@gmail.com)
      await this.emailTransporter.sendMail({
        from: `"BarBaby Fitness System" <noreply@barbabyfitness.com>`,
        to: this.businessEmail,
        subject: `New Client ${formName}: ${clientName}`,
        text: `A new client (${clientName}) has completed the ${formName}. The completed form is attached.\n\nClient Email: ${clientEmail}`,
        html: `<p>A new client (${clientName}) has completed the ${formName}. The completed form is attached.</p><p>Client Email: ${clientEmail}</p>`,
        attachments: [
          {
            filename: `${clientName.replace(/\s+/g, '-').toLowerCase()}_${formType.replace(/_/g, '-')}.pdf`,
            content: Buffer.from(pdfBytes)
          }
        ]
      });
      
      return { success: true };
    } catch (error) {
      console.error('Error sending emails:', error);
      return { success: false, error: error.message };
    }
  }

  /**
   * Process a client form submission - the main entry point
   */
  async processForm(formType, clientData, options = {}) {
    try {
      // Validate form type
      if (!this.pdfForms[formType]) {
        throw new Error(`Unknown form type: ${formType}`);
      }
      
      const templateName = this.pdfForms[formType];
      console.log(`Processing ${formType} form for ${clientData.firstName || 'Unknown'} ${clientData.lastName || 'User'}`);
      
      // 1. Get template
      let templateBuffer;
      try {
        templateBuffer = await this.getTemplate(templateName);
      } catch (templateError) {
        console.error(`Error getting template ${templateName}:`, templateError);
        
        // If this is running in development, try to create a dummy PDF for testing
        if (process.env.NODE_ENV === 'development' && options.saveLocally) {
          console.log('Creating dummy PDF for testing in dev mode...');
          const { PDFDocument, StandardFonts, rgb } = await import('pdf-lib');
          
          // Create a dummy PDF
          const dummyPdf = await PDFDocument.create();
          const page = dummyPdf.addPage();
          const font = await dummyPdf.embedFont(StandardFonts.Helvetica);
          
          page.drawText(`TEST PDF FOR ${formType.toUpperCase()}`, {
            x: 50,
            y: page.getHeight() - 50,
            size: 24,
            font,
            color: rgb(0, 0, 0),
          });
          
          page.drawText(`Client: ${clientData.firstName || ''} ${clientData.lastName || ''}`, {
            x: 50,
            y: page.getHeight() - 100,
            size: 12,
            font,
            color: rgb(0, 0, 0),
          });
          
          // Save dummy PDF
          const dummyPdfBytes = await dummyPdf.save();
          
          // Save it locally
          const debugDir = options.debugDir || './debug-pdfs';
          const fs = await import('fs');
          const path = await import('path');
          
          if (!fs.existsSync(debugDir)) {
            fs.mkdirSync(debugDir, { recursive: true });
          }
          
          const localPath = path.join(
            debugDir, 
            `dummy_${formType}_${Date.now()}.pdf`
          );
          
          fs.writeFileSync(localPath, Buffer.from(dummyPdfBytes));
          console.log(`Dummy PDF saved at: ${localPath}`);
          
          return {
            success: true,
            formType: formType,
            pdfUrl: `file://${localPath}`,
            localPath: localPath,
            isDummy: true,
            error: templateError.message
          };
        }
        
        throw templateError;
      }
      
      // 2. Fill the form
      const filledPdfBytes = await this.fillPdfForm(templateBuffer, clientData);
      
      // 3. Save to R2
      const saveResult = await this.savePdfToR2(filledPdfBytes, formType, clientData);
      
      // 4. Email if requested and configured
      let emailResult = { success: false, reason: 'Email not requested' };
      if (options.sendEmail) {
        try {
          emailResult = await this.emailCompletedForm(filledPdfBytes, formType, clientData);
        } catch (emailError) {
          console.error('Error sending email:', emailError);
          emailResult = { success: false, error: emailError.message };
        }
      }
      
      // 5. Save locally if requested (for debugging)
      if (options.saveLocally && !saveResult.localPath) {
        try {
          const debugDir = options.debugDir || './debug-pdfs';
          const fs = await import('fs');
          const path = await import('path');
          
          if (!fs.existsSync(debugDir)) {
            fs.mkdirSync(debugDir, { recursive: true });
          }
          
          const localPath = path.join(
            debugDir, 
            `${formType}_${clientData.firstName || ''}_${clientData.lastName || ''}_${Date.now()}.pdf`
          );
          fs.writeFileSync(localPath, Buffer.from(filledPdfBytes));
          console.log(`Debug copy saved locally at: ${localPath}`);
          saveResult.localPath = localPath;
        } catch (fsError) {
          console.warn('Could not save local debug copy:', fsError.message);
        }
      }
      
      return {
        success: true,
        formType: formType,
        pdfUrl: saveResult.url,
        pdfKey: saveResult.key,
        localPath: saveResult.localPath,
        emailed: emailResult.success,
        emailError: emailResult.error
      };
    } catch (error) {
      console.error(`Error processing ${formType} form:`, error);
      return {
        success: false,
        formType: formType,
        error: error.message
      };
    }
  }

  /**
   * Process multiple forms at once for the same client
   */
  async processMultipleForms(formTypes, clientData, options = {}) {
    const results = [];
    
    console.log(`Processing multiple forms for client: ${clientData.firstName || ''} ${clientData.lastName || ''}`);
    console.log(`Form types: ${formTypes.join(', ')}`);
    console.log(`Using folder structure: ${JSON.stringify(this.folderPaths)}`);
    
    for (const formType of formTypes) {
      try {
        // Verify folder path exists for this form type
        if (!this.folderPaths[formType]) {
          console.warn(`Warning: No folder path defined for form type: ${formType}`);
          // Use default folder path if not found
          this.folderPaths[formType] = `completed-forms/${formType}/`;
        }
        
        console.log(`Processing form type: ${formType} to path: ${this.folderPaths[formType]}`);
        const result = await this.processForm(formType, clientData, options);
        results.push(result);
      } catch (error) {
        console.error(`Error processing form type ${formType}:`, error);
        results.push({
          success: false,
          formType: formType,
          error: error.message
        });
      }
    }
    
    return {
      success: results.some(r => r.success),
      results: results
    };
  }
  
  /**
   * Configure email transport for sending completed forms
   */
  setEmailTransport(config) {
    this.emailTransporter = nodemailer.createTransport(config);
  }
}

// Export singleton instance for easy use
export const pdfManager = new PDFManager();

// Export class for custom initialization
export default PDFManager;
