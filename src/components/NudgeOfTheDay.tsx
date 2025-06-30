import React from 'react';
import { Lightbulb, Heart } from 'lucide-react';

export default function NudgeOfTheDay() {
  const nudges = [
    "Offer to water a neighbor's plants while they're away! 🌱",
    "Share your WiFi password with a neighbor who needs internet! 📶",
    "Offer to walk an elderly neighbor's dog! 🐕",
    "Help someone carry groceries up the stairs! 🛍️",
    "Share fresh vegetables from your garden! 🥕",
    "Offer to babysit for a parent who needs a break! 👶",
    "Help a neighbor with their technology questions! 💻",
    "Offer to shovel snow from a neighbor's driveway! ❄️",
  ];

  const todayNudge = nudges[new Date().getDay() % nudges.length];

  return (
    <div className="bg-gradient-to-r from-accent-500 to-accent-600 rounded-xl shadow-lg p-6 mb-8 text-white">
      <div className="flex items-center space-x-3 mb-4">
        <Lightbulb className="h-6 w-6" />
        <h2 className="text-xl font-bold">Nudge of the Day</h2>
        <Heart className="h-5 w-5" />
      </div>
      <p className="text-lg font-medium opacity-95">{todayNudge}</p>
      <p className="text-sm opacity-80 mt-2">
        Small acts of kindness make big differences in our communities!
      </p>
    </div>
  );
}