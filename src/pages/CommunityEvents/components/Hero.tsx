import { motion } from "framer-motion";
import { Users } from "lucide-react";
import { Button } from "@/components/ui/Button";

export const Hero = () => {
  return (
    <section className="relative h-[80vh] overflow-hidden">
      <div className="absolute inset-0">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        >
          <source src="/videos/keeppushing.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-transparent" />
      </div>

      <div className="relative container h-full flex items-center">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          className="max-w-2xl"
        >
          <div className="flex items-center gap-4 mb-6">
            <Users className="w-12 h-12 text-[#DB6E1E]" />
            <h1 className="text-6xl md:text-7xl font-black bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
              COMMUNITY EVENTS
            </h1>
          </div>
          <p className="text-2xl text-gray-300 mb-8">
            Join the movement. Connect with like-minded individuals and push
            your limits together.
          </p>
          <div className="flex flex-wrap gap-4">
            <Button variant="solid" className="text-lg px-8">
              View Calendar
            </Button>
            <Button variant="outline" className="text-lg px-8">
              Host an Event
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
