import { Link } from "react-router-dom";
import { motion } from "framer-motion";

interface NavLinkProps {
  to: string;
  isActive: boolean;
  children: React.ReactNode;
  onClick?: () => void;
}

export const NavLink = ({ to, isActive, children, onClick }: NavLinkProps) => {
  return (
    <Link
      to={to}
      onClick={onClick}
      className="relative px-8 py-2 group text-center min-w-[120px]"
    >
      <motion.span
        className="absolute inset-0 rounded-[30px] border-2 border-white"
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0.5,
          scale: isActive ? 1 : 0.98,
        }}
        whileHover={{ scale: 1, opacity: 1 }}
      />

      <motion.span
        className="absolute inset-[2px] rounded-[28px] border border-white"
        initial={false}
        animate={{
          opacity: isActive ? 1 : 0.3,
        }}
        whileHover={{ opacity: 1 }}
      />

      <motion.span
        className="absolute inset-0 rounded-[30px] bg-white"
        initial={{ opacity: 0 }}
        animate={{
          opacity: isActive ? 1 : 0,
        }}
        whileHover={{ opacity: 1 }}
      />

      <span
        className={`relative z-10 text-sm font-semibold tracking-wide transition-colors duration-300 ${isActive ? "text-black" : "text-white"
          } group-hover:text-black whitespace-nowrap`}
      >
        {children}
      </span>
    </Link>
  );
};
