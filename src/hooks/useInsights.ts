import { useEffect, useState } from "react";

export function useInsights() {
  const [motorCensus, setMotorCensus] = useState<any[]>([]);
  const [parkingTrends, setParkingTrends] = useState<any[]>([]);
  const [parkingZones, setParkingZones] = useState<any[]>([]);
  const [populationTrends, setPopulationTrends] = useState<any[]>([]);
  const [populationWeb, setPopulationWeb] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  async function safeFetch(url: string) {
    const res = await fetch(url);
    const contentType = res.headers.get("content-type") || "";

    if (!res.ok) {
      const text = await res.text();
      throw new Error(`HTTP ${res.status} — ${text}`);
    }

    if (contentType.includes("application/json")) {
      return res.json();
    } else {
      const text = await res.text();
      console.error(`Unexpected non-JSON from ${url}:`, text);
      return null;
    }
  }

  useEffect(() => {
    setLoading(true);

    Promise.all([
      safeFetch("/dev/motorCensus").then(setMotorCensus),
      safeFetch("/dev/parkingTrends").then(setParkingTrends),
      safeFetch("/dev/parkingZones").then(setParkingZones),
      safeFetch("/dev/populationTrends").then(setPopulationTrends),
      safeFetch("/dev/populationWeb").then(setPopulationWeb),
    ])
      .catch((err) => console.error("useInsights fetch error:", err))
      .finally(() => setLoading(false));
  }, []);

  return {
    loading,
    motorCensus,
    parkingTrends,
    parkingZones,
    populationTrends,
    populationWeb,
  };
}
