import React from 'react';
import {
  Droplets,
  Wind,
  Gauge,
  Eye,
  Sun,
  ThermometerSnowflake,
  Compass
} from 'lucide-react';
import {
  formatWindSpeed,
  formatVisibility,
  formatPressure,
  formatTemp,
  getWindDirection,
  getUVRating,
  getHumidityRating
} from '../utils/formatters';

export default function WeatherMetrics({ weatherData, unit }) {
  if (!weatherData) return null;

  const { current } = weatherData;
  const uvInfo = getUVRating(current.uvIndex);
  const humidityRating = getHumidityRating(current.humidity);
  const windDir = getWindDirection(current.windDirection);

  const metrics = [
    {
      id: 'humidity',
      title: 'Humidity',
      value: `${current.humidity}%`,
      subtext: humidityRating,
      icon: Droplets,
      iconColor: '#38bdf8',
      barPercent: Math.min(Math.max(current.humidity, 0), 100),
      barColor: 'linear-gradient(90deg, #38bdf8, #0284c7)'
    },
    {
      id: 'wind',
      title: 'Wind Speed',
      value: formatWindSpeed(current.windSpeed, unit),
      subtext: `${windDir} (${Math.round(current.windDirection || 0)}°)`,
      icon: Wind,
      iconColor: '#a78bfa',
      windDegree: current.windDirection || 0,
      hasCompass: true
    },
    {
      id: 'pressure',
      title: 'Pressure',
      value: formatPressure(current.pressure, unit),
      subtext: current.pressure > 1013 ? 'High pressure (Stable)' : 'Low pressure (Unsettled)',
      icon: Gauge,
      iconColor: '#f472b6'
    },
    {
      id: 'visibility',
      title: 'Visibility',
      value: formatVisibility(current.visibility, unit),
      subtext: current.visibility >= 9000 ? 'Clear view' : current.visibility >= 4000 ? 'Moderate haze' : 'Poor visibility',
      icon: Eye,
      iconColor: '#34d399'
    },
    {
      id: 'uv',
      title: 'UV Index',
      value: typeof current.uvIndex === 'number' ? current.uvIndex.toFixed(1) : '--',
      subtext: uvInfo.label,
      badgeColor: uvInfo.color,
      icon: Sun,
      iconColor: '#fbbf24'
    },
    {
      id: 'dewpoint',
      title: 'Dew Point',
      value: formatTemp(current.dewPoint, unit),
      subtext: 'Atmospheric condensation',
      icon: ThermometerSnowflake,
      iconColor: '#2dd4bf'
    }
  ];

  return (
    <div className="weather-metrics-section">
      <h3 className="section-title">
        <span>Detailed Conditions</span>
      </h3>

      <div className="metrics-grid">
        {metrics.map((metric) => {
          const Icon = metric.icon;
          return (
            <div key={metric.id} className="metric-card">
              <div className="metric-card-header">
                <span className="metric-title">{metric.title}</span>
                <div
                  className="metric-icon-box"
                  style={{ backgroundColor: `${metric.iconColor}18`, color: metric.iconColor }}
                >
                  <Icon size={20} />
                </div>
              </div>

              <div className="metric-main-value">
                {metric.value}
              </div>

              <div className="metric-subtext-row">
                {metric.hasCompass && (
                  <Compass
                    size={14}
                    className="compass-dir-icon"
                    style={{ transform: `rotate(${metric.windDegree}deg)` }}
                  />
                )}
                {metric.badgeColor ? (
                  <span
                    className="metric-uv-pill"
                    style={{ backgroundColor: `${metric.badgeColor}22`, color: metric.badgeColor, borderColor: `${metric.badgeColor}44` }}
                  >
                    {metric.subtext}
                  </span>
                ) : (
                  <span className="metric-subtext">{metric.subtext}</span>
                )}
              </div>

              {metric.barPercent !== undefined && (
                <div className="metric-mini-bar-track">
                  <div
                    className="metric-mini-bar-fill"
                    style={{
                      width: `${metric.barPercent}%`,
                      background: metric.barColor
                    }}
                  />
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
