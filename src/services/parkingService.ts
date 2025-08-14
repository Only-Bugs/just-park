import type { ParkingSpot } from "../types/parking";
import { fetchParkingData } from "./fetchParkingData";
export class ParkingApiError extends Error {
  public status?: number;
  constructor(message: string, status?: number) {
    super(message);
    this.name = "ParkingApiError";
    this.status = status;
  }
}
export async function fetchParkingSpots(): Promise<ParkingSpot[]> {
  try {
    const result = await fetchParkingData({ timeout: 10000 });
    if (!result.success) {
      throw new ParkingApiError(result.error || "Failed to fetch parking data");
    }
    return result.data;
  } catch (error) {
    if (error instanceof ParkingApiError) {
      throw error;
    }
    if (error instanceof Error) {
      throw new ParkingApiError(`Network error: ${error.message}`);
    }
    throw new ParkingApiError("Unknown error occurred");
  }
}
class ParkingCache {
  private cache: { data: ParkingSpot[]; timestamp: number } | null = null;
  private readonly CACHE_DURATION = 5 * 60 * 1000;
  async getCachedOrFetch(): Promise<ParkingSpot[]> {
    const now = Date.now();
    if (this.cache && now - this.cache.timestamp < this.CACHE_DURATION) {
      return this.cache.data;
    }
    const data = await fetchParkingSpots();
    this.cache = { data, timestamp: now };
    return data;
  }
  invalidate(): void {
    this.cache = null;
  }
}
export const parkingCache = new ParkingCache();
