"use client";

import { motion } from "framer-motion";
import { Image } from "@/components/ui/image";
import { Link } from "@/components/ui/link";
import { Facebook, Twitter, Instagram, Youtube, Linkedin } from "lucide-react";

export const Footer = () => {
  const footerSections = [
    {
      title: "Bar Baby Fitness",
      links: ["About Us", "Our Team", "Careers", "Press", "Contact"],
    },
    {
      title: "Resources",
      links: [
        "Blog",
        "Workout Tips",
        "Nutrition Guide",
        "Success Stories",
        "FAQ",
      ],
    },
    {
      title: "Locations",
      links: [
        "Find a Gym",
        "Class Schedule",
        "Virtual Training",
        "Partner Locations",
        "Events",
      ],
    },
  ];

  const socialLinks = [
    { icon: <Instagram className="w-6 h-6" />, href: "#" },
    { icon: <Facebook className="w-6 h-6" />, href: "#" },
    { icon: <Twitter className="w-6 h-6" />, href: "#" },
    { icon: <Youtube className="w-6 h-6" />, href: "#" },
    { icon: <Linkedin className="w-6 h-6" />, href: "#" },
  ];

  return (
    <footer className="bg-gradient-to-b from-black via-black to-[#DB6E1E]/10 pt-16 pb-8">
      <div className="container">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Image
              src="/images/logo.png"
              alt="Bar Baby Fitness Logo"
              width={260}
              height={240}
              className="mb-6"
            />
            <div className="flex gap-4">
              {socialLinks.map((social, index) => (
                <Link
                  key={index}
                  href={social.href}
                  className="p-2 rounded-full bg-[#DB6E1E]/10 hover:bg-[#DB6E1E]/20 text-[#DB6E1E] transition-colors duration-300"
                >
                  {social.icon}
                </Link>
              ))}
            </div>
          </motion.div>

          {footerSections.map((section, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <h3 className="font-bold text-[#DB6E1E] mb-6">{section.title}</h3>
              <ul className="space-y-4">
                {section.links.map((link, i) => (
                  <li key={i}>
                    <Link
                      href="#"
                      className="text-gray-400 hover:text-white transition-colors duration-300"
                    >
                      {link}
                    </Link>
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>

        <div className="border-t border-[#DB6E1E]/20 pt-8">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-gray-400">
              © 2024 BAR BABY FITNESS. All rights reserved.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map(
                (item, i) => (
                  <Link
                    key={i}
                    href="#"
                    className="text-sm text-gray-400 hover:text-[#DB6E1E] transition-colors duration-300"
                  >
                    {item}
                  </Link>
                ),
              )}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};
