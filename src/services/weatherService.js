/**
 * Weather Service for fetching live weather and geocoding data.
 * Powered by Open-Meteo (zero-config, free, high precision worldwide).
 */

const GEOCODING_BASE_URL = 'https://geocoding-api.open-meteo.com/v1/search';
const WEATHER_BASE_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Search cities matching the query text for auto-suggestions / city lookup.
 */
export async function searchCities(query, signal) {
  if (!query || query.trim().length < 2) return [];

  const url = `${GEOCODING_BASE_URL}?name=${encodeURIComponent(query.trim())}&count=6&language=en&format=json`;
  
  try {
    const response = await fetch(url, { signal });
    if (!response.ok) {
      throw new Error(`Geocoding failed with status ${response.status}`);
    }
    const data = await response.json();
    if (!data.results) return [];

    return data.results.map((item) => ({
      id: `${item.id || item.latitude + '_' + item.longitude}`,
      name: item.name,
      country: item.country || '',
      countryCode: item.country_code || '',
      admin1: item.admin1 || '',
      latitude: item.latitude,
      longitude: item.longitude,
      timezone: item.timezone || 'auto',
      displayName: [item.name, item.admin1, item.country].filter(Boolean).join(', ')
    }));
  } catch (error) {
    if (error.name === 'AbortError') throw error;
    console.error('Error searching cities:', error);
    return [];
  }
}

/**
 * Fetch full weather data (current, 24h hourly, tomorrow, 7-day forecast) by coordinates.
 */
export async function getWeatherData(lat, lon, locationInfo = {}, signal) {
  const params = new URLSearchParams({
    latitude: lat.toString(),
    longitude: lon.toString(),
    current: [
      'temperature_2m',
      'relative_humidity_2m',
      'apparent_temperature',
      'is_day',
      'precipitation',
      'weather_code',
      'surface_pressure',
      'wind_speed_10m',
      'wind_direction_10m',
      'dew_point_2m'
    ].join(','),
    hourly: [
      'temperature_2m',
      'relative_humidity_2m',
      'dew_point_2m',
      'apparent_temperature',
      'precipitation_probability',
      'weather_code',
      'surface_pressure',
      'visibility',
      'wind_speed_10m',
      'uv_index'
    ].join(','),
    daily: [
      'weather_code',
      'temperature_2m_max',
      'temperature_2m_min',
      'apparent_temperature_max',
      'apparent_temperature_min',
      'sunrise',
      'sunset',
      'uv_index_max',
      'precipitation_sum',
      'precipitation_probability_max',
      'wind_speed_10m_max'
    ].join(','),
    timezone: 'auto',
    forecast_days: '8'
  });

  const url = `${WEATHER_BASE_URL}?${params.toString()}`;

  const response = await fetch(url, { signal });
  if (!response.ok) {
    throw new Error(`Weather service error: ${response.status} ${response.statusText}`);
  }

  const raw = await response.json();
  return normalizeWeatherData(raw, locationInfo, lat, lon);
}

/**
 * Fetch weather by searching a city name directly.
 */
export async function getWeatherByCity(cityName, signal) {
  if (!cityName || !cityName.trim()) {
    throw new Error('Please enter a valid city name.');
  }

  const cities = await searchCities(cityName, signal);
  if (!cities || cities.length === 0) {
    throw new Error(`Could not find weather data for "${cityName}". Please check the spelling.`);
  }

  const bestMatch = cities[0];
  return await getWeatherData(bestMatch.latitude, bestMatch.longitude, bestMatch, signal);
}

/**
 * Reverse geocode coordinates to get a friendly city/region name
 */
export async function reverseGeocode(lat, lon, signal) {
  try {
    const url = `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lon}&localityLanguage=en`;
    const res = await fetch(url, { signal });
    if (res.ok) {
      const data = await res.json();
      return {
        name: data.city || data.locality || data.principalSubdivision || 'Current Location',
        country: data.countryName || '',
        admin1: data.principalSubdivision || '',
        latitude: lat,
        longitude: lon,
        displayName: [data.city || data.locality, data.principalSubdivision, data.countryName].filter(Boolean).join(', ')
      };
    }
  } catch (e) {
    console.warn('Reverse geocode fallback failed:', e);
  }
  return {
    name: 'Current Location',
    country: '',
    admin1: '',
    latitude: lat,
    longitude: lon,
    displayName: 'Current Location'
  };
}

/**
 * Normalizes Open-Meteo raw payload into clean, ready-to-use data structures.
 */
