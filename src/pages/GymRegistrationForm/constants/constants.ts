// src/constants/constants.ts

// Advanced video filter presets
export const VIDEO_FILTERS = {
  default: {
    brightness: 100,
    contrast: 100,
    saturation: 100,
    hueRotate: 0,
    blur: 0,
    grayscale: 0,
    sepia: 0,
  },
  energetic: {
    brightness: 110,
    contrast: 120,
    saturation: 130,
    hueRotate: 10,
    blur: 0,
    grayscale: 0,
    sepia: 20,
  },
  motivational: {
    brightness: 105,
    contrast: 115,
    saturation: 110,
    hueRotate: 350,
    blur: 0,
    grayscale: 0,
    sepia: 10,
  },
  intense: {
    brightness: 95,
    contrast: 140,
    saturation: 120,
    hueRotate: 0,
    blur: 0,
    grayscale: 30,
    sepia: 0,
  },
  cinematic: {
    brightness: 90,
    contrast: 130,
    saturation: 85,
    hueRotate: 0,
    blur: 1,
    grayscale: 20,
    sepia: 10,
  },
};

// Interactive hotspot configurations
export const HOTSPOT_CONFIG = [
  {
    id: 1,
    x: 25,
    y: 35,
    title: "Weight Training Area",
    description: "State-of-the-art equipment for all fitness levels",
    icon: "Dumbbell",
    animation: "pulse",
  },
  {
    id: 2,
    x: 75,
    y: 45,
    title: "Cardio Zone",
    description: "Latest cardio machines with smart tracking",
    icon: "Heart",
    animation: "ripple",
  },
  // Add more hotspots as needed...
];

// Mobile optimizations
export const MOBILE_IMAGE_SIZES = {
  sm: {
    width: 640,
    height: 360,
    quality: 80,
  },
  md: {
    width: 768,
    height: 432,
    quality: 85,
  },
  lg: {
    width: 1024,
    height: 576,
    quality: 90,
  },
};

// Performance configurations
export const PERFORMANCE_CONFIG = {
  imageLoadingStrategy: "progressive",
  videoBufferSize: "4MB",
  animationFrameRate: 60,
  interactionThrottleMs: 16,
  suspenseTimeout: 3000,
};
