// ./server.js
import express from 'express';
import Stripe from 'stripe';
import cors from 'cors';
import * as dotenv from 'dotenv'; // Correct dotenv import
import { createRequire } from 'module'; // Add this to import CommonJS modules

// Create require function for importing CommonJS modules
const require = createRequire(import.meta.url);
// Import email router (CommonJS module)
const emailRouter = require('./server/routes/emails.js');

// Load environment variables from .env file
dotenv.config();

// Initialize Stripe with your test secret key from environment variables
console.log("Loading Stripe with test key:", process.env.STRIPE_TEST_SECRET_KEY ? "Test key exists" : "Test key missing");
const stripe = new Stripe(process.env.STRIPE_TEST_SECRET_KEY);

const app = express();

// Allow requests from your frontend domains
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:5173', 'https://barbabyfitness.com', 'https://www.barbabyfitness.com'],
  credentials: true
}));

app.use(express.json());

// Root route for testing server
app.get('/', (req, res) => {
  res.send('Backend is running!');
});

// Create a payment intent
app.post('/api/create-payment-intent', async (req, res) => {
  try {
    const { amount } = req.body;

    // Log the incoming amount for debugging
    console.log('Amount received:', amount);

    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: 'usd',
    });

    // Respond with the client secret
    res.json({ clientSecret: paymentIntent.client_secret });
  } catch (err) {
    // Log the error and respond with a 500 status code
    console.error('Error creating payment intent:', err);
    res.status(500).json({ error: err.message });
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
    
    console.log('Checkout session request received:', req.body);
    
    // Use the provided values or calculate them if not provided
    const actualPlanPrice = planPrice || (amount / 100) - 10000; // Default if not provided
    const actualInitiationFee = initiationFee || 10000; // Default $100 in cents
    
    // Determine if we're in production or development
    const isProduction = process.env.NODE_ENV === 'production';
    const baseUrl = isProduction ? 'https://barbabyfitness.com' : 'http://localhost:3000';
    
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

    console.log('Checkout session created successfully');
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

// Mount email routes from CommonJS module
app.use('/api', emailRouter);

// Start the server on port 3001 to avoid conflict with Vite frontend on port 3000
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`));
