import { motion } from "framer-motion";
import { Dumbbell, Users, Video, Trophy } from "lucide-react";

const features = [
  {
    icon: <Dumbbell className="w-8 h-8" />,
    title: "Expert Training",
    description: "Professional guidance from certified trainers",
  },
  {
    icon: <Users className="w-8 h-8" />,
    title: "Community",
    description: "Join a supportive fitness family",
  },
  {
    icon: <Video className="w-8 h-8" />,
    title: "Virtual Sessions",
    description: "Train anywhere, anytime with online coaching",
  },
  {
    icon: <Trophy className="w-8 h-8" />,
    title: "Goal Achievement",
    description: "Track progress and celebrate victories",
  },
];

export const Features = () => {
  return (
    <div className="py-24 bg-[#DB6E1E]/5">
      <div className="container">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group p-6 rounded-2xl bg-black/50 border border-[#DB6E1E]/20 hover:border-[#DB6E1E] transition-colors"
            >
              <div className="inline-flex p-4 rounded-xl bg-[#DB6E1E]/10 text-[#DB6E1E] mb-6 group-hover:scale-110 transition-transform duration-300">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
