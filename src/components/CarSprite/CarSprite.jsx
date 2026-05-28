// src/components/CarSprite/CarSprite.jsx
import React from 'react';
import './CarSprite.scss';

const CarSprite = ({ direction = 0, color = '#FFEB3B' }) => {
  // 72 frames para 360 graus = 5 graus por frame
  const frameIndex = Math.min(Math.floor(direction / 5), 71);
  const frameWidth = 60; // Largura de cada frame em pixels
  const positionX = -(frameIndex * frameWidth);

  return (
    <div className="car-sprite-wrapper">
      <div 
        className="car-sprite"
        style={{
          backgroundImage: `url(${process.env.PUBLIC_URL}/sprites/car-sprite.png)`,
          backgroundPosition: `${positionX}px 0`,
          backgroundSize: '4320px 60px', // 72 frames × 60px
        }}
      />
      <div 
        className="car-indicator" 
        style={{ backgroundColor: color }}
      />
    </div>
  );
};

export default CarSprite;