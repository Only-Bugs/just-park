import { createContext, useContext, useState, useCallback } from "react";
import type { ReactNode } from "react";
import type { ParkingSpot } from "../types/parking";
import { useParkingSpots } from "../hooks/useParkingSpots";

interface MapControlsContextType {
  spots: ParkingSpot[];
  loading: boolean;
  error: string | null;
  lastUpdated: Date | null;
  showAvailableOnly: boolean;
  searchLocation: { lat: number; lng: number } | null;
  refresh: () => Promise<void>;
  setShowAvailableOnly: (show: boolean) => void;
  setSearchLocation: (location: { lat: number; lng: number } | null) => void;
  filteredSpots: ParkingSpot[];
}

// eslint-disable-next-line react-refresh/only-export-components
export const MapControlsContext = createContext<
  MapControlsContextType | undefined
>(undefined);

interface MapControlsProviderProps {
  children: ReactNode;
}

export function MapControlsProvider({ children }: MapControlsProviderProps) {
  const {
    spots,
    loading,
    error,
    lastUpdated,
    refresh: originalRefresh,
  } = useParkingSpots();

  // Set default to true for "available only"
  const [showAvailableOnly, setShowAvailableOnly] = useState(true);
  const [searchLocation, setSearchLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const filteredSpots = showAvailableOnly
    ? spots.filter((spot) => spot.status === "Unoccupied")
    : spots;

  const findDensestArea = useCallback((spotsArray: ParkingSpot[]) => {
    if (spotsArray.length === 0) return null;

    const gridSize = 0.002;
    const grid: { [key: string]: ParkingSpot[] } = {};

    spotsArray.forEach((spot) => {
      const gridX = Math.floor(spot.lat / gridSize);
      const gridY = Math.floor(spot.lng / gridSize);
      const key = `${gridX},${gridY}`;
      if (!grid[key]) {
        grid[key] = [];
      }
      grid[key].push(spot);
    });

    let maxCount = 0;
    let densestCell = "";
    Object.entries(grid).forEach(([key, cellSpots]) => {
      if (cellSpots.length > maxCount) {
        maxCount = cellSpots.length;
        densestCell = key;
      }
    });

    if (!densestCell) return null;

    const cellSpots = grid[densestCell];
    const avgLat =
      cellSpots.reduce((sum, spot) => sum + spot.lat, 0) / cellSpots.length;
    const avgLng =
      cellSpots.reduce((sum, spot) => sum + spot.lng, 0) / cellSpots.length;

    return {
      lat: avgLat,
      lng: avgLng,
      count: maxCount,
    };
  }, []);

  const refresh = useCallback(async () => {
    if (isRefreshing) return;
    setIsRefreshing(true);
    try {
      await originalRefresh();
      setTimeout(() => {
        const currentSpots = showAvailableOnly
          ? spots.filter((spot) => spot.status === "Unoccupied")
          : spots;
        const densestArea = findDensestArea(currentSpots);
        if (densestArea) {
          setSearchLocation({ lat: densestArea.lat, lng: densestArea.lng });
        }
      }, 500);
    } finally {
      setIsRefreshing(false);
    }
  }, [
    originalRefresh,
    spots,
    showAvailableOnly,
    findDensestArea,
    isRefreshing,
  ]);

  const value: MapControlsContextType = {
    spots,
    loading,
    error,
    lastUpdated,
    showAvailableOnly,
    searchLocation,
    refresh,
    setShowAvailableOnly,
    setSearchLocation,
    filteredSpots,
  };

  return (
    <MapControlsContext.Provider value={value}>
      {children}
    </MapControlsContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useMapControls() {
  const context = useContext(MapControlsContext);
  if (context === undefined) {
    throw new Error("useMapControls must be used within a MapControlsProvider");
  }
  return context;
}
