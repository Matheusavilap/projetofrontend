// src/contexts/VehicleContext.jsx
import React, { createContext, useContext, useState, useCallback } from 'react';
import gpsService from '../services/gpsService';

const VehicleContext = createContext();

export const useVehicle = () => {
  const context = useContext(VehicleContext);
  if (!context) {
    throw new Error('useVehicle deve ser usado dentro de um VehicleProvider');
  }
  return context;
};

export const VehicleProvider = ({ children, gpsData }) => {
  const [processedData, setProcessedData] = useState(() => 
    gpsData ? gpsService.processGPSData(gpsData) : null
  );
  const [selectedCourse, setSelectedCourse] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [animationSpeed, setAnimationSpeed] = useState('normal');
  const [currentPosition, setCurrentPosition] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);

  const selectCourse = useCallback((courseIndex) => {
    setSelectedCourse(courseIndex);
    setCurrentIndex(0);
    setIsPlaying(false);
    if (processedData?.courses?.[courseIndex]) {
      setCurrentPosition(processedData.courses[courseIndex].gpsPoints?.[0]);
    }
  }, [processedData]);

  const togglePlayback = useCallback(() => {
    setIsPlaying(prev => !prev);
  }, []);

  const resetAnimation = useCallback(() => {
    setIsPlaying(false);
    setCurrentIndex(0);
    if (processedData?.courses?.[selectedCourse]) {
      setCurrentPosition(processedData.courses[selectedCourse].gpsPoints?.[0]);
    }
  }, [processedData, selectedCourse]);

  const updatePosition = useCallback((index) => {
    if (processedData?.courses?.[selectedCourse]) {
      const points = processedData.courses[selectedCourse].gpsPoints;
      if (index < points?.length) {
        setCurrentPosition(points[index]);
        setCurrentIndex(index);
      } else {
        setIsPlaying(false);
      }
    }
  }, [processedData, selectedCourse]);

  const value = {
    data: processedData,
    vehicle: processedData?.vehicle,
    courses: processedData?.courses || [],
    selectedCourse,
    currentPosition,
    currentIndex,
    isPlaying,
    animationSpeed,
    selectCourse,
    togglePlayback,
    resetAnimation,
    updatePosition,
    setAnimationSpeed
  };

  return (
    <VehicleContext.Provider value={value}>
      {children}
    </VehicleContext.Provider>
  );
};

// ✅ APENAS UM EXPORT DEFAULT NO FINAL
export default VehicleContext;