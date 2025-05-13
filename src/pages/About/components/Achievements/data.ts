import { Award, Users, Globe, Trophy } from "lucide-react";
import React from "react";

export const achievements = [
  {
    icon: React.createElement(Award, { className: "w-12 h-12" }),
    value: "98%",
    label: "SUCCESS RATE",
    gradient: "from-pink-500 to-red-500",
    isGoal: false,
    description: "Client satisfaction and goal achievement rate",
  },
  {
    icon: React.createElement(Users, { className: "w-12 h-12" }),
    value: "10K+",
    label: "ACTIVE MEMBERS",
    gradient: "from-blue-500 to-purple-500",
    isGoal: true,
    description: "Target community size by 2025",
  },
  {
    icon: React.createElement(Globe, { className: "w-12 h-12" }),
    value: "20+",
    label: "COUNTRIES",
    gradient: "from-green-500 to-teal-500",
    isGoal: true,
    description: "Global expansion goal",
  },
  {
    icon: React.createElement(Trophy, { className: "w-12 h-12" }),
    value: "500+",
    label: "COMPETITIONS",
    gradient: "from-yellow-500 to-orange-500",
    isGoal: true,
    description: "Competition participation target",
  },
];

export const currentStats = {
  members: "2.5K+",
  countries: "5",
  competitions: "150+",
};
