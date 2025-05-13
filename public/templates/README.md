# Local PDF Templates

This directory is for storing local copies of PDF templates for development purposes.

## How to use

1. Download the PDF templates from Cloudflare R2:
   - `registration_form_template.pdf`
   - `training_agreement_template.pdf`
   - `liability_waiver_template.pdf`

2. Place them in this directory.

3. The application will automatically use these local templates during development, avoiding CORS issues with Cloudflare R2.

## Template Requirements

- File names must match exactly as listed above
- Files must be valid PDF documents
- Files should be placed directly in this directory (not in subdirectories)

## Why use local templates?

When developing locally, direct browser requests to Cloudflare R2 will be blocked by CORS policies. Using local templates avoids these issues and allows for faster development.

In production, the application will use the templates stored in Cloudflare R2.
