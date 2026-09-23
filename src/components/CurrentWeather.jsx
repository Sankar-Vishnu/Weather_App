import React from 'react';
import { MapPin, Calendar, Clock, ArrowUp, ArrowDown, Sparkles } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  formatTemp,
  getWeatherCodeInfo,
  formatFullDate,
  formatTime
} from '../utils/formatters';

export default function CurrentWeather({ weatherData, unit }) {
  if (!weatherData) return null;

  const { location, current } = weatherData;
  const condition = getWeatherCodeInfo(current.weatherCode, current.isDay);

  const formattedDate = formatFullDate(current.time);
  const formattedTime = formatTime(current.time, location.timezone);

  return (
    <div className="current-weather-card">
      <div className="current-card-glow"></div>

      {/* Top Location and Time Meta */}
      <div className="current-meta-top">
        <div className="location-badge">
          <MapPin size={18} className="location-pin" />
          <div className="location-texts">
            <h2 className="location-name">{location.name}</h2>
            <span className="location-region">
              {[location.admin1, location.country].filter(Boolean).join(', ')}
            </span>
          </div>
        </div>

        <div className="datetime-badge">
          <div className="date-item">
            <Calendar size={14} />
            <span>{formattedDate}</span>
          </div>
          <div className="time-item">
            <Clock size={14} />
            <span>{formattedTime}</span>
          </div>
        </div>
      </div>

      {/* Main Temperature & Condition Display */}
      <div className="current-main-section">
        <div className="current-temp-container">
          <div className="temp-hero-display">
            <span className="temp-hero-number">
              {Math.round(unit === 'fahrenheit' ? (current.temp * 9) / 5 + 32 : current.temp)}
            </span>
            <span className="temp-hero-unit">°{unit === 'fahrenheit' ? 'F' : 'C'}</span>
          </div>

          <div className="feels-like-row">
            <span className="feels-like-label">Feels like</span>
            <span className="feels-like-val">{formatTemp(current.feelsLike, unit)}</span>
          </div>
        </div>

        <div className="condition-hero-container">
          <div className="condition-icon-badge">
            <WeatherIcon
              code={current.weatherCode}
              isDay={current.isDay}
              size={68}
              className="condition-hero-icon"
            />
          </div>
          
          <div className="condition-text-group">
            <div className="condition-pill">
              <Sparkles size={13} className="condition-sparkle" />
              <span>{condition.label}</span>
            </div>
            <p className="condition-desc">{condition.description}</p>
          </div>
        </div>
      </div>

      {/* Footer Range & Highlights */}
      <div className="current-footer-row">
        <div className="temp-range-pills">
          <div className="range-pill pill-high">
            <ArrowUp size={14} className="range-arrow arrow-high" />
            <span className="range-label">High:</span>
            <span className="range-val">{formatTemp(current.maxTempToday, unit)}</span>
          </div>
          <div className="range-pill pill-low">
            <ArrowDown size={14} className="range-arrow arrow-low" />
            <span className="range-label">Low:</span>
            <span className="range-val">{formatTemp(current.minTempToday, unit)}</span>
          </div>
        </div>

        <div className="condition-tag">
          <span className="daynight-indicator">
            {current.isDay ? '☀️ Daytime' : '🌙 Nighttime'}
          </span>
          {current.precipitation > 0 && (
            <span className="precip-indicator">
              💧 {current.precipitation.toFixed(1)} mm
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
