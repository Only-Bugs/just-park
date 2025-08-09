import type { Suggestion } from "../types/search";

const suggestionCache = new Map<string, Suggestion[]>();

export async function fetchLocationSuggestions(
  query: string
): Promise<Suggestion[]> {
  if (!query.trim()) return [];

  if (suggestionCache.has(query)) {
    return suggestionCache.get(query)!;
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 3000);

  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}&viewbox=144.90,-37.70,145.10,-37.90&bounded=1&countrycodes=au`,
      { signal: controller.signal }
    );

    if (!res.ok) throw new Error("Failed to fetch suggestions");

    const data: Suggestion[] = await res.json();
    const sliced = data.slice(0, 5);
    suggestionCache.set(query, sliced);
    return sliced;
  } catch (err) {
    console.warn("Suggestion fetch error:", err);
    return suggestionCache.get(query) || [];
  } finally {
    clearTimeout(timeout);
  }
}
