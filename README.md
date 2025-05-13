# Barbaby Fitness

## Payment Integration with Stripe

This application uses Stripe to process credit card payments. Follow these steps to set up the payment system:

1. Create a Stripe account at [stripe.com](https://stripe.com) if you don't have one
2. Get your API keys from the Stripe Dashboard
3. Create a `.env` file in the root directory with the following:
   ```
   VITE_STRIPE_PUBLIC_KEY=pk_test_your_stripe_public_key
   VITE_CLOUDFLARE_R2_PUBLIC_URL=https://pub-a73c1de02759402f8f74a8b93a6f48ea.r2.dev
   VITE_CLOUDFLARE_R2_ENDPOINT=https://barbaby-contracts.8903e28602247a5bf0543b9dbe1c84e9.r2.cloudflarestorage.com
   VITE_CLOUDFLARE_R2_ACCESS_KEY_ID=your_access_key_id
   VITE_CLOUDFLARE_R2_SECRET_ACCESS_KEY=your_secret_access_key
   VITE_CLOUDFLARE_R2_BUCKET_NAME=barbaby-contracts
   ```
4. Create a `.env` file in the `server` directory with:
   ```
   STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
   PORT=3001
   ```

## PDF Templates Setup

This application uses PDF templates for contracts and waivers. For development, you can use local templates:

1. Download the PDF templates from Cloudflare R2:
   - `registration_form_template.pdf`
   - `training_agreement_template.pdf`
   - `liability_waiver_template.pdf`

2. Place them in the `public/templates` directory.

3. The application will automatically use these local templates during development, avoiding CORS issues with Cloudflare R2.

For production, the templates should be stored in Cloudflare R2 in the `templates` directory of the `barbaby-contracts` bucket.

## Running the Application

To run both the frontend and backend together:

```bash
npm run dev:all
```

To run only the frontend:

```bash
npm run dev
```

To run only the backend:

```bash
npm run dev:server
```

## Payment Flow

1. User selects a training plan
2. User fills out registration form
3. User signs contract and waiver
4. User selects payment method (Credit Card, Venmo, etc.)
5. If Credit Card is selected, they are redirected to the Stripe payment page
6. After successful payment, user is shown a confirmation page