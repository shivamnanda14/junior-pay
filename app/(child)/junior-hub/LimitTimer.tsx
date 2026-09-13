"use client";

import { useState, useEffect } from "react";

export default function LimitTimer() {
  const [timeLeft, setTimeLeft] = useState("");

  useEffect(() => {
    const calculateTimeLeft = () => {
      const now = new Date();
      // Calculates the time until the next midnight
      const tomorrow = new Date(now);
      tomorrow.setHours(24, 0, 0, 0);
      
      const diff = tomorrow.getTime() - now.getTime();
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      
      setTimeLeft(`${hours}h ${minutes}m`);
    };

    calculateTimeLeft();
    const timer = setInterval(calculateTimeLeft, 60000); // Update every minute
    return () => clearInterval(timer);
  }, []);

  if (!timeLeft) return null;

  return (
    <div className="bg-orange-500/20 text-orange-100 text-xs font-bold px-3 py-2 rounded-lg border border-orange-400/50 flex items-center gap-2 mt-4 backdrop-blur-sm">
      <span>⏳</span> Daily limit exhausted. Resets in {timeLeft}
    </div>
  );
}