function normalizeWeatherData(raw, locationInfo, lat, lon) {
  const currentRaw = raw.current || {};
  const hourlyRaw = raw.hourly || {};
  const dailyRaw = raw.daily || {};

  // Find index of current hour in hourly forecast
  const currentTime = currentRaw.time ? new Date(currentRaw.time).getTime() : Date.now();
  let startHourIdx = 0;
  if (hourlyRaw.time && hourlyRaw.time.length > 0) {
    const idx = hourlyRaw.time.findIndex((t) => new Date(t).getTime() >= currentTime);
    startHourIdx = idx !== -1 ? idx : 0;
  }

  // Extract next 24 hours
  const hourly = [];
  const totalHours = hourlyRaw.time ? hourlyRaw.time.length : 0;
  for (let i = startHourIdx; i < Math.min(startHourIdx + 24, totalHours); i++) {
    hourly.push({
      time: hourlyRaw.time[i],
      temp: hourlyRaw.temperature_2m[i],
      feelsLike: hourlyRaw.apparent_temperature ? hourlyRaw.apparent_temperature[i] : hourlyRaw.temperature_2m[i],
      humidity: hourlyRaw.relative_humidity_2m ? hourlyRaw.relative_humidity_2m[i] : 0,
      pop: hourlyRaw.precipitation_probability ? hourlyRaw.precipitation_probability[i] : 0,
      weatherCode: hourlyRaw.weather_code[i],
      windSpeed: hourlyRaw.wind_speed_10m ? hourlyRaw.wind_speed_10m[i] : 0,
      uvIndex: hourlyRaw.uv_index ? hourlyRaw.uv_index[i] : 0,
      visibility: hourlyRaw.visibility ? hourlyRaw.visibility[i] : 10000
    });
  }

  // Extract daily forecast (up to 7 days)
  const daily = [];
  const totalDays = dailyRaw.time ? dailyRaw.time.length : 0;
  for (let i = 0; i < Math.min(totalDays, 7); i++) {
    daily.push({
      date: dailyRaw.time[i],
      maxTemp: dailyRaw.temperature_2m_max[i],
      minTemp: dailyRaw.temperature_2m_min[i],
      feelsLikeMax: dailyRaw.apparent_temperature_max ? dailyRaw.apparent_temperature_max[i] : dailyRaw.temperature_2m_max[i],
      feelsLikeMin: dailyRaw.apparent_temperature_min ? dailyRaw.apparent_temperature_min[i] : dailyRaw.temperature_2m_min[i],
      weatherCode: dailyRaw.weather_code[i],
      pop: dailyRaw.precipitation_probability_max ? dailyRaw.precipitation_probability_max[i] : 0,
      precipSum: dailyRaw.precipitation_sum ? dailyRaw.precipitation_sum[i] : 0,
      uvMax: dailyRaw.uv_index_max ? dailyRaw.uv_index_max[i] : 0,
      windMax: dailyRaw.wind_speed_10m_max ? dailyRaw.wind_speed_10m_max[i] : 0,
      sunrise: dailyRaw.sunrise ? dailyRaw.sunrise[i] : null,
      sunset: dailyRaw.sunset ? dailyRaw.sunset[i] : null
    });
  }

  // Visibility from current hour if available
  const currentVisibility = hourly.length > 0 ? hourly[0].visibility : 10000;
  // Current UV index
  const currentUV = hourly.length > 0 ? hourly[0].uvIndex : (daily.length > 0 ? daily[0].uvMax : 0);

  // Tomorrow object (index 1 in daily)
  const tomorrow = daily.length > 1 ? daily[1] : daily[0] || null;

  return {
    location: {
      name: locationInfo.name || 'Selected Location',
      country: locationInfo.country || '',
      admin1: locationInfo.admin1 || '',
      latitude: lat,
      longitude: lon,
      displayName: locationInfo.displayName || locationInfo.name || 'Selected Location',
      timezone: raw.timezone || 'UTC'
    },
    current: {
      time: currentRaw.time || new Date().toISOString(),
      temp: currentRaw.temperature_2m,
      feelsLike: currentRaw.apparent_temperature,
      humidity: currentRaw.relative_humidity_2m,
      dewPoint: currentRaw.dew_point_2m,
      weatherCode: currentRaw.weather_code,
      isDay: currentRaw.is_day !== undefined ? currentRaw.is_day : 1,
      windSpeed: currentRaw.wind_speed_10m,
      windDirection: currentRaw.wind_direction_10m,
      pressure: currentRaw.surface_pressure,
      precipitation: currentRaw.precipitation || 0,
      visibility: currentVisibility,
      uvIndex: currentUV,
      maxTempToday: daily.length > 0 ? daily[0].maxTemp : currentRaw.temperature_2m,
      minTempToday: daily.length > 0 ? daily[0].minTemp : currentRaw.temperature_2m
    },
    tomorrow,
    hourly,
    daily,
    fetchedAt: new Date().toISOString()
  };
}
