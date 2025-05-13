/**
 * API functions for uploading filled PDF documents to R2
 */
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3';
import { ContractFormData } from '../services/pdfService';
import { PDFDocument, PDFTextField } from 'pdf-lib';

// Initialize R2 client
const initR2Client = () => {
  console.log('Initializing R2 client with environment variables:');
  console.log(`ENDPOINT: ${import.meta.env.VITE_CLOUDFLARE_R2_ENDPOINT ? 'Set' : 'Not set'}`);
  console.log(`ACCESS_KEY_ID: ${import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID ? 'Set' : 'Not set'}`);
  console.log(`SECRET_ACCESS_KEY: ${import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY ? 'Set' : 'Not set'}`);
  console.log(`BUCKET_NAME: ${import.meta.env.VITE_CLOUDFLARE_R2_BUCKET_NAME ? 'Set' : 'Not set'}`);
  console.log(`PUBLIC_URL: ${import.meta.env.VITE_CLOUDFLARE_R2_PUBLIC_URL ? 'Set' : 'Not set'}`);

  // Log the actual values for debugging (hiding part of the secret)
  const accessKeyId = import.meta.env.VITE_CLOUDFLARE_R2_ACCESS_KEY_ID || '';
  const secretAccessKey = import.meta.env.VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY || '';
  console.log(`Access Key ID: ${accessKeyId ? `${accessKeyId.substring(0, 4)}...${accessKeyId.substring(accessKeyId.length - 4)}` : 'Not set'}`);
  console.log(`Secret Access Key: ${secretAccessKey ? `${secretAccessKey.substring(0, 4)}...${secretAccessKey.substring(secretAccessKey.length - 4)}` : 'Not set'}`);
  
  // Default endpoint if not set in environment variables
  const endpoint = import.meta.env.VITE_CLOUDFLARE_R2_ENDPOINT ||
                  'https://8903e28602247a5bf0543b9dbe1c84e9.r2.cloudflarestorage.com';

  console.log(`Using R2 endpoint: ${endpoint}`);

  return new S3Client({
    region: 'auto',
    endpoint: endpoint,
    credentials: {
      accessKeyId: accessKeyId,
      secretAccessKey: secretAccessKey,
    },
  });
};

/**
 * Fetches a template PDF from R2, local storage, or direct URL
 */
const getTemplatePdfFromR2 = async (templateKey: string): Promise<Uint8Array> => {
  try {
    // Extract just the filename from the template path
    const templateName = templateKey.split('/').pop();

    if (!templateName) {
      throw new Error(`Invalid template key: ${templateKey}`);
    }

    console.log(`Fetching template: ${templateName}`);

    // Try to fetch from local public folder first (for development)
    try {
      const localUrl = `/templates/${templateName}`;
      console.log(`Attempting to fetch template from local public folder: ${localUrl}`);

      const localResponse = await fetch(localUrl, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
          'Cache-Control': 'no-cache, no-store, must-revalidate'
        }
      });

      if (localResponse.ok) {
        const contentType = localResponse.headers.get('Content-Type');
        if (contentType && contentType.includes('application/pdf')) {
          console.log(`Successfully fetched template from local public folder: ${localUrl}`);
          const arrayBuffer = await localResponse.arrayBuffer();
          return new Uint8Array(arrayBuffer);
        }
      }
    } catch (localError) {
      console.log('Local template not found, trying other sources...');
    }

    // Create a proxy endpoint URL for development
    const proxyEndpoint = '/api/proxy-template';

    // Direct URLs to the templates
    const directUrls = [
      // Use the exact R2 URLs
      `https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev/templates/${templateName}`,

      // Fallback URLs if the direct URL fails
      `${proxyEndpoint}?template=${templateName}`,

      // Additional fallbacks
      `${import.meta.env.VITE_SERVER_URL}/upload-contract/template/${templateName}`,
      `http://localhost:3002/upload-contract/template/${templateName}`,
      `https://api.barbabyfitness.com/upload-contract/template/${templateName}`,
      `${window.location.origin}/upload-contract/template/${templateName}`
    ].filter(Boolean); // Remove empty values

    let response: Response | null = null;
    let lastError: Error | null = null; // Allow both Error and null types

    // Try each URL until one works
    for (const url of directUrls) {
      try {
        console.log(`Attempting to fetch template from: ${url}`);

        // Add cache-busting parameter to avoid caching issues
        const urlWithCacheBust = `${url}${url.includes('?') ? '&' : '?'}t=${Date.now()}`;
        response = await fetch(urlWithCacheBust, {
          method: 'GET',
          headers: {
            'Accept': 'application/pdf',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
          }
        });

        if (response.ok) {
          // Check if the response is actually a PDF
          const contentType = response.headers.get('Content-Type');
          if (contentType && contentType.includes('application/pdf')) {
            console.log(`Successfully fetched template from ${url}`);
            break; // Exit the loop if successful
          } else {
            console.warn(`Response from ${url} is not a PDF (${contentType})`);
            lastError = new Error(`Response from ${url} is not a PDF (${contentType})`);
          }
        } else {
          lastError = new Error(`Failed fetch from ${url}: ${response.status} ${response.statusText}`);
        }
      } catch (err) {
        console.warn(`URL ${url} failed:`, err);
        lastError = err as Error;
        // Continue to next URL
      }
    }

    // If we still don't have a valid response after trying all URLs
    if (!response || !response.ok) {
      console.error('All template fetch attempts failed');
      throw lastError || new Error('Failed to fetch template from any URL');
    }

    // Convert the response to an array buffer and then to Uint8Array
    const arrayBuffer = await response.arrayBuffer();

    // Verify that the response is a valid PDF (check for PDF header)
    const bytes = new Uint8Array(arrayBuffer);
    const pdfHeader = '%PDF-';
    const headerBytes = bytes.slice(0, pdfHeader.length);
    const header = String.fromCharCode.apply(null, Array.from(headerBytes));

    if (!header.startsWith(pdfHeader)) {
      console.error('Invalid PDF: Missing PDF header');
      console.error('First 50 bytes:', Array.from(bytes.slice(0, 50)));
      throw new Error('Invalid PDF: Missing PDF header');
    }

    console.log(`Successfully loaded PDF template (${bytes.length} bytes)`);
    return bytes;
  } catch (error) {
    console.error(`Error fetching template PDF: ${templateKey}`, error);
    throw error;
  }
};

