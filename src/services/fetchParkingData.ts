// src/services/fetchParkingData.ts
import type { ParkingBayApiResponse, ParkingSpot } from "../types/parking";
import { transformApiResponse } from "../types/parking";

const API_URL = "/api/dev/parkingbay";

export interface FetchParkingDataOptions {
  timeout?: number;
  saveToFile?: boolean;
  filePath?: string;
}

export interface FetchParkingDataResult {
  success: boolean;
  data: ParkingSpot[];
  totalRecords: number;
  validRecords: number;
  error?: string;
  timestamp: Date;
}

/**
 * Validates if a parking bay record has all required fields
 */
function isValidParkingRecord(
  record: unknown
): record is ParkingBayApiResponse {
  if (!record || typeof record !== "object") {
    return false;
  }

  const r = record as any;
  return (
    typeof r.Location === "string" &&
    r.Location.includes(",") &&
    r.KerbsideID &&
    r.Status_Description
  );
}

/**
 * Fetches parking data from the API and optionally saves to file
 */
export async function fetchParkingData(
  options: FetchParkingDataOptions = {}
): Promise<FetchParkingDataResult> {
  const { timeout = 10000, saveToFile = false } = options;

  const startTime = Date.now();
  const timestamp = new Date();

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    const response = await fetch(API_URL, {
      signal: controller.signal,
      headers: {
        "Content-Type": "application/json",
      },
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const responseData = await response.json();

    // Handle the API response format: { statusCode: 200, headers: {...}, body: [...] }
    let rawData: unknown[];
    if (responseData && responseData.body && Array.isArray(responseData.body)) {
      rawData = responseData.body;
    } else if (Array.isArray(responseData)) {
      rawData = responseData;
    } else {
      console.error("Unexpected API response format:", responseData);
      throw new Error("API returned unexpected data format");
    }

    const totalRecords = rawData.length;

    // Filter and validate records
    const validRecords = rawData.filter(isValidParkingRecord);
    const validRecordsCount = validRecords.length;

    // Transform to internal format
    const transformedData = validRecords.map(transformApiResponse);

    // Remove duplicates based on ID (keep the most recent one)
    const uniqueData = transformedData.reduce((acc, spot) => {
      const existingIndex = acc.findIndex(
        (existing) => existing.id === spot.id
      );
      if (existingIndex >= 0) {
        // Keep the one with more recent lastUpdated timestamp
        const existing = acc[existingIndex];
        const spotTime = spot.lastUpdated
          ? new Date(spot.lastUpdated).getTime()
          : 0;
        const existingTime = existing.lastUpdated
          ? new Date(existing.lastUpdated).getTime()
          : 0;

        if (spotTime > existingTime) {
          acc[existingIndex] = spot; // Replace with more recent
        }
      } else {
        acc.push(spot);
      }
      return acc;
    }, [] as ParkingSpot[]);

    const duration = Date.now() - startTime;

    return {
      success: true,
      data: uniqueData,
      totalRecords,
      validRecords: validRecordsCount,
      timestamp,
    };
  } catch (error) {
    const duration = Date.now() - startTime;
    console.error(`Fetch failed after ${duration}ms:`, error);

    let errorMessage = "Unknown error occurred";

    if (error instanceof Error) {
      if (error.name === "AbortError") {
        errorMessage = `Request timed out after ${timeout}ms`;
      } else {
        errorMessage = error.message;
      }
    }

    return {
      success: false,
      data: [],
      totalRecords: 0,
      validRecords: 0,
      error: errorMessage,
      timestamp,
    };
  }
}

/**
 * Utility function for development - fetches and logs statistics
 */
export async function fetchParkingDataWithStats(): Promise<void> {
  const result = await fetchParkingData();

  if (result.error) {
    console.log(`Error: ${result.error}`);
  }

  if (result.data.length > 0) {
    const statusCounts = result.data.reduce((acc, spot) => {
      acc[spot.status] = (acc[spot.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    console.log("\nStatus Distribution:");
    Object.entries(statusCounts).forEach(([status, count]) => {
      console.log(`  ${status}: ${count}`);
    });
  }
}
