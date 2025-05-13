// src/pages/TrainingOptions/components/Plans/PlanHeader.tsx

interface PlanHeaderProps {
  backgroundText: string;
  title: string;
  description: string;
}

export const PlanHeader = ({
  backgroundText,
  title,
  description,
}: PlanHeaderProps) => {
  return (
    <div className="bg-[#000000] relative overflow-hidden py-24">
      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-[200px] font-bold text-[#1A1A1A] select-none">
          {backgroundText}
        </h2>
      </div>

      {/* Foreground content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4">
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-6">
          {title}
        </h1>
        <p className="text-xl text-[#9AA1AC] max-w-2xl">{description}</p>
      </div>
    </div>
  );
};