/**
 * Converts a string from any format to camelCase
 * e.g., "First Name" → "firstName", "street_address" → "streetAddress"
 */
const toCamelCase = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/[-_\s]+(.)?/g, (_, c) => (c ? c.toUpperCase() : ''))
    .replace(/^(.)/, s => s.toLowerCase());
};

/**
 * Gets a value from an object using a camelCase key, trying various formats
 * Enhanced to handle more variations and support for common field names.
 * Now includes recursion detection.
 */
const getValueByKey = (data: Record<string, any>, key: string, visitedKeysParam?: Set<string>): any => {
  const visitedKeys = visitedKeysParam ? new Set(visitedKeysParam) : new Set<string>();

  if (visitedKeys.has(key)) {
    console.warn(`getValueByKey: Recursive loop detected for key '${key}'. Path: ${Array.from(visitedKeys).join(' -> ')} -> ${key}`);
    return null; // Break recursion
  }
  // Create a new Set for the current path to avoid modifying the set from the caller for parallel branches.
  const currentPathVisitedKeys = new Set(visitedKeys);
  currentPathVisitedKeys.add(key);

  console.log(`getValueByKey: Processing key '${key}'. Path: ${Array.from(currentPathVisitedKeys).join(' -> ')}`);

  // Try direct match
  if (data[key] !== undefined) {
    console.log(`Found direct match for ${key}`);
    return data[key];
  }

  // Try camelCase version
  const camelKey = toCamelCase(key);
  if (data[camelKey] !== undefined) {
    console.log(`Found camelCase match for ${key} as ${camelKey}`);
    return data[camelKey];
  }

  // Try snake_case, dash-case, and other common variants
  const variants = [
    key.replace(/[\s_-]/g, ''), // No spaces or separators
    key.replace(/[\s_-]/g, '_'), // snake_case
    key.replace(/[\s_-]/g, '-'), // dash-case
    key.toLowerCase().replace(/[\s_-]/g, '') // lowercase no separators
  ];

  for (const variant of variants) {
    if (data[variant] !== undefined) {
      console.log(`Found variant match for ${key} as ${variant}`);
      return data[variant];
    }
  }

  // Try combining fields for common composite fields
  if (key.toLowerCase().includes('name') && !key.toLowerCase().includes('first') && !key.toLowerCase().includes('last')) {
    if (data.firstName && data.lastName) {
      console.log(`Creating composite name from firstName and lastName for ${key}`);
      return `${data.firstName} ${data.lastName}`;
    }
  }

  // Try nested objects with expanded prefixes
  const prefixes = [
    'personalInfo.', 'address.', 'selectedPlan.', 'healthMetrics.',
    'medicalInfo.', 'emergencyContact.', 'payment.'
  ];

  for (const prefix of prefixes) {
    try {
      const nestedKey = prefix + camelKey;
      const parts = nestedKey.split('.');
      let current = data;
      let valid = true;
      for (const part of parts) {
        if (current === null || current === undefined || typeof current !== 'object') {
          valid = false;
          break;
        }
        if (Object.prototype.hasOwnProperty.call(current, part)) {
          current = current[part];
        } else {
          valid = false;
          break;
        }
      }
      if (valid) {
        console.log(`Found nested property match for ${key} at ${nestedKey}`);
        return current;
      }
    } catch (err) {
      console.warn(`Error checking nested path for ${key}:`, err);
      // Continue to the next prefix
    }
  }

  // Expanded aliases/mappings (self-referential ones removed for clarity)
  const aliases: Record<string, string> = {
    // Personal information
    'clientName': 'firstName',
    'fullname': 'firstName lastName',
    'name': 'firstName lastName',
    'emailAddress': 'email',
    'phoneNumber': 'phoneNo',
    'phone': 'phoneNo',
    'date': 'signatureDate',
    'today': 'signatureDate',
    'currentDate': 'signatureDate',

    // Address fields
    'address': 'streetAddress',
    'addressLine1': 'streetAddress',
    'addressLine2': 'streetAddress2',
    'province': 'state',
    'zip': 'zipCode',
    'postalCode': 'zipCode',

    // Plan information
    'plan': 'selectedPlan.title',
    'planTitle': 'selectedPlan.title',
    'planName': 'selectedPlan.title',
    'planType': 'selectedPlan.title',
    'planPrice': 'selectedPlan.price',
    'price': 'selectedPlan.price',
    'cost': 'selectedPlan.price',
    'fee': 'selectedPlan.initiationFee',
    'planDuration': 'selectedPlan.duration',
    'duration': 'selectedPlan.duration',
    'planSessions': 'selectedPlan.sessions',
    'sessions': 'selectedPlan.sessions',
    'initiationFee': 'selectedPlan.initiationFee',
    'initiation': 'selectedPlan.initiationFee',

    // Signature fields
    'signature': 'signatureDataURL',
    'clientSignature': 'clientSignatureDataURL',
    'participantSignature': 'participantSignatureDataURL',
    'memberSignature': 'clientSignatureDataURL',
    'customerSignature': 'clientSignatureDataURL'
  };

  // Try to find a matching alias by substring
  let matchedAliasKeySource: string | null = null;
  let matchedAliasTargetValue: string | null = null;
  const normalizedKeyInput = key.toLowerCase().replace(/[-_\s]/g, '');

  for (const [aliasKey, aliasValue] of Object.entries(aliases)) {
    const normalizedAliasKeyFromMap = aliasKey.toLowerCase().replace(/[-_\s]/g, '');
    if (normalizedKeyInput.includes(normalizedAliasKeyFromMap)) {
      matchedAliasKeySource = aliasKey;
      matchedAliasTargetValue = aliasValue;
      break;
    }
  }

  if (matchedAliasTargetValue) {
    console.log(`Found alias match for input key '${key}' (normalized: '${normalizedKeyInput}') using alias map key '${matchedAliasKeySource}' which maps to target '${matchedAliasTargetValue}'`);
    const aliasTargetStr = String(matchedAliasTargetValue);
    if (aliasTargetStr.includes(' ')) {
      const parts = aliasTargetStr.split(' ');
      // Pass currentPathVisitedKeys to recursive calls
      const values = parts.map(part => getValueByKey(data, part, currentPathVisitedKeys)).filter(Boolean);
      return values.join(' ');
    }
    // Pass currentPathVisitedKeys to recursive calls
    return getValueByKey(data, aliasTargetStr, currentPathVisitedKeys);
  }

  // For date fields, provide current date if nothing else matches
  if (normalizedKeyInput.includes('date') || normalizedKeyInput.includes('day') ||
      normalizedKeyInput.includes('month') || normalizedKeyInput.includes('year')) {
    console.log(`Providing current date for ${key} (normalized: ${normalizedKeyInput}) as no other value found.`);
    return new Date().toLocaleDateString('en-US', {
      year: 'numeric', month: 'long', day: 'numeric'
    });
  }

  console.log(`No match found for ${key}`);
  return null;
};

