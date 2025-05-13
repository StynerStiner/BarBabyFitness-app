# BarBaby Fitness Server Update

This directory contains updated server code with enhanced functionality:

1. **server.js** - Enhanced Express server with improved Stripe integration
2. **emails.js** - New email functionality for customer confirmations and admin notifications

## Setup Instructions

1. Install the Resend package: `npm install resend`
2. Add the following to your .env file:
   ```
   RESEND_API_KEY=your_resend_api_key
   ADMIN_EMAIL=admin@barbabyfit.com
   ```

3. To use these updated files, rename the server-update directory to server or copy these files into your existing server directory.
