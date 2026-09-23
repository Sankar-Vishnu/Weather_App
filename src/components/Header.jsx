import React from 'react';
import { CloudSun, RotateCw } from 'lucide-react';
import UnitToggle from './UnitToggle';

export default function Header({
  unit,
  onToggleUnit,
  onRefresh,
  loading = false
}) {
  return (
    <header className="app-header">
      <div className="header-brand">
        <div className="brand-icon-wrapper">
          <CloudSun className="brand-logo-icon" size={30} />
        </div>
        <div>
          <h1 className="brand-title">SkyPulse</h1>
          <p className="brand-subtitle">Weather & Forecast Intelligence</p>
        </div>
      </div>

      <div className="header-actions">
        <UnitToggle unit={unit} onToggle={onToggleUnit} />
        
        <button
          type="button"
          className="refresh-btn"
          onClick={onRefresh}
          disabled={loading}
          title="Refresh weather data"
          aria-label="Refresh weather data"
        >
          <RotateCw size={18} className={loading ? 'animate-spin' : ''} />
        </button>
      </div>
    </header>
  );
}
