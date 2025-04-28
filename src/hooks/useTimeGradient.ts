'use client';

import { useState, useEffect } from 'react';

type TimeOfDay = 'dawn' | 'day' | 'dusk' | 'night';

export const useTimeGradient = () => {
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>('day');

  useEffect(() => {
    const updateTimeOfDay = () => {
      const currentHour = new Date().getHours();
      if (currentHour >= 5 && currentHour < 10) setTimeOfDay('dawn');
      else if (currentHour >= 10 && currentHour < 17) setTimeOfDay('day');
      else if (currentHour >= 17 && currentHour < 21) setTimeOfDay('dusk');
      else setTimeOfDay('night');
    };

    updateTimeOfDay();
    // Optional: Update time every hour for long sessions
    const interval = setInterval(updateTimeOfDay, 3600000);
    return () => clearInterval(interval);
  }, []);

  // Return both the timeOfDay and the corresponding gradient class
  const gradientClass = {
    dawn: 'bg-gradient-to-b from-rose-500/30 via-amber-400/20 to-black/60',
    day: 'bg-gradient-to-b from-sky-400/20 via-transparent to-black/60',
    dusk: 'bg-gradient-to-b from-orange-500/30 via-purple-500/20 to-black/70',
    night: 'bg-gradient-to-b from-indigo-900/40 via-purple-900/30 to-black/80',
  }[timeOfDay];

  return { timeOfDay, gradientClass };
};
export default useTimeGradient;