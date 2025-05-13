import { Button } from "@/components/ui/Button";
import { useState } from "react";
import { ContractContent } from "./ContractContent";
import {
  validateRegistrationForm,
  handleFormError,
  formatPhoneNumber,
} from "../../utils";
import { RegistrationFormData, ContractFormProps } from "@/pages/TrainingOptions/components/types";

export const ContractForm: React.FC<ContractFormProps> = ({
  selectedPlan,
  onSubmit,
  onBack,
  initialData,
}) => {
  const [hasReadContract, setHasReadContract] = useState(false);
  const [formData, setFormData] = useState<Partial<RegistrationFormData>>({
    fullName: initialData?.fullName || "",
    email: initialData?.email || "",
    phone: initialData?.phone || "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      // Validate form data
      const { isValid, errors: validationErrors } =
        await validateRegistrationForm(formData);

      if (!isValid && validationErrors) {
        setErrors(validationErrors);
        return;
      }

      // Format phone number before submission
      const formattedData = {
        ...formData,
        phone: formatPhoneNumber(formData.phone || ""),
        selectedPlanId: selectedPlan?.id,
      };

      await onSubmit(formattedData);
    } catch (error) {
      const errorResponse = handleFormError(error);
      setErrors({ submit: errorResponse.message });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {selectedPlan && (
        <div className="mb-6 p-4 bg-black/20 rounded-lg">
          <h3 className="text-lg font-semibold text-orange-500">
            Selected Plan: {selectedPlan.title}
          </h3>
          <p className="text-gray-300">{selectedPlan.price}</p>
        </div>
      )}

      <div className="mb-6">
        <div className="bg-black/30 rounded-lg p-6">
          <div className="max-h-[400px] overflow-y-auto pr-4 custom-scrollbar">
            <ContractContent />
          </div>
        </div>

        <div className="mt-4 flex items-start gap-3">
          <input
            type="checkbox"
            id="contractAgreement"
            checked={hasReadContract}
            onChange={(e) => setHasReadContract(e.target.checked)}
            className="mt-1.5"
          />
          <label htmlFor="contractAgreement" className="text-sm text-gray-300">
            I have read, understood, and agree to the terms and conditions
            outlined in this contract.
          </label>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Full Name</label>
        <input
          type="text"
          name="fullName"
          value={formData.fullName || ""}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-black/50 rounded-lg border ${errors.fullName ? "border-red-500" : "border-zinc-800"
            } focus:border-orange-500 focus:outline-none`}
          placeholder="Enter your full name"
          required
        />
        {errors.fullName && (
          <p className="mt-1 text-sm text-red-500">{errors.fullName}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Email</label>
        <input
          type="email"
          name="email"
          value={formData.email || ""}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-black/50 rounded-lg border ${errors.email ? "border-red-500" : "border-zinc-800"
            } focus:border-orange-500 focus:outline-none`}
          placeholder="Enter your email"
          required
        />
        {errors.email && (
          <p className="mt-1 text-sm text-red-500">{errors.email}</p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Phone</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone || ""}
          onChange={handleChange}
          className={`w-full px-4 py-3 bg-black/50 rounded-lg border ${errors.phone ? "border-red-500" : "border-zinc-800"
            } focus:border-orange-500 focus:outline-none`}
          placeholder="Enter your phone number"
          required
        />
        {errors.phone && (
          <p className="mt-1 text-sm text-red-500">{errors.phone}</p>
        )}
      </div>

      {errors.submit && (
        <div className="p-3 bg-red-500/10 border border-red-500 rounded-lg">
          <p className="text-sm text-red-500">{errors.submit}</p>
        </div>
      )}

      <div className="space-y-4">
        <Button
          variant="solid"
          type="submit"
          disabled={!hasReadContract}
          className="w-full disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Sign & Continue to Payment
        </Button>
        <Button variant="outline" onClick={onBack} className="w-full">
          Back to Plans
        </Button>
      </div>
    </form>
  );
};