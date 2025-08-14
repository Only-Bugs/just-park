import { useEffect, useState, useCallback, useRef } from "react";
import type { ParkingSpot } from "../types/parking";
import {
  fetchParkingSpots,
  ParkingApiError,
  parkingCache,
} from "../services/parkingService";
export function useParkingSpots() {
  const [spots, setSpots] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const refreshingRef = useRef(false);
  const loadSpots = useCallback(async (useCache = true) => {
    try {
      setLoading(true);
      setError(null);
      const data = useCache
        ? await parkingCache.getCachedOrFetch()
        : await fetchParkingSpots();
      setSpots(data);
      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof ParkingApiError) {
        setError(err.message);
      } else {
        setError("Failed to load parking data. Please try again.");
      }
      setSpots([]);
    } finally {
      setLoading(false);
    }
  }, []);
  const refresh = useCallback(async () => {
    if (refreshingRef.current) return;
    refreshingRef.current = true;
    try {
      setError(null);
      parkingCache.invalidate();
      const data = await fetchParkingSpots();
      setSpots(data);
      setLastUpdated(new Date());
    } catch (err) {
      if (err instanceof ParkingApiError) {
        setError(err.message);
      } else {
        setError("Failed to refresh parking data. Please try again.");
      }
    } finally {
      refreshingRef.current = false;
    }
  }, []);
  useEffect(() => {
    loadSpots();
  }, [loadSpots]);
  return {
    spots,
    loading,
    error,
    lastUpdated,
    refresh,
  };
}
