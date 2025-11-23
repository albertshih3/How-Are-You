/**
 * Location and Weather Types
 *
 * Type definitions for location and weather data used in journal entries.
 */

/**
 * Location data with coordinates
 */
export interface LocationData {
  name: string;
  lat: number;
  lon: number;
}

/**
 * Weather data with condition and temperature
 */
export interface WeatherData {
  condition: string;
  temp: number;
  unit: 'F' | 'C';
  icon: string;
}

/**
 * Mapbox geocoding feature result
 */
export interface MapboxFeature {
  id: string;
  type: 'Feature';
  place_type: string[];
  relevance: number;
  properties: Record<string, unknown>;
  text: string;
  place_name: string;
  center: [number, number];
  geometry: {
    type: 'Point';
    coordinates: [number, number];
  };
}

/**
 * Mapbox geocoding API response
 */
export interface MapboxGeocodingResponse {
  type: 'FeatureCollection';
  query: string[];
  features: MapboxFeature[];
  attribution: string;
}
