import { Check } from "lucide-react";

interface PlanFeaturesProps {
  features: string[];
}

export const PlanFeatures = ({ features }: PlanFeaturesProps) => {
  return (
    <ul className="space-y-4 mb-8">
      {features.map((feature, index) => (
        <li key={index} className="flex items-center gap-3">
          <Check className="w-5 h-5 text-[#DB6E1E]" />
          <span className="text-gray-300">{feature}</span>
        </li>
      ))}
    </ul>
  );
};
