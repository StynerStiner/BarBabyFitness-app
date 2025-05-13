import { motion } from "framer-motion";
import { Button } from "@/components/ui/Button";

export const EventRegistration = () => {
  return (
    <section className="py-24 bg-zinc-900">
      <div className="container">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="bg-black/50 rounded-2xl p-8 border border-[#DB6E1E]/20"
          >
            <h2 className="text-3xl font-bold mb-6">Quick Registration</h2>
            <form className="space-y-6">
              <div>
                <label className="block text-sm font-medium mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  className="w-full px-4 py-3 bg-black/50 rounded-lg border border-zinc-800 focus:border-[#DB6E1E] focus:outline-none"
                  placeholder="Enter your full name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Email</label>
                <input
                  type="email"
                  className="w-full px-4 py-3 bg-black/50 rounded-lg border border-zinc-800 focus:border-[#DB6E1E] focus:outline-none"
                  placeholder="Enter your email"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Event</label>
                <select className="w-full px-4 py-3 bg-black/50 rounded-lg border border-zinc-800 focus:border-[#DB6E1E] focus:outline-none">
                  <option>Select an event</option>
                  <option>Spring Fitness Challenge</option>
                  <option>Charity Marathon</option>
                  <option>Summer Bootcamp Series</option>
                </select>
              </div>
              <Button variant="solid" className="w-full">
                Register Now
              </Button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
