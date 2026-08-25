export const mockAdvisories = [
  {
    id: "ADV-RAGI-DEFICIT",
    cropId: "CROP-RAGI",
    cropName: "Ragi",
    riskCategory: "BELOW_NORMAL",
    urgency: "MODERATE",
    title: "Soil Moisture Conservation & Protective Irrigation Notice",
    summary: "Predicted rainfall anomaly is below normal (-18.4 mm). Ragi is drought-resilient but requires soil moisture management.",
    actionPoints: [
      "Conduct shallow inter-cultivation or mulching with crop residue to reduce evaporation losses.",
      "If dry spell exceeds 10 consecutive days during flowering phase, provide micro-irrigation or life-saving protective irrigation.",
      "Delay top dressing of nitrogenous fertilizers until rainfall activity resumes."
    ],
    irrigationGuidance: "Alternate furrow irrigation recommended if groundwater reserves allow.",
    broadcastDate: "2026-08-25"
  },
  {
    id: "ADV-RICE-BREAK",
    cropId: "CROP-RICE",
    cropName: "Rice (Paddy)",
    riskCategory: "BREAK_RISK",
    urgency: "HIGH",
    title: "Critical Break Phase Water Allocation Alert",
    summary: "High break phase risk detected. Paddy fields are vulnerable to moisture stress during panicle initiation.",
    actionPoints: [
      "Maintain saturation level instead of continuous standing water to conserve farm pond storage.",
      "Apply anti-transparent spray (such as Kaolin 5%) if dry spell persists beyond 7 days.",
      "Prioritize canal/borewell water allocation to fields currently in tillering/heading stage."
    ],
    irrigationGuidance: "Strict deficit irrigation scheduling; avoid unmonitored flooding.",
    broadcastDate: "2026-08-24"
  },
  {
    id: "ADV-MAIZE-SURPLUS",
    cropId: "CROP-MAIZE",
    cropName: "Maize",
    riskCategory: "ABOVE_NORMAL",
    urgency: "LOW",
    title: "Field Drainage & Fungal Disease Prevention Guidance",
    summary: "Above normal precipitation predicted. Prevent waterlogging in low-lying maize plots.",
    actionPoints: [
      "Clear drainage channels to prevent stagnant water around root zones.",
      "Inspect leaves for Turcicum leaf blight or rust symptoms following prolonged wet spells.",
      "Apply earthing up operation to provide structural support against strong winds."
    ],
    irrigationGuidance: "Suspend artificial irrigation until topsoil dries below field capacity.",
    broadcastDate: "2026-08-23"
  }
];
