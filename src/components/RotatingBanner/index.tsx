"use client";

import { useEffect, useState } from "react";

export const RotatingBanner = () => {
  const [scrollPosition, setScrollPosition] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const images = [
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
    "/placeholder.svg?height=300&width=300",
  ];

  return (
    <div className="relative w-full h-[50vh] min-h-[400px] overflow-hidden bg-white">
      <div
        className="absolute inset-0 flex items-center whitespace-nowrap"
        style={{
          transform: `translateX(${-scrollPosition * 0.5}px)`,
        }}
      >
        <h1 className="text-[20vw] font-bold tracking-tighter text-black relative flex items-center">
          ARTISTIC
          <div className="absolute w-[15vw] h-[15vw] left-[5%] top-1/2 -translate-y-1/2 overflow-hidden rounded-lg">
            <img
              src={images[0]}
              alt=""
              className="w-full h-full object-cover"
              style={{
                transform: `rotate(${scrollPosition * 0.1}deg)`,
              }}
            />
          </div>
          -CREATION
          <div className="absolute w-[15vw] h-[15vw] left-[40%] top-1/2 -translate-y-1/2 overflow-hidden rounded-lg">
            <img
              src={images[1]}
              alt=""
              className="w-full h-full object-cover"
              style={{
                transform: `rotate(${-scrollPosition * 0.1}deg)`,
              }}
            />
          </div>
          -GENER
          <div className="absolute w-[15vw] h-[15vw] left-[75%] top-1/2 -translate-y-1/2 overflow-hidden rounded-lg">
            <img
              src={images[2]}
              alt=""
              className="w-full h-full object-cover"
              style={{
                transform: `rotate(${scrollPosition * 0.1}deg)`,
              }}
            />
          </div>
        </h1>
      </div>
    </div>
  );
};
