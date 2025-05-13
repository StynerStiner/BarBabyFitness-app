// src/pages/TrainingOptions/components/PlanSelection/SelectionHeader.tsx
interface SelectionHeaderProps {
  sessions: number;
  price: number;
}

export const SelectionHeader = ({ sessions, price }: SelectionHeaderProps) => {
  return (
    <div className="text-center mb-6">
      <h3 className="text-2xl font-bold mb-2">{sessions} Sessions</h3>
      <p className="text-gray-400">per week</p>
      <div className="mt-4">
        <span className="text-4xl font-bold text-[#DB6E1E]">${price}</span>
        <span className="text-gray-400">/month</span>
      </div>
    </div>
  );
};
