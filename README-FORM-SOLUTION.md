# BarBaby Fitness PDF Form Solution

## Overview

This solution provides a complete system for handling BarBaby Fitness client form submissions, filling PDF forms, and storing them in Cloudflare R2. It's designed to work with three specific PDF forms:

1. **Registration Form:** `registration_form_modern.pdf`
2. **Personal Training Agreement:** `personal_training_agreement.pdf`
3. **Liability Waiver:** `liability_waiver.pdf`

## Folder Structure

The Cloudflare R2 bucket is organized as follows:

```
barbaby-contracts/
├── registration_form_modern.pdf        (template)
├── personal_training_agreement.pdf     (template)
├── liability_waiver.pdf                (template)
└── completed-forms/
    ├── registration/                   (filled registration forms)
    ├── agreement/                      (filled agreements)
    └── waiver/                         (filled waivers)
```

## Implementation Details

### 1. Submission Workflow

When a client submits a form on the website:

1. Client data with camelCase field names is sent to the server
2. The server retrieves the appropriate PDF template from R2
3. Form fields are filled with client data (exact camelCase field matching)
4. The completed PDF is saved to R2 in the appropriate subfolder
5. Email copies are sent to:
   - The client (using their provided email)
   - The business owner (adm.barbabyfitness@gmail.com)

### 2. API Endpoints

The solution provides these API endpoints:

- **POST /api/registration**
  - Used on: `/register` page
  - Processes: `registration_form_modern.pdf`

- **POST /api/contract-and-waiver**
  - Used on: `/registration-flow/contract-and-waiver` page
  - Processes both: `personal_training_agreement.pdf` and `liability_waiver.pdf`

- **POST /api/training-agreement** (individual endpoint if needed)
  - Processes: `personal_training_agreement.pdf`

- **POST /api/liability-waiver** (individual endpoint if needed)
  - Processes: `liability_waiver.pdf`

### 3. Key Files

- **`src/utils/pdfUtils.js`**: Core PDF handling functionality
- **`src/utils/formHandler.js`**: Express middleware for form handling
- **`form-server.js`**: Ready-to-use Express server implementation
- **`test-barbaby-forms.js`**: Test script for verification

## Setup Instructions

1. **Environment Variables**

Create a `.env` file with:

```
# Cloudflare R2 Configuration
CLOUDFLARE_R2_ACCESS_KEY_ID=8903e28602247a5bf0543b9dbe1c84e9
CLOUDFLARE_R2_SECRET_ACCESS_KEY=***REMOVED***
CLOUDFLARE_R2_ENDPOINT=https://8903e28602247a5bf0543b9dbe1c84e9.r2.cloudflarestorage.com
CLOUDFLARE_R2_BUCKET_NAME=barbaby-contracts
CLOUDFLARE_R2_PUBLIC_URL=https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev

# Email Configuration (for sending completed forms)
EMAIL_HOST=your-smtp-host
EMAIL_PORT=587
EMAIL_SECURE=false
EMAIL_USER=your-email@example.com
EMAIL_PASSWORD=your-password
```

2. **Installation**

```bash
# Install dependencies
npm install @aws-sdk/client-s3 pdf-lib nodemailer express cors dotenv multer
```

3. **Run the Server**

```bash
# Start the form processing server
node form-server.js
```

## Testing

Run the test script to verify the solution:

```bash
node test-barbaby-forms.js
```

This will:
1. Fetch each PDF template from R2
2. Fill it with test data
3. Save filled versions to R2
4. Create local copies for visual verification

## Frontend Integration

Update your frontend form submissions to point to the new endpoints:

```javascript
// Example: Registration form submission
async function submitRegistrationForm(formData) {
  const response = await fetch('/api/registration', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const result = await response.json();
  return result;
}

// Example: Contract and waiver submission
async function submitContractAndWaiver(formData) {
  const response = await fetch('/api/contract-and-waiver', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(formData)
  });
  
  const result = await response.json();
  return result;
}
```

## Important Notes

1. **Field Naming**: All form fields use camelCase naming that matches between frontend forms and PDF forms
2. **PDF Templates**: The solution uses the exact PDF files in your R2 bucket root
3. **Storage**: Completed forms are saved to `/completed-forms/{formType}/` in R2
4. **Emails**: Both the client and business owner receive copies of all completed forms

## Support

For questions or support, contact the development team.