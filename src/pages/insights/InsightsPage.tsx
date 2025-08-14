import React, { useEffect } from "react";
import { useInsights } from "../../hooks/useInsights";

export default function InsightsPage() {
  const insightsData = useInsights();

  useEffect(() => {
    console.log("useInsights() result:", insightsData);
  }, [insightsData]);

  return (
    <div>
      <h1>Insights Debug</h1>
      <p>Check the console for hook output.</p>
    </div>
  );
}
