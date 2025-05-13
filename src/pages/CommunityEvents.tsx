import { motion } from "framer-motion";
import { Calendar, MapPin, Users, Trophy } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Image } from "@/components/ui/image";

export const CommunityEvents = () => {
  const upcomingEvents = [
    {
      title: "Spring Fitness Challenge",
      date: "April 15-30, 2024",
      location: "Bar Baby Fitness HQ",
      image:
        "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&q=80",
      description:
        "Join our 2-week challenge to kickstart your fitness journey",
      participants: "50+ registered",
    },
    {
      title: "Charity Marathon",
      date: "May 20, 2024",
      location: "Downtown Circuit",
      image:
        "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80",
      description:
        "Run for a cause - proceeds go to local youth sports programs",
      participants: "200+ registered",
    },
    {
      title: "Summer Bootcamp Series",
      date: "June 1-30, 2024",
      location: "Various Locations",
      image:
        "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
      description: "Intensive outdoor training sessions every weekend",
      participants: "30+ registered",
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Community Events
          </h1>
          <p className="text-xl text-gray-300">
            Join our vibrant fitness community in various events throughout the
            year. From challenges to charity runs, there's something for
            everyone.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-3 gap-8 mb-16">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 rounded-2xl overflow-hidden border border-zinc-800 hover:border-[#DB6E1E] transition-all duration-300 group"
            >
              <div className="relative h-48">
                <Image
                  src={event.image}
                  alt={event.title}
                  className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-6">
                <h3 className="text-2xl font-bold mb-4">{event.title}</h3>
                <div className="space-y-3 text-gray-300">
                  <div className="flex items-center gap-2">
                    <Calendar className="w-5 h-5 text-[#DB6E1E]" />
                    <span>{event.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-[#DB6E1E]" />
                    <span>{event.location}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="w-5 h-5 text-[#DB6E1E]" />
                    <span>{event.participants}</span>
                  </div>
                </div>
                <p className="mt-4 mb-6 text-gray-400">{event.description}</p>
                <Button variant="outline" className="w-full">
                  Register Now
                </Button>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-[#DB6E1E]/10 rounded-2xl p-8 md:p-12"
        >
          <div className="flex items-center gap-4 mb-6">
            <Trophy className="w-10 h-10 text-[#DB6E1E]" />
            <h2 className="text-3xl font-bold">Host Your Own Event</h2>
          </div>
          <p className="text-xl text-gray-300 mb-8">
            Have an idea for a community fitness event? We'd love to help you
            organize it! Our facility and resources are available for
            community-driven initiatives.
          </p>
          <Button variant="solid" className="w-full md:w-auto">
            Submit Event Proposal
          </Button>
        </motion.div>
      </section>
    </main>
  );
};
