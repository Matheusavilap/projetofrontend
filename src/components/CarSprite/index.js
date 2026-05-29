import { useEffect, useRef } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import './CarSprite.scss';

export default function CarSprite({ position, heading, speed }) {
  const map = useMap();
  const markerRef = useRef(null);
  const innerElRef = useRef(null);

  useEffect(() => {
    if (!map || !position) return;

    // Cria o ícone personalizado apenas uma vez
    const icon = L.divIcon({
      className: 'car-marker',
      html: '<div class="car-sprite-inner"></div>',
      iconSize: [64, 64],
      iconAnchor: [32, 32],
      popupAnchor: [0, -32],
    });

    markerRef.current = L.marker(position, { icon, zIndexOffset: 1000 }).addTo(map);
    innerElRef.current = markerRef.current.getElement().querySelector('.car-sprite-inner');

    return () => {
      map.removeLayer(markerRef.current);
    };
  }, [map]); // Roda apenas no mount do map

  // Atualiza posição e rotação
  useEffect(() => {
    if (!markerRef.current || !position) return;

    markerRef.current.setLatLng(position);

    const inner = innerElRef.current;
    if (inner) {
      // Aplica transição CSS suave
      inner.style.transition = 'transform 0.4s cubic-bezier(0.25, 0.8, 0.25, 1)';
      inner.style.transform = `rotate(${heading}deg)`;
    }
  }, [position, heading]);

  // Atualiza frame do sprite baseado na velocidade/direção
  useEffect(() => {
    if (!innerElRef.current) return;
    
    // Exemplo: 72 frames = 1 frame a cada 5° de rotação
    const frameIndex = Math.floor(((heading % 360) + 360) % 360 / 5);
    // Se o sprite sheet for horizontal e cada frame tiver 64px de largura:
    innerElRef.current.style.backgroundPositionX = `-${frameIndex * 64}px`;
  }, [heading]);

  return null; // Renderizado diretamente no pane do Leaflet
}