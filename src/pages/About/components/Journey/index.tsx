import { useRef } from "react";
import { useScroll } from "framer-motion";
import { Star, Zap, Flame, Users, Trophy } from "lucide-react";
import { JourneyItem } from "./JourneyItem";
import { TimelineLine } from "./TimelineLine";

const milestones = [
  {
    year: "2020",
    title: "THE COME UP",
    description:
      "Started from the bottom, now we're here. Bar Baby Fitness hits the scene.",
    icon: Star,
  },
  {
    year: "2021",
    title: "GOING GLOBAL",
    description:
      "Breaking boundaries with worldwide virtual training. No limits, no excuses.",
    icon: Zap,
  },
  {
    year: "2022",
    title: "LEVEL UP",
    description: "Dropped that AI-powered heat. Training game changed forever.",
    icon: Flame,
  },
  {
    year: "2023",
    title: "SQUAD GOALS",
    description: "10K strong family. Real recognize real.",
    icon: Users,
  },
  {
    year: "2024",
    title: "UNSTOPPABLE",
    description: "Future of fitness? We're writing it. Stay tuned.",
    icon: Trophy,
  },
];

export const Journey = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });

  return (
    <section
      ref={containerRef}
      className="relative py-24 overflow-hidden bg-black"
    >
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black" />
      </div>

      <div className="container relative">
        <div className="relative">
          <TimelineLine scrollYProgress={scrollYProgress} />

          {milestones.map((milestone, index) => (
            <JourneyItem
              key={milestone.year}
              {...milestone}
              index={index}
              isActive={scrollYProgress.get() > index / milestones.length}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
