# BarBaby Fitness PDF Form Solution

## Overview

This solution manages the filling, storage, and emailing of BarBaby Fitness's PDF forms:

1. **Registration Form** (`registration_form_modern.pdf`)
2. **Personal Training Agreement** (`personal_training_agreement.pdf`)
3. **Liability Waiver** (`liability_waiver.pdf`)

These forms are stored in Cloudflare R2 and processed when clients submit data through the BarBaby Fitness website.

## Features

- **PDF Form Filling**: Automatically fills camelCase-named form fields with client data
- **Cloudflare R2 Storage**: Stores completed forms in organized folders
- **Email Distribution**: Sends completed forms to both the client and business owner
- **Express Integration**: Easy to integrate with Express.js routes
- **Error Handling**: Robust error handling and logging throughout the process

## Configuration

### Environment Variables

```
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=your-access-key
CLOUDFLARE_R2_SECRET_ACCESS_KEY=your-secret-key
CLOUDFLARE_R2_ENDPOINT=https://your-endpoint.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=barbaby-contracts
CLOUDFLARE_R2_PUBLIC_URL=https://pub-your-bucket.r2.dev

# Email Configuration (for sending completed forms)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

## Workflow

1. Client fills out a form on the website (form fields use camelCase names)
2. Client submits the form, which is sent to the server
3. Server processes the form data:
   - Retrieves the corresponding PDF template from R2
   - Fills the form fields with client data
   - Saves the filled PDF back to R2 in an organized structure
   - Emails the completed form to the client and business owner
4. Server returns success response with form URLs

## Usage Examples

### Basic Express Route Setup

```javascript
import express from 'express';
import { formHandler } from './src/utils/formHandler.js';

const app = express();

// Configure form handler with email settings
formHandler.configure({
  email: {
    host: process.env.EMAIL_HOST,
    port: parseInt(process.env.EMAIL_PORT),
    secure: process.env.EMAIL_SECURE === 'true',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  }
});

// Registration form endpoint (/register page)
app.post(
  '/api/registration',
  express.json(),
  formHandler.processRegistrationForm(),
  formHandler.sendResponse()
);

// Contract and waiver endpoint (/registration-flow/contract-and-waiver page)
app.post(
  '/api/contract-and-waiver',
  express.json(),
  formHandler.processContractAndWaiver(),
  formHandler.sendResponse()
);

app.listen(3002, () => {
  console.log('Server running on port 3002');
});
```

### Direct API Use

For more advanced customization:

```javascript
import { pdfManager } from './src/utils/pdfUtils.js';

// Process a single form
const result = await pdfManager.processForm(
  'registration', // form type: 'registration', 'agreement', or 'waiver'
  clientData,     // client data with camelCase field names
  {
    sendEmail: true,
    saveLocally: process.env.NODE_ENV === 'development'
  }
);

console.log(result.pdfUrl); // URL to the stored PDF
```

## Form Fields

All PDF forms use camelCase field names that match the client form field names. This ensures consistency between what clients fill out online and what's stored in the PDF forms.

## Storage Structure

Completed forms are stored in R2 with this organization:

```
barbaby-contracts/
├── completed-forms/
│   ├── registration/
│   │   └── client-name_timestamp.pdf
│   ├── agreement/
│   │   └── client-name_timestamp.pdf
│   └── waiver/
│       └── client-name_timestamp.pdf
```

This ensures all client forms are properly organized and easily accessible.

## Dependencies

- `@aws-sdk/client-s3`: For Cloudflare R2 operations
- `pdf-lib`: For PDF form filling
- `nodemailer`: For email delivery
- `multer`: For form data parsing in Express middleware
- `express`: For route handling

## Contact

For questions or support, contact the BarBaby Fitness development team.