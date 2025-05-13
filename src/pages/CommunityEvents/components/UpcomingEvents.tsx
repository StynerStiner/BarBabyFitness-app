import { motion } from "framer-motion";
import { Calendar, MapPin, Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

const upcomingEvents = [
  {
    title: "Spring Fitness Challenge",
    date: "April 15-30, 2024",
    location: "Bar Baby Fitness HQ",
    image:
      "https://images.unsplash.com/photo-1534258936925-c58bed479fcb?auto=format&fit=crop&q=80",
    description: "Join our 2-week challenge to kickstart your fitness journey",
    participants: "50+ registered",
  },
  {
    title: "Charity Marathon",
    date: "May 20, 2024",
    location: "Downtown Circuit",
    image:
      "https://images.unsplash.com/photo-1452626038306-9aae5e071dd3?auto=format&fit=crop&q=80",
    description: "Run for a cause - proceeds go to local youth sports programs",
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

export const UpcomingEvents = () => {
  return (
    <section className="py-24 bg-gradient-to-b from-black to-zinc-900">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Upcoming Events
        </motion.h2>

        <div className="grid lg:grid-cols-3 gap-8">
          {upcomingEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl bg-zinc-900/50 hover:bg-zinc-900 transition-colors"
            >
              <div className="relative h-48">
                <img
                  src={event.image}
                  alt={event.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
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
      </div>
    </section>
  );
};
