import React from 'react';
import { AlertTriangle, RefreshCw, Search } from 'lucide-react';

export default function ErrorMessage({
  message = 'Unable to fetch weather data.',
  onRetry,
  onSelectCity
}) {
  const suggestions = ['London', 'New York', 'Tokyo', 'Paris'];

  return (
    <div className="error-message-card animate-fadeIn">
      <div className="error-icon-wrapper">
        <AlertTriangle size={36} className="error-icon" />
      </div>

      <h3 className="error-title">Oops! Weather Data Unavailable</h3>
      <p className="error-desc">{message}</p>

      <div className="error-actions-group">
        {onRetry && (
          <button type="button" className="error-retry-btn" onClick={onRetry}>
            <RefreshCw size={16} />
            <span>Try Again</span>
          </button>
        )}
      </div>

      {onSelectCity && (
        <div className="error-suggestions-box">
          <span className="error-sugg-title">
            <Search size={14} /> Try searching popular cities instead:
          </span>
          <div className="error-sugg-chips">
            {suggestions.map((city) => (
              <button
                key={city}
                type="button"
                className="error-chip"
                onClick={() => onSelectCity(city)}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
