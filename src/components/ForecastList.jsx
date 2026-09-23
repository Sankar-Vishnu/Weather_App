import React, { useMemo } from 'react';
import { CalendarRange } from 'lucide-react';
import ForecastCard from './ForecastCard';

export default function ForecastList({ dailyForecast = [], unit }) {
  if (!dailyForecast || dailyForecast.length === 0) return null;

  // Calculate global min and max to synchronize temperature range bars
  const { minGlobal, maxGlobal } = useMemo(() => {
    let min = Infinity;
    let max = -Infinity;
    dailyForecast.forEach((day) => {
      if (day.minTemp < min) min = day.minTemp;
      if (day.maxTemp > max) max = day.maxTemp;
    });
    return {
      minGlobal: min !== Infinity ? min : 0,
      maxGlobal: max !== -Infinity ? max : 35
    };
  }, [dailyForecast]);

  return (
    <div className="forecast-list-container">
      <div className="forecast-header">
        <div className="forecast-header-title">
          <CalendarRange size={20} className="forecast-calendar-icon" />
          <h3 className="section-title">7-Day Forecast</h3>
        </div>
        <span className="forecast-header-badge">Weekly Outlook</span>
      </div>

      <div className="forecast-cards-list">
        {dailyForecast.map((day, idx) => (
          <ForecastCard
            key={day.date || idx}
            day={day}
            index={idx}
            unit={unit}
            minGlobal={minGlobal}
            maxGlobal={maxGlobal}
          />
        ))}
      </div>
    </div>
  );
}
