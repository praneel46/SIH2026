export const mockPredictions = [
  {
    id: "PRED-2026-KA-BLR",
    date: "2026-08-26",
    targetPeriod: "August 2026 (Monsoon Peak)",
    location: "Bengaluru Rural, Karnataka",
    rainfallAnomaly: 63.94,
    historicalMean: 120.51,
    deviationPct: -46.9,
    unit: "mm (70/30 Ensemble Synthesis)",
    riskCategory: "HIGH",
    severity: "SEVERE_DEFICIT",
    breakPhaseRisk: "CRITICAL",
    confidenceNote: "70% 3-model meteorological ensemble (GFS/ICON/ECMWF) + 30% historical baseline (2000-2023).",
    inputs: { latitude: 13.29, longitude: 77.55, month: 8, crop_type: "ragi", dmi: 0.10, oni: -0.30, mjo_phase: 4.0, mjo_amplitude: 1.2 }
  },
  {
    id: "PRED-2026-KA-MYS",
    date: "2026-08-20",
    targetPeriod: "August 2026 (Monsoon Peak)",
    location: "Mysuru, Karnataka",
    rainfallAnomaly: 88.50,
    historicalMean: 108.20,
    deviationPct: -18.2,
    unit: "mm (70/30 Ensemble Synthesis)",
    riskCategory: "MODERATE",
    severity: "MODERATE_DEFICIT",
    breakPhaseRisk: "HIGH",
    confidenceNote: "Moderate deficit forecast; recommended supplemental protective irrigation.",
    inputs: { latitude: 12.30, longitude: 76.65, month: 8, crop_type: "maize", dmi: 0.15, oni: -0.20, mjo_phase: 3.0, mjo_amplitude: 1.0 }
  },
  {
    id: "PRED-2026-KA-BEL",
    date: "2026-08-10",
    targetPeriod: "August 2026 (Monsoon Peak)",
    location: "Belagavi, Karnataka",
    rainfallAnomaly: 195.40,
    historicalMean: 202.10,
    deviationPct: -3.3,
    unit: "mm (70/30 Ensemble Synthesis)",
    riskCategory: "NORMAL",
    severity: "OPTIMAL_CONDITIONS",
    breakPhaseRisk: "LOW",
    confidenceNote: "Normal seasonal monsoon conditions forecast across Northern Karnataka belt.",
    inputs: { latitude: 15.85, longitude: 74.50, month: 8, crop_type: "jowar", dmi: 0.05, oni: -0.10, mjo_phase: 4.0, mjo_amplitude: 1.1 }
  }
];

export const mockAnomalyTrends = [
  { day: "Aug 1", observed: 5, projected: -4, actual: 5, predicted: -4 },
  { day: "Aug 6", observed: 14, projected: 8, actual: 14, predicted: 8 },
  { day: "Aug 11", observed: 8, projected: -8, actual: 8, predicted: -8 },
  { day: "Aug 16", observed: -15, projected: -18, actual: -15, predicted: -18 },
  { day: "Aug 21", observed: -24, projected: -16, actual: -24, predicted: -16 },
  { day: "Aug 26", observed: -18, projected: -4, actual: -18, predicted: -4 },
  { day: "Aug 31", observed: 12, projected: 18, actual: 12, predicted: 18 }
];

