/**
 * Utilitários para coordenadas geográficas
 * Commit: Funções auxiliares para manipulação de coordenadas
 */

/**
 * Converte coordenadas para formato legível
 * @param {number} lat - Latitude
 * @param {number} lng - Longitude
 * @returns {string} Coordenadas formatadas
 */
export const formatCoordinates = (lat, lng) => {
  const latDir = lat >= 0 ? 'N' : 'S';
  const lngDir = lng >= 0 ? 'E' : 'W';
  
  return `${Math.abs(lat).toFixed(6)}° ${latDir}, ${Math.abs(lng).toFixed(6)}° ${lngDir}`;
};

/**
 * Calcula o centro de múltiplos pontos
 * @param {Array} points - Array de pontos {lat, lng}
 * @returns {Object} Ponto central {lat, lng}
 */
export const calculateCenterPoint = (points) => {
  if (!points || points.length === 0) return { lat: 0, lng: 0 };

  const sum = points.reduce((acc, point) => ({
    lat: acc.lat + point.lat,
    lng: acc.lng + point.lng
  }), { lat: 0, lng: 0 });

  return {
    lat: sum.lat / points.length,
    lng: sum.lng / points.length
  };
};

/**
 * Calcula bounds (limites) de um conjunto de pontos
 * @param {Array} points - Array de pontos {lat, lng}
 * @returns {Object} Bounds {north, south, east, west}
 */
export const calculateBounds = (points) => {
  if (!points || points.length === 0) return null;

  let north = -90;
  let south = 90;
  let east = -180;
  let west = 180;

  points.forEach(point => {
    if (point.lat > north) north = point.lat;
    if (point.lat < south) south = point.lat;
    if (point.lng > east) east = point.lng;
    if (point.lng < west) west = point.lng;
  });

  return { north, south, east, west };
};

export default {
  formatCoordinates,
  calculateCenterPoint,
  calculateBounds
};