import {
  mockPredictions,
  mockAnomalyTrends
} from '../data/mock/mockPredictions';

import {
  mockClimateSignals
} from '../data/mock/mockClimateSignals';

import {
  mockRiskData
} from '../data/mock/mockRiskData';

import {
  mockAdvisories
} from '../data/mock/mockAdvisories';

import {
  mockCrops
} from '../data/mock/mockCrops';

import {
  mockLocations
} from '../data/mock/mockLocations';


// ============================================================
// CONFIGURATION
// ============================================================

// FastAPI backend URL
const API_BASE_URL = 'http://localhost:8000/api/v1';


// ============================================================
// HELPER
// ============================================================

// Simulate delay only for mock APIs
const delay = (ms = 400) =>
  new Promise(resolve => setTimeout(resolve, ms));


// ============================================================
// API SERVICE
// ============================================================

export const apiService = {

  // ==========================================================
  // 1. FETCH LATEST PREDICTION
  // ==========================================================

  async getLatestPrediction() {
    await delay(350);

    return {
      success: true,
      data: mockPredictions[0]
    };
  },


  // ==========================================================
  // 2. REAL ML PREDICTION
  //
  // React
  //    ↓
  // FastAPI
  //    ↓
  // TensorFlow Lite Model
  //    ↓
  // Open-Meteo Forecast
  //    ↓
  // Prediction + Risk + Advisory
  // ==========================================================

  async evaluatePrediction(inputFeatures) {

    try {

      const payload = {

        // Location
        latitude: Number(
          inputFeatures.latitude ?? 13.29
        ),

        longitude: Number(
          inputFeatures.longitude ?? 77.55
        ),

        // Current month
        month: Number(
          inputFeatures.month ??
          new Date().getMonth() + 1
        ),

        // Crop
        crop_type:
          inputFeatures.crop_type ??
          inputFeatures.cropType ??
          'ragi',

        // Climate signals
        dmi: Number(
          inputFeatures.dmi ?? 0
        ),

        oni: Number(
          inputFeatures.oni ?? 0
        ),

        mjo_phase: Number(
          inputFeatures.mjo_phase ??
          inputFeatures.mjoPhase ??
          1
        ),

        mjo_amplitude: Number(
          inputFeatures.mjo_amplitude ??
          inputFeatures.mjoAmplitude ??
          1
        )
      };


      console.log(
        'Sending prediction request:',
        payload
      );


      const response = await fetch(
        `${API_BASE_URL}/predict-monsoon`,
        {
          method: 'POST',

          headers: {
            'Content-Type': 'application/json'
          },

          body: JSON.stringify(payload)
        }
      );


      // Handle backend errors
      if (!response.ok) {

        let errorMessage =
          'Prediction service failed';

        try {

          const errorData =
            await response.json();

          errorMessage =
            errorData.detail ||
            errorData.message ||
            errorMessage;

        } catch {
          // Ignore JSON parsing error
        }

        throw new Error(errorMessage);
      }


      // Get real backend result
      const result =
        await response.json();


      console.log(
        'Prediction response:',
        result
      );


      // ======================================================
      // CONVERT FASTAPI RESPONSE
      // INTO FRONTEND-FRIENDLY FORMAT
      // ======================================================

      const predictedRainfall =
        result.forecast
          ?.predicted_monthly_rainfall_mm ?? 0;

      const forecast14Day =
        result.forecast
          ?.['14_day_forecast_mm'] ?? 0;

      const riskLevel =
        result.risk_assessment
          ?.risk_level ?? 'LOW';

      const drySpellWarning =
        result.risk_assessment
          ?.dry_spell_warning ?? false;


      // Risk category for UI
      let riskCategory = 'NORMAL';
      let colorCode = '#22C55E';
      let breakPhaseRisk = 'LOW';


      if (
        riskLevel === 'HIGH' ||
        drySpellWarning
      ) {

        riskCategory = 'BREAK_RISK';
        colorCode = '#EF4444';
        breakPhaseRisk = 'CRITICAL';

      } else if (
        riskLevel === 'MEDIUM'
      ) {

        riskCategory = 'BELOW_NORMAL';
        colorCode = '#EAB308';
        breakPhaseRisk = 'MEDIUM';

      }


      // ======================================================
      // RETURN DATA
      // ======================================================

      return {

        success: true,

        data: {

          predictionId:
            `PRED-${Date.now()}`,

          timestamp:
            new Date().toISOString(),


          // Location
          location:
            result.location ?? {
              latitude: payload.latitude,
              longitude: payload.longitude
            },


          // Rainfall prediction
          predictedMonthlyRainfall:
            predictedRainfall,

          forecast14DayRainfall:
            forecast14Day,


          // Compatibility with older UI
          rainfallAnomaly:
            predictedRainfall,

          unit: 'mm',


          // Risk
          riskCategory,
          colorCode,
          breakPhaseRisk,

          drySpellWarning,
          riskLevel,


          // Advisory
          advisory: {
            crop:
              result.agronomic_advisory
                ?.crop ??
              payload.crop_type,

            english:
              result.agronomic_advisory
                ?.advisory_en ??
              '',

            kannada:
              result.agronomic_advisory
                ?.advisory_kn ??
              ''
          },


          // Original climate inputs
          inputs: {
            latitude: payload.latitude,
            longitude: payload.longitude,
            month: payload.month,
            crop_type: payload.crop_type,
            dmi: payload.dmi,
            oni: payload.oni,
            mjo_phase: payload.mjo_phase,
            mjo_amplitude:
              payload.mjo_amplitude
          },


          // Model metadata
          modelMetadata: {
            modelType:
              'TensorFlow Lite Monsoon Prediction Model',

            inference:
              'FastAPI Backend',

            features: [
              'latitude',
              'longitude',
              'month',
              'DMI',
              'ONI',
              'MJO Phase',
              'MJO Amplitude'
            ],

            forecastSource:
              'Open-Meteo',

            note:
              'Prediction generated using the deployed TensorFlow Lite model and weather forecast integration.'
          },


          // Preserve complete backend response
          rawResponse: result
        }
      };


    } catch (error) {

      console.error(
        'Prediction API Error:',
        error
      );


      return {

        success: false,

        error:
          error.message ||
          'Unable to connect to the prediction server.',

        data: null
      };
    }
  },


  // ==========================================================
  // 3. FETCH CLIMATE SIGNALS
  // ==========================================================
  // MOCK DATA - not yet connected to backend, see README
  async getClimateSignals() {

    await delay(300);

    return {
      success: true,
      data: mockClimateSignals
    };
  },


  // ==========================================================
  // 4. FETCH RISK MAP DATA
  // ==========================================================
  // MOCK DATA - not yet connected to backend, see README
  async getRiskMapData() {

    await delay(400);

    return {
      success: true,
      data: mockRiskData
    };
  },


  // ==========================================================
  // 5. FETCH ADVISORIES
  // ==========================================================
  // MOCK DATA - not yet connected to backend, see README
  async getAdvisories(
    cropId = null,
    riskCategory = null
  ) {

    await delay(300);

    let filtered =
      [...mockAdvisories];


    if (cropId) {

      filtered =
        filtered.filter(
          advisory =>
            advisory.cropId === cropId
        );
    }


    if (riskCategory) {

      filtered =
        filtered.filter(
          advisory =>
            advisory.riskCategory ===
            riskCategory
        );
    }


    return {
      success: true,
      data: filtered
    };
  },


  // ==========================================================
  // 6. FETCH CROPS
  // ==========================================================
  // MOCK DATA - not yet connected to backend, see README
  async getCrops() {

    await delay(200);

    return {
      success: true,
      data: mockCrops
    };
  },


  // ==========================================================
  // 7. FETCH LOCATIONS
  // ==========================================================
  // MOCK DATA - not yet connected to backend, see README
  async getLocations() {

    await delay(200);

    return {
      success: true,
      data: mockLocations
    };
  },


  // ==========================================================
  // 8. FETCH ANOMALY TRENDS
  // ==========================================================
  // MOCK DATA - not yet connected to backend, see README
  async getAnomalyTrends() {

    await delay(300);

    return {
      success: true,
      data: mockAnomalyTrends
    };
  },


  // ==========================================================
  // 9. MANUALLY TRIGGER DAILY MONSOON CHECK
  //
  // Useful for demo/testing
  // ==========================================================

  async triggerDailyCheck() {

    try {

      const response =
        await fetch(
          `${API_BASE_URL}/trigger-daily-check`,
          {
            method: 'POST'
          }
        );


      if (!response.ok) {

        throw new Error(
          'Unable to trigger daily monsoon check'
        );
      }


      const result =
        await response.json();


      return {
        success: true,
        data: result
      };


    } catch (error) {

      console.error(
        'Daily check error:',
        error
      );


      return {
        success: false,
        error: error.message
      };
    }
  }
};