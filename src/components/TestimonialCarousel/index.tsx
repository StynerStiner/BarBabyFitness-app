"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  quote: string;
}

const testimonials: Testimonial[] = [
  {
    id: 1,
    name: "KRISTIN WATSON",
    role: "Fitness Enthusiast",
    image:
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
    quote:
      "The training programs at Bar Baby Fitness have completely transformed my approach to fitness. The personal attention and supportive community have helped me achieve goals I never thought possible.",
  },
  {
    id: 2,
    name: "MICHAEL ROBERTS",
    role: "Marathon Runner",
    image:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
    quote:
      "The expertise and dedication of the trainers here is unmatched. They've helped me improve my form and achieve new personal records in my running.",
  },
  {
    id: 3,
    name: "SARAH PARKER",
    role: "CrossFit Athlete",
    image:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
    quote:
      "Bar Baby Fitness offers the perfect blend of challenging workouts and personalized coaching. The community here is incredibly supportive and motivating.",
  },
  {
    id: 4,
    name: "JAMES WILSON",
    role: "Professional Boxer",
    image:
      "https://images.unsplash.com/photo-1506277886164-e25aa3f4ef7f?auto=format&fit=crop&q=80",
    quote:
      "The strength and conditioning programs here have taken my performance to the next level. The trainers understand the specific needs of combat athletes and deliver results.",
  },
  {
    id: 5,
    name: "EMMA THOMPSON",
    role: "Yoga Instructor",
    image:
      "https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80",
    quote:
      "I've found the perfect balance between high-intensity training and mindful movement at Bar Baby Fitness. The holistic approach to fitness here is truly exceptional.",
  },
];

export const TestimonialCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const next = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex + 1 === testimonials.length ? 0 : prevIndex + 1,
    );
  };

  const previous = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex - 1 < 0 ? testimonials.length - 1 : prevIndex - 1,
    );
  };

  return (
    <div className="relative bg-black py-16">
      <div className="max-w-6xl mx-auto px-4">
        <div className="relative min-h-[400px]">
          <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 border border-[#DB6E1E] rounded-lg p-8">
            <div className="ml-[50%] space-y-6">
              <h2 className="text-4xl md:text-5xl font-bold text-white">
                WHAT OUR MEMBERS SAY
              </h2>

              <blockquote className="text-lg text-white/90">
                {testimonials[currentIndex].quote}
              </blockquote>

              <div>
                <cite className="not-italic">
                  <div className="text-[#DB6E1E] text-xl font-bold mb-1">
                    {testimonials[currentIndex].name}
                  </div>
                  <div className="text-white/60">
                    {testimonials[currentIndex].role}
                  </div>
                </cite>
              </div>

              {/* Testimonial Indicators */}
              <div className="flex space-x-2">
                {testimonials.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                      currentIndex === index
                        ? "bg-[#DB6E1E] w-8"
                        : "bg-white/30 hover:bg-white/50"
                    }`}
                    aria-label={`Go to testimonial ${index + 1}`}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="absolute left-[5%] top-1/2 -translate-y-1/2 w-[40%] h-[500px] z-10">
            <div className="relative w-full h-full">
              <img
                src={testimonials[currentIndex].image}
                alt={testimonials[currentIndex].name}
                className="w-full h-full object-cover rounded-lg"
              />

              <button
                onClick={previous}
                className="absolute left-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Previous testimonial"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                onClick={next}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-10 h-10 bg-black/50 hover:bg-black/70 rounded-full flex items-center justify-center text-white transition-colors"
                aria-label="Next testimonial"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
