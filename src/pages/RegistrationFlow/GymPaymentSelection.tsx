// File path: src/pages/RegistrationFlow/GymPaymentSelection.tsx
// cSpell:disable
// eslint-disable-next-line spellcheck/spell-checker
// @ts-ignore
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { CreditCard, Wallet, Building2, Dumbbell } from 'lucide-react';
import { useGymForm } from '../GymRegistrationForm/contexts/GymFormContext';
import type { FormState } from '../GymRegistrationForm/contexts/GymFormContext';
import RegistrationHeader from "@/pages/GymRegistrationForm/components/RegistrationHeader";
import { PlanDetails } from "@/pages/GymRegistrationForm/components/PlanDetails";
import type { Plan } from "../TrainingOptions/components/types";
import { DEFAULT_PLAN } from '../GymRegistrationForm';

declare global {
  interface Window {
    paypal: any;
  }
}

interface LocationState {
  formState?: FormState;
  selectedPlan?: Plan;  // Keep this as selectedPlan
}

export const GymPaymentSelection = () => {
  const navigate = useNavigate();
  const location = useLocation();
  console.log("LOCATION STATE:", location.state); // Debugging log
  const state = location.state as LocationState;
  const { formState: contextFormState } = useGymForm();

  // Debug info for plan data
  useEffect(() => {
    if (!state || !state.selectedPlan) {
      console.warn('No plan data received from location state. Using default or context values.');
    }
  }, [state]);

  const currentFormState = state?.formState || contextFormState;
  const plan = state?.selectedPlan || currentFormState?.selectedPlan || DEFAULT_PLAN;

  const typedPlan: Plan = {
    ...plan,
    id: plan?.id || "",
    perks: plan?.perks || "",
    title: plan?.title || "",
    duration: plan?.duration || "",
    sessions: plan?.sessions || "",
    price: plan?.price || "",
    initiationFee: plan?.initiationFee || "",
    icon: plan?.icon,
  } as Plan;

  const calculateAmount = () => {
    const priceMatch = plan?.price?.match(/\$(\d+)/);
    const initiationMatch = plan?.initiationFee?.match(/\$(\d+)/);

    const monthlyPrice = priceMatch ? parseInt(priceMatch[1]) : 195;
    const initiationFee = initiationMatch ? parseInt(initiationMatch[1]) : 100;

    return (monthlyPrice + initiationFee) * 100;
  };

  const getPlanPrice = () => {
    const priceMatch = plan?.price?.match(/\$(\d+)/);
    return priceMatch ? parseInt(priceMatch[1]) : 195;
  };

  const getInitiationFee = () => {
    const initiationMatch = plan?.initiationFee?.match(/\$(\d+)/);
    return initiationMatch ? parseInt(initiationMatch[1]) : 100;
  };

  const totalPrice = getPlanPrice() + getInitiationFee();

  // State for Zelle instructions modal - now initialized after totalPrice is defined
  const [showZelleInstructions, setShowZelleInstructions] = useState({
    show: false,
    email: 'adm.barbabyfitness@gmail.com',
    phone: '615-957-1941',
    amount: totalPrice,
    note: `${typedPlan?.title || 'Fitness'} Training Plan`,
  });

  const [isPayPalSdkLoaded, setIsPayPalSdkLoaded] = useState(false);
  const [payPalError, setPayPalError] = useState('');
  const [showPriceBreakdown, setShowPriceBreakdown] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const handlePreCheckout = (paymentMethod: string) => {
    setShowPriceBreakdown(true);
  };

  const proceedToPayment = (paymentMethod: string) => {
    if (paymentMethod === 'card') {
      handleCreditCardPayment();
    } else if (paymentMethod === 'venmo') {
      handleVenmoPayment(typedPlan);
    } else if (paymentMethod === 'paypal') {
      // The PayPal buttons are already rendered in the UI
    }
  };

  useEffect(() => {
    // Skip PayPal SDK loading since we've commented out the PayPal section
    // Only load PayPal SDK if we have a container to render to
    const paypalContainerExists = document.getElementById('paypal-button-container');

    if (!paypalContainerExists) {
      console.log('PayPal container not found, skipping SDK load');
      return;
    }

    // Create a unique ID for the script to prevent duplicates
    const scriptId = 'paypal-sdk-script';
    let script = document.getElementById(scriptId) as HTMLScriptElement;

    // Only create and append the script if it doesn't already exist
    if (!script) {
      script = document.createElement('script');
      script.id = scriptId;
      script.src = `https://www.paypal.com/sdk/js?client-id=AXEDdnQ7dJsdWRdoKYCdcWZajYASuRP4hJeXwE-d1-I8kmwsP1g8fuxK0l_2eFv7AORL2DjkR1XiBrzG&currency=USD`; // Sandbox Client ID
      script.async = true;
      script.onload = () => {
        console.log('PayPal SDK loaded successfully.');
        setIsPayPalSdkLoaded(true);
        setPayPalError('');
      };
      script.onerror = () => {
        console.error('Failed to load PayPal SDK.');
        setPayPalError('Failed to load payment processor. Please try again later.');
      };
      document.body.appendChild(script);
    } else {
      // If the script already exists, we can consider it loaded
      setIsPayPalSdkLoaded(true);
    }

    // Safe cleanup function
    return () => {
      try {
        const scriptToRemove = document.getElementById(scriptId);
        if (scriptToRemove && scriptToRemove.parentNode) {
          scriptToRemove.parentNode.removeChild(scriptToRemove);
        }
      } catch (error) {
        console.warn('Error removing PayPal script:', error);
        // Don't throw an error to prevent app crashes
      }
    };
  }, []);

  const handlePayPalPayment = () => {
    if (!window.paypal) {
      console.error('PayPal SDK not loaded.');
      return;
    }

    window.paypal
      .Buttons({
        createOrder: (data: any, actions: any) => {
          return actions.order.create({
            purchase_units: [
              {
                amount: {
                  value: (calculateAmount() / 100).toFixed(2),
                  currency_code: 'USD',
                },
                description: `${plan?.title || 'The Kickstart'} Training Plan + Initiation Fee`,
              },
            ],
          });
        },
        onApprove: (data: any, actions: any) => {
          return actions.order.capture().then((details: any) => {
            navigate('/registration-flow/confirmation', {
              state: {
                formState: currentFormState,
                paymentMethod: 'PayPal',
                plan,
              },
            });
          });
        },
        onError: (err: any) => {
          console.error('PayPal payment error:', err);
          alert('Payment failed. Please try again.');
        },
      })
      .render('#paypal-button-container');
  };

  useEffect(() => {
    if (isPayPalSdkLoaded) {
      handlePayPalPayment();
    }
  }, [isPayPalSdkLoaded]);

  const handleVenmoPayment = (selectedPlan: Plan) => {
    const venmoUsername = 'Lige-Stiner'; // Venmo username

    // Extract the monthly price from the selected plan object
    let amount = 195; // Default to 195 if no price is found

    if (selectedPlan?.price) {
      // Extract the monthly amount (e.g., "$440/month ($55/session)" → 440)
      const monthlyPriceMatch = selectedPlan.price.match(/\$(\d+)\/month/);
      if (monthlyPriceMatch) {
        amount = parseInt(monthlyPriceMatch[1]);
      } else {
        // If no monthly price is found, check for other formats (e.g., "$350/year")
        const yearlyPriceMatch = selectedPlan.price.match(/\$(\d+)\/year/);
        if (yearlyPriceMatch) {
          amount = parseInt(yearlyPriceMatch[1]);
        } else {
          // If no monthly or yearly price is found, use the session price as a fallback
          const sessionPriceMatch = selectedPlan.price.match(/\$(\d+)\/session/);
          if (sessionPriceMatch) {
            amount = parseInt(sessionPriceMatch[1]);
          }
        }
      }
    }

    // Create a note for the Venmo payment
    const note = `${selectedPlan?.title} Training Plan`;

    // Construct the Venmo URL for the app
    const venmoUrl = `venmo://paycharge?txn=pay&recipients=${venmoUsername}&amount=${amount}&note=${encodeURIComponent(note)}`;

    // Fallback URL for Venmo web
    const webFallbackUrl = `https://venmo.com/${venmoUsername}?txn=pay&amount=${amount}&note=${encodeURIComponent(note)}`;

    // Check if the user is on a mobile device
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

    if (isMobile) {
      // Attempt to open the Venmo app
      window.location.href = venmoUrl;

      // Fallback to the web version if the app doesn't open
      setTimeout(() => {
        if (!document.hidden) {
          window.open(webFallbackUrl, '_blank');
        }
      }, 500); // 500ms delay for fallback
    } else {
      // Directly open the web version on desktop
      window.open(webFallbackUrl, '_blank');
    }

    // Delay navigation to the confirmation page
    setTimeout(() => {
      navigate('/registration-flow/confirmation', {
        state: {
          formState: currentFormState,
          paymentMethod: 'Venmo',
          plan: selectedPlan,
          amount: amount,
        },
      });
    }, 1000); // Delay navigation by 1 second
  };

  const handleCreditCardPayment = async () => {
    try {
      // Show loading state to user
      setIsProcessing(true);
      console.log('Starting payment process with plan:', typedPlan);

      // Remove test mode bypass to allow actual payment processing
      // Process payment with Stripe checkout session
      const apiUrl = '/api/create-checkout-session';
      console.log('Connecting to payment API at:', apiUrl);

      // Create a checkout session - proxy handles routing to the correct server port
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: calculateAmount(),
          planPrice: getPlanPrice() * 100, // In cents
          initiationFee: getInitiationFee() * 100, // In cents
          currency: 'usd',
          description: `${plan?.title || 'The Kickstart'} Training Plan + Initiation Fee`,
          plan: typedPlan,
          successUrl: `${window.location.origin}/registration-flow/confirmation?session_id={CHECKOUT_SESSION_ID}&planId=${typedPlan.id}`,
          cancelUrl: `${window.location.origin}/registration-flow/payment-selection`,
        }),
      });

      // Check for network errors first
      if (!response) {
        throw new Error("Network error: Could not connect to payment server. Make sure the server is running.");
      }

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Payment API response error:', response.status, errorText);
        let errorMessage;

        try {
          // Try to parse as JSON
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || 'Failed to create checkout session';
        } catch (e) {
          // If not JSON, use the raw text
          errorMessage = errorText || 'Failed to create checkout session';
        }

        throw new Error(errorMessage);
      }

      const data = await response.json();
      console.log('Payment session created successfully:', data);
      const { url } = data;

      if (!url) {
        throw new Error('Invalid response from payment server: missing checkout URL');
      }

      // Redirect to Checkout
      console.log('Redirecting to payment page:', url);
      window.location.href = url;
    } catch (error) {
      console.error('Error redirecting to checkout:', error);
      // Display specific error message to user
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';

      // Show a more helpful error message to the user
      alert(
        `Payment processing error: ${errorMessage}
        
This may be because the payment server is not running. Please ensure you're running both the frontend and backend using:
npm run dev:all`
      );
      setShowPriceBreakdown(false);
    } finally {
      setIsProcessing(false);
    }
  };

  // Handle Zelle payment selection
  const handleZellePayment = () => {
    // Get client email from form state
    const clientEmail = currentFormState?.email || '';
    console.log('Zelle payment with client email:', clientEmail);

    setShowZelleInstructions({
      ...showZelleInstructions,
      show: true,
      amount: totalPrice,
      note: `${typedPlan?.title || 'Fitness'} Training Plan`,
    });
  };

  // When user confirms Zelle payment, include email in navigation state
  const handleZellePaymentComplete = () => {
    // Get a direct reference to the email to make sure it's passed
    const clientEmail = currentFormState?.email || '';
    console.log('Completing Zelle payment with email:', clientEmail);

    setShowZelleInstructions({ ...showZelleInstructions, show: false });
    navigate('/registration-flow/confirmation', {
      state: {
        formState: currentFormState,
        email: clientEmail, // Add email directly to state root for easier access
        paymentMethod: 'Zelle',
        plan: typedPlan,
        amount: totalPrice,
        testMode: true
      },
    });
  };

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8 pt-16 sm:pt-24 md:pt-28 lg:pt-32">
      <div className="container mx-auto max-w-4xl mt-10 sm:mt-0">
        <RegistrationHeader plan={typedPlan} />
        {typedPlan && <PlanDetails plan={typedPlan} />}
      </div>

      {/* Price Breakdown Modal */}
      {showPriceBreakdown && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-4 sm:p-6 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-orange-500 mb-4">Payment Summary</h2>

            <div className="space-y-4 mb-6">
              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-gray-300">{typedPlan.title}</span>
                <span className="text-white font-medium">${getPlanPrice()}</span>
              </div>

              <div className="flex justify-between items-center border-b border-zinc-800 pb-2">
                <span className="text-gray-300">Initiation Fee</span>
                <span className="text-white font-medium">${getInitiationFee()}</span>
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-gray-200 font-bold">Total</span>
                <span className="text-orange-500 font-bold text-xl">${totalPrice}</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <button
                onClick={() => setShowPriceBreakdown(false)}
                className="py-2 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors sm:flex-1"
              >
                Cancel
              </button>
              <button
                onClick={() => proceedToPayment('card')}
                className="py-2 bg-orange-500 hover:bg-orange-600 text-black font-bold rounded-lg transition-colors sm:flex-1"
              >
                Proceed to Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Zelle Instructions Modal */}
      {showZelleInstructions.show && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4">
          <div className="bg-zinc-900 rounded-xl border border-zinc-700 p-6 sm:p-8 max-w-md w-full">
            <h2 className="text-xl sm:text-2xl font-bold text-blue-500 mb-4">Pay with Zelle</h2>

            <div className="space-y-6 mb-6">
              <p className="text-white text-sm sm:text-base">
                Follow these steps to complete your payment using Zelle:
              </p>

              <ol className="list-decimal pl-5 text-zinc-300 space-y-3">
                <li>Open your banking app or go to your bank's website</li>
                <li>Select Zelle or Send Money option</li>
                <li>Add a recipient using the information below</li>
                <li>Enter the exact amount: <span className="font-bold text-white">${showZelleInstructions.amount}</span></li>
                <li>Add this memo/note: <span className="font-bold text-white">{showZelleInstructions.note}</span></li>
                <li>Complete the payment</li>
                <li>Click "I've Completed Payment" below</li>
              </ol>

              <div className="bg-blue-900/30 border border-blue-500/20 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Email:</span>
                  <span className="text-white font-medium">{showZelleInstructions.email}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Phone:</span>
                  <span className="text-white font-medium">{showZelleInstructions.phone}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Amount:</span>
                  <span className="text-blue-400 font-bold">${showZelleInstructions.amount}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-zinc-400">Memo/Note:</span>
                  <span className="text-white font-medium">{showZelleInstructions.note}</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:space-x-3 space-y-2 sm:space-y-0">
              <button
                onClick={() => setShowZelleInstructions({ ...showZelleInstructions, show: false })}
                className="py-2 border border-zinc-700 rounded-lg hover:bg-zinc-800 transition-colors sm:flex-1"
              >
                Cancel
              </button>
              <button
                onClick={handleZellePaymentComplete}
                className="py-2 bg-blue-500 hover:bg-blue-600 text-white font-bold rounded-lg transition-colors sm:flex-1"
              >
                I've Completed Payment
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Selection Title - Enhanced styling with gradient and better spacing */}
      <h1 className="text-2xl sm:text-3xl md:text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-white via-[#DB6E1E] to-[#DB6E1E] mt-8 mb-10 text-center relative">
        Payment Selection
        <div className="w-24 h-1 bg-[#DB6E1E] mx-auto mt-3 rounded-full"></div>
      </h1>

      <div className="flex flex-col justify-center w-full max-w-4xl gap-8">
        {/* Credit/Debit Card Option */}
        <div
          onClick={() => handlePreCheckout('card')}
          className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 sm:p-8 rounded-2xl shadow-[0_15px_30px_rgba(245,158,11,0.2)] border border-orange-500/30 text-center cursor-pointer hover:shadow-[0_20px_40px_rgba(245,158,11,0.3)] hover:translate-y-[-8px] transition-all duration-300 max-w-md w-full transform hover:scale-[1.03] mx-auto"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(245, 158, 11, 0.2), 0 30px 45px -10px rgba(245, 158, 11, 0.15)',
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="transform transition-transform duration-300 hover:rotate-y-5 hover:rotate-x-5 h-full">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-orange-500 h-16 w-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Secure Card Payment</h3>

              {/* Credit Card Icons */}
              <div className="flex justify-center space-x-3 sm:space-x-4 mt-2 mb-1">
                <img
                  src="/images/icons/visa.svg"
                  alt="Visa"
                  className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md transition-transform hover:scale-110"
                  onError={(e) => console.error('Failed to load Visa SVG')}
                />
                <img
                  src="/images/icons/mastercard.svg"
                  alt="Mastercard"
                  className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md transition-transform hover:scale-110"
                  onError={(e) => console.error('Failed to load Mastercard SVG')}
                />
                <img
                  src="/images/icons/amex.svg"
                  alt="Amex"
                  className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md transition-transform hover:scale-110"
                  onError={(e) => console.error('Failed to load Amex SVG')}
                />
                <img
                  src="/images/icons/discover.svg"
                  alt="Discover"
                  className="w-8 h-8 sm:w-10 sm:h-10 drop-shadow-md transition-transform hover:scale-110"
                  onError={(e) => console.error('Failed to load Discover SVG')}
                />
              </div>

              <button
                className="mt-4 px-6 py-3 bg-gradient-to-r from-orange-500 to-orange-600 text-white font-bold rounded-xl shadow-[0_5px_15px_rgba(245,158,11,0.3)] hover:shadow-[0_10px_25px_rgba(245,158,11,0.4)] transform transition-all duration-300 hover:translate-y-[-2px]"
              >
                {isProcessing ? 'Processing...' : 'Pay Now'}
              </button>
            </div>
          </div>
        </div>

        {/* Zelle Payment Option */}
        <div
          onClick={() => handleZellePayment()}
          className="bg-gradient-to-br from-zinc-800 to-zinc-900 p-6 sm:p-8 rounded-2xl shadow-[0_15px_30px_rgba(245,158,11,0.2)] border border-orange-500/30 text-center cursor-pointer hover:shadow-[0_20px_40px_rgba(245,158,11,0.3)] hover:translate-y-[-8px] transition-all duration-300 max-w-md w-full transform hover:scale-[1.03] mx-auto"
          style={{
            backdropFilter: 'blur(10px)',
            WebkitBackdropFilter: 'blur(10px)',
            boxShadow: '0 15px 30px -5px rgba(0, 0, 0, 0.3), 0 10px 15px -3px rgba(0, 0, 0, 0.2), 0 0 0 1px rgba(245, 158, 11, 0.2), 0 30px 45px -10px rgba(245, 158, 11, 0.15)',
            perspective: '1000px',
            transformStyle: 'preserve-3d'
          }}
        >
          <div className="transform transition-transform duration-300 hover:rotate-y-5 hover:rotate-x-5 h-full">
            <div className="flex flex-col items-center justify-center gap-4">
              <div className="bg-blue-500 h-16 w-16 rounded-full flex items-center justify-center shadow-lg transform hover:scale-110 transition-transform">
                <Dumbbell className="h-8 w-8 text-white" />
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-white">Zelle Payment</h3>
              <p className="text-zinc-300 text-sm sm:text-base">
                Pay securely using Zelle
              </p>
            </div>
          </div>
        </div>
      </div>

      <p className="text-white text-sm sm:text-base md:text-lg font-bold bg-gradient-to-r from-[#DB6E1E] to-red-500 p-3 sm:p-4 rounded-lg shadow-xl text-center mt-6 sm:mt-8 mb-10 sm:mb-20 max-w-md sm:max-w-lg mx-auto">
        Complete your registration with your preferred payment method.
      </p>
    </div>
  );
};

export default GymPaymentSelection;
