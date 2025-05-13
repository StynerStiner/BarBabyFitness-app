import { motion } from "framer-motion";
import { PartnerLogo } from "./PartnerLogo";

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
            <PartnerLogo key={partner.name} {...partner} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
};
