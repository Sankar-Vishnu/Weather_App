import React, { useMemo } from 'react';
import { getWeatherCodeInfo } from '../utils/formatters';

export default function WeatherBackground({ weatherCode = 0, isDay = 1 }) {
  const weatherInfo = useMemo(() => {
    return getWeatherCodeInfo(weatherCode, isDay);
  }, [weatherCode, isDay]);

  const theme = weatherInfo.category || 'clear';
  const timeMode = isDay ? 'day' : 'night';

  return (
    <div className={`weather-bg-container theme-${theme} mode-${timeMode}`} aria-hidden="true">
      <div className="ambient-gradient-1"></div>
      <div className="ambient-gradient-2"></div>
      <div className="ambient-gradient-3"></div>
      <div className="ambient-glow"></div>
      
      {/* Particle effect layers based on theme */}
      {theme === 'rain' && (
        <div className="rain-container">
          {Array.from({ length: 25 }).map((_, i) => (
            <span
              key={i}
              className="raindrop"
              style={{
                left: `${(i * 4) % 100}%`,
                animationDelay: `${(i * 0.15) % 1.5}s`,
                animationDuration: `${0.6 + ((i % 5) * 0.1)}s`
              }}
            />
          ))}
        </div>
      )}

      {theme === 'snow' && (
        <div className="snow-container">
          {Array.from({ length: 20 }).map((_, i) => (
            <span
              key={i}
              className="snowflake"
              style={{
                left: `${(i * 5) % 100}%`,
                animationDelay: `${(i * 0.3) % 3}s`,
                animationDuration: `${3 + (i % 4)}s`,
                opacity: 0.3 + ((i % 5) * 0.15),
                transform: `scale(${0.6 + ((i % 3) * 0.3)})`
              }}
            >
              ❄
            </span>
          ))}
        </div>
      )}

      {theme === 'storm' && (
        <div className="storm-flash"></div>
      )}
    </div>
  );
}
