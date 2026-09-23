import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X, Loader2, Navigation } from 'lucide-react';
import { searchCities } from '../services/weatherService';

export default function SearchBar({
  onSearchCity,
  onSelectCoords,
  onGetLocation,
  recentSearches = [],
  loading = false
}) {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [isSearchingSuggestions, setIsSearchingSuggestions] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [isShaking, setIsShaking] = useState(false);

  const containerRef = useRef(null);
  const inputRef = useRef(null);
  const debounceTimerRef = useRef(null);

  // Quick preset cities for instant access
  const presetCities = ['London', 'New York', 'Tokyo', 'Paris', 'Sydney', 'Dubai'];

  // Handle autocomplete debounced search
  useEffect(() => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    if (query.trim().length < 2) {
      setSuggestions([]);
      setIsSearchingSuggestions(false);
      return;
    }

    setIsSearchingSuggestions(true);
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const results = await searchCities(query.trim());
        setSuggestions(results);
        setShowDropdown(results.length > 0);
      } catch (err) {
        console.warn('Autocomplete fetch error:', err);
      } finally {
        setIsSearchingSuggestions(false);
      }
    }, 280);

    return () => {
      if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    };
  }, [query]);

  // Click outside listener to close suggestions
  useEffect(() => {
    function handleClickOutside(event) {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Trigger search
  const handleSubmit = (e) => {
    if (e) e.preventDefault();

    const trimmed = query.trim();
    // Empty search protection
    if (!trimmed) {
      setIsShaking(true);
      setTimeout(() => setIsShaking(false), 500);
      inputRef.current?.focus();
      return;
    }

    // If dropdown item selected via arrow keys
    if (selectedIndex >= 0 && suggestions[selectedIndex]) {
      handleSelectCity(suggestions[selectedIndex]);
      return;
    }

    setShowDropdown(false);
    onSearchCity(trimmed);
  };

  // Select a suggestion
  const handleSelectCity = (city) => {
    setQuery(city.name);
    setShowDropdown(false);
    setSelectedIndex(-1);
    if (onSelectCoords) {
      onSelectCoords(city.latitude, city.longitude, city);
    } else {
      onSearchCity(city.name);
    }
  };

  // Keyboard navigation for dropdown
  const handleKeyDown = (e) => {
    if (!showDropdown || suggestions.length === 0) {
      if (e.key === 'Enter') {
        handleSubmit(e);
      }
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setSelectedIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      handleSubmit(e);
    } else if (e.key === 'Escape') {
      setShowDropdown(false);
    }
  };

  const handleClear = () => {
    setQuery('');
    setSuggestions([]);
    setShowDropdown(false);
    inputRef.current?.focus();
  };

  return (
    <div className="search-section" ref={containerRef}>
      <form
        onSubmit={handleSubmit}
        className={`search-form-container ${isShaking ? 'shake-animation' : ''}`}
      >
        <div className="search-input-wrapper">
          <Search className="search-icon-inside" size={20} />
          
          <input
            ref={inputRef}
            type="text"
            className="search-input"
            placeholder="Search city, state or country..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => {
              if (suggestions.length > 0) setShowDropdown(true);
            }}
            onKeyDown={handleKeyDown}
            aria-label="Search city"
            autoComplete="off"
            id="weather-city-search-input"
          />

          {isSearchingSuggestions && (
            <Loader2 className="search-spinner animate-spin" size={18} />
          )}

          {query && !isSearchingSuggestions && (
            <button
              type="button"
              className="search-clear-btn"
              onClick={handleClear}
              aria-label="Clear search input"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <button
          type="submit"
          className="search-submit-btn"
          disabled={loading}
          aria-label="Search weather"
          id="weather-search-submit-btn"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={18} />
          ) : (
            <>
              <span>Search</span>
            </>
          )}
        </button>

        <button
          type="button"
          className="location-action-btn"
          onClick={onGetLocation}
          title="Use my current GPS location"
          aria-label="Use current location"
          id="weather-geo-location-btn"
        >
          <Navigation size={18} className="geo-icon" />
          <span className="geo-label">Locate Me</span>
        </button>
      </form>

      {/* Auto-suggestions Dropdown */}
      {showDropdown && suggestions.length > 0 && (
        <div className="suggestions-dropdown animate-fadeIn" role="listbox">
          {suggestions.map((city, idx) => (
            <div
              key={city.id || `${city.latitude}-${city.longitude}-${idx}`}
              role="option"
              aria-selected={selectedIndex === idx}
              className={`suggestion-item ${selectedIndex === idx ? 'selected' : ''}`}
              onClick={() => handleSelectCity(city)}
              onMouseEnter={() => setSelectedIndex(idx)}
            >
              <MapPin size={16} className="suggestion-pin-icon" />
              <div className="suggestion-info">
                <span className="suggestion-city-name">{city.name}</span>
                <span className="suggestion-subtext">
                  {[city.admin1, city.country].filter(Boolean).join(', ')}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Quick City Preset Chips */}
      <div className="quick-presets-container">
        <span className="preset-label">Popular:</span>
        <div className="preset-chips-list">
          {presetCities.map((city) => (
            <button
              key={city}
              type="button"
              className="preset-chip"
              onClick={() => onSearchCity(city)}
            >
              {city}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
