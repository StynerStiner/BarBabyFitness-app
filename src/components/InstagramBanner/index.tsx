"use client";

export const InstagramBanner = () => {
  return (
    <div className="relative h-[400px] flex items-center justify-center overflow-hidden">
      {/* Gradient background */}
      <div className="absolute inset-0 bg-gradient-to-br from-black via-[#DB6E1E]/20 to-black" />

      {/* Animated background elements */}
      <div className="absolute inset-0">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#DB6E1E]/10 rounded-full filter blur-3xl animate-float" />
        <div
          className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-[#DB6E1E]/5 rounded-full filter blur-3xl animate-float"
          style={{ animationDelay: "-1.5s" }}
        />
      </div>

      {/* Background text */}
      <div className="absolute inset-0 flex items-center justify-center">
        <h2 className="text-[200px] font-bold text-[#2a2a2a] select-none tracking-tight">
          FOLLOW US
        </h2>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <h3 className="text-4xl md:text-5xl font-bold text-white bg-gradient-to-r from-white via-white to-[#DB6E1E] bg-clip-text text-transparent">
          Follow us on Social Media
        </h3>
      </div>
    </div>
  );
};
