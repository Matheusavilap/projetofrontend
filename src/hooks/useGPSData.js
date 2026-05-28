/**
 * Hook personalizado para carregamento de dados GPS
 * Commit: Hook useGPSData para busca e processamento de dados
 */

import { useState, useEffect } from 'react';
import gpsService from '../services/gpsService';

export const useGPSData = (dataUrl = null) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        let gpsData;

        if (dataUrl) {
          const response = await fetch(dataUrl);
          gpsData = await response.json();
        } else {
          // Dados serão fornecidos via props
          setLoading(false);
          return;
        }

        const processedData = gpsService.processGPSData(gpsData);
        setData(processedData);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (dataUrl) {
      loadData();
    }
  }, [dataUrl]);

  const processData = (rawData) => {
    const processedData = gpsService.processGPSData(rawData);
    setData(processedData);
    return processedData;
  };

  return {
    data,
    loading,
    error,
    processData
  };
};

export default useGPSData;