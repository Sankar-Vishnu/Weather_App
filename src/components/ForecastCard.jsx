import React from 'react';
import { Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import {
  formatDayName,
  formatTemp,
  getWeatherCodeInfo
} from '../utils/formatters';

export default function ForecastCard({
  day,
  index,
  unit,
  minGlobal = 0,
  maxGlobal = 40
}) {
  const condition = getWeatherCodeInfo(day.weatherCode, 1);
  const dayTitle = formatDayName(day.date, index);
  const dateObj = new Date(day.date);
  const formattedDate = dateObj.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });

  // Calculate percentage bar positions based on global weekly min/max
  const tempSpan = Math.max(maxGlobal - minGlobal, 1);
  const leftPercent = Math.max(0, Math.min(100, ((day.minTemp - minGlobal) / tempSpan) * 100));
  const widthPercent = Math.max(12, Math.min(100 - leftPercent, ((day.maxTemp - day.minTemp) / tempSpan) * 100));

  return (
    <div className={`forecast-card-row ${index === 0 ? 'forecast-row-today' : ''}`}>
      {/* Day and Date */}
      <div className="forecast-day-col">
        <span className="forecast-day-name">{dayTitle}</span>
        <span className="forecast-date-sub">{formattedDate}</span>
      </div>

      {/* Weather Icon & Condition Text */}
      <div className="forecast-condition-col">
        <WeatherIcon
          code={day.weatherCode}
          isDay={1}
          size={24}
          className="forecast-mini-icon"
        />
        <span className="forecast-condition-label" title={condition.description}>
          {condition.label}
        </span>
      </div>

      {/* Precipitation % */}
      <div className="forecast-pop-col">
        {day.pop > 0 ? (
          <span className="forecast-pop-tag" title={`Rain probability: ${day.pop}%`}>
            <Droplets size={12} className="pop-drop-icon" />
            <span>{day.pop}%</span>
          </span>
        ) : (
          <span className="forecast-pop-none">0%</span>
        )}
      </div>

      {/* Visual Temperature Range Bar & High/Low text */}
      <div className="forecast-temp-bar-col">
        <span className="forecast-temp-low">{formatTemp(day.minTemp, unit)}</span>

        <div className="forecast-bar-track">
          <div
            className="forecast-bar-fill"
            style={{
              left: `${leftPercent}%`,
              width: `${widthPercent}%`
            }}
          />
        </div>

        <span className="forecast-temp-high">{formatTemp(day.maxTemp, unit)}</span>
      </div>
    </div>
  );
}
