import React from 'react';
import { useWeather } from './hooks/useWeather';
import WeatherBackground from './components/WeatherBackground';
import Header from './components/Header';
import SearchBar from './components/SearchBar';
import CurrentWeather from './components/CurrentWeather';
import WeatherMetrics from './components/WeatherMetrics';
import TomorrowForecast from './components/TomorrowForecast';
import HourlyForecast from './components/HourlyForecast';
import ForecastList from './components/ForecastList';
import Loader from './components/Loader';
import ErrorMessage from './components/ErrorMessage';

export default function App() {
  const {
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
  } = useWeather('London');

  const currentWeatherCode = weatherData?.current?.weatherCode ?? 0;
  const isDay = weatherData?.current?.isDay ?? 1;

  return (
    <div className="app-root">
      {/* Dynamic atmospheric background */}
      <WeatherBackground weatherCode={currentWeatherCode} isDay={isDay} />

      <main className="app-container">
        {/* Top Header */}
        <Header
          unit={unit}
          onToggleUnit={toggleUnit}
          onRefresh={refreshWeather}
          loading={loading}
        />

        {/* Search Bar & Preset Chips */}
        <SearchBar
          onSearchCity={fetchWeather}
          onSelectCoords={fetchByCoordinates}
          onGetLocation={fetchCurrentLocation}
          recentSearches={recentSearches}
          loading={loading}
        />

        {/* Dynamic Content Area */}
        {loading && !weatherData ? (
          <Loader />
        ) : error ? (
          <ErrorMessage
            message={error}
            onRetry={refreshWeather}
            onSelectCity={fetchWeather}
          />
        ) : weatherData ? (
          <div className="dashboard-grid animate-fadeIn">
            {/* Left Column: Hero Current Weather, Tomorrow Highlight, 24h Hourly */}
            <div className="dashboard-left-col">
              <CurrentWeather weatherData={weatherData} unit={unit} />
              <TomorrowForecast
                tomorrowData={weatherData.tomorrow}
                unit={unit}
                timezone={weatherData.location?.timezone}
              />
              <HourlyForecast hourlyData={weatherData.hourly} unit={unit} />
            </div>

            {/* Right Column: Detailed Metrics Bento Grid & 7-Day Forecast */}
            <div className="dashboard-right-col">
              <WeatherMetrics weatherData={weatherData} unit={unit} />
              <ForecastList dailyForecast={weatherData.daily} unit={unit} />
            </div>
          </div>
        ) : null}

        {/* Application Footer */}
        <footer className="app-footer">
          <p>
            SkyPulse Weather Dashboard &bull; Live precision data powered by{' '}
            <a
              href="https://open-meteo.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="footer-link"
            >
              Open-Meteo API
            </a>
          </p>
          <p>Real-time Global Weather Intelligence &bull; High Accuracy Forecasts</p>
        </footer>
      </main>
    </div>
  );
}
