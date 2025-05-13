"use client";

import { motion } from "framer-motion";
import { Instagram, Twitter } from "lucide-react";

export const TeamSection = () => {
  const team = [
    {
      name: "MIKE JOHNSON",
      role: "HEAD TRAINER",
      image:
        "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80",
      social: { instagram: "#", twitter: "#" },
    },
    {
      name: "SARAH WILLIAMS",
      role: "NUTRITION SPECIALIST",
      image:
        "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80",
      social: { instagram: "#", twitter: "#" },
    },
    {
      name: "ALEX RODRIGUEZ",
      role: "STRENGTH COACH",
      image:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80",
      social: { instagram: "#", twitter: "#" },
    },
  ];

  return (
    <section className="py-24">
      <div className="container">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-5xl md:text-6xl font-black text-center mb-16"
        >
          <span className="bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
            MEET THE SQUAD
          </span>
        </motion.h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="group relative"
            >
              <div className="relative aspect-[3/4] rounded-2xl overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                <div className="absolute inset-x-0 bottom-0 p-6 translate-y-6 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                  <h3 className="text-2xl font-bold mb-1">{member.name}</h3>
                  <p className="text-[#DB6E1E] font-medium mb-4">
                    {member.role}
                  </p>
                  <div className="flex gap-4">
                    <a
                      href={member.social.instagram}
                      className="text-white hover:text-[#DB6E1E] transition-colors"
                    >
                      <Instagram className="w-6 h-6" />
                    </a>
                    <a
                      href={member.social.twitter}
                      className="text-white hover:text-[#DB6E1E] transition-colors"
                    >
                      <Twitter className="w-6 h-6" />
                    </a>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};
