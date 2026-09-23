/**
 * Utility formatters for Weather data, units, and WMO codes.
 */

// WMO Weather Interpretation Codes (WW) mapping
export const WMO_CODES = {
  0: { label: 'Clear Sky', icon: 'Sun', category: 'clear', description: 'Sunny and clear conditions' },
  1: { label: 'Mainly Clear', icon: 'SunDim', category: 'clear', description: 'Mostly sunny with slight clouds' },
  2: { label: 'Partly Cloudy', icon: 'CloudSun', category: 'clouds', description: 'Scattered clouds and sunshine' },
  3: { label: 'Overcast', icon: 'Cloud', category: 'clouds', description: 'Gloomy overcast sky' },
  45: { label: 'Foggy', icon: 'CloudFog', category: 'fog', description: 'Dense fog limiting visibility' },
  48: { label: 'Depositing Rime Fog', icon: 'CloudFog', category: 'fog', description: 'Freezing rime fog' },
  51: { label: 'Light Drizzle', icon: 'CloudDrizzle', category: 'rain', description: 'Light fine mist and drizzle' },
  53: { label: 'Moderate Drizzle', icon: 'CloudDrizzle', category: 'rain', description: 'Steady moderate drizzle' },
  55: { label: 'Dense Drizzle', icon: 'CloudDrizzle', category: 'rain', description: 'Heavy persistent drizzle' },
  56: { label: 'Light Freezing Drizzle', icon: 'CloudSnow', category: 'snow', description: 'Cold freezing drizzle' },
  57: { label: 'Dense Freezing Drizzle', icon: 'CloudSnow', category: 'snow', description: 'Dense freezing drizzle' },
  61: { label: 'Slight Rain', icon: 'CloudRain', category: 'rain', description: 'Light passing rain showers' },
  62: { label: 'Rainy', icon: 'CloudRain', category: 'rain', description: 'Steady moderate rainfall' },
  63: { label: 'Moderate Rain', icon: 'CloudRain', category: 'rain', description: 'Continuous moderate rain' },
  65: { label: 'Heavy Rain', icon: 'CloudRain', category: 'rain', description: 'Heavy downpour rain' },
  66: { label: 'Light Freezing Rain', icon: 'CloudSnow', category: 'snow', description: 'Chilly freezing rain' },
  67: { label: 'Heavy Freezing Rain', icon: 'CloudSnow', category: 'snow', description: 'Severe freezing rain' },
  71: { label: 'Slight Snow Fall', icon: 'Snowflake', category: 'snow', description: 'Gentle fluttering snow' },
  73: { label: 'Moderate Snow Fall', icon: 'Snowflake', category: 'snow', description: 'Steady snowfall' },
  75: { label: 'Heavy Snow Fall', icon: 'Snowflake', category: 'snow', description: 'Heavy winter blizzard snowfall' },
  77: { label: 'Snow Grains', icon: 'Snowflake', category: 'snow', description: 'Fine snow grains' },
  80: { label: 'Slight Rain Showers', icon: 'CloudRain', category: 'rain', description: 'Brief passing showers' },
  81: { label: 'Moderate Rain Showers', icon: 'CloudRain', category: 'rain', description: 'Passing rain showers' },
  82: { label: 'Violent Rain Showers', icon: 'CloudRain', category: 'rain', description: 'Torrential downpours' },
  85: { label: 'Slight Snow Showers', icon: 'Snowflake', category: 'snow', description: 'Intermittent snow flurries' },
  86: { label: 'Heavy Snow Showers', icon: 'Snowflake', category: 'snow', description: 'Intense snow squalls' },
  95: { label: 'Thunderstorm', icon: 'CloudLightning', category: 'storm', description: 'Thunderstorm with lightning' },
  96: { label: 'Thunderstorm with Slight Hail', icon: 'CloudLightning', category: 'storm', description: 'Thunderstorm with hail' },
  99: { label: 'Thunderstorm with Heavy Hail', icon: 'CloudLightning', category: 'storm', description: 'Severe thunderstorm with heavy hail' }
};

/**
 * Get info for a given WMO weather code
 */
