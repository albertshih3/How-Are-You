/**
 * Open-Meteo Weather API Wrapper
 *
 * Fetches current weather data using the Open-Meteo API.
 * No API key required - public API.
 */

import type { WeatherData } from '../types/location';

const OPEN_METEO_API_URL = 'https://api.open-meteo.com/v1/forecast';

/**
 * Weather code mappings from Open-Meteo to conditions and icons
 *
 * Weather codes: https://open-meteo.com/en/docs
 * - 0: Clear sky
 * - 1, 2, 3: Mainly clear, partly cloudy, and overcast
 * - 45, 48: Fog and depositing rime fog
 * - 51, 53, 55: Drizzle: Light, moderate, and dense intensity
 * - 61, 63, 65: Rain: Slight, moderate and heavy intensity
 * - 71, 73, 75: Snow fall: Slight, moderate, and heavy intensity
 * - 80, 81, 82: Rain showers: Slight, moderate, and violent
 * - 95, 96, 99: Thunderstorm
 */
const WEATHER_CODE_MAP: Record<number, { condition: string; icon: string }> = {
  0: { condition: 'Clear', icon: '01d' },
  1: { condition: 'Mostly Clear', icon: '01d' },
  2: { condition: 'Partly Cloudy', icon: '02d' },
  3: { condition: 'Cloudy', icon: '03d' },
  45: { condition: 'Foggy', icon: '50d' },
  48: { condition: 'Foggy', icon: '50d' },
  51: { condition: 'Light Drizzle', icon: '09d' },
  53: { condition: 'Drizzle', icon: '09d' },
  55: { condition: 'Heavy Drizzle', icon: '09d' },
  56: { condition: 'Light Freezing Drizzle', icon: '09d' },
  57: { condition: 'Freezing Drizzle', icon: '09d' },
  61: { condition: 'Light Rain', icon: '10d' },
  63: { condition: 'Rain', icon: '10d' },
  65: { condition: 'Heavy Rain', icon: '10d' },
  66: { condition: 'Light Freezing Rain', icon: '10d' },
  67: { condition: 'Freezing Rain', icon: '10d' },
  71: { condition: 'Light Snow', icon: '13d' },
  73: { condition: 'Snow', icon: '13d' },
  75: { condition: 'Heavy Snow', icon: '13d' },
  77: { condition: 'Snow Grains', icon: '13d' },
  80: { condition: 'Light Showers', icon: '09d' },
  81: { condition: 'Showers', icon: '09d' },
  82: { condition: 'Heavy Showers', icon: '09d' },
  85: { condition: 'Light Snow Showers', icon: '13d' },
  86: { condition: 'Snow Showers', icon: '13d' },
  95: { condition: 'Thunderstorm', icon: '11d' },
  96: { condition: 'Thunderstorm with Hail', icon: '11d' },
  99: { condition: 'Heavy Thunderstorm', icon: '11d' },
};

/**
 * Interface for Open-Meteo API response
 */
interface OpenMeteoResponse {
  latitude: number;
  longitude: number;
  current: {
    time: string;
    temperature_2m: number;
    weather_code: number;
  };
}

/**
 * Fetch current weather for a location
 *
 * @param lat - Latitude
 * @param lon - Longitude
 * @param unit - Temperature unit ('F' or 'C'), default 'F'
 * @returns WeatherData object with current conditions
 * @throws Error if request fails
 */
export async function fetchWeather(
  lat: number,
  lon: number,
  unit: 'F' | 'C' = 'F'
): Promise<WeatherData> {
  const temperatureUnit = unit === 'F' ? 'fahrenheit' : 'celsius';

  const url = `${OPEN_METEO_API_URL}?` +
    `latitude=${lat}&` +
    `longitude=${lon}&` +
    `current=temperature_2m,weather_code&` +
    `temperature_unit=${temperatureUnit}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Weather API error: ${response.status} ${response.statusText}`);
    }

    const data: OpenMeteoResponse = await response.json();

    // Map weather code to condition and icon
    const weatherCode = data.current.weather_code;
    const weatherInfo = WEATHER_CODE_MAP[weatherCode] || {
      condition: 'Unknown',
      icon: '01d',
    };

    return {
      condition: weatherInfo.condition,
      temp: Math.round(data.current.temperature_2m),
      unit,
      icon: weatherInfo.icon,
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch weather: ${error.message}`);
    }
    throw new Error('Failed to fetch weather');
  }
}
