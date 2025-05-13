// src/pages/TrainingOptions/hooks/useTrainingPlans.ts
import React, { useMemo } from 'react';
import { Plan } from '../components/types';
import { Dumbbell } from 'lucide-react'; // Import only the necessary icons

interface TrainingPlanDetails {
  sessions: number;
  price: number;
  features: string[];
}

const TRAINING_PLAN_DETAILS: Record<string, TrainingPlanDetails> = {
  basic: {
    sessions: 1,
    price: 240,
    features: [
      'Personalized workout plans',
      'Progress tracking',
      'Initial body composition analysis',
    ],
  },
  standard: {
    sessions: 2,
    price: 440,
    features: [
      'Personalized workout plans',
      'Nutrition guidance',
      'Progress tracking',
      'Quarterly body composition analysis',
    ],
  },
  premium: {
    sessions: 3,
    price: 600,
    features: [
      'Personalized workout plans',
      'Nutrition guidance',
      'Progress tracking',
      'Priority scheduling',
      'Monthly body composition analysis',
    ],
  },
  elite: {
    sessions: 4,
    price: 720,
    features: [
      'Personalized workout plans',
      'Advanced nutrition coaching',
      'Progress tracking',
      'Priority scheduling',
      'Weekly body composition analysis',
      'Recovery guidance',
    ],
  },
};

export const useTrainingPlans = () => {
  const plans = useMemo(
    () =>
      Object.entries(TRAINING_PLAN_DETAILS).map(
        ([id, details]) =>
          ({
            id,
            ...details,
            title: id.charAt(0).toUpperCase() + id.slice(1),
            price: `$${details.price}/month`,
            sessions: `${details.sessions} sessions/month`,
            initiationFee: '$99',
            perks: details.features.join(', '),
            duration: '1-month',
            features: details.features,
            icon: React.createElement(Dumbbell, { className: "w-8 h-8 text-[#DB6E1E]" }), // Correct JSX usage
          }) as Plan,
      ),
    [],
  );

  return {
    plans,
    findPlanById: (planId: string | null) =>
      planId ? plans.find((p) => p.id === planId) : null,
    calculateTotalCost: (plan: Plan) => {
      const priceMatch = plan.price.match(/\$(\d+)/);
      const initFeeMatch = plan.initiationFee.match(/\$(\d+)/);

      const monthlyPrice = priceMatch ? parseInt(priceMatch[1], 10) : 0;
      const initiationFee = initFeeMatch ? parseInt(initFeeMatch[1], 10) : 0;

      return monthlyPrice + initiationFee;
    },
  };
};