/**
 * Fills a PDF template with form data and signature
 */
const fillPdfTemplate = async (
  templateData: Uint8Array,
  formData: ContractFormData
): Promise<Uint8Array> => {
  try {
    // Verify that templateData is valid
    if (!templateData || templateData.length === 0) {
      throw new Error('Template data is empty or invalid');
    }

    // Check for PDF header
    const pdfHeader = '%PDF-';
    const headerBytes = templateData.slice(0, pdfHeader.length);
    const header = String.fromCharCode.apply(null, Array.from(headerBytes));

    if (!header.startsWith(pdfHeader)) {
      console.error('Invalid PDF template: Missing PDF header');
      console.error('First 50 bytes:', Array.from(templateData.slice(0, 50)));
      throw new Error('Invalid PDF template: Missing PDF header');
    }

    console.log(`Loading PDF document (${templateData.length} bytes)...`);

    // Load the PDF document with additional options for better error handling
    const pdfDoc = await PDFDocument.load(templateData, {
      ignoreEncryption: true,
      updateMetadata: false
    });

    console.log('PDF document loaded successfully');

    // Get form fields (if any)
    const form = pdfDoc.getForm();
    const fields = form.getFields();

    console.log(`PDF has ${fields.length} form fields`);

    // Log all available form fields for debugging
    if (fields.length > 0) {
      console.log('Available form fields:');
      fields.forEach(field => {
        console.log(`- ${field.getName()} (${field.constructor.name})`);
      });
    }

    // Enhanced data logging - log complete form data structure
    console.log('Complete form data for PDF injection:');
    console.log(JSON.stringify(formData, null, 2));

    // If no form fields, create a simple PDF with the data
    if (fields.length === 0) {
      console.log('No form fields found, creating a simple PDF with the data');

      // Get the first page or create one if none exists
      let page = pdfDoc.getPages()[0];
      if (!page) {
        page = pdfDoc.addPage();
      }

      // Add client information to the page with all available data
      const { firstName, lastName, email, phoneNo, selectedPlan } = formData;
      let text = `
        Client Information:
        Name: ${firstName} ${lastName}
        Email: ${email || 'N/A'}
        Phone: ${phoneNo || 'N/A'}
        Date: ${new Date().toLocaleDateString()}
      `;

      // Add plan information if available
      if (selectedPlan) {
        text += `
        
        Selected Plan: ${selectedPlan.title || 'N/A'}
        Price: ${selectedPlan.price || 'N/A'}
        Sessions: ${selectedPlan.sessions || 'N/A'}
        Duration: ${selectedPlan.duration || 'N/A'}
        Initiation Fee: ${selectedPlan.initiationFee || 'N/A'}
        `;
      }

      // Add address information if available
      if (formData.streetAddress || formData.city || formData.state || formData.zipCode) {
        text += `
        
        Address:
        ${formData.streetAddress || 'N/A'}
        ${formData.city || 'N/A'}, ${formData.state || 'N/A'} ${formData.zipCode || 'N/A'}
        `;
      }

      page.drawText(text, {
        x: 50,
        y: page.getHeight() - 100,
        size: 12
      });

      // Add signature if available, trying all possible signature fields
      if (formData.signatureDataURL || formData.clientSignatureDataURL || 
          formData.trainingSignature || formData.liabilitySignature) {
        const signatureToUse = formData.signatureDataURL || formData.clientSignatureDataURL || 
                             formData.trainingSignature || formData.liabilitySignature;
        await addSignatureToPage(pdfDoc, page, signatureToUse, 50, 100);
      }

      return await pdfDoc.save();
    }

    // Enhanced field mapping with structured approach
    // First, create a complete map of field names to their normalized versions
    const fieldMappings: Record<string, string> = {
      // Personal information fields
      'firstName': 'firstName',
      'lastName': 'lastName',
      'name': 'firstName',
      'fullName': 'firstName lastName',
      'clientName': 'firstName lastName',
      'client': 'firstName lastName',
      'email': 'email',
      'emailAddress': 'email',
      'phone': 'phoneNo',
      'phoneNumber': 'phoneNo',
      'phoneNo': 'phoneNo',
      'date': 'signatureDate',
      'signatureDate': 'signatureDate',
      'currentDate': 'signatureDate',

      // Address fields
      'address': 'streetAddress',
      'streetAddress': 'streetAddress',
      'city': 'city',
      'state': 'state',
      'zipCode': 'zipCode',
      'zip': 'zipCode',
      'postalCode': 'zipCode',

      // Plan details
      'plan': 'selectedPlan.title',
      'planTitle': 'selectedPlan.title',
      'planName': 'selectedPlan.title',
      'planPrice': 'selectedPlan.price',
      'price': 'selectedPlan.price',
      'planDuration': 'selectedPlan.duration',
      'duration': 'selectedPlan.duration',
      'planSessions': 'selectedPlan.sessions',
      'sessions': 'selectedPlan.sessions',
      'initiationFee': 'selectedPlan.initiationFee',
      'fee': 'selectedPlan.initiationFee',
      
      // Signature fields handled separately but included for mapping
      'signature': 'signatureDataURL',
      'clientSignature': 'clientSignatureDataURL',
      'participantSignature': 'participantSignatureDataURL',
      'trainerSignature': 'trainerSignatureDataURL',
      'trainingSignature': 'trainingSignature',
      'liabilitySignature': 'liabilitySignature'
    };
    
    // Map form fields and log the mapping for debugging
    console.log('Mapping fields to PDF form:');
    
    for (const field of fields) {
      const fieldName = field.getName();
      console.log(`Processing field: ${fieldName}`);

      // Only process text fields
      if (field instanceof PDFTextField) {
        // Try to find a value using multiple approaches
        let value = null;
        
        // 1. Direct match from formData
        if (formData[fieldName as keyof ContractFormData] !== undefined) {
          value = formData[fieldName as keyof ContractFormData];
        } 
        // 2. Using our mapping table
        else {
          const normalizedFieldName = fieldName.toLowerCase().replace(/[-_\s]/g, '');
          
          // Try to find a match in our mappings
          for (const [mappingKey, mappingTarget] of Object.entries(fieldMappings)) {
            if (normalizedFieldName.includes(mappingKey.toLowerCase())) {
              // Get the value using dot notation if needed
              if (mappingTarget.includes('.')) {
                const [obj, prop] = mappingTarget.split('.');
                const formDataValue = formData[obj as keyof ContractFormData];
                if (formDataValue && typeof formDataValue === 'object') {
                  // Handle object type (like Plan)
                  value = (formDataValue as Record<string, any>)[prop];
                } else {
                  // This branch shouldn't normally execute since we're accessing a property,
                  // but it's included for type safety
                  value = undefined;
                }
              } else {
                value = formData[mappingTarget as keyof ContractFormData];
              }
              
              if (value) {
                console.log(`Matched field ${fieldName} to mapping ${mappingKey} -> ${mappingTarget}`);
                break;
              }
            }
          }
        }
        
        // 3. Using the helper function as fallback
        if (value === null) {
          value = getValueByKey(formData, fieldName);
        }

        // Set the value if we found one
        if (value !== null && value !== undefined) {
          // Format value for special cases
          let formattedValue = value;
          
          // Handle special case for fullName fields
          if (fieldName.toLowerCase().includes('fullname') || fieldName.toLowerCase().includes('name')) {
            if (typeof value === 'string' && !value.includes(' ') && formData.firstName && formData.lastName) {
              formattedValue = `${formData.firstName} ${formData.lastName}`;
            }
          }
          
          // Handle special case for date fields
          if (fieldName.toLowerCase().includes('date') && !formattedValue) {
            formattedValue = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
          }
          
          console.log(`Setting value for field ${fieldName}: ${formattedValue}`);
          field.setText(formattedValue.toString());
        } else {
          console.warn(`No value found for field ${fieldName}`);
          // Set an empty string instead of null to avoid type errors
          field.setText('');
        }
      }
    }

    // Process signatures - try to match signature fields to the right signature data
    await processSignatureFields(pdfDoc, form, fields, formData);

    return await pdfDoc.save();
  } catch (error) {
    console.error('Error filling PDF template:', error);

    // Create a fallback PDF if the template fails
    try {
      console.log('Creating fallback PDF...');
      const fallbackPdf = await PDFDocument.create();
      const page = fallbackPdf.addPage();

      // Add error information
      page.drawText('Error processing template', {
        x: 50,
        y: page.getHeight() - 50,
        size: 16
      });

      // Add client information
      const { firstName, lastName, email, phoneNo } = formData;
      const text = `
        Client Information:
        Name: ${firstName} ${lastName}
        Email: ${email || 'N/A'}
        Phone: ${phoneNo || 'N/A'}
        Date: ${new Date().toLocaleDateString()}

        Error: ${error instanceof Error ? error.message : (typeof error === 'string' ? error : 'Unknown error')}
      `;

      page.drawText(text, {
        x: 50,
        y: page.getHeight() - 100,
        size: 12
      });

      // Add signature if available
      if (formData.signatureDataURL) {
        await addSignatureToPage(fallbackPdf, page, formData.signatureDataURL, 50, 200);
      }

      console.log('Fallback PDF created successfully');
      return await fallbackPdf.save();
    } catch (fallbackError) {
      console.error('Failed to create fallback PDF:', fallbackError);
      throw error; // Throw the original error
    }
  }
};

