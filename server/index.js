const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables with absolute path to ensure it's found
dotenv.config({ path: path.resolve(__dirname, '.env') });

// Debug environment variables - make sure key looks valid
const stripeKey = process.env.STRIPE_TEST_SECRET_KEY;
console.log('STRIPE_TEST_SECRET_KEY length:', stripeKey ? stripeKey.length : 0);
console.log('STRIPE_TEST_SECRET_KEY format check:', 
  stripeKey && (stripeKey.startsWith('sk_test_') || stripeKey.startsWith('sk_live_')) ? 'Looks valid' : 'Invalid format');
console.log('Environment variables loaded from:', path.resolve(__dirname, '.env'));

// Check Cloudflare R2 credentials and provide better feedback
const r2AccessKey = process.env.CLOUDFLARE_R2_ACCESS_KEY_ID;
const r2SecretKey = process.env.CLOUDFLARE_R2_SECRET_ACCESS_KEY;
const r2Endpoint = process.env.CLOUDFLARE_R2_ENDPOINT;
const r2BucketName = process.env.CLOUDFLARE_R2_BUCKET_NAME;

console.log('Cloudflare R2 Access Key ID length:', r2AccessKey ? r2AccessKey.length : 0);
console.log('Cloudflare R2 Endpoint:', r2Endpoint || 'Not configured');
console.log('Cloudflare R2 Bucket Name:', r2BucketName || 'Not configured');

// Validate R2 configuration
if (!r2AccessKey || !r2SecretKey || !r2Endpoint || !r2BucketName) {
  console.warn('⚠️ WARNING: Cloudflare R2 is not fully configured. Contract uploads may fail.');
  if (!r2SecretKey) console.warn('⚠️ Missing CLOUDFLARE_R2_SECRET_ACCESS_KEY');
  if (!r2AccessKey) console.warn('⚠️ Missing CLOUDFLARE_R2_ACCESS_KEY_ID');
  if (!r2Endpoint) console.warn('⚠️ Missing CLOUDFLARE_R2_ENDPOINT');
  if (!r2BucketName) console.warn('⚠️ Missing CLOUDFLARE_R2_BUCKET_NAME');
} else {
  console.log('✓ Cloudflare R2 configuration looks complete');
}

// Use test key from environment variables
const TEST_KEY = process.env.STRIPE_TEST_SECRET_KEY || '***REMOVED***';
let stripeKeyToUse = stripeKey;
let isTestMode = true;

// Initialize Stripe with test key
let stripe;
try {
  stripe = require('stripe')(stripeKeyToUse);
  
  // Test the Stripe connection with a simple operation
  stripe.paymentMethods.list({ limit: 1 })
    .then(() => console.log('✓ Stripe connection successful with test key!'))
    .catch(err => {
      console.error('✗ Test key connection failed:', err.message);
      console.log('Attempting to use fallback test key...');
      
      // Use the hardcoded test key as fallback
      stripeKeyToUse = TEST_KEY;
      isTestMode = true;
      stripe = require('stripe')(stripeKeyToUse);
      
      // Test again with the fallback test key
      return stripe.paymentMethods.list({ limit: 1 });
    })
    .then(result => {
      if (isTestMode && result) {
        console.log('✓ Stripe connection successful with TEST key! (USING TEST MODE)');
        console.log('⚠️ IMPORTANT: You are now using Stripe TEST mode. No real payments will be processed.');
        console.log('⚠️ Please check your Stripe Dashboard to verify your live key or generate a new one.');
      }
    })
    .catch(err => {
      if (isTestMode) {
        console.error('✗ Both live and test keys failed. Cannot connect to Stripe:', err.message);
      }
    });
} catch (error) {
  console.error('Error initializing Stripe client:', error.message);
}

const app = express();
const PORT = process.env.PORT || 3002;  // Changed to use port 3002 to ensure consistency

