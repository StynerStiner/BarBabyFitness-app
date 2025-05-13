import { motion } from "framer-motion";
import { Heart, Trophy, Users } from "lucide-react";

const impacts = [
  {
    icon: <Heart className="w-8 h-8" />,
    title: "$50K+",
    description: "Raised for Local Charities",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "1000+",
    description: "Event Participants",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "20+",
    description: "Community Partners",
  },
];

export const CommunityImpact = () => {
  return (
    <section className="py-24 bg-[#DB6E1E]/5">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Our Impact
        </motion.h2>

        <div className="grid md:grid-cols-3 gap-8">
          {impacts.map((impact, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="text-center"
            >
              <div className="inline-flex p-4 rounded-full bg-[#DB6E1E]/10 text-[#DB6E1E] mb-6">
                {impact.icon}
              </div>
              <h3 className="text-4xl font-bold mb-2">{impact.title}</h3>
              <p className="text-gray-400">{impact.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