/**
 * Process signature fields in the PDF and add signature images
 */
const processSignatureFields = async (
  pdfDoc: PDFDocument,
  form: any,
  fields: any[],
  formData: ContractFormData
) => {
  try {
    // Find signature fields based on common naming patterns
    const signatureFieldNames = fields
      .filter(f =>
        f.getName().toLowerCase().includes('signature') ||
        f.getName().toLowerCase().includes('sign')
      )
      .map(f => f.getName());

    if (signatureFieldNames.length === 0) {
      console.log('No signature fields found in form, trying to add signature to fixed positions');

      // Add signature to the first page at a reasonable position
      const pages = pdfDoc.getPages();
      if (pages.length > 0) {
        const page = pages[0];

        // Add signatures if available
        if (formData.signatureDataURL) {
          await addSignatureToPage(pdfDoc, page, formData.signatureDataURL, 100, 200);
        }

        // Add other signatures if available (client, trainer, participant)
        if (formData.clientSignatureDataURL || formData.clientSignature) {
          await addSignatureToPage(
            pdfDoc,
            page,
            formData.clientSignatureDataURL || formData.clientSignature,
            100, 150
          );
        }

        if (formData.participantSignatureDataURL || formData.participantSignature) {
          await addSignatureToPage(
            pdfDoc,
            page,
            formData.participantSignatureDataURL || formData.participantSignature,
            100, 100
          );
        }
      }
      return;
    }

    // Process each signature field
    for (const fieldName of signatureFieldNames) {
      console.log(`Processing signature field: ${fieldName}`);

      // Determine which signature to use based on field name
      let signatureDataURL = formData.signatureDataURL; // Default signature

      if (fieldName.toLowerCase().includes('client')) {
        signatureDataURL = formData.clientSignatureDataURL || formData.clientSignature || signatureDataURL;
      } else if (fieldName.toLowerCase().includes('participant')) {
        signatureDataURL = formData.participantSignatureDataURL || formData.participantSignature || signatureDataURL;
      } else if (fieldName.toLowerCase().includes('trainer')) {
        signatureDataURL = formData.trainerSignatureDataURL || formData.trainerSignature || signatureDataURL;
      }

      if (!signatureDataURL) {
        console.log(`No signature available for field: ${fieldName}`);
        continue;
      }

      try {
        // Get the field's position and page
        const field = form.getTextField(fieldName);
        const fieldData = field.acroField;
        const page = pdfDoc.getPages()[fieldData.page.nodeRef.objectNumber - 1];

        // Hide the original field as we'll be adding the image
        field.setText('');

        // Get the widget coordinates for the field
        const widgets = fieldData.getWidgets();
        if (widgets.length > 0) {
          const widget = widgets[0];
          const rect = widget.getRectangle();

          // Add the signature image at the field position
          await addSignatureToPage(
            pdfDoc,
            page,
            signatureDataURL,
            rect.x,
            rect.y,
            rect.width,
            rect.height
          );
        }
      } catch (error) {
        console.error(`Error adding signature to field ${fieldName}:`, error);
      }
    }
  } catch (error) {
    console.error('Error processing signature fields:', error);
  }
};

