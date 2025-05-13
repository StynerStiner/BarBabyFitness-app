// server/routes/emails.js
const express = require('express');
const router = express.Router();
const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');
const { S3Client, GetObjectCommand } = require('@aws-sdk/client-s3');

// Configure Cloudflare R2
const r2 = new S3Client({
  region: 'auto',
  endpoint: process.env.CLOUDFLARE_R2_ENDPOINT,
  credentials: {
    accessKeyId: process.env.CLOUDFLARE_R2_ACCESS_KEY_ID,
    secretAccessKey: process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY,
  },
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'adm.barbabyfitness@gmail.com',
    pass: process.env.EMAIL_PASSWORD || '', // You'll need to add this to your .env file
  },
});

// Beautiful HTML template for emails
const getEmailTemplate = (content, isClient = true) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>BarBaby Fitness</title>
      <style>
        body {
          font-family: 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background-color: #f9f9f9;
          margin: 0;
          padding: 0;
        }
        .email-container {
          max-width: 600px;
          margin: 0 auto;
          background-color: #ffffff;
          border-radius: 8px;
          overflow: hidden;
        }
        .email-header {
          background-color: #333333;
          padding: 20px;
          text-align: center;
        }
        .orange-accent {
          background-color: #F17A2B;
          height: 5px;
        }
        .logo {
          max-width: 200px;
          height: auto;
          margin-bottom: 10px;
        }
        .email-body {
          padding: 30px;
        }
        .section {
          margin-bottom: 30px;
        }
        h1, h2, h3 {
          color: #333333;
          margin-top: 0;
        }
        h1 {
          font-size: 24px;
        }
        h2 {
          font-size: 20px;
          margin-top: 20px;
          border-bottom: 1px solid #eeeeee;
          padding-bottom: 10px;
        }
        .plan-name {
          color: #F17A2B;
          font-weight: bold;
        }
        p {
          margin: 0 0 15px;
        }
        .highlight {
          font-weight: bold;
          color: #F17A2B;
        }
        .button {
          display: inline-block;
          background-color: #F17A2B;
          color: white !important;
          text-decoration: none;
          padding: 12px 25px;
          border-radius: 25px;
          font-weight: bold;
          margin: 15px 0;
          text-align: center;
        }
        .footer {
          background-color: #333333;
          color: #ffffff;
          padding: 20px;
          text-align: center;
          font-size: 12px;
        }
        .footer a {
          color: #F17A2B;
          text-decoration: none;
        }
        .item-row {
          display: flex;
          justify-content: space-between;
          margin-bottom: 8px;
        }
        .item-label {
          color: #666;
        }
        .item-value {
          font-weight: 500;
        }
        .total-row {
          display: flex;
          justify-content: space-between;
          margin-top: 15px;
          padding-top: 15px;
          border-top: 2px solid #eeeeee;
          font-weight: bold;
        }
        .total-value {
          color: #F17A2B;
          font-size: 18px;
        }
        .payment-box {
          background-color: #f8f8f8;
          border-radius: 6px;
          padding: 15px;
          margin-bottom: 20px;
        }
        .success-icon {
          font-size: 40px;
          color: #4CAF50;
          margin-bottom: 10px;
        }
        .next-steps {
          background-color: #FFF8F3;
          border-left: 4px solid #F17A2B;
          padding: 15px;
          margin: 15px 0;
        }
        ul {
          padding-left: 20px;
          margin: 10px 0;
        }
        li {
          margin-bottom: 8px;
        }
        .social-links {
          margin-top: 15px;
        }
        .social-links a {
          display: inline-block;
          margin: 0 10px;
        }
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="email-header">
          <img src="https://barbabyfitness.com/images/logo_updated_transparent.png" alt="BarBaby Fitness" class="logo">
          <h1 style="color: #ffffff; margin: 0;">BARBABY FITNESS</h1>
        </div>
        <div class="orange-accent"></div>
        <div class="email-body">
          ${content}
        </div>
        <div class="footer">
          <p>&copy; ${new Date().getFullYear()} BarBaby Fitness. All rights reserved.</p>
          <p>Nashville, TN</p>
          <p>
            <a href="https://barbabyfitness.com/privacy-policy">Privacy Policy</a> | 
            <a href="https://barbabyfitness.com/terms">Terms & Conditions</a>
          </p>
          <div class="social-links">
            <a href="https://instagram.com/barbabyfitness">Instagram</a>
            <a href="https://facebook.com/barbabyfitness">Facebook</a>
          </div>
        </div>
      </div>
    </body>
    </html>
  `;
};

// Send email notifications
router.post('/registration-confirmation', async (req, res) => {
  const { 
    clientEmail,
    clientName,
    contractUrl,
    planName,
    paymentDetails,
    registrationData
  } = req.body;
    
  if (!clientEmail) {
    return res.status(400).json({ 
      success: false, 
      message: 'Missing required field: clientEmail is required' 
    });
  }

  try {
    // Set up email options
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@barbabyfitness.com';
    const fromEmail = process.env.FROM_EMAIL || 'receipts@barbabyfitness.com';
    const replyTo = ownerEmail;
    
    // Format client name for display
    const formattedClientName = clientName || 'Valued Client';
    
    // Client registration email
    const clientEmailOptions = {
      from: `"BarBaby Fitness" <${fromEmail}>`,
      to: clientEmail,
      subject: 'Welcome to BarBaby Fitness - Registration Confirmation',
      html: getEmailTemplate(`
        <div class="section">
          <h1>Registration Confirmation</h1>
          <p>Hello ${formattedClientName},</p>
          <p>Thank you for registering with BarBaby Fitness! We're excited to have you join our fitness family.</p>
          <p>Your registration is confirmed and your account has been created. Below are some details about what to expect next:</p>
        </div>
        
        <div class="section">
          <h2>Next Steps</h2>
          <ul>
            <li>Schedule your first training session</li>
            <li>Download our fitness app to track your progress</li>
            <li>Join our community on social media for tips and updates</li>
          </ul>
        </div>
        
        <div class="section">
          <p>If you selected a personal training plan, one of our trainers will contact you within 24 hours to schedule your first session.</p>
          <p>If you have any questions, please don't hesitate to contact us at <a href="mailto:info@barbabyfitness.com">info@barbabyfitness.com</a>.</p>
        </div>
        
        <div class="section">
          <p>We look forward to helping you achieve your fitness goals!</p>
          <a href="https://barbabyfitness.com/schedule" class="button">Schedule Your First Session</a>
        </div>
      `),
      replyTo: replyTo
    };
    
    // Owner notification email
    const ownerEmailOptions = {
      from: `"BarBaby Fitness System" <${fromEmail}>`,
      to: ownerEmail,
      subject: `New Registration - ${formattedClientName}`,
      html: getEmailTemplate(`
        <div class="section">
          <h1>New Registration Alert</h1>
          <p>A new user has registered with BarBaby Fitness:</p>
          <p><strong>Name:</strong> ${formattedClientName}</p>
          <p><strong>Email:</strong> ${clientEmail}</p>
          <p><strong>Plan Selected:</strong> ${planName || 'None'}</p>
        </div>
        
        <div class="section">
          <h2>Registration Details</h2>
          <p>Check the admin dashboard for full registration details.</p>
        </div>
        
        <div class="section">
          <p>Please reach out to the client within 24 hours to welcome them and answer any questions they may have.</p>
        </div>
      `, false),
      replyTo: clientEmail
    };
    
    // Track email sending results
    const emailResults = {
      clientEmailSent: false,
      ownerEmailSent: false,
      clientEmailError: null,
      ownerEmailError: null
    };
    
    // Send emails
    try {
      const clientEmailResult = await transporter.sendMail(clientEmailOptions);
      emailResults.clientEmailSent = true;
      console.log('Client email sent:', clientEmailResult.messageId);
    } catch (error) {
      emailResults.clientEmailError = error.message;
      console.error('Error sending client email:', error);
    }
    
    try {
      const ownerEmailResult = await transporter.sendMail(ownerEmailOptions);
      emailResults.ownerEmailSent = true;
      console.log('Owner email sent:', ownerEmailResult.messageId);
    } catch (error) {
      emailResults.ownerEmailError = error.message;
      console.error('Error sending owner email:', error);
    }
    
    res.json({
      success: emailResults.clientEmailSent || emailResults.ownerEmailSent,
      message: 'Registration emails processed',
      results: emailResults
    });
  } catch (error) {
    console.error('Error processing registration emails:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing registration emails',
      error: error.message
    });
  }
});

// Create the payment confirmation email content function 
const getPaymentConfirmationEmail = (
  formattedClientName,
  formattedDate,
  paymentMethod,
  transactionId,
  monthlyFee,
  initiationFee,
  planTitle,
  planSessions,
  planDuration,
  isClient = true
) => {
  return isClient ? `
    <div class="section">
      <h1>🎉 Registration Successful!</h1>
      <p>Thank you for joining <strong>BarBaby Fitness</strong>! Your registration has been completed successfully.</p>
    </div>
    
    <div class="section">
      <h2>Payment Confirmation</h2>
      <div class="payment-box">
        <div class="success-icon">✓</div>
        <div class="item-row">
          <span class="item-label">Date:</span>
          <span class="item-value">${formattedDate}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Payment Method:</span>
          <span class="item-value">${paymentMethod}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Transaction ID:</span>
          <span class="item-value">${transactionId}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Monthly Fee:</span>
          <span class="item-value">$${monthlyFee}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Initiation Fee:</span>
          <span class="item-value">$${initiationFee}</span>
        </div>
        <div class="total-row">
          <span>Total Paid:</span>
          <span class="total-value">$${parseInt(monthlyFee || 0) + parseInt(initiationFee || 0)}</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <h2>Your Plan: <span class="plan-name">${planTitle}</span></h2>
      <p>You've chosen our ${planTitle} plan, which includes:</p>
      <ul>
        <li>${planSessions}</li>
        <li>${planDuration}</li>
        <li>Personalized fitness coaching</li>
        <li>Access to our fitness app</li>
      </ul>
    </div>
    
    <div class="section">
      <h2>Important Documents</h2>
      <p>The following documents are attached to this email for your records:</p>
      <ul>
        <li><strong>Personal Training Contract</strong> - Contains terms and conditions of your membership</li>
        <li><strong>Registration Form</strong> - Your personal information and selected plan details</li>
        <li><strong>Liability Waiver</strong> - Confirming your acknowledgment of fitness training risks</li>
      </ul>
      <p>Please save these documents for future reference. If you have any questions about any of these documents, please contact us.</p>
    </div>
    
    <div class="section">
      <h2>Next Steps</h2>
      <div class="next-steps">
        <ul>
          <li>Schedule your first session using our online booking system</li>
          <li>Prepare comfortable workout clothes and a water bottle</li>
          <li>Arrive 15 minutes early for your first session to complete orientation</li>
        </ul>
      </div>
      <p>We're excited to be part of your fitness journey! If you have any questions, don't hesitate to reach out.</p>
      <a href="https://barbabyfitness.com/schedule" class="button">Schedule Your First Session</a>
    </div>
  ` : `
    <div class="section">
      <h1>New Payment Received!</h1>
      <p>A new client has completed payment:</p>
      <p><strong>Client:</strong> ${formattedClientName}</p>
      <p><strong>Plan:</strong> ${planTitle}</p>
    </div>
    
    <div class="section">
      <h2>Payment Details</h2>
      <div class="payment-box">
        <div class="item-row">
          <span class="item-label">Date:</span>
          <span class="item-value">${formattedDate}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Payment Method:</span>
          <span class="item-value">${paymentMethod}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Transaction ID:</span>
          <span class="item-value">${transactionId}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Monthly Fee:</span>
          <span class="item-value">$${monthlyFee}</span>
        </div>
        <div class="item-row">
          <span class="item-label">Initiation Fee:</span>
          <span class="item-value">$${initiationFee}</span>
        </div>
        <div class="total-row">
          <span>Total Paid:</span>
          <span class="total-value">$${parseInt(monthlyFee || 0) + parseInt(initiationFee || 0)}</span>
        </div>
      </div>
    </div>
    
    <div class="section">
      <p>The client's contract and registration details are attached to this email. You may want to reach out to welcome them and confirm their first session.</p>
    </div>
  `;
};

// Add alias for post-payment-actions to match the frontend expectations
router.post('/post-payment-actions', async (req, res) => {
  console.log('Post-payment-actions endpoint called with data:', req.body);
  
  try {
    const { 
      clientEmail,
      clientName,
      contractUrl,
      planName,
      paymentDetails,
      registrationData
    } = req.body;
    
    if (!clientEmail) {
      return res.status(400).json({ 
        success: false, 
        message: 'Missing required field: clientEmail is required' 
      });
    }
    
    console.log(`Sending confirmation emails to ${clientEmail} for ${clientName}`);
    
    // Set up default values
    const ownerEmail = process.env.OWNER_EMAIL || 'owner@barbabyfitness.com';
    const fromEmail = process.env.FROM_EMAIL || 'receipts@barbabyfitness.com';
    
    // Track email sending results
    const emailResults = {
      registrationEmailSent: false,
      contractEmailSent: false,
      paymentConfirmationSent: false,
      registrationEmailError: null,
      contractEmailError: null,
      paymentConfirmationError: null
    };
    
    // Format client name for display
    const formattedClientName = clientName || 'Valued Client';
    
    // Get payment details
    const paymentMethod = paymentDetails?.method || 'Credit Card';
    const transactionId = paymentDetails?.transactionId || `manual-${Date.now()}`;
    const formattedDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Extract plan details
    let planTitle = planName || 'Basic Plan';
    let monthlyFee = paymentDetails?.amount || '0';
    let initiationFee = '0';
    let planSessions = 'Unlimited sessions';
    let planDuration = 'Monthly access';
    
    // Get more detailed plan info if available
    if (registrationData?.selectedPlan) {
      planTitle = registrationData.selectedPlan.title || planTitle;
      monthlyFee = registrationData.selectedPlan.price?.toString() || monthlyFee;
      initiationFee = registrationData.selectedPlan.initiationFee?.toString() || initiationFee;
      planSessions = registrationData.selectedPlan.sessions || planSessions;
      planDuration = registrationData.selectedPlan.duration || planDuration;
    }
    
    console.log('Sending registration confirmation to client and owner');
    
    // Send confirmation emails to both client and gym owner
    const emailContentClient = getPaymentConfirmationEmail(
      formattedClientName,
      formattedDate,
      paymentMethod,
      transactionId,
      monthlyFee,
      initiationFee,
      planTitle,
      planSessions,
      planDuration,
      true // isClient
    );
    
    const emailContentOwner = getPaymentConfirmationEmail(
      formattedClientName,
      formattedDate,
      paymentMethod,
      transactionId,
      monthlyFee,
      initiationFee,
      planTitle,
      planSessions,
      planDuration,
      false // isOwner
    );
    
    // Create email options for payment confirmation
    const clientPaymentEmailOptions = {
      from: `"BarBaby Fitness" <${ownerEmail}>`,
      to: clientEmail,
      subject: '✓ Payment Confirmed - Welcome to BarBaby Fitness!',
      html: getEmailTemplate(emailContentClient, true),
      attachments: []
    };
    
    const ownerPaymentEmailOptions = {
      from: `"BarBaby Fitness System" <${ownerEmail}>`,
      to: ownerEmail,
      subject: `💰 New Payment - ${formattedClientName}`,
      html: getEmailTemplate(emailContentOwner, false),
      attachments: []
    };
    
    // Send the emails
    try {
      console.log('Sending payment confirmation emails...');
      const [clientResult, ownerResult] = await Promise.all([
        transporter.sendMail(clientPaymentEmailOptions),
        transporter.sendMail(ownerPaymentEmailOptions)
      ]);
      
      console.log('Payment confirmation emails sent successfully');
      emailResults.paymentConfirmationSent = true;
    } catch (error) {
      console.error('Error sending payment confirmation emails:', error);
      emailResults.paymentConfirmationError = error.message;
    }
    
    // Return results
    res.json({
      success: emailResults.contractEmailSent || emailResults.registrationEmailSent || emailResults.paymentConfirmationSent,
      message: 'Post-payment actions completed',
      results: emailResults
    });
  } catch (error) {
    console.error('Error in post-payment actions:', error);
    res.status(500).json({
      success: false,
      message: 'Error processing post-payment actions',
      error: error.message
    });
  }
});

// Utility function to convert stream to buffer
async function streamToBuffer(stream) {
  return new Promise((resolve, reject) => {
    const chunks = [];
    stream.on('data', (chunk) => chunks.push(chunk));
    stream.on('error', reject);
    stream.on('end', () => resolve(Buffer.concat(chunks)));
  });
}

module.exports = router;