// Middleware
app.use(cors({
  origin: ['http://localhost:5173', 'http://localhost:5174', 'http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'https://barbabyfitness.com', 'https://www.barbabyfitness.com'],
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

// Increase payload size limit for file uploads
app.use(bodyParser.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ limit: '50mb', extended: true }));

// Import routes
const uploadContractRoutes = require('./routes/upload-contract');
const uploadContractPdfRoutes = require('./routes/upload-contract-pdf');
const emailRoutes = require('./routes/emails');

// Use routes
app.use('/upload-contract', uploadContractRoutes);
app.use('/api/upload-contract', uploadContractPdfRoutes);
app.use('/email', emailRoutes);

// Root route for server status
app.get('/', (req, res) => {
  res.json({ 
    status: 'online', 
    message: 'BarBaby Fitness API is running with Stripe test keys',
    environment: process.env.NODE_ENV || 'development'
  });
});

// Mount routes
app.use('/api/upload-contract', uploadContractRoutes); // API endpoint for contract uploads
app.use('/upload-contract', uploadContractRoutes);     // Direct access for PDF templates
app.use('/api', emailRoutes); // This includes post-payment email functionality

// Alias /api/check-session to /api/checkout-session for compatibility
app.get('/api/check-session', async (req, res) => {
  const sessionId = req.query.session_id;
  try {
    const session = await stripe.checkout.sessions.retrieve(sessionId, {
      expand: ['payment_intent', 'customer', 'line_items']
    });
    res.json(session);
  } catch (error) {
    console.error('Error retrieving session:', error);
    res.status(500).json({ error: error.message });
  }
});

// Routes
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount, currency, description } = req.body;

    // Create a PaymentIntent with the order amount and currency
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency,
      description,
      automatic_payment_methods: {
        enabled: true,
      },
    });

    // Send publishable key and PaymentIntent details to client
    res.json({
      clientSecret: paymentIntent.client_secret,
    });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: error.message });
  }
});

// Stripe Checkout Session endpoint
app.post('/api/create-checkout-session', async (req, res) => {
  try {
    const { 
      amount, 
      planPrice, 
      initiationFee,
      currency, 
      description, 
      plan, 
      successUrl, 
      cancelUrl 
    } = req.body;
    
    // Use the provided values or calculate them if not provided
    const actualPlanPrice = planPrice || (amount / 100) - 100; // Assuming $100 initiation fee
    const actualInitiationFee = initiationFee || 10000; // Default $100 in cents
    
    // Determine if we're in production or development
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction ? 'https://barbabyfitness.com' : 'http://localhost:5173';
    
    // Create a Checkout Session with itemized costs
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price_data: {
            currency: currency || 'usd',
            product_data: {
              name: plan?.title || 'Training Plan',
              description: `${plan?.sessions || ''} ${plan?.duration || ''}`,
            },
            unit_amount: actualPlanPrice,
          },
          quantity: 1,
        },
        {
          price_data: {
            currency: currency || 'usd',
            product_data: {
              name: 'Initiation Fee',
              description: 'One-time registration fee',
            },
            unit_amount: actualInitiationFee,
          },
          quantity: 1,
        }
      ],
      mode: 'payment',
      success_url: successUrl || `${baseUrl}/registration-flow/confirmation?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: cancelUrl || `${baseUrl}/registration-flow/payment-selection`,
    });

    res.json({ url: session.url });
  } catch (error) {
    console.error('Error creating checkout session:', error);
    res.status(500).json({ message: error.message });
  }
});

// Retrieve Checkout Session details
app.get('/api/checkout-session', async (req, res) => {
  try {
    const { session_id } = req.query;
    
    if (!session_id) {
      return res.status(400).json({ message: 'Session ID is required' });
    }
    
    const session = await stripe.checkout.sessions.retrieve(session_id, {
      expand: ['payment_intent', 'line_items'],
    });
    
    res.json(session);
  } catch (error) {
    console.error('Error retrieving checkout session:', error);
    res.status(500).json({ message: error.message });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Export for serverless functions
module.exports = app;
