export interface VideoData {
  id: string;
  title: string;
  description: string;
  thumbnail: string;
  url: string;
}

export const VIDEOS: VideoData[] = [
  {
    id: "motivation",
    title: "Motivation Delivered",
    description: "Get inspired with dynamic workout routines",
    thumbnail: "/images/1.motivation_delivered.png",
    url: "/videos/motivation-delivered",
  },
  {
    id: "strength",
    title: "Strength Training",
    description: "Build muscle and improve overall strength",
    thumbnail: "/images/strength_training.png",
    url: "/videos/strength-training",
  },
  {
    id: "core",
    title: "Dynamic Core",
    description: "Master core strengthening exercises",
    thumbnail: "/images/dynamic_core.png",
    url: "/videos/dynamic-core",
  },
];
