// src/pages/TrainingOptions/hooks/usePlans.tsx
import React, { JSX } from 'react';
import {
  Dumbbell,
  Trophy,
} from "lucide-react";

export interface Plan {
  id: string;
  title: string;
  duration: string;
  initiationFee: string;
  sessions: string;
  price: string;
  perks: string;
  icon: JSX.Element;
  recommended?: boolean;
  features?: string[];
}

export const usePlans = () => {
  const plans: Plan[] = [
    {
      id: "kickstart",
      title: "Barbaby Kick Starter",
      duration: "Valid for 30 days",
      initiationFee: "$100",
      sessions: "3 sessions",
      price: "$195",
      perks: "Perfect for beginners",
      features: [
        "3 One-hour Training Sessions",
        "Valid for 30 days",
        "Perfect for beginners",
        "Personalized workout plan",
        "Fitness assessment",
        "$100 initiation fee for new clients"
      ],
      icon: <Dumbbell className="w-8 h-8 text-[#DB6E1E]" />,
    },
    {
      id: "steady-climb",
      title: "Barbaby Steady Climb",
      duration: "Valid for 30 days",
      initiationFee: "$100",
      sessions: "4 sessions",
      price: "$240",
      perks: "Structured progression plan",
      features: [
        "4 One-hour Training Sessions",
        "Valid for 30 days",
        "Structured progression plan",
        "Nutrition guidance",
        "Weekly progress tracking",
        "$100 initiation fee for new clients"
      ],
      icon: <Dumbbell className="w-8 h-8 text-[#DB6E1E]" />,
    },
    {
      id: "power-surge",
      title: "Barbaby Power Surge",
      duration: "Valid for 30 days",
      initiationFee: "$100",
      sessions: "8 sessions",
      price: "$440",
      perks: "Intensive training program",
      features: [
        "8 One-hour Training Sessions",
        "Valid for 30 days",
        "Intensive training program",
        "Advanced fitness assessment",
        "Customized meal planning",
        "$100 initiation fee for new clients"
      ],
      icon: <Trophy className="w-8 h-8 text-[#DB6E1E]" />,
      recommended: true,
    },
    {
      id: "elite-focus",
      title: "Barbaby Elite Focus",
      duration: "Valid for 30 days",
      initiationFee: "$100",
      sessions: "12 sessions",
      price: "$600",
      perks: "Elite level programming",
      features: [
        "12 One-hour Training Sessions",
        "Valid for 30 days",
        "Elite level programming",
        "Priority scheduling",
        "Comprehensive progress tracking",
        "$100 initiation fee for new clients"
      ],
      icon: <Trophy className="w-8 h-8 text-[#DB6E1E]" />,
      recommended: true,
    },
  ];

  return { plans };
};
