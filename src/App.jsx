// src/App.jsx
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Polyline, Marker, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { Icon } from 'leaflet'; 
import CarSprite from './components/CarSprite/CarSprite';
import './App.scss';

// Fix do ícone Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// Componente para centralizar o mapa
function MapCenter({ position }) {
  const map = useMap(); // Agora o useMap está definido graças ao import acima
  
  useEffect(() => {
    if (position) {
      // move o mapa para a nova posição com animação suave
      map.setView([position.latitude, position.longitude], map.getZoom(), {
        animate: true,
        pan: {
          duration: 0.5 // meio segundo de animação
        }
      });
    }
  }, [position, map]);

  return null;
}

const App = () => {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(-1);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  
  // Importa os dados GPS
  const gpsData = require('./frontend_data_gps.json');
  
  const vehicle = gpsData.vehicle || {};
  const courses = gpsData.courses || [];
  const currentCourse = courses[selectedRoute] || { gps: [] };
  const points = currentCourse.gps || [];
  const currentPoint = currentIndex >= 0 ? points[currentIndex] : null;

  // Animação com velocidade baseada nos dados GPS
  useEffect(() => {
    if (!isPlaying || currentIndex >= points.length - 1) {
      if (currentIndex >= points.length - 1) setIsPlaying(false);
      return;
    }

    const interval = setInterval(() => {
      setCurrentIndex(prev => {
        const nextIndex = prev + 1;
        if (nextIndex >= points.length) {
          setIsPlaying(false);
          return prev;
        }
        return nextIndex;
      });
    }, 500 / speedMultiplier); // Velocidade base ajustável

    return () => clearInterval(interval);
  }, [isPlaying, currentIndex, points.length, speedMultiplier]);

  // Handler para iniciar/parar
  const togglePlay = () => {
    if (currentIndex === -1 || currentIndex >= points.length - 1) {
      setCurrentIndex(0);
    }
    setIsPlaying(!isPlaying);
  };

  // Handler para reiniciar
  const handleReset = () => {
    setIsPlaying(false);
    setCurrentIndex(-1);
  };

  // Handler para trocar rota
  const handleRouteChange = (e) => {
    setSelectedRoute(Number(e.target.value));
    setCurrentIndex(-1);
    setIsPlaying(false);
  };

  // Ajusta velocidade baseado na velocidade real do GPS (BÔNUS)
  useEffect(() => {
    if (currentPoint?.speed) {
      // Quanto maior a velocidade, mais rápido avança
      const newSpeed = Math.max(0.5, currentPoint.speed / 10);
      setSpeedMultiplier(newSpeed);
    }
  }, [currentPoint]);

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚗 Rastreamento 3D</h1>
        <div className="controls">
          <select value={selectedRoute} onChange={handleRouteChange}>
            {courses.map((_, idx) => (
              <option key={idx} value={idx}>
                Rota {idx + 1}
              </option>
            ))}
          </select>
          <button onClick={togglePlay} className="btn-primary">
            {isPlaying ? '⏸ Pausar' : '▶ Reproduzir'}
          </button>
          <button onClick={handleReset} className="btn-secondary">
            🔄 Reiniciar
          </button>
        </div>
      </header>

      <div className="map-container">
        <MapContainer 
          center={points[0] ? [points[0].latitude, points[0].longitude] : [-23.963214, -46.28054]}
          zoom={14}
          style={{ height: '100%', width: '100%' }}
        >
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {/* Linha da rota */}
          {points.length > 0 && (
            <Polyline 
              positions={points.map(p => [p.latitude, p.longitude])}
              color="#FFC107"
              weight={3}
              opacity={0.8}
            />
          )}
          
          {/* Marker do carro COM SPRITE */}
          {currentPoint && (
<Marker 
    position={[currentPoint.latitude, currentPoint.longitude]}
    icon={new Icon({
      iconUrl: 'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCI+PC9zdmc+', // SVG transparente
      iconSize: [60, 60],
      iconAnchor: [30, 30],
    })}
  >
    <CarSprite 
      direction={currentPoint.direction || 0}
      color={vehicle.color?.replace(/\s/g, '') || '#FFEB3B'}
    />
  </Marker>
)}
          
          <MapCenter position={currentPoint || points[0]} />
        </MapContainer>
      </div>

      <div className="info-panel">
        <div className="info-item">
          <strong>Placa:</strong> {vehicle.plate?.trim() || 'N/A'}
        </div>
        <div className="info-item">
          <strong>Velocidade:</strong> {currentPoint?.speed?.toFixed(1) || 0} km/h
        </div>
        <div className="info-item">
          <strong>Direção:</strong> {currentPoint?.direction?.toFixed(1) || 0}°
        </div>
        <div className="info-item">
          <strong>Ponto:</strong> {currentIndex + 1} / {points.length}
        </div>
        <div className="info-item">
          <strong>Rota:</strong> {selectedRoute + 1} / {courses.length}
        </div>
      </div>
    </div>
  );
};

export default App;