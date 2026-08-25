export const mockRiskData = [
  {
    id: "REG-MH-PUNE-HAV",
    districtName: "Pune",
    blockName: "Haveli",
    state: "Maharashtra",
    lat: 18.5204,
    lng: 73.8567,
    rainfallAnomaly: -18.4,
    riskCategory: "BELOW_NORMAL",
    riskLabel: "Below Normal (-18.4 mm)",
    color: "#EAB308", // Amber
    breakSpellProbability: "65%",
    soilMoistureStatus: "38% (Deficit)",
    dominantCrop: "Ragi & Groundnut",
    spatialScopeNote: "Mock spatial polygon for UI visualization; ML output is currently regional prototype scale."
  },
  {
    id: "REG-MH-PUNE-BAR",
    districtName: "Pune",
    blockName: "Baramati",
    state: "Maharashtra",
    lat: 18.1517,
    lng: 74.5786,
    rainfallAnomaly: -28.9,
    riskCategory: "BREAK_RISK",
    riskLabel: "High Break Risk (-28.9 mm)",
    color: "#EF4444", // Red
    breakSpellProbability: "82%",
    soilMoistureStatus: "24% (Severe Deficit)",
    dominantCrop: "Sugarcane & Maize",
    spatialScopeNote: "Mock spatial polygon for UI visualization; ML output is currently regional prototype scale."
  },
  {
    id: "REG-MH-SAT-KRA",
    districtName: "Satara",
    blockName: "Karad",
    state: "Maharashtra",
    lat: 17.2844,
    lng: 74.1849,
    rainfallAnomaly: -8.1,
    riskCategory: "BELOW_NORMAL",
    riskLabel: "Mild Deficit (-8.1 mm)",
    color: "#FACC15",
    breakSpellProbability: "40%",
    soilMoistureStatus: "52% (Moderate)",
    dominantCrop: "Sugarcane",
    spatialScopeNote: "Mock spatial polygon for UI visualization; ML output is currently regional prototype scale."
  },
  {
    id: "REG-MH-NAS-NIP",
    districtName: "Nashik",
    blockName: "Niphad",
    state: "Maharashtra",
    lat: 20.0768,
    lng: 74.1072,
    rainfallAnomaly: +14.2,
    riskCategory: "ABOVE_NORMAL",
    riskLabel: "Above Normal (+14.2 mm)",
    color: "#3B82F6", // Blue
    breakSpellProbability: "15%",
    soilMoistureStatus: "78% (Good)",
    dominantCrop: "Grapes & Maize",
    spatialScopeNote: "Mock spatial polygon for UI visualization; ML output is currently regional prototype scale."
  },
  {
    id: "REG-KA-BLR-DOD",
    districtName: "Bengaluru Rural",
    blockName: "Doddaballapura",
    state: "Karnataka",
    lat: 13.2929,
    lng: 77.5428,
    rainfallAnomaly: +2.4,
    riskCategory: "NORMAL",
    riskLabel: "Normal (+2.4 mm)",
    color: "#22C55E", // Green
    breakSpellProbability: "20%",
    soilMoistureStatus: "68% (Optimal)",
    dominantCrop: "Ragi",
    spatialScopeNote: "Mock spatial polygon for UI visualization; ML output is currently regional prototype scale."
  }
];
