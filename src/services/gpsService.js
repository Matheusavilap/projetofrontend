/**
 * Serviço para processamento de dados GPS
 * Commit: Implementação do serviço de GPS com funções de cálculo
 */

class GPSService {
  /**
   * Calcula a distância entre dois pontos geográficos (Haversine formula)
   * @param {number} lat1 - Latitude do ponto 1
   * @param {number} lon1 - Longitude do ponto 1
   * @param {number} lat2 - Latitude do ponto 2
   * @param {number} lon2 - Longitude do ponto 2
   * @returns {number} Distância em metros
   */
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371e3; // Raio da Terra em metros
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δφ = (lat2 - lat1) * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  }

  /**
   * Calcula o bearing (direção) entre dois pontos
   * @param {number} lat1 - Latitude do ponto 1
   * @param {number} lon1 - Longitude do ponto 1
   * @param {number} lat2 - Latitude do ponto 2
   * @param {number} lon2 - Longitude do ponto 2
   * @returns {number} Bearing em graus (0-360)
   */
  calculateBearing(lat1, lon1, lat2, lon2) {
    const φ1 = lat1 * Math.PI / 180;
    const φ2 = lat2 * Math.PI / 180;
    const Δλ = (lon2 - lon1) * Math.PI / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x = Math.cos(φ1) * Math.sin(φ2) -
              Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    
    let θ = Math.atan2(y, x) * 180 / Math.PI;
    return (θ + 360) % 360; // Normaliza para 0-360
  }

  /**
   * Processa dados brutos do GPS
   * @param {Object} gpsData - Dados GPS brutos
   * @returns {Object} Dados processados
   */
  processGPSData(gpsData) {
    const courses = gpsData.courses.map(course => ({
      ...course,
      startTime: new Date(course.start_at),
      endTime: new Date(course.end_at),
      gpsPoints: course.gps.map(point => ({
        ...point,
        timestamp: new Date(point.acquisition_time),
        lat: point.latitude,
        lng: point.longitude
      }))
    }));

    return {
      ...gpsData,
      courses,
      vehicle: gpsData.vehicle
    };
  }

  /**
   * Interpola pontos entre dois timestamps
   * @param {Array} points - Array de pontos GPS
   * @param {Date} startTime - Tempo inicial
   * @param {Date} endTime - Tempo final
   * @returns {Array} Pontos interpolados
   */
  interpolatePoints(points, startTime, endTime) {
    const startTimestamp = startTime.getTime();
    const endTimestamp = endTime.getTime();
    const interpolated = [];

    for (let i = 0; i < points.length - 1; i++) {
      const current = points[i];
      const next = points[i + 1];
      const currentTimestamp = new Date(current.acquisition_time).getTime();
      const nextTimestamp = new Date(next.acquisition_time).getTime();

      if (currentTimestamp <= endTimestamp && nextTimestamp >= startTimestamp) {
        interpolated.push(current);
      }
    }

    return interpolated;
  }
}

export default new GPSService();