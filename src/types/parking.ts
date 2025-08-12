// Updated types to match actual API response with robust error handling

export interface ParkingRestriction {
  Days: string;
  Start_Time: string;
  End_Time: string;
  Rule: string;
}

export interface ParkingBayApiResponse {
  Lastupdated: string;
  Status_Timestamp: string;
  Zone_Number: string;
  Status_Description: string;
  KerbsideID: number;
  Location: string;
  Restrictions: ParkingRestriction[];
}

export interface ParkingSpot {
  id: string;
  status: "Unoccupied" | "Present" | string;
  lat: number;
  lng: number;
  zone: string | null;
  lastUpdated: string | null;
  statusTimestamp: string | null;
  restrictions: ParkingRestriction[];
  // Computed fields for easier access
  primaryRule?: string;
  currentRestriction?: ParkingRestriction | null;
}

// Australian parking rule interpretations
export const PARKING_RULE_MEANINGS: Record<string, string> = {
  MP2P: "2 Hour Meter Parking",
  MP1P: "1 Hour Meter Parking",
  MP3P: "3 Hour Meter Parking",
  MP4P: "4 Hour Meter Parking",
  DP2P: "2 Hour Disc Parking",
  DP1P: "1 Hour Disc Parking",
  DP3P: "3 Hour Disc Parking",
  DP4P: "4 Hour Disc Parking",
  LZ30: "30 Minute Loading Zone",
  LZ15: "15 Minute Loading Zone",
  LZ60: "1 Hour Loading Zone",
  NP: "No Parking",
  NS: "No Stopping",
  TP: "Taxi Parking",
  DP: "Disabled Parking",
  MP: "Meter Parking",
  PP: "Permit Parking",
  RZ: "Resident Zone",
};

export function interpretParkingRule(rule: string): string {
  return PARKING_RULE_MEANINGS[rule] || rule;
}

export function getCurrentRestriction(
  restrictions: ParkingRestriction[]
): ParkingRestriction | null {
  if (!restrictions || restrictions.length === 0) return null;

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "short" });
  const currentTime = now.toTimeString().slice(0, 8); // HH:MM:SS format

  // Find restriction that applies to current day and time
  for (const restriction of restrictions) {
    if (!restriction.Days) continue;

    const days = restriction.Days.split(",");
    const dayMatches = days.some(
      (day) => day.trim().toLowerCase() === currentDay.toLowerCase()
    );

    if (dayMatches) {
      const startTime = restriction.Start_Time || "00:00:00";
      const endTime = restriction.End_Time || "23:59:59";

      if (currentTime >= startTime && currentTime <= endTime) {
        return restriction;
      }
    }
  }

  return null;
}

export function transformApiResponse(
  apiData: ParkingBayApiResponse
): ParkingSpot | null {
  try {
    // Robust location parsing
    if (!apiData.Location || typeof apiData.Location !== "string") {
      console.warn(
        `Invalid location data for KerbsideID ${apiData.KerbsideID}:`,
        apiData.Location
      );
      return null;
    }

    const locationParts = apiData.Location.split(",");
    if (locationParts.length !== 2) {
      console.warn(
        `Invalid location format for KerbsideID ${apiData.KerbsideID}:`,
        apiData.Location
      );
      return null;
    }

    const [latStr, lngStr] = locationParts.map((part) => part.trim());
    const lat = parseFloat(latStr);
    const lng = parseFloat(lngStr);

    if (isNaN(lat) || isNaN(lng)) {
      console.warn(
        `Invalid coordinates for KerbsideID ${apiData.KerbsideID}:`,
        { lat: latStr, lng: lngStr }
      );
      return null;
    }

    // Ensure restrictions is an array
    const restrictions = Array.isArray(apiData.Restrictions)
      ? apiData.Restrictions
      : [];

    // Find the most relevant restriction (current or most restrictive)
    const currentRestriction = getCurrentRestriction(restrictions);
    const primaryRule = currentRestriction?.Rule || restrictions[0]?.Rule || "";

    return {
      id: apiData.KerbsideID.toString(),
      status: apiData.Status_Description || "Unknown",
      lat,
      lng,
      zone: apiData.Zone_Number || null,
      lastUpdated: apiData.Lastupdated || null,
      statusTimestamp: apiData.Status_Timestamp || null,
      restrictions,
      primaryRule,
      currentRestriction,
    };
  } catch (error) {
    console.error(
      `Error transforming API data for KerbsideID ${apiData.KerbsideID}:`,
      error
    );
    return null;
  }
}

// Helper functions for display
export function formatDays(days: string): string {
  if (!days) return "Unknown";

  const dayMap: Record<string, string> = {
    Mon: "Monday",
    Tue: "Tuesday",
    Wed: "Wednesday",
    Thu: "Thursday",
    Fri: "Friday",
    Sat: "Saturday",
    Sun: "Sunday",
  };

  const dayList = days.split(",").map((d) => d.trim());

  // Check for common patterns
  if (dayList.length === 7) return "Every day";
  if (
    dayList.length === 5 &&
    !dayList.includes("Sat") &&
    !dayList.includes("Sun")
  ) {
    return "Weekdays";
  }
  if (
    dayList.length === 2 &&
    dayList.includes("Sat") &&
    dayList.includes("Sun")
  ) {
    return "Weekends";
  }

  return dayList.map((d) => dayMap[d] || d).join(", ");
}

export function formatTime(time: string): string {
  if (!time) return "Unknown";

  try {
    // Convert 24h format to 12h format for Australian standards
    const [hours, minutes] = time.split(":");
    const hour24 = parseInt(hours);
    const hour12 = hour24 === 0 ? 12 : hour24 > 12 ? hour24 - 12 : hour24;
    const ampm = hour24 >= 12 ? "PM" : "AM";

    return `${hour12}:${minutes} ${ampm}`;
  } catch (error) {
    console.warn(`Error formatting time ${time}:`, error);
    return time;
  }
}

export function getRestrictionsForCurrentTime(
  restrictions: ParkingRestriction[]
): ParkingRestriction[] {
  if (!restrictions || restrictions.length === 0) return [];

  const now = new Date();
  const currentDay = now.toLocaleDateString("en-US", { weekday: "short" });

  return restrictions.filter((restriction) => {
    if (!restriction.Days) return false;
    const days = restriction.Days.split(",").map((d) => d.trim());
    return days.includes(currentDay);
  });
}
