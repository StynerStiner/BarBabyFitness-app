import { Hero } from "./components/Hero";
import { Journey } from "./components/Journey";
import { PhilosophySection } from "./components/PhilosophySection";
import { AchievementsSection } from "./components/AchievementsSection";
import { FacilitiesSection } from "./components/Facilities";
import { TeamSection } from "./components/TeamSection";
import { TestimonialsSection } from "./components/Testimonials";
import { PartnersSection } from "./components/Partners";
import { JoinSection } from "./components/JoinSection";

export const About = () => {
  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Hero />
      <Journey />
      <PhilosophySection />
      <AchievementsSection />
      <FacilitiesSection />
      <TeamSection />
      <TestimonialsSection />
      <PartnersSection />
      <JoinSection />
    </main>
  );
};
