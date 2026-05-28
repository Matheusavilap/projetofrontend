/**
 * Utilitário para cálculo de posição do sprite
 * Commit: Implementação dos cálculos de rotação do sprite
 */

const TOTAL_FRAMES = 72; // Número de frames no sprite
const FRAME_WIDTH = 60; // Largura de cada frame em pixels
const FRAME_HEIGHT = 60; // Altura de cada frame em pixels

/**
 * Calcula o índice do frame baseado na direção
 * @param {number} direction - Direção em graus (0-360)
 * @returns {number} Índice do frame (0-71)
 */
export const calculateSpriteFrame = (direction) => {
  // Normaliza a direção para 0-360
  const normalizedDirection = ((direction % 360) + 360) % 360;
  
  // Calcula o índice do frame (72 frames para 360 graus)
  const frameIndex = Math.floor((normalizedDirection / 360) * TOTAL_FRAMES);
  
  return Math.min(frameIndex, TOTAL_FRAMES - 1);
};

/**
 * Calcula a posição X do frame no sprite
 * @param {number} frameIndex - Índice do frame
 * @returns {number} Posição X em pixels
 */
export const getSpritePositionX = (frameIndex) => {
  return frameIndex * FRAME_WIDTH;
};

/**
 * Obtém as dimensões do sprite
 * @returns {Object} Dimensões do sprite
 */
export const getSpriteDimensions = () => ({
  width: FRAME_WIDTH,
  height: FRAME_HEIGHT,
  totalFrames: TOTAL_FRAMES,
  totalWidth: TOTAL_FRAMES * FRAME_WIDTH
});

/**
 * Calcula a velocidade de animação baseada na velocidade do veículo
 * @param {number} speedKmh - Velocidade em km/h
 * @param {string} animationSpeed - Velocidade da animação ('slow', 'normal', 'fast')
 * @returns {number} Intervalo em milissegundos
 */
export const calculateAnimationInterval = (speedKmh, animationSpeed = 'normal') => {
  const speedMultipliers = {
    slow: 0.5,
    normal: 1,
    fast: 2
  };

  const multiplier = speedMultipliers[animationSpeed] || 1;
  
  // Quanto maior a velocidade, menor o intervalo (animação mais rápida)
  // Base: 1000ms para 0 km/h, diminuindo conforme a velocidade aumenta
  const baseInterval = Math.max(100, 1000 - (speedKmh * 10));
  
  return baseInterval / multiplier;
};

export default {
  calculateSpriteFrame,
  getSpritePositionX,
  getSpriteDimensions,
  calculateAnimationInterval
};