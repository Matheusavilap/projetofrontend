/**
 * Hook personalizado para animação do veículo
 * Commit: Hook useVehicleAnimation com useEffect e setInterval
 */

import { useEffect, useRef, useCallback } from 'react';
import { useVehicle } from '../contexts/VehicleContext';
import { calculateAnimationInterval } from '../utils/spriteCalculator';

export const useVehicleAnimation = () => {
  const { 
    isPlaying, 
    currentPosition, 
    currentIndex, 
    updatePosition, 
    courses,
    selectedCourse,
    animationSpeed
  } = useVehicle();

  const intervalRef = useRef(null);

  const getSpeed = useCallback(() => {
    if (!currentPosition || !courses[selectedCourse]) return 0;
    const point = courses[selectedCourse].gpsPoints[currentIndex];
    return point?.speed || 0;
  }, [currentPosition, courses, selectedCourse, currentIndex]);

  useEffect(() => {
    if (isPlaying) {
      const speed = getSpeed();
      const interval = calculateAnimationInterval(speed, animationSpeed);

      intervalRef.current = setInterval(() => {
        updatePosition(currentIndex + 1);
      }, interval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    }
  }, [isPlaying, currentIndex, updatePosition, getSpeed, animationSpeed]);

  return {
    isPlaying,
    currentPosition,
    currentIndex,
    speed: getSpeed()
  };
};

export default useVehicleAnimation;