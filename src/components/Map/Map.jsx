import { MapContainer, TileLayer } from 'react-leaflet';
import CarSprite from '../components/CarSprite';
import { useVehicleContext } from '../contexts/VehicleContext';
import { useRoutePlayer } from '../hooks/useRoutePlayer';

export default function Map({ routePoints }) {
  const { speedMultiplier } = useVehicleContext();
  
  const {
    position,
    heading,
    speed,
    isPlaying,
    setIsPlaying,
    progress
  } = useRoutePlayer(routePoints, speedMultiplier);

  return (
    <div className="map-wrapper">
      <MapContainer center={[-23.5505, -46.6333]} zoom={13} style={{ height: '100vh' }}>
        <TileLayer
          attribution='&copy; OpenStreetMap contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {position && (
          <CarSprite 
            position={position} 
            heading={heading} 
            speed={speed} 
          />
        )}
      </MapContainer>

      {/* Controles opcionais */}
      <div className="route-controls">
        <button onClick={() => setIsPlaying(!isPlaying)}>
          {isPlaying ? '⏸ Pausar' : '▶ Executar Rota'}
        </button>
        <progress value={progress} max="100" />
      </div>
    </div>
  );
}