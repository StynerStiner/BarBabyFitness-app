import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";

interface ValueCardProps {
  icon: React.ReactNode;
  title: string;
  description: string;
  gradient: string;
  image: string;
  index: number;
}

export const ValueCard = ({
  icon,
  title,
  description,
  gradient,
  image,
  index,
}: ValueCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1 }}
      className="group relative"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 to-transparent rounded-2xl blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      <motion.div
        whileHover={{ scale: 1.05 }}
        className="relative p-8 rounded-2xl bg-black/50 border border-[#DB6E1E]/20 hover:border-[#DB6E1E] transition-all backdrop-blur-sm overflow-hidden"
      >
        {/* Background Image */}
        <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity duration-500">
          <Image
            src={image}
            alt={title}
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent" />
        </div>

        {/* Content */}
        <div className="relative z-10">
          <div
            className={`inline-flex p-4 rounded-xl bg-gradient-to-br ${gradient} mb-6 text-white transform group-hover:scale-110 transition-transform duration-300`}
          >
            {icon}
          </div>
          <motion.div
            initial={{ scale: 0.8 }}
            whileInView={{ scale: 1 }}
            transition={{
              type: "spring",
              stiffness: 100,
              delay: index * 0.2,
            }}
          >
            <h3 className="text-2xl font-bold mb-4 bg-gradient-to-r from-white to-[#DB6E1E] bg-clip-text text-transparent">
              {title}
            </h3>
            <p className="text-gray-400 group-hover:text-white transition-colors duration-300">
              {description}
            </p>
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};