/**
 * Add signature image to a specific position on a PDF page
 */
const addSignatureToPage = async (
  pdfDoc: PDFDocument,
  page: any,
  signatureDataURL: string | undefined,
  x: number,
  y: number,
  width?: number,
  height?: number
) => {
  try {
    // Skip if no signature data is provided
    if (!signatureDataURL) return;

    // Extract the base64 data (removing the data URL prefix if present)
    let signatureData = signatureDataURL;
    if (signatureDataURL.includes('base64,')) {
      signatureData = signatureDataURL.split('base64,')[1];
    }

    if (!signatureData) return;

    // Determine if PNG or JPEG based on data URL
    let signatureImage;
    if (signatureDataURL.includes('image/png')) {
      signatureImage = await pdfDoc.embedPng(Buffer.from(signatureData, 'base64'));
    } else if (signatureDataURL.includes('image/jpeg') || signatureDataURL.includes('image/jpg')) {
      signatureImage = await pdfDoc.embedJpg(Buffer.from(signatureData, 'base64'));
    } else {
      // Default to PNG if unsure
      signatureImage = await pdfDoc.embedPng(Buffer.from(signatureData, 'base64'));
    }

    // Calculate appropriate size for the signature
    const imgDims = signatureImage.scale(0.5); // Scale down to 50%

    // Use provided dimensions or calculate based on image aspect ratio
    const sigWidth = width || imgDims.width;
    const sigHeight = height || (sigWidth * (imgDims.height / imgDims.width));

    // Draw the signature image
    page.drawImage(signatureImage, {
      x,
      y,
      width: sigWidth,
      height: sigHeight,
    });

    console.log(`Signature added to page at (${x}, ${y})`);
  } catch (error) {
    console.error('Error adding signature to page:', error);
  }
};

/**
 * Uploads a PDF to R2 and returns the public URL
 * Enhanced version with better error handling and metadata
 */
const uploadPdfToR2 = async (
  pdfBuffer: Uint8Array,
  formData: ContractFormData,
  type: 'registration' | 'trainingAgreement' | 'liabilityWaiver'
): Promise<string> => {
  try {
    // Validate formData before proceeding
    if (!formData.firstName || !formData.lastName || !formData.email) {
      console.error('Missing required client information:', {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
      });
      throw new Error('Client information is incomplete. Please ensure all required fields are provided.');
    }

    // Log formData for debugging (exclude large signature data for clarity)
    console.log('FormData received for PDF upload:', {
      ...formData,
      signatureDataURL: formData.signatureDataURL ? '[Signature data present]' : '[No signature data]',
      clientSignatureDataURL: formData.clientSignatureDataURL ? '[Signature data present]' : '[No signature data]',
      participantSignatureDataURL: formData.participantSignatureDataURL ? '[Signature data present]' : '[No signature data]',
      trainingSignature: formData.trainingSignature ? '[Signature data present]' : '[No signature data]',
      liabilitySignature: formData.liabilitySignature ? '[Signature data present]' : '[No signature data]',
    });
    
    // Generate a unique file name with client name and timestamp
    const timestamp = Date.now();
    const clientName = `${formData.firstName}-${formData.lastName}`;
    
    // Verify the PDF buffer is valid before uploading
    if (!pdfBuffer || pdfBuffer.length < 100 || !isPdfValidBuffer(pdfBuffer)) {
      console.error('Invalid PDF buffer - PDF data appears to be corrupted or incomplete');
      throw new Error('PDF generation failed - invalid PDF data');
    }
    
    // Import the uploadPdfToR2 function from upload-proxy
    const { uploadPdfToR2: proxyUploadPdf } = await import('./upload-proxy');
    
    // Additional metadata for the PDF
    const metadata = {
      'document-type': type,
      'client-name': `${formData.firstName} ${formData.lastName}`,
      'client-email': formData.email,
      'client-phone': formData.phoneNo || 'not-provided',
      'plan-name': formData.selectedPlan?.title || 'not-provided',
      'creation-date': new Date().toISOString(),
    };
    
    // Upload via the proxy service which avoids CORS issues
    const publicUrl = await proxyUploadPdf(pdfBuffer, type, clientName, metadata);
    
    console.log(`Uploaded ${type} PDF via server proxy:`, publicUrl);
    return publicUrl;
  } catch (error) {
    console.error(`Error uploading ${type} PDF via server proxy:`, error);
    
    // Try fallback - use local storage temporarily
    try {
      console.log('Attempting fallback storage solution - saving to local storage');
      const fallbackKey = `pdf_${type}_${Date.now()}`;
      const pdfBase64 = btoa(String.fromCharCode.apply(null, Array.from(pdfBuffer)));
      localStorage.setItem(fallbackKey, pdfBase64);
      
      console.log(`PDF temporarily saved to local storage with key: ${fallbackKey}`);
      console.log(`Warning: This is a temporary solution and PDFs will be lost when browser storage is cleared`);
      
      // Generate fallback URL with warning
      const fallbackUrl = `data:application/pdf;base64,${pdfBase64}`;
      console.log(`Fallback URL generated. This is NOT a persistent URL.`);
      
      return fallbackUrl;
    } catch (fallbackError) {
      console.error('Fallback storage also failed:', fallbackError);
      throw error;
    }
  }
};

