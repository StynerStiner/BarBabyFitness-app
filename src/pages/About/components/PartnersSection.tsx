import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

const partners = [
  {
    name: "Nike Training",
    logo: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&q=80",
  },
  {
    name: "Under Armour",
    logo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80",
  },
  {
    name: "Adidas",
    logo: "https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&q=80",
  },
  {
    name: "Reebok",
    logo: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&q=80",
  },
];

export const PartnersSection = () => {
  return (
    <section className="py-24 bg-black/50">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-6">Our Partners</h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Collaborating with industry leaders to bring you the best in fitness
            innovation.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {partners.map((partner, index) => (
            <motion.div
              key={partner.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="group relative"
            >
              <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-white/5 p-6 hover:bg-white/10 transition-colors">
                <Image
                  src={partner.logo}
                  alt={partner.name}
                  className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
                />
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
