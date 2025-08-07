import type { Suggestion } from "../types/search";

export async function fetchLocationSuggestions(
  query: string
): Promise<Suggestion[]> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&viewbox=144.90,-37.70,145.10,-37.90&bounded=1&countrycodes=au`
  );

  if (!res.ok) throw new Error("Failed to fetch suggestions");

  const data: Suggestion[] = await res.json();
  return data.slice(0, 5);
}
