'use client';

import { useState, useEffect, useCallback } from 'react';

type PartOfDay = 'dawn' | 'morning' | 'afternoon' | 'evening' | 'night';

interface TimeOfDayResult {
  partOfDay: PartOfDay;
  accentTint: string;
  isDaytime: boolean;
  timeBasedOpacity: number;
}

/**
 * Hook que fornece informações contextuais sobre o período do dia e
 * gera uma cor de destaque apropriada baseada na hora atual.
 * 
 * @returns {TimeOfDayResult} Objeto contendo o período do dia e a cor de destaque correspondente
 */
export const useTimeOfDay = (): TimeOfDayResult => {
  const [partOfDay, setPartOfDay] = useState<PartOfDay>('morning');
  const [accentTint, setAccentTint] = useState<string>('hsl(28, 65%, 55%)');
  const [isDaytime, setIsDaytime] = useState<boolean>(true);
  const [timeBasedOpacity, setTimeBasedOpacity] = useState<number>(0.8);

  const updateTimeOfDay = useCallback(() => {
    const currentHour = new Date().getHours();
    
    // Determine o período do dia
    if (currentHour >= 5 && currentHour < 8) {
      setPartOfDay('dawn');
      setIsDaytime(true);
      setTimeBasedOpacity(0.7);
    } else if (currentHour >= 8 && currentHour < 12) {
      setPartOfDay('morning');
      setIsDaytime(true);
      setTimeBasedOpacity(0.8);
    } else if (currentHour >= 12 && currentHour < 17) {
      setPartOfDay('afternoon');
      setIsDaytime(true);
      setTimeBasedOpacity(0.9);
    } else if (currentHour >= 17 && currentHour < 20) {
      setPartOfDay('evening');
      setIsDaytime(false);
      setTimeBasedOpacity(0.75);
    } else {
      setPartOfDay('night');
      setIsDaytime(false);
      setTimeBasedOpacity(0.6);
    }

    // Calcule a matiz HSL com base na hora (28° pela manhã até 8° à noite)
    // Quanto mais tarde, mais quente/âmbar fica a cor
    let hue: number;
    if (currentHour >= 5 && currentHour < 12) {
      // Dawn to morning: 28° -> 22°
      hue = 28 - ((currentHour - 5) / 7) * 6;
    } else if (currentHour >= 12 && currentHour < 17) {
      // Afternoon: 22° -> 16°
      hue = 22 - ((currentHour - 12) / 5) * 6;
    } else if (currentHour >= 17 && currentHour < 20) {
      // Evening: 16° -> 12°
      hue = 16 - ((currentHour - 17) / 3) * 4;
    } else {
      // Night: 12° -> 8°
      hue = currentHour < 5 ? 8 + (currentHour / 5) * 4 : 12 - ((currentHour - 20) / 9) * 4;
    }

    // Configure a variável CSS personalizada para uso global
    document.documentElement.style.setProperty('--color-accent-hue', Math.round(hue).toString());
    
    // Atualize a variável RGB para gradientes e transparências
    const hslToRgb = (h: number, s: number, l: number): number[] => {
      s /= 100;
      l /= 100;
      const k = (n: number) => (n + h / 30) % 12;
      const a = s * Math.min(l, 1 - l);
      const f = (n: number) => l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1)));
      return [
        Math.round(255 * f(0)),
        Math.round(255 * f(8)),
        Math.round(255 * f(4))
      ];
    };
    
    const rgb = hslToRgb(Math.round(hue), 65, 55);
    document.documentElement.style.setProperty('--color-accent-rgb', rgb.join(', '));
    
    setAccentTint(`hsl(${Math.round(hue)}, 65%, 55%)`);
  }, []);

  useEffect(() => {
    // Atualize imediatamente
    updateTimeOfDay();
    
    // Configure um intervalo para atualizar a cada 15 minutos (900000ms)
    const interval = setInterval(updateTimeOfDay, 15 * 60 * 1000);
    
    // Limpe o intervalo quando o componente for desmontado
    return () => clearInterval(interval);
  }, [updateTimeOfDay]);

  return { partOfDay, accentTint, isDaytime, timeBasedOpacity };
};

export default useTimeOfDay;