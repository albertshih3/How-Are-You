/**
 * Geolocation API Wrapper
 *
 * Promise-based wrapper for the browser Geolocation API.
 * Handles permissions, timeouts, and errors gracefully.
 */

export interface GeolocationPosition {
  latitude: number;
  longitude: number;
  accuracy: number;
}

export class GeolocationError extends Error {
  constructor(
    message: string,
    public code: number
  ) {
    super(message);
    this.name = 'GeolocationError';
  }
}

/**
 * Get the user's current position using the browser Geolocation API
 *
 * @param timeout - Maximum time to wait for position (ms), default 10000
 * @returns Promise resolving to GeolocationPosition
 * @throws GeolocationError if permission denied, unavailable, or timeout
 */
export async function getCurrentPosition(
  timeout = 10000
): Promise<GeolocationPosition> {
  // Check if geolocation is supported
  if (!navigator.geolocation) {
    throw new GeolocationError(
      'Geolocation is not supported by your browser',
      0
    );
  }

  return new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        resolve({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        });
      },
      (error) => {
        // Map browser geolocation errors to friendly messages
        let message: string;
        switch (error.code) {
          case error.PERMISSION_DENIED:
            message = 'Location permission denied. Please enable location access in your browser settings.';
            break;
          case error.POSITION_UNAVAILABLE:
            message = 'Location information is unavailable. Please try again.';
            break;
          case error.TIMEOUT:
            message = 'Location request timed out. Please try again.';
            break;
          default:
            message = 'An unknown error occurred while getting your location.';
        }
        reject(new GeolocationError(message, error.code));
      },
      {
        enableHighAccuracy: false, // We only need city-level accuracy
        timeout,
        maximumAge: 300000, // Cache position for 5 minutes
      }
    );
  });
}
