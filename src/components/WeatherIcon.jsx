import React from 'react';
import {
  Sun,
  SunDim,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets,
  HelpCircle
} from 'lucide-react';
import { getWeatherCodeInfo } from '../utils/formatters';

const ICON_MAP = {
  Sun,
  SunDim,
  Moon,
  Cloud,
  CloudSun,
  CloudMoon,
  CloudFog,
  CloudDrizzle,
  CloudRain,
  CloudSnow,
  CloudLightning,
  Snowflake,
  Wind,
  Droplets
};

export default function WeatherIcon({
  code,
  isDay = 1,
  iconName = null,
  size = 32,
  className = '',
  color = undefined
}) {
  let IconComponent = HelpCircle;

  if (iconName && ICON_MAP[iconName]) {
    IconComponent = ICON_MAP[iconName];
  } else if (code !== undefined && code !== null) {
    const info = getWeatherCodeInfo(code, isDay);
    if (info && info.icon && ICON_MAP[info.icon]) {
      IconComponent = ICON_MAP[info.icon];
    }
  }

  return (
    <IconComponent
      size={size}
      className={`weather-icon ${className}`}
      color={color}
      strokeWidth={1.75}
    />
  );
}
