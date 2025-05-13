"use client";

import { motion } from "framer-motion";
import { Quote } from "lucide-react";

const testimonials = [
  {
    name: "Sarah Chen",
    role: "Professional Athlete",
    quote:
      "Bar Baby Fitness transformed my approach to training. The results speak for themselves.",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
  },
  {
    name: "Mike Johnson",
    role: "Fitness Enthusiast",
    quote:
      "The community here is incredible. Everyone pushes each other to be better.",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
  },
  {
    name: "Emma Rodriguez",
    role: "Marathon Runner",
    quote:
      "The trainers here understand what it takes to achieve peak performance.",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
  },
];

export const TestimonialsSection = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        <motion.div
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 1.5 }}
          className="relative h-full"
        >
          <img
            src="/images/AboutTestimonialsSectionBackground.png"
            alt="Background Image"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-black opacity-90" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <h2 className="text-4xl md:text-5xl font-bold text-white text-center mb-12">
          What Our Clients Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
              className="group"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent" />

                <div className="absolute inset-0 p-8 flex flex-col justify-end">
                  <Quote className="w-10 h-10 text-[#DB6E1E] mb-4" />
                  <p className="text-lg mb-6 text-white">{testimonial.quote}</p>
                  <div>
                    <h3 className="text-2xl font-bold text-white">
                      {testimonial.name}
                    </h3>
                    <p className="text-[#DB6E1E]">{testimonial.role}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
