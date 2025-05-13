import { Hero } from "./components/Hero";
import { UpcomingEvents } from "./components/UpcomingEvents";
import { EventCalendar } from "./components/EventCalendar";
import { CommunitySpotlight } from "./components/CommunitySpotlight";
import { EventGallery } from "./components/EventGallery";
import { HostEvent } from "./components/HostEvent";
import { CommunityImpact } from "./components/CommunityImpact";
import { EventRegistration } from "./components/EventRegistration";

export const CommunityEvents = () => {
  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <Hero />
      <UpcomingEvents />
      <EventCalendar />
      <CommunitySpotlight />
      <EventGallery />
      <CommunityImpact />
      <HostEvent />
      <EventRegistration />
    </main>
  );
};
