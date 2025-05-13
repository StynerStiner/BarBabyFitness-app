// src/pages/RegistrationFlow/StripePayment.tsx
import React, { useEffect, useState } from 'react';
import { useStripe, useElements, CardElement } from '@stripe/react-stripe-js';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGymForm } from '../GymRegistrationForm/contexts/GymFormContext';
import { ArrowLeft } from 'lucide-react';

const CARD_ELEMENT_OPTIONS = {
    style: {
        base: {
            color: '#fff',
            fontSize: '16px',
            fontFamily: '"Inter", sans-serif',
            '::placeholder': {
                color: '#aab7c4',
            },
        },
        invalid: {
            color: '#fa755a',
            iconColor: '#fa755a',
        },
    },
    hidePostalCode: true,
};

export const StripePayment = () => {
    const stripe = useStripe();
    const elements = useElements();
    const navigate = useNavigate();
    const location = useLocation();
    const { formState } = useGymForm();

    const { amount = 19500, currency = 'usd', description = 'Training Plan + Initiation Fee', plan } =
        (location.state as any) || {};

    const [clientSecret, setClientSecret] = useState<string | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!amount) return;

        // Use the full URL for local development
        const apiUrl = process.env.NODE_ENV === 'production' 
            ? '/api/create-payment-intent'
            : 'http://localhost:3002/api/create-payment-intent';

        fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                amount,
                currency,
                description,
            }),
        })
            .then(async (res) => {
                if (!res.ok) {
                    const errorData = await res.json();
                    throw new Error(errorData.message || 'Failed to create payment intent');
                }
                return res.json();
            })
            .then((data) => {
                setClientSecret(data.clientSecret);
            })
            .catch((err) => {
                setError(err.message);
                console.error('Error fetching payment intent:', err);
            });
    }, [amount, currency, description]);

    const handlePay = async () => {
        if (!stripe || !elements || !clientSecret) return;

        setIsLoading(true);
        setError(null);

        const cardElement = elements.getElement(CardElement);
        if (!cardElement) {
            setError('Card element not found');
            setIsLoading(false);
            return;
        }

        try {
            const { paymentIntent, error: paymentError } = await stripe.confirmCardPayment(
                clientSecret,
                {
                    payment_method: {
                        card: cardElement,
                        billing_details: {
                            name: `${formState?.firstName || ''} ${formState?.lastName || ''}` || 'Anonymous',
                            email: formState?.email || '',
                        },
                    },
                }
            );

            if (paymentError) {
                throw new Error(paymentError.message);
            }

            if (paymentIntent && paymentIntent.status === 'succeeded') {
                navigate('/registration-flow/confirmation', {
                    state: {
                        formState,
                        paymentMethod: 'Credit/Debit Card',
                        paymentId: paymentIntent.id,
                        plan,
                    },
                });
            }
        } catch (err: any) {
            setError(err.message || 'Payment failed. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const goBack = () => {
        navigate('/registration-flow/payment-selection', {
            state: {
                formState,
                plan
            }
        });
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8 pt-48">
            <div className="w-full max-w-md">
                <button
                    onClick={goBack}
                    className="flex items-center text-orange-500 hover:text-orange-400 mb-6"
                >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to payment options
                </button>
            </div>

            <h1 className="text-3xl font-bold text-orange-500 mb-6">Complete Payment</h1>

            <div className="max-w-md w-full space-y-6">
                {error && (
                    <div className="p-4 bg-red-900/50 border border-red-500 rounded-lg text-red-200">
                        {error}
                    </div>
                )}

                <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg">
                    <div className="space-y-4">
                        <div className="flex justify-between text-sm">
                            <span className="text-zinc-400">Amount</span>
                            <span className="font-medium">${(amount / 100).toFixed(2)} USD</span>
                        </div>

                        {plan && (
                            <div className="py-2 border-t border-b border-zinc-800 my-3">
                                <p className="font-medium text-orange-500">{plan.title}</p>
                                <p className="text-xs text-zinc-400">{plan.sessions}</p>
                            </div>
                        )}

                        <div className="border border-zinc-800 rounded p-4">
                            <CardElement options={CARD_ELEMENT_OPTIONS} />
                        </div>

                        <button
                            onClick={handlePay}
                            disabled={isLoading || !stripe || !clientSecret}
                            className="w-full px-4 py-2 bg-orange-500 hover:bg-orange-600 disabled:opacity-50 
                                     disabled:cursor-not-allowed text-white rounded-lg transition-colors"
                        >
                            {isLoading ? 'Processing...' : 'Pay Now'}
                        </button>
                    </div>
                </div>

                <p className="text-sm text-zinc-400 text-center">
                    Your payment is processed securely through Stripe.
                    All card information is encrypted and never stored on our servers.
                </p>
            </div>
        </div>
    );
};

export default StripePayment;
