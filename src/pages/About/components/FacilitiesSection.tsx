import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

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
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative aspect-square overflow-hidden rounded-2xl"
            >
              <Image
                src={facility.image}
                alt={facility.title}
                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute inset-x-0 bottom-0 p-6 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                <h3 className="text-2xl font-bold mb-2">{facility.title}</h3>
                <p className="text-gray-300">{facility.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
