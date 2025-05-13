# BarBaby Fitness PDF Form Solution

## Overview

This solution manages PDF forms for BarBaby Fitness, focusing on three specific forms:

1. **Registration Form** - `registration_form_modern.pdf`
2. **Personal Training Agreement** - `personal_training_agreement.pdf`
3. **Liability Waiver** - `liability_waiver.pdf`

When clients submit forms on the website, this system:
- Fills the PDF forms with client data
- Saves completed forms to Cloudflare R2 in an organized structure
- Emails copies to the client and business owner

## Cloudflare R2 Structure

The solution works with your existing R2 bucket structure:

```
barbaby-contracts/
├── registration_form_modern.pdf        (template in root)
├── personal_training_agreement.pdf     (template in root)
├── liability_waiver.pdf                (template in root)
└── completed-forms/
    ├── registration/                   (filled registration forms)
    ├── agreement/                      (filled agreements)
    └── waiver/                         (filled waivers)
```

## Quick Start

1. **Install dependencies**:
   ```bash
   npm install @aws-sdk/client-s3 pdf-lib nodemailer express cors dotenv multer
   ```

2. **Create test templates** (if needed):
   ```bash
   node create-test-templates.js
   ```

3. **Verify setup**:
   ```bash
   node verify-r2-forms.js
   ```

4. **Start the server**:
   ```bash
   node form-server.js
   ```

## Form Submission Endpoints

Use these endpoints in your frontend:

- **Registration Form** (used on `/register`):
  ```
  POST http://localhost:3003/api/registration
  ```

- **Training Agreement & Liability Waiver** (used on `/registration-flow/contract-and-waiver`):
  ```
  POST http://localhost:3003/api/contract-and-waiver
  ```

- **Individual Forms** (if needed):
  ```
  POST http://localhost:3003/api/training-agreement
  POST http://localhost:3003/api/liability-waiver
  ```

## Form Field Naming

All forms use camelCase field names that exactly match the field names in your online forms, ensuring data is mapped correctly between your website and the PDFs.

## Configuration (.env)

```
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=8903e28602247a5bf0543b9dbe1c84e9
CLOUDFLARE_R2_SECRET_ACCESS_KEY=***REMOVED***
CLOUDFLARE_R2_ENDPOINT=https://8903e28602247a5bf0543b9dbe1c84e9.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=barbaby-contracts
CLOUDFLARE_R2_PUBLIC_URL=https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev

# Email Configuration (Add your email service details)
EMAIL_HOST=smtp.example.com
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password

# Business Email (for notifications)
BUSINESS_EMAIL=adm.barbabyfitness@gmail.com

# Server Configuration
PORT=3003

# Environment
NODE_ENV=development
```

## Email Notifications

When email is configured, the system automatically sends:
1. A copy to the client (using their provided email)
2. A copy to the business owner (`adm.barbabyfitness@gmail.com`)

## Key Components

- **pdfUtils.js**: Core PDF filling and R2 storage functionality
- **formHandler.js**: Express middleware for handling form submissions
- **form-server.js**: Standalone Express server to process forms
- **create-test-templates.js**: Utility to create test PDF templates
- **verify-r2-forms.js**: Verification script to test your setup

## Debug Features

In development mode, the system:
- Saves local copies of processed PDFs in `./debug-pdfs/`
- Creates detailed logs of form processing 
- Provides explicit error messages

## Troubleshooting

If you encounter issues:

1. **R2 Connection Problems**:
   - Check that your .env file has the correct credentials
   - Ensure the bucket exists and permissions are set correctly

2. **Template Not Found**:
   - Make sure templates are in the ROOT of your R2 bucket
   - Run `create-test-templates.js` to generate and upload templates

3. **Port Already in Use**:
   - Change the PORT in .env to an available port

4. **Check Local Copies**:
   - Look in `./debug-pdfs/` for local copies of processed forms

## Frontend Integration Example

```javascript
// Example of form submission
async function submitRegistrationForm(formData) {
  try {
    const response = await fetch('http://localhost:3003/api/registration', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(formData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      // Show success message
      console.log('Form submitted successfully!');
      console.log('Form URL:', result.forms[0].url);
    } else {
      // Handle error
      console.error('Error submitting form:', result.error);
    }
    
    return result;
  } catch (error) {
    console.error('Error:', error);
  }
}
```