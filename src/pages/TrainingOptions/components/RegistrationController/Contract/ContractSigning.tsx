// src/pages/TrainingOptions/components/RegistrationController/Contract/ContractSigning.tsx

import { motion } from "framer-motion";
import { FileText } from "lucide-react";
import { useState } from "react";
import { SignatureData } from "@/pages/TrainingOptions/components/types";

interface ContractSigningProps {
  formData: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
  };
  selectedPlan: {
    title: string;
    price: string;
  };
  onSubmit: (data: SignatureData) => void;
  onBack: () => void;
}

export const ContractSigning: React.FC<ContractSigningProps> = ({
  formData: initialFormData,
  selectedPlan,
  onSubmit,
  onBack,
}) => {
  const [signatureData, setSignatureData] = useState<SignatureData>({
    signature: "",
    date: new Date().toISOString().split("T")[0],
    acceptedTerms: false,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setSignatureData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!signatureData.acceptedTerms || !signatureData.signature) return;
    onSubmit(signatureData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-3xl mx-auto"
    >
      <div className="bg-zinc-900/50 rounded-2xl p-8 border border-zinc-800">
        <div className="flex items-center gap-3 mb-6">
          <FileText className="w-8 h-8 text-[#DB6E1E]" />
          <h2 className="text-3xl font-bold">Training Agreement</h2>
        </div>

        <div className="mb-6 p-4 bg-[#DB6E1E]/10 rounded-lg">
          <h3 className="font-semibold mb-2">
            Selected Plan: {selectedPlan?.title}
          </h3>
          <p className="text-gray-300">{selectedPlan?.price}</p>
        </div>

        <div className="mb-6">
          <h3 className="font-semibold mb-4">Member Information</h3>
          <div className="grid grid-cols-2 gap-4 text-sm text-gray-300">
            <div>
              <p className="font-medium">Name:</p>
              <p>
                {initialFormData.firstName} {initialFormData.lastName}
              </p>
            </div>
            <div>
              <p className="font-medium">Email:</p>
              <p>{initialFormData.email}</p>
            </div>
            <div>
              <p className="font-medium">Phone:</p>
              <p>{initialFormData.phone}</p>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-2">
                Digital Signature
              </label>
              <input
                type="text"
                name="signature"
                value={signatureData.signature}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 rounded-lg border border-zinc-800 focus:border-orange-500 focus:outline-none"
                placeholder="Type your full name as signature"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Date</label>
              <input
                type="date"
                name="date"
                value={signatureData.date}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-black/50 rounded-lg border border-zinc-800 focus:border-orange-500 focus:outline-none"
                required
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="acceptedTerms"
                checked={signatureData.acceptedTerms}
                onChange={handleChange}
                className="rounded border-zinc-800"
                required
              />
              <label className="text-sm text-gray-300">
                I agree to the terms and conditions
              </label>
            </div>
          </div>

          <div className="flex gap-4">
            <button
              type="button"
              onClick={onBack}
              className="w-full px-4 py-2 rounded-lg border border-zinc-800 hover:border-orange-500 transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              disabled={
                !signatureData.acceptedTerms || !signatureData.signature
              }
              className="w-full px-4 py-2 rounded-lg bg-[#DB6E1E] hover:bg-[#DB6E1E]/90 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Continue to Payment
            </button>
          </div>
        </form>
      </div>
    </motion.div>
  );
};
