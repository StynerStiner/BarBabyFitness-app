import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

interface PartnerLogoProps {
  name: string;
  logo: string;
  index: number;
}

export const PartnerLogo = ({ name, logo, index }: PartnerLogoProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="relative aspect-[3/2] rounded-lg overflow-hidden bg-white/5 p-6 hover:bg-white/10 transition-colors">
        <Image
          src={logo}
          alt={name}
          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
        />
      </div>
    </motion.div>
  );
};
