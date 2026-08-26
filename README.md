# 🌦️ Weather Index

<div align="center">

### 🌍 AI-Powered Climate Intelligence Platform

**Understand • Predict • Prepare**

A modern climate intelligence platform designed to analyze rainfall anomalies, climate signals, monsoon risks, and regional weather patterns to support smarter decisions.

<br/>

![Weather Index](https://img.shields.io/badge/Weather-Index-00C8FF?style=for-the-badge&logo=icloud&logoColor=white)
![AI Powered](https://img.shields.io/badge/AI-Powered-7B61FF?style=for-the-badge&logo=openai&logoColor=white)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Vite](https://img.shields.io/badge/Vite-Fast-646CFF?style=for-the-badge&logo=vite&logoColor=white)

<br/>

### 🚀 Climate Intelligence for Smarter Decisions

</div>

---

## 🌐 Overview

**Weather Index** is an AI-powered climate intelligence platform focused on transforming complex climate and weather data into simple, actionable insights.

The platform combines:

- 🌧️ Rainfall anomaly analysis
- 🌊 Monsoon risk assessment
- 📡 Climate signal monitoring
- 🗺️ Regional climate intelligence
- 📊 Forecast visualization
- 🤖 AI-powered insights
- ⚠️ Risk assessment
- 📋 Climate reports
- 🌱 Agricultural vulnerability monitoring

The goal is simple:

> **Understand the climate → Predict upcoming changes → Prepare for potential risks.**

---

# ✨ Key Features

## 🌧️ Rainfall Anomaly Monitoring

Monitor deviations from normal rainfall patterns and understand whether a region is experiencing:

- Below-normal rainfall
- Normal rainfall
- Above-normal rainfall
- Historical deviations
- Predicted anomalies

The dashboard provides visual representations of historical observations and model projections.

---

## ⚠️ Monsoon Risk Assessment

Analyze the current monsoon phase and identify potential risks.

### Example

```text
MONSOON RISK PHASE

MODERATE
Break Risk

Break Spell Alert
65% Probability
```

---

## 📱 Twilio Setup

To enable real WhatsApp alert delivery in the daily monitoring scheduler:
1. Sign up for a free account at [twilio.com](https://www.twilio.com/).
2. Navigate to the Twilio Console and activate the **WhatsApp Sandbox**.
3. Copy your **Account SID** and **Auth Token**.
4. Open [`app.py`](file:///c:/Users/LEnobo/Downloads/SIH2026-main/SIH2026-main/app.py) and update the credentials in `send_whatsapp_alert()`:
   ```python
   TWILIO_SID = "YOUR_ACTUAL_TWILIO_ACCOUNT_SID"
   TWILIO_AUTH = "YOUR_ACTUAL_TWILIO_AUTH_TOKEN"
   ```
5. Update `SUBSCRIBERS` in `app.py` with verified subscriber phone numbers.
6. *(Note: If credentials remain as placeholders, the application will run all inference and forecast evaluations normally and log a graceful skip notice without crashing.)*

---

## 📊 Current Data Sources

| Feature / UI View | Service Endpoint / Method | Data Status | Description |
| :--- | :--- | :---: | :--- |
| **Interactive Prediction Simulator** | `POST /api/v1/predict-monsoon` (`apiService.evaluatePrediction`) | 🟢 **REAL** | Live regional TFLite regression model + Open-Meteo 16-day forecast API. |
| **Daily Automated Risk Check** | `POST /api/v1/trigger-daily-check` (`apiService.triggerDailyCheck`) | 🟢 **REAL** | Background APScheduler job comparing live forecast & model to district CSV baseline. |
| **Climate Signal Monitoring** | `apiService.getClimateSignals` | 🟡 **MOCK** | Static demonstration dataset for DMI, ONI, and MJO indices. |
| **Monsoon Risk Map (GIS)** | `apiService.getRiskMapData` | 🟡 **MOCK** | Static GeoJSON/district risk assessment data for map overlay. |
| **Agronomic Crop Advisories** | `apiService.getAdvisories` | 🟡 **MOCK** | Static rule-based agronomic recommendations. |
| **Crop Selector List** | `apiService.getCrops` | 🟡 **MOCK** | Static list of regional crops (Ragi, Maize, etc.). |
| **District Locations** | `apiService.getLocations` | 🟡 **MOCK** | Static metadata for Karnataka districts. |
| **Historical Anomaly Trends** | `apiService.getAnomalyTrends` | 🟡 **MOCK** | Static time-series chart data for dashboard visualization. |
| **Dashboard Latest Prediction** | `apiService.getLatestPrediction` | 🟡 **MOCK** | Static initial card data for dashboard view prior to running live simulator. |

---

## 📈 Model Version History

* **2026-08-26 (Model Promotion & Climatological Calibration):**
  * **Original Prototype Model (`monsoon_regional_model_OLD_underperforming.tflite`):** Underperformed a naive historical mean baseline on held-out test data (2019–2023) with an error of **98.85 mm MAE** vs. **57.76 mm baseline MAE**. It has been safely archived to `/archive-old-model/` alongside the full benchmark report.
  * **Promoted Live Model (`monsoon_regional_model.tflite`):** Retrained via [`train_model.py`](file:///c:/Users/LEnobo/Downloads/SIH2026-main/SIH2026-main/train_model.py) on [`karnataka_merged_data.csv`](file:///c:/Users/LEnobo/Downloads/SIH2026-main/SIH2026-main/karnataka_merged_data.csv) using a strict time-based split (Train: 2000–2018, Test: 2019–2023). Achieves **58.17 mm MAE** on held-out data.
  * **Technical Transparency Note:** The current model closely tracks the seasonal climatological baseline (58.17 mm vs. 57.76 mm). Macro climate signals (DMI, ONI, MJO) provide directional stability, but the system should be presented plainly as a regional risk & anomaly indicator rather than an overstated precision forecaster.

