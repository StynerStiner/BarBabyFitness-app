import { TestimonialCard } from "./TestimonialCard";

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
    <section className="py-24 bg-zinc-900">
      <div className="container">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Success Stories
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            Real results from real people. Join our community and write your own
            success story.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <TestimonialCard
              key={testimonial.name}
              {...testimonial}
              index={index}
            />
          ))}
        </div>
      </div>
    </section>
  );
};
