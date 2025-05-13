import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";
import { Trophy } from "lucide-react";

export const HostEvent = () => {
  return (
    <section className="py-24 bg-black relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[url('/images/noise.png')] opacity-5" />
        <div className="absolute inset-0 bg-gradient-to-br from-[#DB6E1E]/20 via-black to-black" />
      </div>

      <div className="container relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="max-w-3xl mx-auto text-center"
        >
          <div className="flex justify-center mb-6">
            <Trophy className="w-12 h-12 text-[#DB6E1E]" />
          </div>
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Host Your Own Event
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Have an idea for a community fitness event? We'd love to help you
            organize it! Our facility and resources are available for
            community-driven initiatives.
          </p>
          <Button variant="solid" className="text-lg px-8">
            Submit Event Proposal
          </Button>
        </motion.div>
      </div>
    </section>
  );
};
