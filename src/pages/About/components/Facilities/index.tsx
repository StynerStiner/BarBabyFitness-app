import { motion } from "framer-motion";
import { FacilityCard } from "./FacilityCard";

const facilities = [
  {
    title: "State-of-the-Art Equipment",
    description: "Premium fitness equipment for strength and conditioning",
    image:
      "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80",
  },
  {
    title: "Functional Training Area",
    description: "Dedicated space for dynamic workouts and CrossFit",
    image:
      "https://images.unsplash.com/photo-1571902943202-507ec2618e8f?auto=format&fit=crop&q=80",
  },
  {
    title: "Recovery Zone",
    description: "Advanced recovery tools and techniques",
    image:
      "https://images.unsplash.com/photo-1540497077202-7c8a3999166f?auto=format&fit=crop&q=80",
  },
  {
    title: "Group Training Studio",
    description: "Spacious studio for high-energy group sessions",
    image:
      "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&q=80",
  },
];

export const FacilitiesSection = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            World-Class Facilities
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Experience fitness in a premium environment designed to inspire and
            empower your journey.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {facilities.map((facility, index) => (
            <FacilityCard key={index} {...facility} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