/**
 * Checks if a buffer is a valid PDF by looking for the PDF header
 */
const isPdfValidBuffer = (buffer: Uint8Array): boolean => {
  if (buffer.length < 5) return false;
  
  // Check for PDF header %PDF-
  const header = String.fromCharCode.apply(null, Array.from(buffer.slice(0, 5)));
  return header === '%PDF-';
};

/**
 * Saves a reference to the uploaded document for tracking purposes
 */
const saveDocumentReference = async (
  r2Client: S3Client, 
  bucketName: string, 
  docInfo: {
    type: string;
    clientName: string;
    clientEmail: string;
    filePath: string;
    publicUrl: string;
    timestamp: string;
  }
) => {
  try {
    const trackingKey = 'document-tracking/uploaded-documents.json';
    
    // Try to get existing tracking data
    let existingData: any[] = [];
    try {
      const { GetObjectCommand } = await import('@aws-sdk/client-s3');
      const getCommand = new GetObjectCommand({
        Bucket: bucketName,
        Key: trackingKey,
      });
      
      const response = await r2Client.send(getCommand);
      const bodyContents = await response.Body?.transformToString();
      if (bodyContents) {
        existingData = JSON.parse(bodyContents);
      }
    } catch (err) {
      console.log('No existing tracking file found, creating new one');
    }
    
    // Add new document reference
    existingData.push({
      ...docInfo,
      uploadedAt: new Date().toISOString()
    });
    
    // Save updated tracking data
    const putCommand = new PutObjectCommand({
      Bucket: bucketName,
      Key: trackingKey,
      Body: JSON.stringify(existingData, null, 2),
      ContentType: 'application/json',
    });
    
    await r2Client.send(putCommand);
    console.log('Document reference saved to tracking file');
  } catch (err) {
    console.error('Error saving document reference:', err);
    // Non-blocking - don't throw
  }
};

/**
 * Main function to fill and upload all contract PDFs
 * Enhanced with better error handling, data validation, and detailed logging
 */
