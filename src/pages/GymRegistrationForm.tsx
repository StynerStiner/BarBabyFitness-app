import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader } from "@/components/ui/Card";
import EmergencyContactSection from "@/pages/GymRegistrationForm/components/EmergencyContactSection";
import { MembershipSection } from "@/pages/GymRegistrationForm/components/MembershipSection";
import RegistrationHeader from "@/pages/GymRegistrationForm/components/RegistrationHeader";
import { PlanDetails } from "@/pages/GymRegistrationForm/components/PlanDetails";
import HeroSection from "@/pages/GymRegistrationForm/components/HeroSection";
import { MedicalInfoSection } from "@/pages/GymRegistrationForm/components/MedicalInfoSection";
import PersonalInfoSection from "@/pages/GymRegistrationForm/components/PersonalInfoSection";
import HealthMetrics from "@/pages/GymRegistrationForm/components/HealthMetrics";
import { TermsAndSubmit } from "@/pages/GymRegistrationForm/components/TermsAndSubmit";
import { useGymForm } from "@/pages/GymRegistrationForm/contexts/GymFormContext";
import type { Plan } from "@/pages/TrainingOptions/components/types";
import { ValidationResult } from "@/pages/GymRegistrationForm/utils/validationUtils";
import { processFormData } from "@/pages/GymRegistrationForm/utils/formProcessor";
import { validateForm } from "@/pages/GymRegistrationForm/utils/validationUtils";
import { Dumbbell } from "lucide-react";

// Default plan to use when needed
export const DEFAULT_PLAN = {
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
    "$100 initiation fee for new clients",
  ],
  icon: <Dumbbell className="w-10 h-10 text-[#F17A2B]" />,
};

/**
 * GymRegistrationForm is a React functional component responsible for rendering
 * the user interface for the gym registration process. It leverages context to
 * manage form state and handles the submission of registration data.
 * 
 * This component performs the following:
 * - Retrieves the selected gym plan from the React Router location state.
 * - Updates the form context with the selected plan.
 * - Renders several sections for personal information, health metrics, emergency
 *   contact, medical information, and membership details.
 * - Validates form data on submit and navigates to the contract and waiver step
 *   if the data is valid.
 * 
 * Dependencies include components for UI layout, form sections, and utilities
 * for validation and form processing.
 */

export const GymRegistrationForm: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { formState, updateField } = useGymForm();
  const [validationErrors, setValidationErrors] =
    useState<ValidationResult | null>(null);

  // Access the selected plan from location.state
  const selectedPlan = location.state?.selectedPlan as Plan | null;

  useEffect(() => {
    if (selectedPlan) {
      updateField("selectedPlan", selectedPlan);
    }
  }, [selectedPlan, updateField]);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    try {
      const validationResult = await validateForm(formState);
      setValidationErrors(validationResult);

      if (!validationResult.isValid) return;

      const processedData = processFormData(formState);

      const planData = {
        id: selectedPlan?.id || "",
        title: selectedPlan?.title || "",
        duration: selectedPlan?.duration || "",
        price: selectedPlan?.price || "",
      };

      navigate("/registration-flow/contract-and-waiver", {
        state: {
          formData: processedData,
          selectedPlan: planData,
        },
      });
    } catch (error) {
      console.error("Form submission error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-black via-black to-[#1a1a1a] text-white">
      <HeroSection />
      <div className="relative -mt-20 px-4 md:px-6 pb-12 bg-gradient-to-b from-transparent to-black/90">
        <Card className="max-w-4xl mx-auto bg-black/90 border-orange-500/20 backdrop-blur-lg shadow-2xl">
          <CardHeader>
            <RegistrationHeader plan={selectedPlan} />
            {selectedPlan && <PlanDetails plan={selectedPlan} />}
          </CardHeader>
          <CardContent className="space-y-8 mt-6">
            <form onSubmit={handleSubmit} className="space-y-12">
              <PersonalInfoSection />
              <HealthMetrics />
              <EmergencyContactSection />
              <MedicalInfoSection />
              {selectedPlan && <MembershipSection plan={selectedPlan} />}
              <TermsAndSubmit onSubmit={handleSubmit} />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default GymRegistrationForm;