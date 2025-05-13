import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const spotlights = [
  {
    name: "Sarah Chen",
    achievement: "Marathon Champion",
    quote: "The community support pushed me to achieve my personal best.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
  },
  {
    name: "Marcus Rodriguez",
    achievement: "Transformation Winner",
    quote: "Lost 50 lbs with the help of this amazing community.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
  },
];

export const CommunitySpotlight = () => {
  return (
    <section className="py-24 bg-black">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Community Spotlight
        </motion.h2>

        <div className="grid md:grid-cols-2 gap-8">
          {spotlights.map((spotlight, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              className="relative group"
            >
              <div className="relative h-[400px] rounded-2xl overflow-hidden">
                <img
                  src={spotlight.image}
                  alt={spotlight.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <Quote className="w-10 h-10 text-[#DB6E1E] mb-4" />
                  <p className="text-xl mb-4">"{spotlight.quote}"</p>
                  <h3 className="text-2xl font-bold">{spotlight.name}</h3>
                  <p className="text-[#DB6E1E]">{spotlight.achievement}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
