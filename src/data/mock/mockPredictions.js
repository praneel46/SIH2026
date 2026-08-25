export const mockPredictions = [
  {
    id: "PRED-2026-8942",
    date: "2026-08-25",
    targetPeriod: "August 2026 - September 2026",
    location: "Western Ghats / Maharashtra Region",
    rainfallAnomaly: -18.4,
    unit: "mm (estimated deviation)",
    riskCategory: "BELOW_NORMAL",
    severity: "MODERATE_DEFICIT",
    breakPhaseRisk: "HIGH",
    confidenceNote: "Prototype regression model trained on DMI lag features. Regional scale inference.",
    dmiInput: { dmi: 0.42, dmi_lag1: 0.35, dmi_lag2: 0.28 },
    scaledInput: [-0.05, 0.02, 0.08, 0.7077, -0.7066]
  },
  {
    id: "PRED-2026-8941",
    date: "2026-08-15",
    targetPeriod: "Mid August 2026",
    location: "Central Deccan Plateau",
    rainfallAnomaly: -24.1,
    unit: "mm (estimated deviation)",
    riskCategory: "BREAK_RISK",
    severity: "HIGH_BREAK_RISK",
    breakPhaseRisk: "CRITICAL",
    confidenceNote: "Model indicates persistent suppressed precipitation signal based on negative Indian Ocean Dipole lag trends.",
    dmiInput: { dmi: -0.15, dmi_lag1: -0.22, dmi_lag2: -0.10 },
    scaledInput: [-0.29, -0.08, -0.45, 0.866, -0.5]
  },
  {
    id: "PRED-2026-8940",
    date: "2026-08-01",
    targetPeriod: "Early August 2026",
    location: "Northern Plains / Indo-Gangetic Belt",
    rainfallAnomaly: +12.8,
    unit: "mm (estimated deviation)",
    riskCategory: "ABOVE_NORMAL",
    severity: "SURPLUS_ALERT",
    breakPhaseRisk: "LOW",
    confidenceNote: "Favorable Dipole Mode Index alignment creating positive anomaly conditions.",
    dmiInput: { dmi: 0.58, dmi_lag1: 0.45, dmi_lag2: 0.38 },
    scaledInput: [0.22, 0.18, 0.15, 0.5, -0.866]
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
