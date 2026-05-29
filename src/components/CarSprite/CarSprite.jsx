import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import './CarSprite.scss';

const CONFIG = {
  TOTAL_FRAMES: 72,
  FRAME_WIDTH: 64,
  FRAME_HEIGHT: 64,
  REFERENCE_ZOOM: 17,
  BASE_SCALE: 1
};

export default function CarSprite({ position, heading }) {
  const map = useMap();
  const markerRef = useRef(null);
  const innerElRef = useRef(null);

  // Cria o marcador apenas uma vez
  useEffect(() => {
    if (!map) return;

    // O ícone agora é apenas um container vazio, o tamanho é controlado pelo CSS
    const icon = L.divIcon({
      className: '', // Remove classes padrão do leaflet
      html: `
        <div class="sprite-wrapper">
          <div class="car-sprite-inner"></div>
        </div>
      `,
      iconSize: [64, 64],
      iconAnchor: [32, 32] // Centraliza no ponto GPS
    });

    markerRef.current = L.marker([0, 0], { icon, zIndexOffset: 1000 }).addTo(map);
    innerElRef.current = markerRef.current.getElement().querySelector('.car-sprite-inner');

    return () => {
      if (markerRef.current) map.removeLayer(markerRef.current);
      markerRef.current = null;
      innerElRef.current = null;
    };
  }, [map]);

  // Atualiza posição e rotação
  useEffect(() => {
    if (!markerRef.current || !position || !innerElRef.current) return;

    // Move o marcador para a coordenada
    markerRef.current.setLatLng([position[0], position[1]]);

    const inner = innerElRef.current;
    const safeHeading = isNaN(heading) ? 0 : heading;
    const normalized = ((safeHeading % 360) + 360) % 360;
    
    // Cálculo do frame com Math.round para evitar sub-pixels na posição do background
    const frameIndex = Math.round((normalized / 360) * (CONFIG.TOTAL_FRAMES - 1)) % CONFIG.TOTAL_FRAMES;

    // Aplica a imagem e a posição do frame
    inner.style.backgroundImage = `url('/sprites/car-sprite.png')`;
    inner.style.backgroundPositionX = `-${frameIndex * CONFIG.FRAME_WIDTH}px`;
    
    // Aplica a rotação (o CSS cuida da suavidade aqui)
    inner.style.transform = `rotate(${normalized}deg)`;

  }, [position, heading]);

  return null;
}