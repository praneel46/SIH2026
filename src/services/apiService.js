import { mockPredictions, mockAnomalyTrends } from '../data/mock/mockPredictions';
import { mockClimateSignals } from '../data/mock/mockClimateSignals';
import { mockRiskData } from '../data/mock/mockRiskData';
import { mockAdvisories } from '../data/mock/mockAdvisories';
import { mockCrops } from '../data/mock/mockCrops';
import { mockLocations } from '../data/mock/mockLocations';

// Helper to simulate asynchronous Spring Boot REST response
const delay = (ms = 400) => new Promise(resolve => setTimeout(resolve, ms));

export const apiService = {
  // 1. Fetch latest prediction
  async getLatestPrediction() {
    await delay(350);
    return {
      success: true,
      data: mockPredictions[0]
    };
  },

  // 2. Simulate ML Prediction Execution (Emulates Spring Boot -> FastAPI TFLite inference)
  async evaluatePrediction(inputFeatures) {
    await delay(800); // Realistic ML inference delay

    const dmi = parseFloat(inputFeatures.dmi ?? 0.42);
    const dmi_lag1 = parseFloat(inputFeatures.dmi_lag1 ?? 0.35);
    const dmi_lag2 = parseFloat(inputFeatures.dmi_lag2 ?? 0.28);
    const month = parseInt(inputFeatures.month ?? 8, 10);

    // StandardScaler parameters from training:
    // mean  = [-0.2476, -0.2483, -0.2485, 0.00079, -0.00079]
    // scale = [0.3349, 0.3352, 0.3350, 0.7077, 0.7066]

    const month_sin = Math.sin((2 * Math.PI * month) / 12);
    const month_cos = Math.cos((2 * Math.PI * month) / 12);

    const scaled_dmi = (dmi - (-0.2476)) / 0.3349;
    const scaled_lag1 = (dmi_lag1 - (-0.2483)) / 0.3352;
    const scaled_lag2 = (dmi_lag2 - (-0.2485)) / 0.3350;
    const scaled_sin = (month_sin - 0.00079) / 0.7077;
    const scaled_cos = (month_cos - (-0.00079)) / 0.7066;

    // Emulate prototype regression weights (underfitting around mean)
    const simulatedAnomaly = parseFloat((-14.5 + dmi * 12.0 - dmi_lag1 * 6.5).toFixed(1));

    let riskCategory = "NORMAL";
    let colorCode = "#22C55E";
    let breakPhaseRisk = "LOW";

    if (simulatedAnomaly <= -20) {
      riskCategory = "BREAK_RISK";
      colorCode = "#EF4444";
      breakPhaseRisk = "CRITICAL";
    } else if (simulatedAnomaly < -5) {
      riskCategory = "BELOW_NORMAL";
      colorCode = "#EAB308";
      breakPhaseRisk = "MEDIUM";
    } else if (simulatedAnomaly > 10) {
      riskCategory = "ABOVE_NORMAL";
      colorCode = "#3B82F6";
      breakPhaseRisk = "LOW";
    }

    return {
      success: true,
      data: {
        predictionId: `PRED-${Date.now()}`,
        timestamp: new Date().toISOString(),
        rainfallAnomaly: simulatedAnomaly,
        unit: "mm (estimated deviation)",
        riskCategory,
        colorCode,
        breakPhaseRisk,
        inputs: { dmi, dmi_lag1, dmi_lag2, month, month_sin, month_cos },
        scaledInputs: [scaled_dmi, scaled_lag1, scaled_lag2, scaled_sin, scaled_cos],
        modelMetadata: {
          modelType: "TensorFlow Lite Prototype (Sequential)",
          inputShape: "[1, 5]",
          scaler: "z-score (StandardScaler)",
          note: "Regional signal inference. Spatial features pending retraining."
        }
      }
    };
  },

  // 3. Fetch Climate Signals
  async getClimateSignals() {
    await delay(300);
    return { success: true, data: mockClimateSignals };
  },

  // 4. Fetch Risk Map Polygons
  async getRiskMapData() {
    await delay(400);
    return { success: true, data: mockRiskData };
  },

  // 5. Fetch Advisories
  async getAdvisories(cropId = null, riskCategory = null) {
    await delay(300);
    let filtered = [...mockAdvisories];
    if (cropId) {
      filtered = filtered.filter(a => a.cropId === cropId);
    }
    if (riskCategory) {
      filtered = filtered.filter(a => a.riskCategory === riskCategory);
    }
    return { success: true, data: filtered };
  },

  // 6. Fetch Crops
  async getCrops() {
    await delay(200);
    return { success: true, data: mockCrops };
  },

  // 7. Fetch Locations
  async getLocations() {
    await delay(200);
    return { success: true, data: mockLocations };
  },

  // 8. Fetch Anomaly Trends
  async getAnomalyTrends() {
    await delay(300);
    return { success: true, data: mockAnomalyTrends };
  }
};
