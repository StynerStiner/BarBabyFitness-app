import { HeroBackground } from "./HeroBackground";
import { HeroContent } from "./HeroContent";

export const Hero = () => {
  return (
    <section className="relative min-h-screen flex items-center overflow-hidden">
      <HeroBackground />
      <div className="container relative">
        <HeroContent />
      </div>
    </section>
  );
};
