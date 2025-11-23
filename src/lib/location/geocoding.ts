/**
 * Mapbox Geocoding API Wrapper
 *
 * Provides forward and reverse geocoding using the Mapbox Geocoding API.
 * Requires NEXT_PUBLIC_MAPBOX_API_KEY environment variable.
 */

import type { LocationData, MapboxGeocodingResponse } from '../types/location';

const MAPBOX_API_KEY = process.env.NEXT_PUBLIC_MAPBOX_API_KEY;
const GEOCODING_BASE_URL = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

/**
 * Search for locations by query string (forward geocoding)
 *
 * @param query - Search query (e.g., "San Francisco", "Paris, France")
 * @param limit - Maximum number of results, default 5
 * @returns Array of LocationData results
 * @throws Error if API key is missing or request fails
 */
export async function searchLocations(
  query: string,
  limit = 5
): Promise<LocationData[]> {
  if (!MAPBOX_API_KEY) {
    throw new Error('Mapbox API key is not configured');
  }

  if (!query.trim()) {
    return [];
  }

  const encodedQuery = encodeURIComponent(query);
  const url = `${GEOCODING_BASE_URL}/${encodedQuery}.json?` +
    `access_token=${MAPBOX_API_KEY}&` +
    `types=place,locality,region&` +
    `limit=${limit}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data: MapboxGeocodingResponse = await response.json();

    // Convert Mapbox features to LocationData
    return data.features.map((feature) => ({
      name: feature.place_name,
      lat: feature.center[1], // Mapbox uses [lon, lat]
      lon: feature.center[0],
    }));
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to search locations: ${error.message}`);
    }
    throw new Error('Failed to search locations');
  }
}

/**
 * Convert coordinates to a location name (reverse geocoding)
 *
 * @param lat - Latitude
 * @param lon - Longitude
 * @returns LocationData with city/region name
 * @throws Error if API key is missing or request fails
 */
export async function reverseGeocode(
  lat: number,
  lon: number
): Promise<LocationData> {
  if (!MAPBOX_API_KEY) {
    throw new Error('Mapbox API key is not configured');
  }

  const url = `${GEOCODING_BASE_URL}/${lon},${lat}.json?` +
    `access_token=${MAPBOX_API_KEY}&` +
    `types=place,locality`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Geocoding API error: ${response.status} ${response.statusText}`);
    }

    const data: MapboxGeocodingResponse = await response.json();

    if (data.features.length === 0) {
      throw new Error('No location found for these coordinates');
    }

    const feature = data.features[0];
    return {
      name: feature.place_name,
      lat: feature.center[1],
      lon: feature.center[0],
    };
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to reverse geocode: ${error.message}`);
    }
    throw new Error('Failed to reverse geocode');
  }
}
