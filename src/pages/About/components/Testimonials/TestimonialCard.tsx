import { motion } from "framer-motion";
import { Quote } from "lucide-react";

interface TestimonialCardProps {
  name: string;
  role: string;
  quote: string;
  image: string;
  index: number;
}

export const TestimonialCard = ({
  name,
  role,
  quote,
  image,
  index,
}: TestimonialCardProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.2 }}
      className="relative"
    >
      <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

        <div className="absolute inset-0 p-8 flex flex-col justify-end">
          <Quote className="w-10 h-10 text-[#DB6E1E] mb-4" />
          <p className="text-lg mb-6">{quote}</p>
          <div>
            <h3 className="text-2xl font-bold">{name}</h3>
            <p className="text-[#DB6E1E]">{role}</p>
          </div>
        </div>
      </div>
    </motion.div>
  );
};
