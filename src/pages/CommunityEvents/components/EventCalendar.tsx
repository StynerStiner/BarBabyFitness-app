import { motion } from "framer-motion";
import { Calendar as CalendarIcon } from "lucide-react";

const monthEvents = [
  { date: "15", event: "Morning HIIT Session", time: "7:00 AM" },
  { date: "18", event: "Community Run", time: "6:30 AM" },
  { date: "20", event: "Strength Workshop", time: "10:00 AM" },
  { date: "22", event: "Yoga in the Park", time: "8:00 AM" },
  { date: "25", event: "Boxing Masterclass", time: "6:00 PM" },
  { date: "28", event: "Nutrition Seminar", time: "2:00 PM" },
];

export const EventCalendar = () => {
  return (
    <section className="py-24 bg-[#DB6E1E]/5">
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <CalendarIcon className="w-12 h-12 text-[#DB6E1E] mx-auto mb-4" />
          <h2 className="text-4xl md:text-5xl font-bold">Monthly Schedule</h2>
        </motion.div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {monthEvents.map((event, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              className="bg-black/50 backdrop-blur-sm p-6 rounded-xl border border-[#DB6E1E]/20 hover:border-[#DB6E1E] transition-colors"
            >
              <div className="flex items-start gap-4">
                <div className="text-center">
                  <span className="text-3xl font-bold text-[#DB6E1E]">
                    {event.date}
                  </span>
                  <span className="block text-sm text-gray-400">APR</span>
                </div>
                <div>
                  <h3 className="text-xl font-bold mb-2">{event.event}</h3>
                  <p className="text-gray-400">{event.time}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
