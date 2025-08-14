import type { ParkingSpot } from "../types/parking";

/**
 * Calculate the distance between two coordinates using the Haversine formula
 * Returns distance in meters
 */
export function calculateDistance(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371000; // Earth's radius in meters
  const dLat = (lat2 - lat1) * (Math.PI / 180);
  const dLng = (lng2 - lng1) * (Math.PI / 180);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * (Math.PI / 180)) *
      Math.cos(lat2 * (Math.PI / 180)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c;
  return Math.round(distance);
}

/**
 * Format distance for display
 */
export function formatDistance(meters: number): string {
  if (meters < 1000) {
    return `${meters}m`;
  } else {
    return `${(meters / 1000).toFixed(1)}km`;
  }
}

/**
 * Add distance information to parking spots and sort by distance
 */
export function sortSpotsByDistance(
  spots: ParkingSpot[],
  searchLocation: { lat: number; lng: number }
): (ParkingSpot & { distance: number; formattedDistance: string })[] {
  return spots
    .map((spot) => {
      const distance = calculateDistance(
        searchLocation.lat,
        searchLocation.lng,
        spot.lat,
        spot.lng
      );
      return {
        ...spot,
        distance,
        formattedDistance: formatDistance(distance),
      };
    })
    .sort((a, b) => a.distance - b.distance);
}

/**
 * Get walking time estimate (assuming 5 km/h walking speed)
 */
export function getWalkingTime(meters: number): string {
  const walkingSpeedKmH = 5;
  const walkingSpeedMs = (walkingSpeedKmH * 1000) / 3600;
  const timeInSeconds = meters / walkingSpeedMs;
  const timeInMinutes = Math.round(timeInSeconds / 60);

  if (timeInMinutes < 1) {
    return "< 1 min";
  } else if (timeInMinutes < 60) {
    return `${timeInMinutes} min`;
  } else {
    const hours = Math.floor(timeInMinutes / 60);
    const remainingMinutes = timeInMinutes % 60;
    return `${hours}h ${remainingMinutes}m`;
  }
}