export const fillAndUploadContractPdfs = async (
  formData: ContractFormData
): Promise<{
  registrationUrl: string;
  trainingAgreementUrl: string;
  liabilityWaiverUrl: string;
}> => {
  console.log('Starting fillAndUploadContractPdfs process...');
  
  // Check if formData is null or undefined
  if (!formData) {
    console.error('FormData is null or undefined');
    throw new Error('Cannot process contracts: Form data is missing');
  }
  
  // Ensure required fields are present
  const requiredFields = ['firstName', 'lastName', 'email'];
  const missingFields = requiredFields.filter(field => !formData[field as keyof ContractFormData]);
  
  if (missingFields.length > 0) {
    console.error(`Required fields missing: ${missingFields.join(', ')}`);
    throw new Error(`Cannot process contracts: Required fields missing (${missingFields.join(', ')})`);
  }
  
  console.log('Form data received:');
  console.log(JSON.stringify({
    ...formData,
    // Exclude large signature data for clearer logs
    signatureDataURL: formData.signatureDataURL ? '[Signature data present]' : undefined,
    clientSignatureDataURL: formData.clientSignatureDataURL ? '[Signature data present]' : undefined,
    participantSignatureDataURL: formData.participantSignatureDataURL ? '[Signature data present]' : undefined,
    trainingSignature: formData.trainingSignature ? '[Signature data present]' : undefined,
    liabilitySignature: formData.liabilitySignature ? '[Signature data present]' : undefined,
  }, null, 2));

  // Define template paths with exact R2 URLs
  const templatePaths = {
    registration: 'https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev/templates/registration_form_template.pdf',
    trainingAgreement: 'https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev/templates/training_agreement_template.pdf',
    liabilityWaiver: 'https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev/templates/liability_waiver_template.pdf',
  };

  // First, let's validate and normalize the formData to ensure all required fields exist
  formData = validateAndNormalizeFormData(formData);

  // Create simplified fallback PDF function
  const createFallbackPdf = async (
    type: string,
    formData: ContractFormData,
    errorMessage?: string
  ): Promise<Uint8Array> => {
    console.log(`Creating fallback PDF for ${type}...`);
    const fallbackPdf = await PDFDocument.create();
    const page = fallbackPdf.addPage();

    // Add a professional header
    page.drawText(`${type.charAt(0).toUpperCase() + type.slice(1)} Document`, {
      x: 50,
      y: page.getHeight() - 50,
      size: 20
    });

    // Add subtitle with date
    page.drawText(`Generated on ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: page.getHeight() - 80,
      size: 12
    });

    // Add separator line
    page.drawLine({
      start: { x: 50, y: page.getHeight() - 100 },
      end: { x: page.getWidth() - 50, y: page.getHeight() - 100 },
      thickness: 2
    });

    // Add client information
    const { firstName, lastName, email, phoneNo, selectedPlan, streetAddress, city, state, zipCode } = formData;
    
    // Client section header
    page.drawText('CLIENT INFORMATION', {
      x: 50,
      y: page.getHeight() - 130,
      size: 14
    });

    // Client data
    page.drawText(`Name: ${firstName} ${lastName}`, {
      x: 50,
      y: page.getHeight() - 155,
      size: 12
    });
    
    page.drawText(`Email: ${email || 'N/A'}`, {
      x: 50,
      y: page.getHeight() - 175,
      size: 12
    });
    
    page.drawText(`Phone: ${phoneNo || 'N/A'}`, {
      x: 50,
      y: page.getHeight() - 195,
      size: 12
    });

    // Set current Y position for next section
    let currentY = page.getHeight() - 225;

    // Address section (if available)
    if (streetAddress || city || state || zipCode) {
      page.drawText('ADDRESS', {
        x: 50,
        y: currentY,
        size: 14
      });
      
      currentY -= 25;
      
      if (streetAddress) {
        page.drawText(`${streetAddress}`, {
          x: 50,
          y: currentY,
          size: 12
        });
        currentY -= 20;
      }
      
      if (city || state || zipCode) {
        page.drawText(`${city || 'N/A'}, ${state || ''} ${zipCode || ''}`, {
          x: 50,
          y: currentY,
          size: 12
        });
        currentY -= 20;
      }
      
      currentY -= 20; // Extra space
    }

    // Plan section (if available)
    if (selectedPlan) {
      page.drawText('PLAN DETAILS', {
        x: 50,
        y: currentY,
        size: 14
      });
      
      currentY -= 25;
      
      if (selectedPlan.title) {
        page.drawText(`Plan: ${selectedPlan.title}`, {
          x: 50,
          y: currentY,
          size: 12
        });
        currentY -= 20;
      }
      
      if (selectedPlan.price) {
        page.drawText(`Price: ${selectedPlan.price}`, {
          x: 50,
          y: currentY,
          size: 12
        });
        currentY -= 20;
      }
      
      if (selectedPlan.sessions) {
        page.drawText(`Sessions: ${selectedPlan.sessions}`, {
          x: 50,
          y: currentY,
          size: 12
        });
        currentY -= 20;
      }
      
      if (selectedPlan.duration) {
        page.drawText(`Duration: ${selectedPlan.duration}`, {
          x: 50,
          y: currentY,
          size: 12
        });
        currentY -= 20;
      }
      
      if (selectedPlan.initiationFee) {
        page.drawText(`Initiation Fee: ${selectedPlan.initiationFee}`, {
          x: 50,
          y: currentY,
          size: 12
        });
        currentY -= 20;
      }
      
      currentY -= 30; // Extra space
    } else {
      currentY -= 30;
    }

    // Add error message if provided
    if (errorMessage) {
      page.drawText('NOTICE', {
        x: 50,
        y: currentY,
        size: 14
      });
      
      currentY -= 25;
      
      page.drawText('This is a fallback document created because the original template could not be processed.', {
        x: 50,
        y: currentY,
        size: 10
      });
      
      currentY -= 15;
      
      page.drawText(`Error: ${errorMessage}`, {
        x: 50,
        y: currentY,
        size: 10
      });
      
      currentY -= 30;
    }

    // Add signature section
    page.drawText('SIGNATURE', {
      x: 50,
      y: currentY,
      size: 14
    });
    
    currentY -= 25;
    
    // Add date line
    page.drawText(`Date: ${new Date().toLocaleDateString()}`, {
      x: 50,
      y: currentY,
      size: 12
    });
    
    currentY -= 20;
    
    // Add signature if available - try all signature fields
    const signatureToUse = formData.signatureDataURL || 
                         formData.clientSignatureDataURL || 
                         formData.trainingSignature ||
                         formData.liabilitySignature || 
                         formData.participantSignatureDataURL;
    
    if (signatureToUse) {
      await addSignatureToPage(fallbackPdf, page, signatureToUse, 50, currentY - 60, 200, 60);
      currentY -= 70;
    } else {
      // If no signature available, draw a signature line
      page.drawLine({
        start: { x: 50, y: currentY - 30 },
        end: { x: 250, y: currentY - 30 },
        thickness: 1
      });
      
      page.drawText('Client Signature', {
        x: 50,
        y: currentY - 45,
        size: 10
      });
      
      currentY -= 55;
    }

    // Add footer
    const footerText = `BarBaby Fitness - ${type.charAt(0).toUpperCase() + type.slice(1)} Document - Generated on ${new Date().toLocaleDateString()}`;
    page.drawText(footerText, {
      x: page.getWidth() / 2 - footerText.length * 2.5, // Approximate centering
      y: 30,
      size: 10
    });

    console.log(`Fallback PDF for ${type} created successfully`);
    return await fallbackPdf.save();
  };

  // Process templates in parallel for better performance
  console.log('Fetching and processing templates...');
  
  const results = await Promise.allSettled([
    // Registration template processing
    (async () => {
      try {
        console.log('Fetching registration template...');
        const template = await getTemplatePdfFromR2(templatePaths.registration);
        console.log('Filling registration template with data...');
        const filled = await fillPdfTemplate(template, formData);
        console.log('Uploading filled registration template...');
        const url = await uploadPdfToR2(filled, formData, 'registration');
        console.log('Registration processing complete:', url);
        return { type: 'registration', url };
      } catch (error) {
        console.error('Error processing registration template:', error);
        const fallback = await createFallbackPdf('registration', formData, 
          error instanceof Error ? error.message : 'Unknown error processing registration');
        const url = await uploadPdfToR2(fallback, formData, 'registration')
          .catch(uploadErr => {
            console.error('Failed to upload fallback registration PDF:', uploadErr);
            return `error://registration-upload-failed-${Date.now()}`;
          });
        return { type: 'registration', url, fallback: true };
      }
    })(),
    
    // Training agreement template processing
    (async () => {
      try {
        console.log('Fetching training agreement template...');
        const template = await getTemplatePdfFromR2(templatePaths.trainingAgreement);
        console.log('Filling training agreement template with data...');
        const filled = await fillPdfTemplate(template, formData);
        console.log('Uploading filled training agreement template...');
        const url = await uploadPdfToR2(filled, formData, 'trainingAgreement');
        console.log('Training agreement processing complete:', url);
        return { type: 'trainingAgreement', url };
      } catch (error) {
        console.error('Error processing training agreement template:', error);
        const fallback = await createFallbackPdf('training agreement', formData, 
          error instanceof Error ? error.message : 'Unknown error processing training agreement');
        const url = await uploadPdfToR2(fallback, formData, 'trainingAgreement')
          .catch(uploadErr => {
            console.error('Failed to upload fallback training agreement PDF:', uploadErr);
            return `error://training-agreement-upload-failed-${Date.now()}`;
          });
        return { type: 'trainingAgreement', url, fallback: true };
      }
    })(),
    
    // Liability waiver template processing
    (async () => {
      try {
        console.log('Fetching liability waiver template...');
        const template = await getTemplatePdfFromR2(templatePaths.liabilityWaiver);
        console.log('Filling liability waiver template with data...');
        const filled = await fillPdfTemplate(template, formData);
        console.log('Uploading filled liability waiver template...');
        const url = await uploadPdfToR2(filled, formData, 'liabilityWaiver');
        console.log('Liability waiver processing complete:', url);
        return { type: 'liabilityWaiver', url };
      } catch (error) {
        console.error('Error processing liability waiver template:', error);
        const fallback = await createFallbackPdf('liability waiver', formData, 
          error instanceof Error ? error.message : 'Unknown error processing liability waiver');
        const url = await uploadPdfToR2(fallback, formData, 'liabilityWaiver')
          .catch(uploadErr => {
            console.error('Failed to upload fallback liability waiver PDF:', uploadErr);
            return `error://liability-waiver-upload-failed-${Date.now()}`;
          });
        return { type: 'liabilityWaiver', url, fallback: true };
      }
    })()
  ]);
  
  // Extract URLs from results
  let registrationUrl = 'error://registration-missing';
  let trainingAgreementUrl = 'error://training-agreement-missing';
  let liabilityWaiverUrl = 'error://liability-waiver-missing';
  
  let fallbackUsed = false;
  
  results.forEach((result, index) => {
    if (result.status === 'fulfilled') {
      const { type, url, fallback } = result.value;
      if (fallback) fallbackUsed = true;
      
      switch(type) {
        case 'registration':
          registrationUrl = url;
          break;
        case 'trainingAgreement':
          trainingAgreementUrl = url;
          break;
        case 'liabilityWaiver':
          liabilityWaiverUrl = url;
          break;
      }
    }
  });

  // Log all URLs for debugging
  console.log('Final URLs:');
  console.log('- Registration:', registrationUrl);
  console.log('- Training Agreement:', trainingAgreementUrl);
  console.log('- Liability Waiver:', liabilityWaiverUrl);
  
  if (fallbackUsed) {
    console.warn('One or more fallback PDFs were used due to processing errors.');
  }

  console.log('PDF processing completed');

  // Return URLs to all uploaded PDFs
  return {
    registrationUrl,
    trainingAgreementUrl,
    liabilityWaiverUrl,
  };
};

