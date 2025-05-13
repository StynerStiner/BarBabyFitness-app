// src/animations/animation.ts

import { Variants } from "framer-motion";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

// Framer Motion Variants
export const fadeInUp: Variants = {
  initial: {
    opacity: 0,
    y: 20,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: {
      duration: 0.4,
    },
  },
};

export const staggerChildren: Variants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

// Hero Section Animations
export const heroTextAnimation: Variants = {
  initial: {
    opacity: 0,
    y: 30,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.8,
      ease: [0.6, 0.01, -0.05, 0.95],
    },
  },
};

// Button Hover Animation
export const buttonHover: Variants = {
  initial: { scale: 1 },
  hover: {
    scale: 1.05,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
  tap: {
    scale: 0.95,
    transition: {
      duration: 0.1,
    },
  },
};

// Plan Card Animations
export const planCardAnimation: Variants = {
  initial: {
    opacity: 0,
    scale: 0.9,
    y: 20,
  },
  animate: {
    opacity: 1,
    scale: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut",
    },
  },
  hover: {
    y: -5,
    transition: {
      duration: 0.2,
      ease: "easeInOut",
    },
  },
};

// Form Field Animations
export const formFieldAnimation: Variants = {
  initial: {
    opacity: 0,
    x: -10,
  },
  animate: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

// Success Message Animation
export const successAnimation: Variants = {
  initial: {
    scale: 0.8,
    opacity: 0,
  },
  animate: {
    scale: 1,
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "spring",
      stiffness: 200,
      damping: 15,
    },
  },
};

// Progress Bar Animation
export const progressBarAnimation: Variants = {
  initial: { width: "0%" },
  animate: (custom: number) => ({
    width: `${custom}%`,
    transition: {
      duration: 0.8,
      ease: "easeInOut",
    },
  }),
};

// GSAP Animations
export const initializeGSAPAnimations = () => {
  // Hero Section Parallax
  gsap.to(".hero-background", {
    yPercent: 30,
    ease: "none",
    scrollTrigger: {
      trigger: ".hero-section",
      start: "top top",
      end: "bottom top",
      scrub: true,
    },
  });

  // Animated Counter
  const counterAnimation = (element: Element, target: number) => {
    gsap.to(element, {
      innerHTML: target,
      duration: 2,
      snap: { innerHTML: 1 },
      scrollTrigger: {
        trigger: element,
        start: "top center",
      },
    });
  };

  // Reveal Animation
  const revealAnimation = (element: Element) => {
    gsap.from(element, {
      y: 60,
      opacity: 0,
      duration: 1,
      ease: "power3.out",
      scrollTrigger: {
        trigger: element,
        start: "top bottom-=100",
      },
    });
  };

  return {
    counterAnimation,
    revealAnimation,
  };
};

// Custom Hover Effect
export const createHoverEffect = (element: HTMLElement) => {
  const hover = gsap.to(element, {
    scale: 1.05,
    duration: 0.3,
    paused: true,
    ease: "power2.out",
  });

  element.addEventListener("mouseenter", () => hover.play());
  element.addEventListener("mouseleave", () => hover.reverse());

  return () => {
    hover.kill();
    element.removeEventListener("mouseenter", () => hover.play());
    element.removeEventListener("mouseleave", () => hover.reverse());
  };
};
