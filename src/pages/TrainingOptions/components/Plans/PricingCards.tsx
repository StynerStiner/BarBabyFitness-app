// src/pages/TrainingOptions/components/Plans/PricingCards.tsx
import { motion } from "framer-motion";
import { Dumbbell, Check, Star } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { EditableContent } from "@/components/EditableContent"; // Correct import

const pricingPlans = [
  {
    name: "Barbaby Kick Starter",
    sessions: 3,
    price: 195,
    features: [
      "3 One-hour Training Sessions",
      "Valid for 30 days",
      "Perfect for beginners",
      "Personalized workout plan",
      "Fitness assessment",
      "$100 initiation fee for new clients"
    ],
    popular: false,
  },
  {
    name: "Barbaby Steady Climb",
    sessions: 4,
    price: 240,
    features: [
      "4 One-hour Training Sessions",
      "Valid for 30 days",
      "Structured progression plan",
      "Nutrition guidance",
      "Weekly progress tracking",
      "$100 initiation fee for new clients"
    ],
    popular: false,
  },
  {
    name: "Barbaby Power Surge",
    sessions: 8,
    price: 440,
    features: [
      "8 One-hour Training Sessions",
      "Valid for 30 days",
      "Intensive training program",
      "Advanced fitness assessment",
      "Customized meal planning",
      "$100 initiation fee for new clients"
    ],
    popular: true,
  },
  {
    name: "Barbaby Elite Focus",
    sessions: 12,
    price: 600,
    features: [
      "12 One-hour Training Sessions",
      "Valid for 30 days",
      "Elite level programming",
      "Priority scheduling",
      "Comprehensive progress tracking",
      "$100 initiation fee for new clients"
    ],
    popular: false,
  },
];

export const PricingCards = () => {
  return (
    <div className="py-12">
      <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {pricingPlans.map((plan, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
            className={`relative p-8 rounded-2xl ${plan.popular
              ? "border-2 border-[#DB6E1E] bg-[#DB6E1E]/10"
              : "border border-zinc-800 bg-black/50"
              }`}
          >
            {plan.popular && (
              <div className="absolute -top-1 -right-1 overflow-hidden pt-5 pr-5">
                <div className="absolute top-0 right-0 transform translate-x-[30%] translate-y-[-30%] rotate-45 bg-[#DB6E1E] text-white text-xs font-semibold py-1 px-10 shadow-md">
                  Recommended
                </div>
              </div>
            )}

            <div className="text-center mb-8">
              <div className="inline-flex p-3 rounded-xl bg-[#DB6E1E]/10 mb-4">
                <Dumbbell className="w-8 h-8 text-[#DB6E1E]" />
              </div>

              {/* Replace the static name with EditableContent */}
              <h3 className="text-2xl font-bold mb-2">
                <EditableContent
                  contentId={`plan-name-${plan.name}`}
                  path={`/pricing/${plan.name}`}
                  defaultContent={plan.name}
                />
              </h3>

              {/* Replace the static price with EditableContent */}
              <div className="flex items-center justify-center gap-2 mb-4">
                <EditableContent
                  contentId={`plan-price-${plan.name}`}
                  path={`/pricing/${plan.name}`}
                  defaultContent={`$${plan.price}`}
                />
                <span className="text-gray-400">/month</span>
              </div>

              <div className="flex items-center justify-center gap-1">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`w-4 h-4 ${plan.popular
                      ? "text-[#DB6E1E] fill-[#DB6E1E]"
                      : "text-gray-400"
                      }`}
                  />
                ))}
              </div>
            </div>

            <ul className="space-y-4 mb-8">
              {/* Replace each static feature with EditableContent */}
              {plan.features.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-[#DB6E1E]" />
                  <EditableContent
                    contentId={`plan-feature-${plan.name}-${i}`}
                    path={`/pricing/${plan.name}`}
                    defaultContent={feature}
                  />
                </li>
              ))}
            </ul>

            <Button
              variant={plan.popular ? "solid" : "outline"}
              className="w-full"
            >
              Choose Plan
            </Button>
          </motion.div>
        ))}
      </div>
    </div>
  );
};