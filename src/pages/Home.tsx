import { Hero } from "@/components/Hero";
import { MarqueeBanner } from "@/components/MarqueeBanner";
import { FlexibleMembership } from "@/components/FlexibleMembership";
import { FitnessProgram } from "@/components/FitnessProgram";
import { GroupWorkouts } from "@/components/GroupWorkouts";
import { VideoSection } from "@/components/VideoSection";
import { TransformSection } from "@/components/TransformSection";
import { MerchSection } from "@/components/MerchSection";
import { CompetitionSection } from "@/components/CompetitionSection";
import { TestimonialCarousel } from "@/components/TestimonialCarousel";
import { ShowcaseSection } from "@/components/ShowcaseSection";
import { ParallaxGallery } from "@/components/ParallaxGallery";

export const Home = () => {
  return (
    <main className="overflow-hidden">
      <Hero />
      <MarqueeBanner />
      <div className="space-y-24 md:space-y-32">
        <FlexibleMembership />
        <ParallaxGallery />
        <FitnessProgram />
        <GroupWorkouts />
        <VideoSection />
        <ShowcaseSection />
        <TransformSection />
        <TestimonialCarousel />
        <MerchSection />
        <CompetitionSection />
      </div>
    </main>
  );
};
