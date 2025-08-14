import { useEffect, useState, useCallback } from "react";
import type { ParkingSpot } from "../types/parking";
import { fetchParkingSpots, ParkingApiError } from "../services/parkingService";
export const useParkingData = () => {
  const [data, setData] = useState<ParkingSpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const parsed = await fetchParkingSpots();
      setData(parsed);
    } catch (err) {
      if (err instanceof ParkingApiError) {
        setError(err.message);
      } else {
        setError("Failed to load parking data. Please try again.");
      }
      setData([]);
    } finally {
      setLoading(false);
    }
  }, []);
  useEffect(() => {
    loadData();
  }, [loadData]);
  return { data, loading, error, refresh: loadData };
};