/**
 * Validates and normalizes form data to ensure all required fields exist
 */
const validateAndNormalizeFormData = (formData: ContractFormData): ContractFormData => {
  const normalizedData = { ...formData };
  
  // Ensure required personal fields exist
  normalizedData.firstName = normalizedData.firstName || '';
  normalizedData.lastName = normalizedData.lastName || '';
  normalizedData.email = normalizedData.email || '';
  normalizedData.phoneNo = normalizedData.phoneNo || '';
  
  // Address fields
  normalizedData.streetAddress = normalizedData.streetAddress || '';
  normalizedData.city = normalizedData.city || '';
  normalizedData.state = normalizedData.state || '';
  normalizedData.zipCode = normalizedData.zipCode || '';
  
  // Ensure plan data is structured correctly
  if (!normalizedData.selectedPlan) {
    // Create a default plan structure with all required fields
    normalizedData.selectedPlan = {
      id: '',
      title: '',
      price: '',
      sessions: '',
      duration: '',
      initiationFee: '',
      perks: '',
      icon: null,
      features: []
    };
  } else {
    // Since selectedPlan can be a Plan or string, we need to carefully handle it
    const plan = normalizedData.selectedPlan as any;
    
    // Ensure all required fields exist
    if (typeof plan === 'object') {
      plan.id = plan.id || '';
      plan.title = plan.title || '';
      plan.price = plan.price || '';
      plan.sessions = plan.sessions || '';
      plan.duration = plan.duration || '';
      plan.initiationFee = plan.initiationFee || '';
      plan.perks = plan.perks || '';
      plan.features = plan.features || [];
      
      // If icon is undefined, set it to null (ReactNode)
      if (plan.icon === undefined) {
        plan.icon = null;
      }
    } else {
      // If plan is not an object, create a proper one
      normalizedData.selectedPlan = {
        id: '',
        title: String(plan || ''),  // Use the string value as the title
        price: '',
        sessions: '',
        duration: '',
        initiationFee: '',
        perks: '',
        icon: null,
        features: []
      };
    }
  }
  
  // Ensure signature date exists
  if (!normalizedData.signatureDate) {
    normalizedData.signatureDate = new Date().toLocaleDateString('en-US', { 
      year: 'numeric', month: 'long', day: 'numeric' 
    });
  }
  
  return normalizedData;
};

// Export individual functions for testing and flexibility
export {
  getTemplatePdfFromR2,
  fillPdfTemplate,
  uploadPdfToR2,
};
