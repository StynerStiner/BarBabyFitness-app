// src/pages/TrainingOptions/index.tsx
import { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useGymForm } from "@/pages/GymRegistrationForm/contexts/GymFormContext";
import {
  Dumbbell,
  Trophy,
  Zap,
} from "lucide-react";
import { Plan } from "@/pages/TrainingOptions/components/types";
import { PlanHeader } from "@/pages/TrainingOptions/components/Plans/PlanHeader";
import { PlanCard } from "@/pages/TrainingOptions/components/PlanSelection/PlanCard";
import { Hero } from "@/pages/TrainingOptions/components/RegistrationController/Shared/Hero";
import LoyaltyRewards from "@/pages/TrainingOptions/components/Plans/LoyaltyRewards";

export const TrainingOptions = () => {
  const [selectedPlan, setSelectedPlan] = useState<string | null>(null);
  const navigate = useNavigate();
  const { updateField } = useGymForm();

  const plans = [
    {
      id: "training",
      title: "Training Packages",
      description: "Choose the right training package for your fitness journey",
      options: [
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
          icon: <Dumbbell className="w-10 h-10 text-[#F17A2B]" />,
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
          icon: <Zap className="w-10 h-10 text-[#F17A2B]" />,
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
          icon: <Zap className="w-10 h-10 text-[#F17A2B]" />,
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
          icon: <Trophy className="w-10 h-10 text-[#F17A2B]" />,
          recommended: true,
        },
      ],
    },
  ];

  const handlePlanSelect = (planId: string) => {
    setSelectedPlan(planId);

    const selectedPlanData = plans
      .flatMap((category) => category.options)
      .find((plan) => plan.id === planId);

    if (selectedPlanData) {
      const { icon, ...planWithoutIcon } = selectedPlanData;

      const cleanPlan = {
        ...planWithoutIcon,
        price: planWithoutIcon.price,
        initiationFee: planWithoutIcon.initiationFee,
      };

      updateField("selectedPlan", cleanPlan);

      navigate("/register", {
        state: {
          selectedPlan: cleanPlan,
        },
      });
    }
  };

  const renderPlanSection = (planCategory: typeof plans[0]) => {
    return (
      <section key={planCategory.id} className="w-full mb-24">
        <PlanHeader
          backgroundText={planCategory.title.split(" ")[0].toUpperCase()}
          title={planCategory.title}
          description={planCategory.description}
        />
        <div className="max-w-6xl mx-auto px-6 py-12 space-y-6">
          {planCategory.options.map((plan, index) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              isSelected={plan.id === selectedPlan}
              onSelect={() => handlePlanSelect(plan.id)}
              index={index}
            />
          ))}
        </div>
      </section>
    );
  };

  return (
    <main className="bg-black text-white min-h-screen">
      <Hero />
      <div className="py-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-4xl mx-auto px-4 mb-24"
        >
          <h1 className="text-5xl md:text-6xl font-bold mb-8">
            Training Options
          </h1>
          <p className="text-xl text-gray-300">
            Unlock your best self with plans tailored for every goal. Enjoy
            loyalty perks, exclusive merch discounts, and join our supportive
            community.
          </p>
        </motion.div>

        {plans.map(renderPlanSection)}

        <section className="py-24">
          <LoyaltyRewards />
        </section>
      </div>
    </main>
  );
};

export default TrainingOptions;
