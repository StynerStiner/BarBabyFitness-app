import { Link } from "react-router-dom";
import { Image } from "@/components/ui/image";

export const Logo = () => {
  return (
    <Link to="/" className="flex items-center gap-6">
      <div className="w-[80px] md:w-[120px] lg:w-[150px] relative group">
        <Image
          src="/images/logo.png"
          alt="Bar Baby Fitness Logo"
          width={260}
          height={250}
          className="object-contain transition-transform duration-300 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-[#DB6E1E]/20 filter blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      </div>
      <span
        className="hidden lg:block text-[#DB6E1E] text-3xl lg:text-4xl animate-pulse-glow"
        style={{ fontFamily: "'Pacifico', cursive" }}
      >
        COMMIT TO BEING FIT
      </span>
    </Link>
  );
};
