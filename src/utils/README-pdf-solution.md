# PDF Processing and R2 Storage Solution

A focused solution for filling PDF forms and saving to Cloudflare R2 storage.

## Overview

This solution provides a robust way to:

1. Fill PDF forms with client data
2. Save completed PDFs to Cloudflare R2 storage
3. Process one or multiple PDFs in a batch
4. Support PDF templates from both R2 and local storage
5. Work with Express routes via middleware

## Components

### 1. CloudflareR2PDFManager Class (`pdfUtils.js`)

The core utility class that handles:
- PDF template retrieval (from R2 or local fallback)
- Form filling using pdf-lib
- Saving to Cloudflare R2
- Document type detection

### 2. Express Middleware (`pdfMiddleware.js`)

Integration with Express routes:
- Form data handling
- Contract processing
- Signature handling
- Response formatting

### 3. Usage Examples

- `pdf-manager-example.js`: Standalone usage examples
- `pdf-route-example.js`: Express route integration examples

## Configuration

The solution uses the following environment variables:

```
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_ENDPOINT=https://your-account.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=your-bucket-name
CLOUDFLARE_R2_PUBLIC_URL=https://pub-your-bucket.r2.dev
```

## Usage Examples

### Basic Usage

```javascript
import { pdfManager } from './src/utils/pdfUtils.js';

// Process a single PDF
const result = await pdfManager.processAndSavePdf(
  'template_name.pdf',    // Template name in R2
  clientData,             // Form data to fill
  {
    documentType: 'contract',
    localTemplatePath: './templates/template_name.pdf',  // Fallback
  }
);

console.log(result.url); // Public URL of the filled PDF
```

### Express Route Integration

```javascript
import express from 'express';
import { pdfProcessor } from './src/utils/pdfMiddleware.js';

const app = express();

app.post(
  '/api/create-contracts',
  pdfProcessor.handleFormUpload(),
  pdfProcessor.processContracts(),
  pdfProcessor.sendResponse()
);

app.listen(3000);
```

## Benefits

- **Reliability**: Handles R2 errors with local file fallbacks
- **Flexibility**: Process single documents or batches
- **Integration**: Simple to add to existing Express routes
- **Debugging**: Optional local file saving for troubleshooting
- **Maintainability**: Clean, modular design with separation of concerns

## Dependencies

- `@aws-sdk/client-s3`: For R2 storage operations
- `pdf-lib`: For PDF form manipulation
- `multer`: For handling multipart form data (in the middleware)