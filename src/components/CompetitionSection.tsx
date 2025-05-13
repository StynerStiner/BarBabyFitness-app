import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Bell, Dumbbell, Salad } from "lucide-react";

export const CompetitionSection = () => {
  const features = [
    {
      icon: <Salad className="w-8 h-8 text-[#DB6E1E]" />,
      title: "Personalized Meal Plans",
      description: "Custom nutrition plans tailored to your fitness goals",
    },
    {
      icon: <Dumbbell className="w-8 h-8 text-[#DB6E1E]" />,
      title: "Workout Integration",
      description: "Seamlessly integrate nutrition with your training routine",
    },
    {
      icon: <Bell className="w-8 h-8 text-[#DB6E1E]" />,
      title: "Daily Reminders",
      description: "Stay on track with meal timing and nutrition goals",
    },
  ];

  return (
    <section className="relative py-24 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-black via-black/95 to-[#DB6E1E]/20" />

      <div className="relative container mx-auto px-4">
        <div className="flex flex-col lg:flex-row items-center gap-12 max-w-7xl mx-auto">
          {/* Left Content */}
          <div className="lg:w-1/2 text-left">
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
                Nutrition Guidance Coming Soon
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                We're crafting a comprehensive nutrition program to complement
                your fitness journey. Be the first to know when we launch.
              </p>

              <div className="flex flex-wrap gap-4">
                <Button
                  variant="outline"
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10">Get Early Access</span>
                  <div className="absolute inset-0 bg-[#DB6E1E] transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </Button>
                <Button
                  variant="solid"
                  className="group relative overflow-hidden"
                >
                  <span className="relative z-10">Notify Me</span>
                  <div className="absolute inset-0 bg-white transform -translate-x-full group-hover:translate-x-0 transition-transform duration-300" />
                </Button>
              </div>
            </motion.div>
          </div>

          {/* Right Content - Features */}
          <div className="lg:w-1/2">
            <div className="grid gap-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.2 }}
                  className="bg-black/40 backdrop-blur-sm p-6 rounded-2xl border border-white/10 hover:border-[#DB6E1E]/50 transition-all duration-300 flex items-center gap-6"
                >
                  <div className="bg-black/30 p-3 rounded-full flex-shrink-0">
                    {feature.icon}
                  </div>
                  <div>
                    <h3 className="text-xl font-bold mb-2 text-white">
                      {feature.title}
                    </h3>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
