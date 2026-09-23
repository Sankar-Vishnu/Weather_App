import React, { useRef } from 'react';
import { Clock, ChevronLeft, ChevronRight, Droplets } from 'lucide-react';
import WeatherIcon from './WeatherIcon';
import { formatHourShort, formatTemp } from '../utils/formatters';

export default function HourlyForecast({ hourlyData = [], unit }) {
  const scrollRef = useRef(null);

  if (!hourlyData || hourlyData.length === 0) return null;

  const handleScroll = (direction) => {
    if (scrollRef.current) {
      const scrollAmount = direction === 'left' ? -280 : 280;
      scrollRef.current.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  return (
    <div className="hourly-forecast-section">
      <div className="hourly-header">
        <div className="hourly-title-row">
          <Clock size={18} className="hourly-icon" />
          <h3 className="section-title">24-Hour Forecast</h3>
        </div>

        <div className="scroll-controls">
          <button
            type="button"
            className="scroll-arrow-btn"
            onClick={() => handleScroll('left')}
            aria-label="Scroll hourly forecast left"
          >
            <ChevronLeft size={18} />
          </button>
          <button
            type="button"
            className="scroll-arrow-btn"
            onClick={() => handleScroll('right')}
            aria-label="Scroll hourly forecast right"
          >
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="hourly-scroll-container" ref={scrollRef}>
        {hourlyData.map((hour, idx) => {
          const isFirst = idx === 0;
          const displayTime = isFirst ? 'Now' : formatHourShort(hour.time);
          const hourNum = new Date(hour.time).getHours();
          const isDayHour = hourNum >= 6 && hourNum < 20 ? 1 : 0;

          return (
            <div
              key={hour.time || idx}
              className={`hourly-card ${isFirst ? 'hourly-card-now' : ''}`}
            >
              <span className="hourly-time">{displayTime}</span>

              <div className="hourly-icon-wrapper">
                <WeatherIcon
                  code={hour.weatherCode}
                  isDay={isDayHour}
                  size={28}
                  className="hourly-weather-icon"
                />
              </div>

              <div className="hourly-temp">
                {formatTemp(hour.temp, unit)}
              </div>

              <div className="hourly-pop-wrapper">
                {hour.pop > 0 ? (
                  <span className="hourly-pop-badge" title={`Precipitation chance: ${hour.pop}%`}>
                    <Droplets size={10} />
                    <span>{hour.pop}%</span>
                  </span>
                ) : (
                  <span className="hourly-pop-empty">-</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
