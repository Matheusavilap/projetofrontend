import { useState, useEffect, useRef } from 'react';
import { calculateBearing } from '../utils/coordinateUtils';

export function useRoutePlayer(routePoints, speedMultiplier = 1) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [position, setPosition] = useState(null);
  const [heading, setHeading] = useState(0);
  const [speed, setSpeed] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const timerRef = useRef(null);
  const lastValidHeading = useRef(0); // Guarda a última direção válida

  useEffect(() => {
    if (!routePoints || routePoints.length < 2) return;

    const playStep = () => {
      setCurrentIndex(prev => {
        const next = prev + 1;
        if (next >= routePoints.length) {
          setIsPlaying(false);
          return prev;
        }
        return next;
      });
    };

    if (isPlaying) {
      const interval = Math.max(150, 1000 / speedMultiplier);
      timerRef.current = setInterval(playStep, interval);
    }

    return () => clearInterval(timerRef.current);
  }, [isPlaying, routePoints, speedMultiplier]);

  useEffect(() => {
    if (!routePoints || currentIndex >= routePoints.length) return;

    const current = routePoints[currentIndex];
    const next = routePoints[currentIndex + 1] || current;

    setPosition({ lat: current.lat, lng: current.lng });
    setSpeed(current.speed || 30);

    // Cálculo seguro de heading
    let newHeading = lastValidHeading.current;
    if (currentIndex < routePoints.length - 1) {
      const dLat = next.lat - current.lat;
      const dLng = next.lng - current.lng;
      // Só calcula bearing se houver deslocamento real (> ~1 metro)
      if (Math.abs(dLat) > 0.00001 || Math.abs(dLng) > 0.00001) {
        newHeading = calculateBearing(current.lat, current.lng, next.lat, next.lng);
        lastValidHeading.current = newHeading;
      }
    }
    setHeading(newHeading);
  }, [currentIndex, routePoints]);

  return {
    position,
    heading,
    speed,
    isPlaying,
    setIsPlaying,
    progress: routePoints ? (currentIndex / routePoints.length) * 100 : 0,
    currentIndex
  };
}