import { useState, useEffect, useCallback, useRef } from 'react';
import { getWeatherByCity, getWeatherData, reverseGeocode } from '../services/weatherService';

const DEFAULT_CITY = 'London';
const RECENT_SEARCHES_KEY = 'rw_recent_searches';
const UNIT_KEY = 'rw_temp_unit';

export function useWeather(initialCity = DEFAULT_CITY) {
  const [selectedCity, setSelectedCity] = useState(initialCity);
  const [weatherData, setWeatherData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Temperature unit ('celsius' or 'fahrenheit')
  const [unit, setUnit] = useState(() => {
    try {
      return localStorage.getItem(UNIT_KEY) || 'celsius';
    } catch {
      return 'celsius';
    }
  });

  // Recent searches history
  const [recentSearches, setRecentSearches] = useState(() => {
    try {
      const stored = localStorage.getItem(RECENT_SEARCHES_KEY);
      return stored ? JSON.parse(stored) : ['London', 'Tokyo', 'New York', 'Paris', 'Sydney'];
    } catch {
      return ['London', 'Tokyo', 'New York', 'Paris', 'Sydney'];
    }
  });

  const abortControllerRef = useRef(null);

  // Save unit changes
  const toggleUnit = useCallback(() => {
    setUnit((prev) => {
      const next = prev === 'celsius' ? 'fahrenheit' : 'celsius';
      try {
        localStorage.setItem(UNIT_KEY, next);
      } catch (e) {
        console.warn('Could not save unit to localStorage', e);
      }
      return next;
    });
  }, []);

  // Add to recent searches
  const addToRecentSearches = useCallback((cityName) => {
    if (!cityName) return;
    setRecentSearches((prev) => {
      const filtered = prev.filter((c) => c.toLowerCase() !== cityName.toLowerCase());
      const updated = [cityName, ...filtered].slice(0, 8);
      try {
        localStorage.setItem(RECENT_SEARCHES_KEY, JSON.stringify(updated));
      } catch (e) {
        console.warn('Could not save recent searches', e);
      }
      return updated;
    });
  }, []);

  // Fetch weather for a given city name
  const fetchWeather = useCallback(async (cityName) => {
    if (!cityName || !cityName.trim()) return;

    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const data = await getWeatherByCity(cityName.trim(), controller.signal);
      setWeatherData(data);
      setSelectedCity(data.location.name);
      addToRecentSearches(data.location.name);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Fetch weather failed:', err);
      setError(err.message || 'Unable to fetch weather data. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [addToRecentSearches]);

  // Fetch weather by coordinates (e.g. from geolocation or direct city selection)
  const fetchByCoordinates = useCallback(async (lat, lon, locationInfo = {}) => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }
    const controller = new AbortController();
    abortControllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      let loc = locationInfo;
      if (!loc.name || loc.name === 'Selected Location') {
        loc = await reverseGeocode(lat, lon, controller.signal);
      }
      const data = await getWeatherData(lat, lon, loc, controller.signal);
      setWeatherData(data);
      setSelectedCity(data.location.name);
      addToRecentSearches(data.location.name);
    } catch (err) {
      if (err.name === 'AbortError') return;
      console.error('Fetch by coordinates failed:', err);
      setError(err.message || 'Unable to fetch weather for this location.');
    } finally {
      setLoading(false);
    }
  }, [addToRecentSearches]);

  // Get current device geolocation
  const fetchCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      setError('Geolocation is not supported by your browser.');
      return;
    }

    setLoading(true);
    setError(null);

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        await fetchByCoordinates(latitude, longitude);
      },
      (err) => {
        console.warn('Geolocation error:', err);
        setLoading(false);
        setError('Location access was denied or unavailable. Please search for a city manually.');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [fetchByCoordinates]);

  // Initial load
  useEffect(() => {
    fetchWeather(initialCity);
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, [initialCity, fetchWeather]);

  // Refresh current city
  const refreshWeather = useCallback(() => {
    if (weatherData && weatherData.location) {
      fetchByCoordinates(weatherData.location.latitude, weatherData.location.longitude, weatherData.location);
    } else {
      fetchWeather(selectedCity);
    }
  }, [weatherData, selectedCity, fetchByCoordinates, fetchWeather]);

  return {
    selectedCity,
    weatherData,
    loading,
    error,
    unit,
    toggleUnit,
    recentSearches,
    fetchWeather,
    fetchByCoordinates,
    fetchCurrentLocation,
    refreshWeather
  };
}
