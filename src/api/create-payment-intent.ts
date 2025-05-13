/**
 * Client-side function to call the payment intent API endpoint
 */
export async function createPaymentIntent(amount: number) {
  try {
    // Dynamically determine the API base URL based on environment
    const apiBaseUrl = import.meta.env.MODE === 'production' 
      ? 'https://barbabyfitness.com' // Your production domain
      : 'http://localhost:3000';
      
    const response = await fetch(`${apiBaseUrl}/api/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ amount }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create payment intent');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error calling payment intent API:', error);
    throw error;
  }
}
