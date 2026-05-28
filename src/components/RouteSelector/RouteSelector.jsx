/**
 * Componente RouteSelector - Seleção de rotas e controles
 * Commit: Implementação do seletor de rotas com internacionalização
 */

import React from 'react';
import { useIntl } from 'react-intl';
import { useVehicle } from '../../contexts/VehicleContext';
import './RouteSelector.scss';

const RouteSelector = () => {
  const intl = useIntl();
  const { 
    courses, 
    selectedCourse, 
    selectCourse, 
    isPlaying, 
    togglePlayback, 
    resetAnimation,
    animationSpeed,
    setAnimationSpeed
  } = useVehicle();

  const formatDuration = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    
    if (hours > 0) {
      return `${hours}h ${minutes}min`;
    }
    return `${minutes}min`;
  };

  const formatDistance = (meters) => {
    return `${(meters / 1000).toFixed(2)} km`;
  };

  return (
    <div className="route-selector">
      <h2 className="route-selector__title">
        {intl.formatMessage({ id: 'routes.title' })}
      </h2>

      <div className="route-selector__list">
        {courses.map((course, index) => (
          <button
            key={index}
            className={`route-selector__item ${selectedCourse === index ? 'route-selector__item--active' : ''}`}
            onClick={() => selectCourse(index)}
          >
            <div className="route-selector__course-info">
              <span className="route-selector__course-name">
                {intl.formatMessage({ id: 'routes.course' })} {index + 1}
              </span>
              <div className="route-selector__course-details">
                <span>{formatDistance(course.distance)}</span>
                <span>•</span>
                <span>{formatDuration(course.duration)}</span>
                <span>•</span>
                <span>{course.stops} {intl.formatMessage({ id: 'vehicle.stops' })}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      <div className="route-selector__controls">
        <button 
          className="route-selector__btn route-selector__btn--primary"
          onClick={togglePlayback}
        >
          {isPlaying 
            ? intl.formatMessage({ id: 'routes.pause' })
            : intl.formatMessage({ id: 'routes.play' })
          }
        </button>

        <button 
          className="route-selector__btn route-selector__btn--secondary"
          onClick={resetAnimation}
        >
          {intl.formatMessage({ id: 'routes.reset' })}
        </button>
      </div>

      <div className="route-selector__speed-control">
        <label className="route-selector__label">
          {intl.formatMessage({ id: 'routes.speed' })}:
        </label>
        <div className="route-selector__speed-options">
          {['slow', 'normal', 'fast'].map((speed) => (
            <button
              key={speed}
              className={`route-selector__speed-btn ${animationSpeed === speed ? 'route-selector__speed-btn--active' : ''}`}
              onClick={() => setAnimationSpeed(speed)}
            >
              {intl.formatMessage({ id: `routes.${speed}` })}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RouteSelector;