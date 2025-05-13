/**
 * Server-side route handler for uploading PDFs to Cloudflare R2
 * Acts as a proxy to avoid CORS issues
 */
const express = require('express');
const router = express.Router();
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const fs = require('fs');
const path = require('path');

// Configure Cloudflare R2 client
const r2Client = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT || 'https://8903e28602247a5bf0543b9dbe1c84e9.r2.cloudflarestorage.com',
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID || 'f78f5384df6b4672ae21e9ecb2c8508b',
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY || '***REMOVED***',
  },
  forcePathStyle: true // Required for Cloudflare R2
});

// Helper function to validate base64 content
const isValidBase64 = (str) => {
  try {
    return Buffer.from(str, 'base64').toString('base64') === str;
  } catch (err) {
    return false;
  }
};

// Helper function to validate PDF content
const isPdfContent = (base64Str) => {
  // Basic validation to check if it looks like a PDF (starts with %PDF-)
  try {
    const buffer = Buffer.from(base64Str, 'base64');
    const header = buffer.toString('utf8', 0, 5);
    return header === '%PDF-';
  } catch (err) {
    return false;
  }
};

/**
 * Upload PDF to R2 storage
 * This route handles the PDF upload from the frontend and stores it in Cloudflare R2
 */
router.post('/upload-pdf', async (req, res) => {
  try {
    console.log('Received PDF upload request via server proxy');
    console.log('Request body keys:', Object.keys(req.body));
    
    // Validate request
    if (!req.body || !req.body.pdfContent || !req.body.filePath) {
      console.error('Missing required fields in request');
      console.log('Available fields:', Object.keys(req.body));
      return res.status(400).json({
        success: false,
        message: 'Missing required fields: pdfContent and filePath are required'
      });
    }

    const { filePath, pdfContent, contentType, clientName, formType, timestamp, additionalMetadata } = req.body;
    
    // Validate PDF content
    if (!isValidBase64(pdfContent)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid PDF content: Not valid base64'
      });
    }

    if (!isPdfContent(pdfContent)) {
      console.warn('Warning: Content may not be a valid PDF');
    }

    console.log(`Processing PDF upload for ${formType} form from client: ${clientName}`);
    console.log(`File path: ${filePath}`);

    // Convert base64 to buffer
    const pdfBuffer = Buffer.from(pdfContent, 'base64');
    console.log(`PDF size: ${pdfBuffer.length} bytes`);

    // Set up metadata
    const metadata = {
      'client-name': clientName || 'unknown',
      'form-type': formType || 'unknown',
      'timestamp': timestamp || Date.now().toString(),
      ...(additionalMetadata || {})
    };

    // Prepare the bucket name
    const bucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME || 'barbaby-contracts';

    // Create parameters for the S3 command
    const params = {
      Bucket: bucketName,
      Key: filePath,
      Body: pdfBuffer,
      ContentType: contentType || 'application/pdf',
      Metadata: metadata
    };

    console.log(`Uploading to bucket: ${bucketName}, path: ${filePath}`);

    // Create and execute the upload command
    const command = new PutObjectCommand(params);
    await r2Client.send(command);

    // Construct public URL
    const publicUrl = `${process.env.CLOUDFLARE_R2_PUBLIC_URL || 'https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev'}/${filePath}`;
    
    console.log(`PDF uploaded successfully. Public URL: ${publicUrl}`);

    // Return success response
    res.status(200).json({
      success: true,
      message: 'PDF uploaded successfully to R2',
      url: publicUrl
    });

  } catch (error) {
    console.error('Error uploading PDF to R2:', error);
    
    // Return error response
    res.status(500).json({
      success: false,
      message: `Error uploading PDF: ${error.message}`,
      error: error.toString()
    });
  }
});

// Make sure we're exporting the router properly
module.exports = router;
