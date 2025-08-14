import type { ParkingSpot } from "./parking";
export interface ParkingMapProps {
  onSelectSpot: (spot: ParkingSpot) => void;
  showAvailableOnly: boolean;
  searchLocation: { lat: number; lng: number } | null;
}
