import { useState } from "react";
import { motion } from "framer-motion";
import { useLocation } from "react-router-dom";
import { Logo } from "./Logo";
import { NavLink } from "./NavLink";
import { MobileMenu } from "./MobileMenu";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Training Options", path: "/training-options" },
    { name: "Community Events", path: "/community-events" },
    { name: "Merch", path: "/merch" },
    { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      className="bg-black/90 backdrop-blur-sm px-6 py-4 fixed w-full top-0 z-50"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <Logo />

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              isActive={location.pathname === item.path}
            >
              {item.name}
            </NavLink>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden z-50 p-2 rounded-full hover:bg-white/10 transition-colors"
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Toggle menu"
        >
          <motion.div
            className="w-6 h-6 flex flex-col justify-around"
            animate={isOpen ? "open" : "closed"}
          >
            <motion.span
              className="w-full h-0.5 bg-white block"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: 45, y: 8 },
              }}
            />
            <motion.span
              className="w-full h-0.5 bg-white block"
              variants={{
                closed: { opacity: 1 },
                open: { opacity: 0 },
              }}
            />
            <motion.span
              className="w-full h-0.5 bg-white block"
              variants={{
                closed: { rotate: 0, y: 0 },
                open: { rotate: -45, y: -8 },
              }}
            />
          </motion.div>
        </button>

        {/* Mobile Menu */}
        <MobileMenu
          isOpen={isOpen}
          onClose={() => setIsOpen(false)}
          navItems={navItems}
          currentPath={location.pathname}
        />
      </div>
    </motion.nav>
  );
};
