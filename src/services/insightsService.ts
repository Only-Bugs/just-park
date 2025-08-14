import axios from "axios";

const cache = new Map<string, { ts: number; data: unknown }>();
const TTL = 5 * 60 * 1000;

function unwrapBody<T>(raw: any): T {
  // API Gateway style: { statusCode, headers, body }
  if (raw && typeof raw === "object" && "body" in raw) {
    const b = (raw as any).body;
    try {
      return (typeof b === "string" ? JSON.parse(b) : b) as T;
    } catch {
      return b as T;
    }
  }
  return raw as T;
}

async function get<T>(url: string): Promise<T> {
  const now = Date.now();
  const hit = cache.get(url);
  if (hit && now - hit.ts < TTL) return hit.data as T;

  const resp = await axios.get(url);
  const unwrapped = unwrapBody<T>(resp.data);
  cache.set(url, { ts: now, data: unwrapped });
  return unwrapped;
}

export function getParkingTrends() {
  return get<any>("/api/dev/parkingtrends");
}
export function getPopulationTrends() {
  return get<any>("/api/dev/populationtrends");
}
export function getPopulationWeb() {
  return get<any>("/api/dev/populationweb");
}
export function getMotorCensus() {
  return get<any>("/api/dev/motorcensus");
}
export function getParkingZones() {
  return get<any>("/api/dev/parkingzones");
}
