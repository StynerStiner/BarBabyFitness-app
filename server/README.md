# Barbaby Fitness API Server

This server handles payment processing for Barbaby Fitness using Stripe.

## Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create a `.env` file in the root directory with the following variables:
   ```
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   PORT=3001
   ```

3. Start the server:
   ```
   npm start
   ```

   For development with auto-restart:
   ```
   npm run dev
   ```

## API Endpoints

### POST /api/create-payment-intent
Creates a Stripe payment intent.

**Request Body:**
```json
{
  "amount": 19500,
  "currency": "usd",
  "description": "Barbaby Power Surge Training Plan + Initiation Fee"
}
```

**Response:**
```json
{
  "clientSecret": "pi_..."
}
``` 