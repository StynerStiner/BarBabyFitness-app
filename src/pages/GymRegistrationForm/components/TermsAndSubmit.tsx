// src/pages/GymRegistrationForm/components/TermsAndSubmit.tsx

import React, { FC } from "react";
import { useNavigate } from "react-router-dom";

import { Checkbox } from "../../../components/ui/checkbox";
import { Label } from "../../../components/ui/Label";
import { Button } from "../../../components/ui/Button";
import { useGymForm } from "../contexts/GymFormContext";

interface TermsAndSubmitProps {
  onSubmit: (event: React.FormEvent<HTMLFormElement>) => void;
}

export const TermsAndSubmit: FC<TermsAndSubmitProps> = ({ onSubmit }) => {
  const { formState, updateField } = useGymForm();
  const navigate = useNavigate();

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    try {
      console.log("TermsAndSubmit - Starting submission process");

      const form = (e.currentTarget as HTMLButtonElement).form as HTMLFormElement;
      const formEvent = {
        preventDefault: () => { },
        currentTarget: form,
        target: form,
      } as unknown as React.FormEvent<HTMLFormElement>;

      onSubmit(formEvent);

      if (!formState.selectedPlan) {
        console.error("TermsAndSubmit - No selected plan found in formState");
        throw new Error("No plan selected. Please restart the registration process.");
      }

      // Create a clean plan object without the icon
      const planData = {
        id: formState.selectedPlan.id,
        title: formState.selectedPlan.title,
        duration: formState.selectedPlan.duration,
        price: formState.selectedPlan.price
      };

      navigate("/registration-flow/contract-and-waiver", {
        state: {
          formData: {
            clientName: `${formState.firstName} ${formState.lastName}`,
            signatureDate: new Date().toISOString().split('T')[0],
            agreedToContract: false,
            agreedToWaiver: false,
          },
          selectedPlan: planData
        },
      });
    } catch (error) {
      console.error("TermsAndSubmit - Error:", error);
      alert(error instanceof Error ? error.message : "An unexpected error occurred");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-2">
        <Checkbox
          id="terms"
          checked={formState.agreedToTerms}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
            updateField("agreedToTerms", e.target.checked);
          }}
          className="border-orange-500 text-white data-[state=checked]:bg-orange-500 data-[state=checked]:border-orange-500"
        />
        <Label htmlFor="terms" className="text-white">
          I agree to the{" "}
          <a
            href="/terms"
            className="text-orange-400 hover:text-orange-300 underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            terms & conditions
          </a>
        </Label>
      </div>

      <Button
        type="button"
        disabled={!formState.agreedToTerms}
        onClick={handleClick}
        className="w-auto mx-auto px-16 bg-gradient-to-r from-orange-500 to-[#DB6E1E] hover:from-orange-600 hover:to-[#c25f18] text-white font-semibold py-6 text-lg shadow-lg transition-all duration-300 ease-in-out transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
      >
        Complete Registration
      </Button>
    </div>
  );
};