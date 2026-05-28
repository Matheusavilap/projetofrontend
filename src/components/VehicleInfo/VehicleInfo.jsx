/**
 * Componente VehicleInfo - Informações do veículo
 * Commit: Implementação do painel de informações do veículo
 */

import React from 'react';
import { useIntl } from 'react-intl';
import { useVehicle } from '../../contexts/VehicleContext';
import CarSprite from '../CarSprite';
import './VehicleInfo.scss';

const VehicleInfo = () => {
  const intl = useIntl();
  const { vehicle, currentPosition, courses, selectedCourse, currentIndex } = useVehicle();

  const stats = React.useMemo(() => {
    if (!courses[selectedCourse]) return null;

    const course = courses[selectedCourse];
    const totalDistance = course.distance;
    const totalTime = course.duration;
    const avgSpeed = course.speed_avg;
    const maxSpeed = course.speed_max;
    const gpsPoints = course.gps_count;

    return {
      totalDistance,
      totalTime,
      avgSpeed,
      maxSpeed,
      gpsPoints
    };
  }, [courses, selectedCourse]);

  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const currentSpeed = currentPosition?.speed || 0;
  const currentDirection = currentPosition?.direction || 0;

  return (
    <div className="vehicle-info">
      <div className="vehicle-info__header">
        <div className="vehicle-info__sprite">
          <CarSprite 
            direction={currentDirection}
            speed={currentSpeed}
            color={vehicle.color}
            size="large"
          />
        </div>
        <div className="vehicle-info__title-section">
          <h1 className="vehicle-info__title">
            {intl.formatMessage({ id: 'app.title' })}
          </h1>
          <p className="vehicle-info__subtitle">
            {intl.formatMessage({ id: 'app.subtitle' })}
          </p>
        </div>
      </div>

      <div className="vehicle-info__data">
        <div className="vehicle-info__card">
          <div className="vehicle-info__label">
            {intl.formatMessage({ id: 'vehicle.plate' })}
          </div>
          <div className="vehicle-info__value vehicle-info__value--highlight">
            {vehicle.plate}
          </div>
        </div>

        <div className="vehicle-info__card">
          <div className="vehicle-info__label">
            {intl.formatMessage({ id: 'vehicle.vin' })}
          </div>
          <div className="vehicle-info__value">
            {vehicle.vin}
          </div>
        </div>

        <div className="vehicle-info__card">
          <div className="vehicle-info__label">
            {intl.formatMessage({ id: 'vehicle.speed' })}
          </div>
          <div className="vehicle-info__value">
            {currentSpeed.toFixed(1)} {intl.formatMessage({ id: 'vehicle.kmh' })}
          </div>
        </div>

        <div className="vehicle-info__card">
          <div className="vehicle-info__label">
            {intl.formatMessage({ id: 'vehicle.direction' })}
          </div>
          <div className="vehicle-info__value">
            {currentDirection.toFixed(1)}°
          </div>
        </div>
      </div>

      {stats && (
        <div className="vehicle-info__stats">
          <h3 className="vehicle-info__stats-title">
            {intl.formatMessage({ id: 'stats.totalDistance' })}
          </h3>
          <div className="vehicle-info__stats-grid">
            <div className="vehicle-info__stat-item">
              <div className="vehicle-info__stat-value">
                {(stats.totalDistance / 1000).toFixed(2)}
              </div>
              <div className="vehicle-info__stat-label">
                {intl.formatMessage({ id: 'vehicle.km' })}
              </div>
            </div>

            <div className="vehicle-info__stat-item">
              <div className="vehicle-info__stat-value">
                {formatTime(stats.totalTime)}
              </div>
              <div className="vehicle-info__stat-label">
                {intl.formatMessage({ id: 'vehicle.duration' })}
              </div>
            </div>

            <div className="vehicle-info__stat-item">
              <div className="vehicle-info__stat-value">
                {stats.avgSpeed.toFixed(1)}
              </div>
              <div className="vehicle-info__stat-label">
                {intl.formatMessage({ id: 'stats.avgSpeed' })}
              </div>
            </div>

            <div className="vehicle-info__stat-item">
              <div className="vehicle-info__stat-value">
                {stats.maxSpeed.toFixed(1)}
              </div>
              <div className="vehicle-info__stat-label">
                {intl.formatMessage({ id: 'stats.maxSpeed' })}
              </div>
            </div>

            <div className="vehicle-info__stat-item">
              <div className="vehicle-info__stat-value">
                {stats.gpsPoints}
              </div>
              <div className="vehicle-info__stat-label">
                {intl.formatMessage({ id: 'stats.gpsPoints' })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VehicleInfo;