export function getWeatherCodeInfo(code, isDay = 1) {
  const info = WMO_CODES[code] || {
    label: 'Partly Cloudy',
    icon: isDay ? 'CloudSun' : 'CloudMoon',
    category: 'clouds',
    description: 'Variable cloud cover'
  };

  // Adjust icon for night
  if (!isDay) {
    if (code === 0 || code === 1) {
      return { ...info, icon: 'Moon', label: code === 0 ? 'Clear Night' : 'Mainly Clear Night' };
    }
    if (code === 2) {
      return { ...info, icon: 'CloudMoon' };
    }
  }

  return info;
}

/**
 * Temperature conversion and formatting
 */
export function formatTemp(tempC, unit = 'celsius') {
  if (tempC === null || tempC === undefined || isNaN(tempC)) return '--';
  const val = unit === 'fahrenheit' ? (tempC * 9) / 5 + 32 : tempC;
  return `${Math.round(val)}°${unit === 'fahrenheit' ? 'F' : 'C'}`;
}

export function formatTempRaw(tempC, unit = 'celsius') {
  if (tempC === null || tempC === undefined || isNaN(tempC)) return '--';
  const val = unit === 'fahrenheit' ? (tempC * 9) / 5 + 32 : tempC;
  return Math.round(val);
}

/**
 * Wind speed formatting
 */
export function formatWindSpeed(kmh, unit = 'celsius') {
  if (kmh === null || kmh === undefined || isNaN(kmh)) return '--';
  if (unit === 'fahrenheit') {
    const mph = kmh * 0.621371;
    return `${mph.toFixed(1)} mph`;
  }
  return `${Math.round(kmh)} km/h`;
}

/**
 * Visibility formatting
 */
export function formatVisibility(meters, unit = 'celsius') {
  if (meters === null || meters === undefined || isNaN(meters)) return '--';
  const km = meters / 1000;
  if (unit === 'fahrenheit') {
    const miles = km * 0.621371;
    return `${miles.toFixed(1)} mi`;
  }
  return `${km.toFixed(1)} km`;
}

/**
 * Pressure formatting
 */
export function formatPressure(hPa, unit = 'celsius') {
  if (hPa === null || hPa === undefined || isNaN(hPa)) return '--';
  if (unit === 'fahrenheit') {
    const inHg = hPa * 0.02953;
    return `${inHg.toFixed(2)} inHg`;
  }
  return `${Math.round(hPa)} hPa`;
}

/**
 * Wind direction degrees to compass label
 */
export function getWindDirection(deg) {
  if (deg === null || deg === undefined) return 'N/A';
  const directions = ['N', 'NNE', 'NE', 'ENE', 'E', 'ESE', 'SE', 'SSE', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
  const index = Math.round((deg % 360) / 22.5) % 16;
  return directions[index];
}

/**
 * UV index rating
 */
export function getUVRating(uv) {
  if (uv === null || uv === undefined) return { label: 'Low', color: '#10b981' };
  if (uv <= 2) return { label: 'Low', color: '#10b981' };
  if (uv <= 5) return { label: 'Moderate', color: '#f59e0b' };
  if (uv <= 7) return { label: 'High', color: '#f97316' };
  if (uv <= 10) return { label: 'Very High', color: '#ef4444' };
  return { label: 'Extreme', color: '#8b5cf6' };
}

/**
 * Humidity rating
 */
export function getHumidityRating(humidity) {
  if (humidity < 30) return 'Dry';
  if (humidity <= 60) return 'Comfortable';
  if (humidity <= 80) return 'Humid';
  return 'Very Humid';
}

/**
 * Date and Time formatters
 */
export function formatDayName(dateString, index = 0) {
  if (!dateString) return '';
  if (index === 0) return 'Today';
  if (index === 1) return 'Tomorrow';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { weekday: 'short' });
}

export function formatFullDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric'
  });
}

export function formatTime(isoString, timezone = 'UTC') {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
    hour12: true
  });
}

export function formatHourShort(isoString) {
  if (!isoString) return '';
  const date = new Date(isoString);
  return date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    hour12: true
  });
}
