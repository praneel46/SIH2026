export const mockClimateSignals = {
  current: {
    dmi: 0.42,
    dmi_lag1: 0.35,
    dmi_lag2: 0.28,
    month: 8,
    month_sin: Math.sin((2 * Math.PI * 8) / 12),
    month_cos: Math.cos((2 * Math.PI * 8) / 12),
    timestamp: "2026-08-25T19:22:00Z"
  },
  futurePlaceholders: [
    { name: "ONI (Oceanic Niño Index)", status: "Future Expansion", description: "ENSO ocean surface temperature anomaly monitoring" },
    { name: "MJO (Madden-Julian Oscillation)", status: "Future Expansion", description: "Tropical atmospheric circulation & wave phase tracking" },
    { name: "Rainfall Lag (Spatial Grid)", status: "Future Expansion", description: "Historical precipitation memory arrays" }
  ],
  historicalDmi: [
    { month: "Jan", dmi: -0.12, lag1: -0.15, lag2: -0.18 },
    { month: "Feb", dmi: -0.05, lag1: -0.12, lag2: -0.15 },
    { month: "Mar", dmi: 0.08, lag1: -0.05, lag2: -0.12 },
    { month: "Apr", dmi: 0.18, lag1: 0.08, lag2: -0.05 },
    { month: "May", dmi: 0.25, lag1: 0.18, lag2: 0.08 },
    { month: "Jun", dmi: 0.31, lag1: 0.25, lag2: 0.18 },
    { month: "Jul", dmi: 0.35, lag1: 0.31, lag2: 0.25 },
    { month: "Aug", dmi: 0.42, lag1: 0.35, lag2: 0.28 }
  ]
};
