// src/pages/RegistrationFlow/GymPaymentConfirmation.tsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { useGymForm } from '../GymRegistrationForm/contexts/GymFormContext';
import type { Plan } from "../TrainingOptions/components/types";
import RegistrationHeader from "../GymRegistrationForm/components/RegistrationHeader";
import { CheckCircle, AlertTriangle } from 'lucide-react';

const GymPaymentConfirmation = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const [searchParams] = useSearchParams();
    const { formState } = useGymForm();

    const [isLoading, setIsLoading] = useState(true);
    const [success, setSuccess] = useState<boolean | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [paymentDetails, setPaymentDetails] = useState<any>(null);

    // Get payment details from URL or location state
    const sessionId = searchParams.get('session_id');
    const paymentMethod = location.state?.paymentMethod || 'Credit Card';
    const plan = location.state?.plan || formState.selectedPlan;
    const isTestMode = location.state?.testMode === true;

    // Fetch Stripe payment details if session_id is available
    useEffect(() => {
        const fetchPaymentDetails = async () => {
            // For test mode, bypass server verification
            if (isTestMode) {
                console.log('TEST MODE: Bypassing payment verification');
                setPaymentDetails({
                    amount_total: (getPlanPrice() + getInitiationFee()) * 100,
                    payment_method_types: [paymentMethod],
                    created: Date.now() / 1000,
                    test_mode: true
                });
                setSuccess(true);
                setIsLoading(false);
                return;
            }

            if (sessionId) {
                try {
                    const response = await fetch(`/api/checkout-session?session_id=${sessionId}`);

                    if (!response.ok) {
                        throw new Error('Failed to fetch payment details');
                    }

                    const data = await response.json();
                    setPaymentDetails(data);
                    setSuccess(true);
                } catch (error) {
                    console.error('Error fetching payment details:', error);
                    setError('Unable to verify payment. Please contact support.');
                    setSuccess(false);
                }
            } else if (location.state?.paymentMethod) {
                // For non-Stripe payments (PayPal, Venmo)
                setPaymentDetails({
                    amount_total: location.state.amount ? location.state.amount * 100 : undefined,
                    payment_method_types: [location.state.paymentMethod],
                    created: Date.now() / 1000
                });
                setSuccess(true);
            } else {
                setError('Payment information not found');
                setSuccess(false);
            }

            setIsLoading(false);
        };

        fetchPaymentDetails();
    }, [sessionId, location.state, isTestMode]);

    // Send contract and registration copies only after successful payment
    useEffect(() => {
        if (success && !isLoading) {
            sendContractAndRegistrationCopies();
        }
    }, [success, isLoading]);

    const sendContractAndRegistrationCopies = async () => {
        try {
            const clientName = `${formState.firstName} ${formState.lastName}`;
            const clientEmail = formState.email;
            // Fix: Access contractUrl through the contractInfo object
            const contractUrl = formState.contractInfo?.contractUrl || location.state?.formState?.contractInfo?.contractUrl || location.state?.contractUrl;
            const planName = plan?.title;

            // Create payment details object
            const paymentInfo = {
                amount: paymentDetails?.amount_total ? (paymentDetails.amount_total / 100).toFixed(2) :
                    (location.state?.amount || ''),
                method: paymentMethod,
                transactionId: sessionId || `${Date.now()}`
            };

            console.log('Sending post-payment notifications with:', {
                clientName,
                clientEmail,
                contractUrlPresent: !!contractUrl,
                planName,
                paymentInfoPresent: !!paymentInfo
            });

            // Send both contract and registration copies in one request
            const response = await fetch('/api/post-payment-actions', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    clientName,
                    clientEmail,
                    contractUrl,
                    registrationData: formState,
                    paymentDetails: paymentInfo,
                    planName
                }),
            });

            const data = await response.json();
            console.log('Post-payment actions completed:', data);

            if (!data.success) {
                console.warn('Email sending had issues:', data);
            }
        } catch (error) {
            console.error('Error sending contract and registration copies:', error);
            // Don't show error to user - payment was still successful
        }
    };

    const getPlanPrice = () => {
        if (!plan) return 0;
        const priceMatch = plan.price?.match(/\$(\d+)/);
        return priceMatch ? parseInt(priceMatch[1]) : 195;
    };

    const getInitiationFee = () => {
        if (!plan) return 0;
        const initiationMatch = plan.initiationFee?.match(/\$(\d+)/);
        return initiationMatch ? parseInt(initiationMatch[1]) : 100;
    };

    const formatDate = (timestamp: number) => {
        return new Date(timestamp * 1000).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    if (isLoading) {
        return (
            <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
                <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-orange-500 mb-4"></div>
                <h2 className="text-xl font-semibold">Verifying your payment...</h2>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center px-4 py-8 pt-16">
            <div className="container mx-auto max-w-3xl mt-10 sm:mt-0">
                {plan && <RegistrationHeader plan={plan as Plan} />}
            </div>

            <div className="bg-zinc-900 border border-zinc-800 rounded-lg max-w-2xl w-full p-6 mt-8">
                {success ? (
                    <div className="text-center">
                        <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-green-500 mb-2">Payment Successful!</h1>
                        <p className="text-gray-300 mb-6">Thank you for your payment. Your registration is now complete.</p>

                        <div className="bg-zinc-800 rounded-lg p-4 text-left mb-6">
                            <h2 className="text-xl font-bold text-orange-500 mb-3">Payment Summary</h2>
                            <div className="space-y-2">
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Plan:</span>
                                    <span className="text-white font-medium">{plan?.title || 'Personal Training'}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Monthly Fee:</span>
                                    <span className="text-white font-medium">${getPlanPrice()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Initiation Fee:</span>
                                    <span className="text-white font-medium">${getInitiationFee()}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-400">Payment Method:</span>
                                    <span className="text-white font-medium">{paymentMethod}</span>
                                </div>
                                {paymentDetails?.created && (
                                    <div className="flex justify-between">
                                        <span className="text-gray-400">Date:</span>
                                        <span className="text-white font-medium">{formatDate(paymentDetails.created)}</span>
                                    </div>
                                )}
                                <div className="border-t border-gray-700 my-2 pt-2 flex justify-between">
                                    <span className="text-gray-300 font-bold">Total Paid:</span>
                                    <span className="text-orange-500 font-bold">${getPlanPrice() + getInitiationFee()}</span>
                                </div>
                            </div>
                        </div>

                        <div className="bg-green-900/30 border border-green-700/50 rounded-lg p-4 mb-6">
                            <p className="text-green-400">
                                A confirmation email with your contract and registration details has been sent to your email address.
                            </p>
                        </div>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="text-center">
                        <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4" />
                        <h1 className="text-2xl sm:text-3xl font-bold text-red-500 mb-2">Payment Verification Failed</h1>
                        <p className="text-gray-300 mb-6">{error || 'We couldn\'t verify your payment. Please contact support.'}</p>

                        <div className="flex flex-col sm:flex-row justify-center gap-3">
                            <button
                                onClick={() => navigate('/registration-flow/payment-selection')}
                                className="px-6 py-3 border border-orange-500 text-orange-500 font-bold rounded-lg hover:bg-orange-500/10 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => navigate('/')}
                                className="px-6 py-3 bg-orange-500 text-black font-bold rounded-lg hover:bg-orange-600 transition-colors"
                            >
                                Return to Home
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default GymPaymentConfirmation;