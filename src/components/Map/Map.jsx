/**
 * Componente Map - Renderiza o mapa com Leaflet
 * Commit: Implementação do mapa com rotas e marker animado
 */

import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import L from 'leaflet';
import { useVehicle } from '../../contexts/VehicleContext';
import { calculateBounds, calculateCenterPoint } from '../../utils/coordinateUtils';
import CarSprite from '../CarSprite';
import './Map.scss';

// Fix para ícone do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Componente para atualizar o centro do mapa
const MapUpdater = ({ center, zoom }) => {
  const map = useMap();
  
  React.useEffect(() => {
    if (center) {
      map.setView([center.lat, center.lng], zoom);
    }
  }, [center, zoom, map]);

  return null;
};

const Map = () => {
  const { courses, selectedCourse, currentPosition } = useVehicle();
  
  const routePoints = useMemo(() => {
    if (!courses[selectedCourse]) return [];
    return courses[selectedCourse].gpsPoints.map(point => [point.lat, point.lng]);
  }, [courses, selectedCourse]);

  const mapCenter = useMemo(() => {
    if (currentPosition) {
      return { lat: currentPosition.lat, lng: currentPosition.lng };
    }
    if (routePoints.length > 0) {
      const points = routePoints.map(([lat, lng]) => ({ lat, lng }));
      return calculateCenterPoint(points);
    }
    return { lat: -23.963214, lng: -46.28054 }; // Valor padrão
  }, [currentPosition, routePoints]);

  const bounds = useMemo(() => {
    if (routePoints.length > 0) {
      const points = routePoints.map(([lat, lng]) => ({ lat, lng }));
      return calculateBounds(points);
    }
    return null;
  }, [routePoints]);

  const carDirection = currentPosition?.direction || 0;
  const carSpeed = currentPosition?.speed || 0;

  return (
    <div className="map-container">
      <MapContainer
        center={[-23.963214, -46.28054]} 
        zoom={13} 
        style={{ height: '100%', width: '100%' }} 
      >
        <MapUpdater center={mapCenter} zoom={15} />
        
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        {routePoints.length > 1 && (
          <Polyline
            positions={routePoints}
            color="#FFEB3B"
            weight={4}
            opacity={0.8}
            dashArray="10, 10"
          />
        )}

        {currentPosition && (
          <Marker position={[currentPosition.lat, currentPosition.lng]}>
            <div className="map-container__car-marker">
              <CarSprite 
                direction={carDirection}
                speed={carSpeed}
                size="medium"
              />
            </div>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default Map;