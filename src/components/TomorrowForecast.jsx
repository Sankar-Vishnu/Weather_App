import React from 'react';
import { CalendarDays, ArrowUp, ArrowDown, Droplets, Wind, Sunrise, Sunset } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  formatTemp,
  getWeatherCodeInfo,
  formatTime
} from '../utils/formatters';

export default function TomorrowForecast({ tomorrowData, unit, timezone }) {
  if (!tomorrowData) return null;

  const condition = getWeatherCodeInfo(tomorrowData.weatherCode, 1);
  const sunriseTime = tomorrowData.sunrise ? formatTime(tomorrowData.sunrise, timezone) : '--';
  const sunsetTime = tomorrowData.sunset ? formatTime(tomorrowData.sunset, timezone) : '--';

  return (
    <div className="tomorrow-forecast-card">
      <div className="tomorrow-card-header">
        <div className="tomorrow-title-row">
          <CalendarDays size={18} className="tomorrow-header-icon" />
          <h3 className="tomorrow-title">Tomorrow's Outlook</h3>
        </div>
        <span className="tomorrow-condition-pill">{condition.label}</span>
      </div>

      <div className="tomorrow-body">
        <div className="tomorrow-icon-col">
          <WeatherIcon
            code={tomorrowData.weatherCode}
            isDay={1}
            size={52}
            className="tomorrow-weather-icon"
          />
        </div>

        <div className="tomorrow-temp-col">
          <div className="tomorrow-temp-main">
            <span className="tomorrow-high-val">
              {formatTemp(tomorrowData.maxTemp, unit)}
            </span>
            <span className="tomorrow-divider">/</span>
            <span className="tomorrow-low-val">
              {formatTemp(tomorrowData.minTemp, unit)}
            </span>
          </div>
          <p className="tomorrow-desc">{condition.description}</p>
        </div>
      </div>

      <div className="tomorrow-metrics-grid">
        <div className="tomorrow-sub-stat">
          <Droplets size={15} className="stat-icon-blue" />
          <span className="sub-stat-label">Rain Chance</span>
          <span className="sub-stat-val">{tomorrowData.pop || 0}%</span>
        </div>

        <div className="tomorrow-sub-stat">
          <Wind size={15} className="stat-icon-purple" />
          <span className="sub-stat-label">Max Wind</span>
          <span className="sub-stat-val">
            {Math.round(unit === 'fahrenheit' ? tomorrowData.windMax * 0.621371 : tomorrowData.windMax)}{' '}
            {unit === 'fahrenheit' ? 'mph' : 'km/h'}
          </span>
        </div>

        <div className="tomorrow-sub-stat">
          <Sunrise size={15} className="stat-icon-amber" />
          <span className="sub-stat-label">Sunrise</span>
          <span className="sub-stat-val">{sunriseTime}</span>
        </div>

        <div className="tomorrow-sub-stat">
          <Sunset size={15} className="stat-icon-orange" />
          <span className="sub-stat-label">Sunset</span>
          <span className="sub-stat-val">{sunsetTime}</span>
        </div>
      </div>
    </div>
  );
}
