import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useGymForm } from '../GymRegistrationForm/contexts/GymFormContext';
import type { FormState, Plan } from '../GymRegistrationForm/contexts/GymFormContext';

interface LocationState {
    formState?: FormState;
    plan?: Plan;
}

export const VenmoPayment = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const state = location.state as LocationState;

    const { formState: contextFormState } = useGymForm();
    const currentFormState = state?.formState || contextFormState;
    const plan = currentFormState.selectedPlan || state?.plan;

    // Helper function to extract the numeric value from a price string (e.g., "$195/month")
    const extractPrice = (price: string | undefined): number => {
        if (!price) return 0; // Return 0 if price is undefined or null
        const match = price.match(/\$(\d+)/);
        return match ? parseInt(match[1], 10) : 0; // Return 0 if no match is found
    };

    const monthlyPrice = extractPrice(plan?.price);
    const initiationFee = extractPrice(plan?.initiationFee);
    const totalDue = monthlyPrice + initiationFee;

    const handleGoBack = () => {
        navigate('/registration-flow/payment-selection', {
            state: {
                formState: currentFormState,
                plan,
            },
        });
    };

    return (
        <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center px-4 py-8">
            <h1 className="text-3xl font-bold text-orange-500 mb-6">Venmo Payment</h1>

            <div className="bg-zinc-900 p-8 rounded-lg shadow-md border border-zinc-800 text-center max-w-2xl w-full">
                <h2 className="text-xl text-orange-500 mb-4">{plan?.title || 'The Kickstart'} Plan</h2>
                <p className="text-gray-300">Monthly Fee: {plan?.price || '$195/month'}</p>
                <p className="text-gray-300">Initiation Fee: {plan?.initiationFee || '$100'}</p>
                <p className="text-gray-300 font-bold mt-4">Total Due Today: ${totalDue.toFixed(2)}</p>

                <div className="mt-6">
                    <p className="text-gray-300 mb-4">
                        To complete your payment via Venmo, please send the total amount to:
                    </p>
                    <p className="text-orange-500 font-semibold">@YourVenmoUsername</p>
                    <p className="text-gray-300 mt-2">
                        Once the payment is confirmed, your registration will be complete.
                    </p>
                </div>

                <button
                    onClick={handleGoBack}
                    className="mt-6 bg-orange-500 text-white px-6 py-2 rounded-lg hover:bg-orange-600 transition-colors"
                >
                    Go Back
                </button>
            </div>
        </div>
    );
};

export default VenmoPayment;