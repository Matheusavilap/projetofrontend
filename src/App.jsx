import React, { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Polyline } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import CarSprite from './components/CarSprite/CarSprite';
import './App.scss';

// 🔧 Corrige ícones padrão do Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png',
});

// 🧮 Calcula bearing matemático entre dois pontos GPS
function calculateBearing(lat1, lng1, lat2, lng2) {
  const toRad = (deg) => (deg * Math.PI) / 180;
  const toDeg = (rad) => (rad * 180) / Math.PI;
  const φ1 = toRad(lat1);
  const φ2 = toRad(lat2);
  const Δλ = toRad(lng2 - lng1);
  const y = Math.sin(Δλ) * Math.cos(φ2);
  const x = Math.cos(φ1) * Math.sin(φ2) - Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
  const bearing = (toDeg(Math.atan2(y, x)) + 360) % 360;
  return isNaN(bearing) ? 0 : bearing;
}

const App = () => {
  const [selectedRoute, setSelectedRoute] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [speedMultiplier, setSpeedMultiplier] = useState(1);
  const [carPosition, setCarPosition] = useState(null);
  const [carHeading, setCarHeading] = useState(0);
  
  const animFrameRef = useRef(null);

  // Carrega os dados GPS (ajuste o caminho se necessário)
  const gpsData = require('./frontend_data_gps.json');
  const vehicle = gpsData.vehicle || {};
  const courses = gpsData.courses || [];
  const points = courses[selectedRoute]?.gps || [];

  // 🔹 Define posição inicial ao trocar de rota ou carregar
  useEffect(() => {
    if (points.length > 0) {
      setCarPosition([points[0].latitude, points[0].longitude]);
      setIsPlaying(false);
    }
  }, [selectedRoute, points]);

  // 🔹 Loop de animação corrigido e robusto (Uber-like)
  useEffect(() => {
    if (!isPlaying || points.length < 2) {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
      return;
    }

    let lastTimestamp = 0;
    let currentIdx = 0;
    let progress = 0;
    const timePerSegment = 1500 / speedMultiplier; // Tempo base para percorrer 1 segmento (ms)

    const animate = (timestamp) => {
      if (!lastTimestamp) lastTimestamp = timestamp;
      const delta = timestamp - lastTimestamp;
      lastTimestamp = timestamp;

      // Atualiza progresso entre o ponto atual e o próximo
      progress += delta / timePerSegment;

      // Avança para o próximo segmento se completar o atual
      while (progress >= 1 && currentIdx < points.length - 1) {
        progress -= 1;
        currentIdx++;
      }

      // Finaliza a rota
      if (currentIdx >= points.length - 1) {
        const lastPoint = points[points.length - 1];
        setCarPosition([lastPoint.latitude, lastPoint.longitude]);
        setCarHeading(0);
        setIsPlaying(false);
        return;
      }

      const p1 = points[currentIdx];
      const p2 = points[currentIdx + 1];

      // Interpolação linear de posição (movimento contínuo)
      const lat = p1.latitude + (p2.latitude - p1.latitude) * progress;
      const lng = p1.longitude + (p2.longitude - p1.longitude) * progress;
      
      // Calcula direção para o próximo ponto
      const heading = calculateBearing(p1.latitude, p1.longitude, p2.latitude, p2.longitude);

      setCarPosition([lat, lng]);
      setCarHeading(heading);

      animFrameRef.current = requestAnimationFrame(animate);
    };

    animFrameRef.current = requestAnimationFrame(animate);

    // Limpeza garantida ao desmontar ou reiniciar
    return () => {
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [isPlaying, speedMultiplier, points]);

  const handleTogglePlay = () => {
    setIsPlaying(prev => !prev);
  };

  const handleReset = () => {
    setIsPlaying(false);
    if (points.length > 0) {
      setCarPosition([points[0].latitude, points[0].longitude]);
      setCarHeading(0);
    }
  };

  return (
    <div className="app">
      <header className="app-header">
        <h1>🚗 Rastreamento 3D</h1>
        <div className="controls">
          <select value={selectedRoute} onChange={e => setSelectedRoute(Number(e.target.value))}>
            {courses.map((_, idx) => (
              <option key={idx} value={idx}>Rota {idx + 1}</option>
            ))}
          </select>
          
          <div className="speed-selector">
            <label>Velocidade: {speedMultiplier}x</label>
            <input 
              type="range" min="0.5" max="5" step="0.5" 
              value={speedMultiplier} 
              onChange={e => setSpeedMultiplier(Number(e.target.value))} 
            />
          </div>

          <button onClick={handleTogglePlay} className="btn-primary" disabled={points.length === 0}>
            {isPlaying ? '⏸ Pausar' : '▶ Executar'}
          </button>
          
          <button onClick={handleReset} className="btn-secondary">🔄 Reiniciar</button>
        </div>
      </header>

      <div className="map-container">
        <MapContainer center={carPosition || [-23.55, -46.63]} zoom={14} style={{ height: '100%', width: '100%' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; OpenStreetMap'
          />
          
          {/* Linha da rota */}
          {points.length > 0 && (
            <Polyline 
              positions={points.map(p => [p.latitude, p.longitude])} 
              color="#FFC107" 
              weight={4} 
              opacity={0.8} 
            />
          )}

          {/* Sprite do carro */}
          {carPosition && (
            <CarSprite 
              position={carPosition} 
              heading={carHeading} 
            />
          )}
        </MapContainer>
      </div>

      <div className="info-panel">
        <div className="info-item"><strong>Placa:</strong> {vehicle.plate?.trim() || 'N/A'}</div>
        <div className="info-item"><strong>Velocidade:</strong> {(speedMultiplier * 30).toFixed(1)} km/h</div>
        <div className="info-item"><strong>Direção:</strong> {carHeading.toFixed(1)}°</div>
        <div className="info-item"><strong>Rota:</strong> {selectedRoute + 1} / {courses.length}</div>
      </div>
    </div>
  );
};

export default App;