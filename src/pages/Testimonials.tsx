import { motion } from "framer-motion";
import { Star, Quote } from "lucide-react";

export const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah Johnson",
      role: "Fitness Enthusiast",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      quote:
        "Bar Baby Fitness transformed my approach to working out. The personalized attention and supportive community have helped me achieve goals I never thought possible.",
      rating: 5,
    },
    {
      name: "Michael Chen",
      role: "Marathon Runner",
      image:
        "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80",
      quote:
        "The training programs here are second to none. The trainers push you to your limits while ensuring proper form and technique.",
      rating: 5,
    },
    {
      name: "Emma Rodriguez",
      role: "Professional Athlete",
      image:
        "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
      quote:
        "I've trained at many facilities, but Bar Baby Fitness stands out for its exceptional coaching and state-of-the-art equipment.",
      rating: 5,
    },
  ];

  return (
    <main className="min-h-screen bg-black text-white pt-20">
      <section className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center max-w-3xl mx-auto mb-16"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            Success Stories
          </h1>
          <p className="text-xl text-gray-300">
            Hear from our community members about their transformative
            experiences at Bar Baby Fitness.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 rounded-2xl p-6 border border-zinc-800 hover:border-[#DB6E1E] transition-all duration-300"
            >
              <Quote className="w-10 h-10 text-[#DB6E1E] mb-4" />
              <p className="text-gray-300 mb-6">{testimonial.quote}</p>

              <div className="flex items-center gap-4">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <h3 className="font-bold">{testimonial.name}</h3>
                  <p className="text-sm text-gray-400">{testimonial.role}</p>
                </div>
              </div>

              <div className="flex mt-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star
                    key={i}
                    className="w-4 h-4 text-[#DB6E1E] fill-current"
                  />
                ))}
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="max-w-4xl mx-auto text-center bg-[#DB6E1E]/10 rounded-2xl p-8 md:p-12"
        >
          <h2 className="text-3xl font-bold mb-6">Share Your Story</h2>
          <p className="text-xl text-gray-300 mb-8">
            We'd love to hear about your experience at Bar Baby Fitness. Your
            story could inspire others on their fitness journey.
          </p>
          <button className="px-8 py-3 bg-[#DB6E1E] text-white rounded-full hover:bg-[#DB6E1E]/90 transition-colors">
            Submit Your Testimonial
          </button>
        </motion.div>
      </section>
    </main>
  );
};
