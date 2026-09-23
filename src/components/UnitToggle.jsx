import React from 'react';

export default function UnitToggle({ unit, onToggle }) {
  const isCelsius = unit === 'celsius';

  return (
    <div className="unit-toggle-wrapper" title={`Switch to ${isCelsius ? 'Fahrenheit' : 'Celsius'}`}>
      <div className="unit-toggle-track" onClick={onToggle} role="button" tabIndex={0} onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') onToggle(); }}>
        <div className={`unit-toggle-thumb ${isCelsius ? 'pos-celsius' : 'pos-fahrenheit'}`} />
        <button
          type="button"
          className={`unit-btn ${isCelsius ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (!isCelsius) onToggle();
          }}
          aria-label="Celsius"
        >
          °C
        </button>
        <button
          type="button"
          className={`unit-btn ${!isCelsius ? 'active' : ''}`}
          onClick={(e) => {
            e.stopPropagation();
            if (isCelsius) onToggle();
          }}
          aria-label="Fahrenheit"
        >
          °F
        </button>
      </div>
    </div>
  );
}
