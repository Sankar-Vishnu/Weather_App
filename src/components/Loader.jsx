import React from 'react';
import { CloudSun } from 'lucide-react';

export default function Loader({ message = 'Fetching live weather forecast...' }) {
  return (
    <div className="weather-loader-container animate-fadeIn">
      <div className="loader-pulse-ring">
        <div className="loader-icon-glow">
          <CloudSun size={48} className="loader-sun-cloud" />
        </div>
      </div>
      <p className="loader-text">{message}</p>

      {/* Skeleton placeholders matching dashboard layout */}
      <div className="skeleton-grid">
        <div className="skeleton-card skeleton-hero shimmer"></div>
        <div className="skeleton-bento shimmer">
          <div className="skeleton-mini-card shimmer"></div>
          <div className="skeleton-mini-card shimmer"></div>
          <div className="skeleton-mini-card shimmer"></div>
          <div className="skeleton-mini-card shimmer"></div>
        </div>
        <div className="skeleton-card skeleton-hourly shimmer"></div>
        <div className="skeleton-card skeleton-forecast shimmer"></div>
      </div>
    </div>
  );
}
