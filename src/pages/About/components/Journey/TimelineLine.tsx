import { motion, useTransform } from "framer-motion";

interface TimelineLineProps {
  scrollYProgress: any;
}

export const TimelineLine = ({ scrollYProgress }: TimelineLineProps) => {
  return (
    <div className="absolute left-1/2 top-0 w-px h-full bg-[#DB6E1E]/30">
      <motion.div
        className="absolute top-0 left-0 w-full bg-[#DB6E1E]"
        style={{
          height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]),
        }}
      />
    </div>
  );
};
