import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";
import { Image } from "@/components/ui/image";

export const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const navItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Training Options", path: "/training-options" },
    { name: "Community Events", path: "/community-events" },
    { name: "Merch", path: "/merch" },
    { name: "PDF Registration", path: "/pdf-registration" },
    // { name: "Testimonials", path: "/testimonials" },
    { name: "Contact", path: "/contact" },
  ];

  return (
    <motion.nav
      className="bg-black/90 backdrop-blur-sm px-6 py-4 fixed w-full top-0 z-50 shadow-lg"
      initial={{ height: 80 }}
      animate={{ height: isOpen ? "100vh" : 60 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto flex justify-between items-center">
        <div className="flex items-center gap-6">
          <Link to="/" className="w-[100px] md:w-[150px] lg:w-[180px] xl:w-[200px]">
            <Image
              src="/images/logo.png"
              alt="Bar Baby Fitness Logo"
              width={200}
              height={200}
              className="object-contain"
            />
          </Link>
          <span
            className="hidden lg:block text-[#DB6E1E] text-3xl lg:text-4xl"
            style={{
              fontFamily: "'Pacifico', cursive",
              textShadow: "2px 2px 4px rgba(0,0,0,0.3)",
            }}
          >
            COMMIT TO BEING FIT
          </span>
        </div>

        {/* Desktop Navigation */}
        <div className="hidden lg:flex items-center space-x-4">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`relative px-8 py-2 group text-center ${item.name === "Training Options" ||
                item.name === "Community Events"
                ? "min-w-[180px]"
                : "min-w-[120px]"
                }`}
            >
              {/* Double border effect */}
              <span className="absolute inset-0 rounded-[30px] border-2 border-white"></span>
              <span className="absolute inset-[2px] rounded-[28px] border border-white"></span>

              {/* Hover background */}
              <span
                className={`absolute inset-0 rounded-[30px] bg-white ${location.pathname === item.path ? "opacity-100" : "opacity-0"
                  } transition-opacity duration-300 group-hover:opacity-100`}
              ></span>

              {/* Text */}
              <span
                className={`relative z-10 text-sm font-semibold tracking-wide transition-colors duration-300 ${location.pathname === item.path ? "text-black" : "text-white"
                  } group-hover:text-black whitespace-nowrap`}
              >
                {item.name}
              </span>
            </Link>
          ))}
        </div>

        {/* Mobile Menu Button */}
        <button
          className="lg:hidden z-50 p-2 rounded-full"
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
      </div>

      {/* Mobile Menu */}
      <motion.div
        className="lg:hidden fixed inset-0 bg-black/95 z-40"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -20 }}
        transition={{ duration: 0.2 }}
        style={{ pointerEvents: isOpen ? "auto" : "none" }}
      >
        <div className="flex flex-col items-center justify-center h-full space-y-6">
          {navItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: isOpen ? 1 : 0, x: isOpen ? 0 : -20 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link
                to={item.path}
                className="relative px-8 py-2 group"
                onClick={() => setIsOpen(false)}
              >
                <span
                  className={`relative z-10 text-2xl font-semibold ${location.pathname === item.path
                    ? "text-[#DB6E1E]"
                    : "text-white"
                    }`}
                >
                  {item.name}
                </span>
                {/* Mobile menu hover effect */}
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-[#DB6E1E] transition-all duration-300 group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </motion.nav>
  );
};
