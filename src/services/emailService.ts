import { Plan } from "@/pages/TrainingOptions/components/types";

// Use environment variables instead of hardcoded values
const RESEND_API_KEY = import.meta.env.VITE_RESEND_API_KEY;
const OWNER_EMAIL = import.meta.env.VITE_OWNER_EMAIL || "owner@barbabyfitness.com";
const FROM_EMAIL = import.meta.env.VITE_FROM_EMAIL || "receipts@barbabyfitness.com";

// Log API key status for debugging (don't log the actual key)
console.log('Email service initialized, API key available:', !!RESEND_API_KEY);

interface ClientDetails {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
}

interface PaymentDetails {
  transactionId: string;
  method: string;
  amount: number;
  date: string;
  contractUrl?: string; // Added contract URL
}

/**
 * Attachment interface for email
 */
interface EmailAttachment {
  filename: string;
  content: string; // base64 encoded content
}

/**
 * Generates HTML content for client receipt emails
 */
const generateClientReceiptHTML = (
  paymentDetails: PaymentDetails,
  plan: Plan,
  client: ClientDetails
): string => {
  // Calculate total amount
  const planPrice = parseInt(plan.price.replace(/\$/g, ''), 10) || 0;
  const initiationFee = parseInt(plan.initiationFee?.replace(/\$/g, ''), 10) || 100;
  const total = planPrice + initiationFee;

  // Contract section HTML - only shown if contract URL exists
  const contractSection = paymentDetails.contractUrl ? `
    <div class="receipt">
      <h2>Your Contract</h2>
      <p>You can access your signed contract at any time by clicking the link below:</p>
      <p style="text-align: center; margin: 20px 0;">
        <a href="${paymentDetails.contractUrl}" 
           style="background-color: #DB6E1E; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; font-weight: bold;">
          View Contract
        </a>
      </p>
      <p style="font-size: 12px; color: #777;">
        We recommend saving a copy of your contract for your records. 
        If you have any questions about the terms, please contact us.
      </p>
    </div>
  ` : '';

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
          .header { text-align: center; margin-bottom: 30px; }
          .header h1 { color: #DB6E1E; }
          .content { margin-bottom: 30px; }
          .receipt { background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin-bottom: 30px; }
          .receipt h2 { color: #DB6E1E; margin-top: 0; }
          .table { width: 100%; border-collapse: collapse; }
          .table td { padding: 8px 0; }
          .table td:last-child { text-align: right; }
          .total { border-top: 1px solid #ddd; font-weight: bold; }
          .total td { padding: 12px 0; }
          .total td:last-child { color: #DB6E1E; }
          .footer { text-align: center; margin-top: 30px; color: #777; font-size: 12px; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>BarBaby Fitness</h1>
          <h2>Payment Confirmation</h2>
        </div>
        
        <div class="content">
          <p>Dear ${client.firstName} ${client.lastName},</p>
          <p>Thank you for joining BarBaby Fitness! Your payment has been successfully processed.</p>
        </div>
        
        <div class="receipt">
          <h2>Plan Details</h2>
          <table class="table">
            <tr>
              <td>Plan:</td>
              <td><strong>${plan.title}</strong></td>
            </tr>
            <tr>
              <td>Duration:</td>
              <td>${plan.duration}</td>
            </tr>
            <tr>
              <td>Sessions:</td>
              <td>${plan.sessions}</td>
            </tr>
            <tr>
              <td>Plan Price:</td>
              <td>${plan.price}</td>
            </tr>
            <tr>
              <td>Initiation Fee:</td>
              <td>${plan.initiationFee || "$100"}</td>
            </tr>
            <tr class="total">
              <td><strong>Total:</strong></td>
              <td><strong>$${total}</strong></td>
            </tr>
          </table>
        </div>
        
        <div class="receipt">
          <h2>Payment Information</h2>
          <table class="table">
            <tr>
              <td>Date:</td>
              <td>${paymentDetails.date}</td>
            </tr>
            <tr>
              <td>Payment Method:</td>
              <td>${paymentDetails.method}</td>
            </tr>
            <tr>
              <td>Transaction ID:</td>
              <td>${paymentDetails.transactionId}</td>
            </tr>
          </table>
        </div>
        
        ${contractSection}
        
        <div class="receipt">
          <h2>Next Steps</h2>
          <p>Our team will be in touch shortly to schedule your first session. If you have any questions, please contact us at support@barbabyfitness.com or call (555) 123-4567.</p>
        </div>
        
        <div class="footer">
          <p>BarBaby Fitness<br>123 Workout Street, Fitness City, FC 12345</p>
        </div>
      </body>
    </html>
  `;
};

/**
 * Generates HTML content for owner notification emails
 */
const generateOwnerReceiptHTML = (
  paymentDetails: PaymentDetails,
  plan: Plan,
  client: ClientDetails
): string => {
  // Calculate total amount
  const planPrice = parseInt(plan.price.replace(/\$/g, ''), 10) || 0;
  const initiationFee = parseInt(plan.initiationFee?.replace(/\$/g, ''), 10) || 100;
  const total = planPrice + initiationFee;

  // Contract section HTML - only shown if contract URL exists
  const contractSection = paymentDetails.contractUrl ? `
    <div class="section">
      <h2>Client Contract</h2>
      <p>The client has signed a contract which is available here:</p>
      <p style="margin: 15px 0;">
        <a href="${paymentDetails.contractUrl}" 
           style="background-color: #DB6E1E; color: white; padding: 8px 15px; text-decoration: none; border-radius: 5px;">
          View Client Contract
        </a>
      </p>
    </div>
  ` : '';

  return `
    <html>
      <head>
        <style>
          body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
          .header { margin-bottom: 30px; }
          .header h1 { color: #DB6E1E; }
          .alert { background-color: #DB6E1E; color: white; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
          .section { background-color: #f7f7f7; padding: 20px; border-radius: 5px; margin-bottom: 20px; }
          .section h2 { color: #DB6E1E; margin-top: 0; }
          .table { width: 100%; border-collapse: collapse; }
          .table td { padding: 8px 0; }
          .table td:last-child { text-align: right; }
          .total { border-top: 1px solid #ddd; font-weight: bold; }
          .total td { padding: 12px 0; }
          .total td:last-child { color: #DB6E1E; }
        </style>
      </head>
      <body>
        <div class="header">
          <h1>New Registration</h1>
          <div class="alert">A new client has registered with BarBaby Fitness!</div>
        </div>
        
        <div class="section">
          <h2>Client Information</h2>
          <table class="table">
            <tr>
              <td>Name:</td>
              <td>${client.firstName} ${client.lastName}</td>
            </tr>
            <tr>
              <td>Email:</td>
              <td>${client.email}</td>
            </tr>
            ${client.phone ? `<tr><td>Phone:</td><td>${client.phone}</td></tr>` : ''}
          </table>
        </div>
        
        <div class="section">
          <h2>Plan Details</h2>
          <table class="table">
            <tr>
              <td>Plan:</td>
              <td><strong>${plan.title}</strong></td>
            </tr>
            <tr>
              <td>Duration:</td>
              <td>${plan.duration}</td>
            </tr>
            <tr>
              <td>Sessions:</td>
              <td>${plan.sessions}</td>
            </tr>
            <tr>
              <td>Plan Price:</td>
              <td>${plan.price}</td>
            </tr>
            <tr>
              <td>Initiation Fee:</td>
              <td>${plan.initiationFee || "$100"}</td>
            </tr>
            <tr class="total">
              <td><strong>Total:</strong></td>
              <td><strong>$${total}</strong></td>
            </tr>
          </table>
        </div>
        
        <div class="section">
          <h2>Payment Information</h2>
          <table class="table">
            <tr>
              <td>Date:</td>
              <td>${paymentDetails.date}</td>
            </tr>
            <tr>
              <td>Payment Method:</td>
              <td>${paymentDetails.method}</td>
            </tr>
            <tr>
              <td>Transaction ID:</td>
              <td>${paymentDetails.transactionId}</td>
            </tr>
          </table>
        </div>
        
        ${contractSection}
        
        <div class="section">
          <h2>Action Required</h2>
          <p>Please reach out to this client within 24 hours to schedule their first training session.</p>
        </div>
      </body>
    </html>
  `;
};

/**
 * Sends email confirmations to both the client and gym owner
 */
export const sendPaymentConfirmations = async (
  clientEmail: string,
  plan: Plan,
  paymentDetails: PaymentDetails,
  clientDetails: ClientDetails,
  ownerEmail: string = OWNER_EMAIL,
  attachments?: EmailAttachment[] // Add attachments parameter
): Promise<{
  clientSent: boolean;
  ownerSent: boolean;
  clientResult?: any;
  ownerResult?: any;
  error?: any;
}> => {
  try {
    // Prepare to fetch
    const clientHtml = generateClientReceiptHTML(paymentDetails, plan, clientDetails);
    const ownerHtml = generateOwnerReceiptHTML(paymentDetails, plan, clientDetails);
    
    // Using fetch API to call Resend (since we're not installing the package)
    const [clientResponse, ownerResponse] = await Promise.all([
      // Send client receipt
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: clientEmail,
          subject: 'BarBaby Fitness: Payment Confirmation',
          html: clientHtml,
          attachments: attachments // Add attachments to the client email
        })
      }),
      
      // Send owner notification
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ownerEmail,
          subject: `New Registration: ${clientDetails.firstName} ${clientDetails.lastName}`,
          html: ownerHtml,
          attachments: attachments // Add attachments to the owner email as well
        })
      })
    ]);
    
    const clientResult = await clientResponse.json();
    const ownerResult = await ownerResponse.json();
    
    console.log('Email sending results:', { clientResult, ownerResult });
    
    return {
      clientSent: clientResponse.ok,
      ownerSent: ownerResponse.ok,
      clientResult,
      ownerResult
    };
  } catch (error) {
    console.error('Error sending payment confirmation emails:', error);
    return {
      clientSent: false,
      ownerSent: false,
      error
    };
  }
};

/**
 * Sends a contract confirmation email with PDF attachments
 */
export const sendContractConfirmation = async (
  clientEmail: string,
  clientDetails: ClientDetails,
  attachments: EmailAttachment[],
  ownerEmail: string = OWNER_EMAIL
): Promise<{
  clientSent: boolean;
  ownerSent: boolean;
  error?: any;
}> => {
  try {
    const clientHTML = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
            .header { text-align: center; margin-bottom: 30px; }
            .header h1 { color: #DB6E1E; }
            .content { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>BarBaby Fitness</h1>
            <h2>Contract Documentation</h2>
          </div>
          
          <div class="content">
            <p>Dear ${clientDetails.firstName} ${clientDetails.lastName},</p>
            <p>Thank you for registering with BarBaby Fitness! Please find attached your completed contract documents:</p>
            <ul>
              <li>Registration Form</li>
              <li>Personal Training Agreement</li>
              <li>Liability Waiver</li>
            </ul>
            <p>Please keep these documents for your records.</p>
            <p>If you have any questions, please contact us at support@barbabyfitness.com or call (555) 123-4567.</p>
            <p>We look forward to working with you!</p>
            <p>Sincerely,<br>BarBaby Fitness Team</p>
          </div>
        </body>
      </html>
    `;

    const ownerHTML = `
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333; }
            .header { margin-bottom: 30px; }
            .header h1 { color: #DB6E1E; }
            .alert { background-color: #DB6E1E; color: white; padding: 10px; border-radius: 5px; margin-bottom: 20px; }
            .content { margin-bottom: 30px; }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>New Client Contract</h1>
            <div class="alert">A new client has signed contract documents!</div>
          </div>
          
          <div class="content">
            <p><strong>Client:</strong> ${clientDetails.firstName} ${clientDetails.lastName}</p>
            <p><strong>Email:</strong> ${clientDetails.email}</p>
            ${clientDetails.phone ? `<p><strong>Phone:</strong> ${clientDetails.phone}</p>` : ''}
            <p>The following contract documents are attached:</p>
            <ul>
              <li>Registration Form</li>
              <li>Personal Training Agreement</li>
              <li>Liability Waiver</li>
            </ul>
            <p><strong>Action Required:</strong> Please review these documents and follow up with the client within 24 hours.</p>
          </div>
        </body>
      </html>
    `;

    // Using fetch API to call Resend
    const [clientResponse, ownerResponse] = await Promise.all([
      // Send client email with attachments
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: clientEmail,
          subject: 'BarBaby Fitness: Your Contract Documents',
          html: clientHTML,
          attachments: attachments
        })
      }),
      
      // Send owner notification with attachments
      fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: FROM_EMAIL,
          to: ownerEmail,
          subject: `New Contract Documents: ${clientDetails.firstName} ${clientDetails.lastName}`,
          html: ownerHTML,
          attachments: attachments
        })
      })
    ]);

    const clientResult = await clientResponse.json();
    const ownerResult = await ownerResponse.json();
    
    console.log('Contract email sending results:', { clientResult, ownerResult });
    
    return {
      clientSent: clientResponse.ok,
      ownerSent: ownerResponse.ok
    };
  } catch (error) {
    console.error('Error sending contract emails:', error);
    return {
      clientSent: false,
      ownerSent: false,
      error
    };
  }
};

export default {
  sendPaymentConfirmations,
  sendContractConfirmation
};