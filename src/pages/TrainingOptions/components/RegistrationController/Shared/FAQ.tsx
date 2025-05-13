import { motion } from "framer-motion";
import { Plus, Minus } from "lucide-react";
import { useState } from "react";

const faqs = [
  {
    question: "What's included in the membership fee?",
    answer:
      "The annual membership fee of $350 includes access to our facilities, basic equipment usage, and the ability to book training sessions. Individual training sessions are billed separately based on your chosen plan.",
  },
  {
    question: "Can I change my training plan?",
    answer:
      "Yes, you can upgrade or downgrade your training plan at any time with 30 days notice. Your rate will be adjusted accordingly at the start of the next billing cycle.",
  },
  {
    question: "Are there any long-term commitments?",
    answer:
      "No long-term contracts required. Our membership is annual, but training plans are month-to-month, giving you the flexibility to adjust as needed.",
  },
  {
    question: "What happens if I need to cancel a session?",
    answer:
      "We require 24 hours notice for session cancellations. Sessions cancelled with less notice will be charged at the full rate.",
  },
];

export const FAQ = () => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="py-24 bg-black">
      <div className="container max-w-4xl">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-4xl font-bold text-center mb-12"
        >
          Frequently Asked Questions
        </motion.h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="border border-zinc-800 rounded-lg overflow-hidden"
            >
              <button
                className="w-full p-6 flex items-center justify-between hover:bg-zinc-900/50 transition-colors"
                onClick={() => setOpenIndex(openIndex === index ? null : index)}
              >
                <span className="text-lg font-semibold text-left">
                  {faq.question}
                </span>
                {openIndex === index ? (
                  <Minus className="w-5 h-5 text-[#DB6E1E]" />
                ) : (
                  <Plus className="w-5 h-5 text-[#DB6E1E]" />
                )}
              </button>

              {openIndex === index && (
                <div className="px-6 pb-6">
                  <p className="text-gray-400">{faq.answer}</p>
                </div>
              )}
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};
