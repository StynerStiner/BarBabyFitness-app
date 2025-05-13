import { motion } from "framer-motion";

export const MarqueeBanner = () => {
  const bannerText = [
    "PUSH YOUR LIMITS",
    "STAY CONSISTENT",
    "BELIEVE IN YOURSELF",
    "NO PAIN NO GAIN",
    "BE STRONGER",
    "FITNESS IS LIFE",
  ];

  return (
    <div className="bg-black py-8 overflow-hidden relative">
      <div className="border-y-4 border-white relative">
        <div className="absolute inset-0 bg-gradient-to-r from-black via-transparent to-black z-10" />
        <div className="flex overflow-x-hidden">
          <div className="py-6 animate-marquee whitespace-nowrap flex">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="inline-flex items-center">
                {bannerText.map((text, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="mx-8 text-[#DB6E1E] text-6xl sm:text-7xl md:text-8xl font-black tracking-tighter hover-glow cursor-default"
                    style={{
                      textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
                      fontFamily: "'Pacifico', cursive",
                    }}
                  >
                    {text}
                  </motion.span>
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
