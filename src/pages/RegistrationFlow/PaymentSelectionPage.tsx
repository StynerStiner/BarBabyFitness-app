import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGymForm } from '@/pages/GymRegistrationForm/contexts/GymFormContext';
import type { Plan } from '@/pages/TrainingOptions/components/types';
import RegistrationHeader from '@/pages/GymRegistrationForm/components/RegistrationHeader';
import { Card, CardContent } from '@/components/ui/Card';
import HeroSection from '@/pages/GymRegistrationForm/components/HeroSection';
import { Button } from '@/components/ui/Button';

interface PaymentMethod {
    id: string;
    name: string;
    description: string;
    icon: React.ReactNode;
}

/**
 * PaymentSelectionPage component handles the payment selection and processing
 * for the gym registration, collecting payment information and completing the registration.
 */
const PaymentSelectionPage: React.FC = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { formState, updateField, setPaymentInfo, completeRegistration } = useGymForm();

    // Get selected plan from location state or formState
    const selectedPlan = location.state?.selectedPlan as Plan | null || formState.selectedPlan;

    // State for payment selection
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState<string | null>(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [paymentError, setPaymentError] = useState<string | null>(null);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);

    // Redirect if no plan selected
    useEffect(() => {
        if (!selectedPlan) {
            navigate('/training-options');
        }
        if (!formState.contractInfo) {
            navigate('/registration-flow/contract-and-waiver');
        }
    }, [selectedPlan, formState.contractInfo, navigate]);

    // Available payment methods
    const paymentMethods: PaymentMethod[] = [
        {
            id: 'credit-card',
            name: 'Credit/Debit Card',
            description: 'Pay securely with your card',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
            )
        },
        {
            id: 'paypal',
            name: 'PayPal',
            description: 'Fast and secure payment with PayPal',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2z" />
                </svg>
            )
        },
        {
            id: 'bank-transfer',
            name: 'Bank Transfer',
            description: 'Direct deposit to our bank account',
            icon: (
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
            )
        }
    ];

    const handlePaymentMethodSelect = (methodId: string) => {
        setSelectedPaymentMethod(methodId);
        setPaymentError(null);
    };

    const handleProcessPayment = async () => {
        if (!selectedPaymentMethod) {
            setPaymentError('Please select a payment method');
            return;
        }

        // Add an additional null check here
        if (!selectedPlan) {
            setPaymentError('No plan selected. Please go back and select a plan.');
            return;
        }

        setIsProcessing(true);
        setPaymentError(null);

        try {
            // Now TypeScript knows selectedPlan is not null
            const price = parseInt(selectedPlan.price.replace(/\$/g, '') || '195', 10);
            const fee = parseInt(selectedPlan.initiationFee.replace(/\$/g, '') || '100', 10);
            const totalAmount = price + fee;

            // In a real application, you would integrate with a payment gateway here
            // For this example, we'll simulate a successful payment after a delay
            await new Promise(resolve => setTimeout(resolve, 2000));

            // Create payment information
            const paymentInfo = {
                paymentMethod: selectedPaymentMethod,
                transactionId: `TRANS-${Date.now()}`,
                sessionId: `SESSION-${Date.now()}`,
                paymentStatus: 'completed',
                paymentDate: new Date().toISOString(),
                totalAmount
            };

            // Save payment information to context
            setPaymentInfo(paymentInfo);
            
            // Complete the registration
            completeRegistration();

            // Show success message
            setSuccessMessage('Payment processed successfully! Your registration is now complete.');

            // Redirect to confirmation page after a delay
            setTimeout(() => {
                navigate('/registration-flow/confirmation', {
                    state: {
                        registrationData: formState
                    }
                });
            }, 3000);

        } catch (error) {
            console.error('Payment processing error:', error);
            setPaymentError('There was an error processing your payment. Please try again.');
        } finally {
            setIsProcessing(false);
        }
    };

    if (!selectedPlan) {
        return <div>Please select a plan to proceed.</div>;
    }

    // Calculate total price
    const calculateTotalPrice = () => {
        const price = parseInt(selectedPlan.price.replace(/\$/g, '') || '195', 10);
        const fee = parseInt(selectedPlan.initiationFee.replace(/\$/g, '') || '100', 10);
        return price + fee;
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#1a1a1a] text-white">
            <HeroSection />
            <div className="mx-auto max-w-4xl px-4 pt-8 sm:pt-12 md:pt-16">
                <RegistrationHeader plan={selectedPlan ? { ...selectedPlan, perks: selectedPlan.perks || '', icon: selectedPlan.icon } : null} />
            </div>

            <div className="container mx-auto px-4 py-8 max-w-4xl">
                <Card className="bg-[#1a1a1a]/90 backdrop-blur border-orange-500/20 p-2 sm:p-4 md:p-6 lg:p-8">
                    <CardContent className="p-2 sm:p-4 md:p-6 lg:p-8">
                        <h1 className="mb-4 sm:mb-8 text-center">
                            <span className="inline-block px-3 sm:px-6 py-2 sm:py-3 bg-orange-500 text-white text-xl sm:text-2xl md:text-3xl lg:text-4xl font-extrabold uppercase tracking-wider rounded-lg shadow-lg border-2 border-orange-400">
                                Payment Selection
                            </span>
                        </h1>

                        {/* Payment Summary */}
                        <div className="mb-6 sm:mb-10 p-4 sm:p-6 bg-orange-500/10 rounded-lg border border-orange-500/20">
                            <h2 className="text-xl sm:text-2xl font-bold text-orange-400 mb-4">Payment Summary</h2>
                            <div className="space-y-3">
                                <div className="flex justify-between">
                                    <span className="text-gray-300">{selectedPlan.title} Plan</span>
                                    <span className="font-semibold">{selectedPlan.price.replace(/\$/g, '')}</span>
                                </div>
                                <div className="flex justify-between">
                                    <span className="text-gray-300">Initiation Fee</span>
                                    <span className="font-semibold">{selectedPlan.initiationFee.replace(/\$/g, '')}</span>
                                </div>
                                <div className="border-t border-orange-500/20 pt-3 flex justify-between">
                                    <span className="text-lg font-bold text-white">Total Due Today</span>
                                    <span className="text-lg font-bold text-orange-400">${calculateTotalPrice()}</span>
                                </div>
                            </div>
                        </div>

                        {/* Payment Methods */}
                        <div className="mb-6 sm:mb-10">
                            <h2 className="text-xl font-bold text-orange-400 mb-4">Select Payment Method</h2>
                            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                {paymentMethods.map(method => (
                                    <div
                                        key={method.id}
                                        className={`cursor-pointer p-4 rounded-lg border ${selectedPaymentMethod === method.id
                                                ? 'border-orange-500 bg-orange-500/20'
                                                : 'border-gray-700 hover:border-orange-500/50'
                                            } transition-all duration-200`}
                                        onClick={() => handlePaymentMethodSelect(method.id)}
                                    >
                                        <div className="flex items-center space-x-3 mb-2">
                                            <div className={`${selectedPaymentMethod === method.id ? 'text-orange-400' : 'text-gray-300'}`}>
                                                {method.icon}
                                            </div>
                                            <h3 className="font-semibold">{method.name}</h3>
                                        </div>
                                        <p className="text-sm text-gray-400">{method.description}</p>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Error and Success Messages */}
                        {paymentError && (
                            <div className="mb-6 p-3 bg-red-500/10 border border-red-500 text-red-500 rounded-lg text-center">
                                {paymentError}
                            </div>
                        )}

                        {successMessage && (
                            <div className="mb-6 p-3 bg-green-500/10 border border-green-500 text-green-500 rounded-lg text-center">
                                {successMessage}
                            </div>
                        )}

                        {/* Navigation Buttons */}
                        <div className="flex flex-col sm:flex-row justify-center space-y-3 sm:space-y-0 sm:space-x-4 mt-8">
                            <Button
                                variant="outline"
                                className="px-6 py-3 border-2 border-orange-500 text-orange-500 
                  hover:bg-orange-500 hover:text-white rounded-lg 
                  transition-all duration-200 w-full sm:w-auto"
                                onClick={() => window.history.back()}
                                disabled={isProcessing}
                            >
                                Back
                            </Button>
                            <Button
                                className="px-8 py-3 bg-orange-500 text-white hover:bg-orange-600 
                  rounded-lg transition-all duration-200 w-full sm:w-auto flex justify-center items-center"
                                onClick={handleProcessPayment}
                                disabled={!selectedPaymentMethod || isProcessing}
                            >
                                {isProcessing ? (
                                    <>
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Processing...
                                    </>
                                ) : (
                                    'Process Payment'
                                )}
                            </Button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default PaymentSelectionPage;