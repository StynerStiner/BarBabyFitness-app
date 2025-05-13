import { motion } from "framer-motion";

const images = [
  {
    url: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80",
    title: "Morning HIIT",
  },
  {
    url: "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&q=80",
    title: "Community Run",
  },
  {
    url: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&q=80",
    title: "Strength Workshop",
  },
  {
    url: "https://images.unsplash.com/photo-1517838277536-f5f99be501cd?auto=format&fit=crop&q=80",
    title: "Boxing Class",
  },
];

export const EventGallery = () => {
  return (
    <section className="py-24 bg-zinc-900">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-5xl font-bold text-center mb-16"
        >
          Event Gallery
        </motion.h2>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {images.map((image, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, scale: 0.8 }}
              whileInView={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <img
                src={image.url}
                alt={image.title}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <h3 className="absolute bottom-4 left-4 text-xl font-bold transform translate-y-full opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                {image.title}
              </h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
