# ==============================================================================
# app.py -- Monsoon Regional Inference API & Multi-Source Monitoring Service
# SIH26086: Weather Index Climate Intelligence Platform
#
# FEATURES:
# 1. TFLite Regional Model Inference (monsoon_regional_model.tflite)
# 2. Haversine Location-to-District Matching (resolve_district)
# 3. Multi-Source Meteorological Ensemble Forecasting:
#    - GFS (NOAA, USA)
#    - ICON (DWD, Germany)
#    - ECMWF IFS (Europe)
#    via Open-Meteo free aggregation API.
# 4. Historical Climatological Analysis (2000-2023 baseline from karnataka_merged_data.csv)
# 5. 70/30 Weighted Monthly Prediction Combining Ensemble Forecasts + Climatology
# 6. SQLite Prediction & Audit Database Logging (prediction_database.py)
# 7. Scheduled Daily Risk Monitoring & WhatsApp Dispatch
#
# HARD CONSTRAINT:
# Strictly read-only for ML artifacts. Logging only; NO automated retraining.
# ==============================================================================

from fastapi import FastAPI, Query
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Optional, List, Dict, Any
import numpy as np
import json
import requests
import uvicorn
import struct
from apscheduler.schedulers.background import BackgroundScheduler
from apscheduler.triggers.cron import CronTrigger
from datetime import datetime
import csv
import math

import prediction_database as db

app = FastAPI(
    title="Weather Index Monsoon Prediction & Monitoring API",
    version="2.0.0",
    description="Multi-Source Ensemble Forecasts, Climatological Baselines, and Regional TFLite Inference"
)

# Enable CORS for Vite frontend dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:3000",
        "http://127.0.0.1:3000"
    ],
    allow_origin_regex=".*",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ==============================================================================
# 0. DATABASE & ML ARTIFACT INITIALIZATION (READ-ONLY)
# ==============================================================================

# Initialize SQLite Database
db.init_db()

# Load StandardScaler Parameters
with open("scaler_params.json", "r", encoding="utf-8") as f:
    scaler_params = json.load(f)

MEANS = np.array(scaler_params["mean"], dtype=np.float32)
SCALES = np.array(scaler_params["scale"], dtype=np.float32)

# Universal TFLite Model Loader (TFLite Runtime / TensorFlow / FlatBuffers Fallback)
_tflite_interpreter = None
_tflite_weights = None

try:
    import ai_edge_litert.interpreter as _tflite_rt
    _tflite_interpreter = _tflite_rt.Interpreter(model_path="monsoon_regional_model.tflite")
    _tflite_interpreter.allocate_tensors()
except Exception:
    try:
        import tensorflow as tf
        _tflite_interpreter = tf.lite.Interpreter(model_path="monsoon_regional_model.tflite")
        _tflite_interpreter.allocate_tensors()
    except Exception:
        # Direct parsing of monsoon_regional_model.tflite FlatBuffers schema (Zero-dependency fallback)
        with open("monsoon_regional_model.tflite", "rb") as f:
            _buf = f.read()

        _root_pos = struct.unpack('<I', _buf[0:4])[0]
        _vtable_off = struct.unpack('<i', _buf[_root_pos:_root_pos+4])[0]
        _vtable_pos = _root_pos - _vtable_off
        _vtable_len = struct.unpack('<H', _buf[_vtable_pos:_vtable_pos+2])[0]
        _num_fields = (_vtable_len - 4) // 2
        _fields = [struct.unpack('<H', _buf[_vtable_pos + 4 + i*2 : _vtable_pos + 6 + i*2])[0] for i in range(_num_fields)]

        _buffers_field_offset = _fields[4]
        _buffers_vec_pos = _root_pos + _buffers_field_offset + struct.unpack('<I', _buf[_root_pos + _buffers_field_offset : _root_pos + _buffers_field_offset + 4])[0]
        _num_buffers = struct.unpack('<I', _buf[_buffers_vec_pos : _buffers_vec_pos + 4])[0]

        _buffers = {}
        for i in range(_num_buffers):
            _b_off = struct.unpack('<I', _buf[_buffers_vec_pos + 4 + i*4 : _buffers_vec_pos + 8 + i*4])[0]
            _b_pos = _buffers_vec_pos + 4 + i*4 + _b_off
            _bv_off = struct.unpack('<i', _buf[_b_pos : _b_pos+4])[0]
            _bv_pos = _b_pos - _bv_off
            _bv_len = struct.unpack('<H', _buf[_bv_pos : _bv_pos+2])[0]
            if _bv_len > 4:
                _df_off = struct.unpack('<H', _buf[_bv_pos+4 : _bv_pos+6])[0]
                if _df_off != 0:
                    _vec_off = struct.unpack('<I', _buf[_b_pos + _df_off : _b_pos + _df_off + 4])[0]
                    _d_pos = _b_pos + _df_off + _vec_off
                    _d_len = struct.unpack('<I', _buf[_d_pos : _d_pos + 4])[0]
                    _raw = _buf[_d_pos+4 : _d_pos+4+_d_len]
                    _buffers[i] = np.frombuffer(_raw, dtype=np.float32)

        _tflite_weights = {
            "W1": _buffers[6].reshape(16, 7),
            "b1": _buffers[7],
            "W2": _buffers[5].reshape(8, 16),
            "b2": _buffers[2],
            "W3": _buffers[4].reshape(1, 8),
            "b3": _buffers[3]
        }

# Load Crop Coefficients (FAO-56 Table 12 & Table 11)
with open("crop_coefficients.json", "r", encoding="utf-8") as f:
    CROP_COEFFICIENTS = json.load(f)

# Configurable threshold: if distance to nearest district centroid > 50km, flag low confidence
MAX_CONFIDENCE_DISTANCE_KM = 50.0

def load_district_centroids(csv_path: str = "karnataka_merged_data.csv") -> Dict[str, Dict[str, float]]:
    """Extracts unique district coordinate centroids from karnataka_merged_data.csv (read-only)."""
    districts = {}
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            d = r["District"]
            if d not in districts:
                districts[d] = {
                    "lat": float(r["Lat"]),
                    "lon": float(r["Lon"])
                }
    return districts

DISTRICT_CENTROIDS = load_district_centroids()

# ==============================================================================
# PART 0: LOCATION-TO-DISTRICT MATCHING (HAVERSINE)
# ==============================================================================

def haversine_km(lat1: float, lon1: float, lat2: float, lon2: float) -> float:
    """Calculates great-circle distance between two points on a sphere in kilometers."""
    R = 6371.0  # Earth mean radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat / 2.0) ** 2 +
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) *
         math.sin(dlon / 2.0) ** 2)
    c = 2.0 * math.atan2(math.sqrt(a), math.sqrt(1.0 - a))
    return R * c

def resolve_district(latitude: float, longitude: float) -> Dict[str, Any]:
    """
    Given an input latitude and longitude, finds the nearest of the 18 Karnataka districts
    in karnataka_merged_data.csv using the Haversine distance formula.
    Returns matched district name, distance in km, and a confidence flag.
    """
    min_dist = float("inf")
    best_district = "Bengaluru Rural"
    best_coords = {"lat": 13.29, "lon": 77.55}

    for district_name, coords in DISTRICT_CENTROIDS.items():
        dist = haversine_km(latitude, longitude, coords["lat"], coords["lon"])
        if dist < min_dist:
            min_dist = dist
            best_district = district_name
            best_coords = coords

    is_low_confidence = min_dist > MAX_CONFIDENCE_DISTANCE_KM

    return {
        "district": best_district,
        "distance_km": round(min_dist, 2),
        "low_confidence_match": is_low_confidence,
        "matched_centroid": best_coords
    }

# ==============================================================================
# PART 1: MULTI-SOURCE METEOROLOGICAL ENSEMBLE FORECASTING
# ==============================================================================
# Trusted Meteorological Sources:
# 1. GFS (Global Forecast System) - NOAA, USA (https://www.weather.gov/)
# 2. ICON (Icosahedral Nonhydrostatic) - DWD, Germany (https://www.dwd.de/)
# 3. ECMWF IFS (Integrated Forecasting System) - ECMWF, Europe (https://www.ecmwf.int/)
#
# Accessed via the free, open-source Open-Meteo aggregation API (https://open-meteo.com/).
# ==============================================================================

def fetch_single_model_forecast(lat: float, lon: float, model_param: str, days: int = 16) -> Optional[float]:
    """Fetches 16-day precipitation sum for a specific meteorological model via Open-Meteo."""
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}&daily=precipitation_sum"
        f"&timezone=auto&forecast_days={min(days, 16)}&models={model_param}"
    )
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            daily_vals = data.get("daily", {}).get("precipitation_sum", [])
            valid_vals = [float(v) for v in daily_vals if v is not None]
            if valid_vals:
                return round(sum(valid_vals), 2)
    except Exception as e:
        print(f"Warning: Failed to fetch {model_param} forecast: {e}")
    return None

def fetch_reference_et0(lat: float, lon: float, days: int = 16) -> float:
    """
    Fetches 16-day cumulative reference evapotranspiration (ET0) via Open-Meteo.
    Calculated using the FAO-56 Penman-Monteith equation (the exact method pairing with FAO-56 Kc values).
    Simplification note: ET0 is derived from standard atmospheric variables (temperature, humidity,
    radiation, wind); requesting from the primary forecast feed is sufficient rather than querying 3 separate feeds.
    """
    url = (
        f"https://api.open-meteo.com/v1/forecast"
        f"?latitude={lat}&longitude={lon}&daily=et0_fao_evapotranspiration"
        f"&timezone=auto&forecast_days={min(days, 16)}"
    )
    try:
        response = requests.get(url, timeout=10)
        if response.status_code == 200:
            data = response.json()
            daily_et0 = data.get("daily", {}).get("et0_fao_evapotranspiration", [])
            valid_et0 = [float(v) for v in daily_et0 if v is not None]
            if valid_et0:
                return round(sum(valid_et0), 2)
    except Exception as e:
        print(f"Warning: Failed to fetch ET0 data: {e}")
    return 0.0

def fetch_ensemble_forecast(lat: float, lon: float, days: int = 16) -> Dict[str, Any]:
    """
    Fetches 16-day forecasts from NOAA GFS, DWD ICON, and ECMWF IFS.
    Quantifies multi-model spread (max - min) and determines model agreement category.
    Also fetches 16-day cumulative reference evapotranspiration (ET0).
    """
    # 1. NOAA GFS
    gfs_val = fetch_single_model_forecast(lat, lon, "gfs_seamless", days)
    # 2. DWD ICON
    icon_val = fetch_single_model_forecast(lat, lon, "icon_seamless", days)
    # 3. ECMWF IFS (try ifs025 first, fallback to ifs04)
    ecmwf_val = fetch_single_model_forecast(lat, lon, "ecmwf_ifs025", days)
    if ecmwf_val is None:
        ecmwf_val = fetch_single_model_forecast(lat, lon, "ecmwf_ifs04", days)

    valid_forecasts = [v for v in [gfs_val, icon_val, ecmwf_val] if v is not None]
    sources_count = len(valid_forecasts)

    if sources_count > 0:
        ensemble_avg = sum(valid_forecasts) / sources_count
    else:
        # Fallback to standard open-meteo best-match if individual models fail
        fallback = fetch_single_model_forecast(lat, lon, "best_match", days)
        ensemble_avg = fallback if fallback is not None else 0.0
        sources_count = 1 if fallback is not None else 0

    # Multi-Model Spread & Uncertainty Quantification (Bug 2 Fix)
    if sources_count >= 2:
        spread_mm = round(max(valid_forecasts) - min(valid_forecasts), 2)
        spread_ratio = spread_mm / ensemble_avg if ensemble_avg > 0 else 0.0

        # Spread relative to ensemble mean:
        # > 60% relative spread = LOW agreement (high forecast uncertainty)
        # 25% - 60% relative spread = MODERATE agreement
        # <= 25% relative spread = HIGH agreement (strong model consensus)
        if spread_ratio > 0.60:
            model_agreement = "LOW"
            agreement_note = "Meteorological sources show significant disagreement for this forecast window - treat this prediction with additional caution."
        elif spread_ratio > 0.25:
            model_agreement = "MODERATE"
            agreement_note = "Meteorological sources show moderate spread across regional model solutions."
        else:
            model_agreement = "HIGH"
            agreement_note = "High model consensus across independent meteorological agencies."
    elif sources_count == 1:
        spread_mm = 0.0
        model_agreement = "INSUFFICIENT_SOURCES"
        agreement_note = "Single meteorological source available; uncertainty spread cannot be computed."
    else:
        spread_mm = 0.0
        model_agreement = "UNAVAILABLE"
        agreement_note = "Forecast data temporarily unavailable from all meteorological sources."

    # Reference Evapotranspiration (ET0) via FAO Penman-Monteith
    et0_val = fetch_reference_et0(lat, lon, days)

    return {
        "gfs_forecast_mm": gfs_val,
        "icon_forecast_mm": icon_val,
        "ecmwf_forecast_mm": ecmwf_val,
        "sources_succeeded_count": sources_count,
        "ensemble_forecast_16d_mm": round(ensemble_avg, 2),
        "spread_mm": spread_mm,
        "model_agreement": model_agreement,
        "agreement_note": agreement_note,
        "ensemble_et0_16d_mm": et0_val
    }

def fetch_forecast(lat: float, lon: float, days: int = 16) -> dict:
    """Legacy single-endpoint forecast wrapper for backward compatibility."""
    res = fetch_ensemble_forecast(lat, lon, days)
    return {
        "total_mm": res["ensemble_forecast_16d_mm"],
        "daily_values": []
    }

# ==============================================================================
# PART 2: HISTORICAL CLIMATOLOGICAL BASELINE
# ==============================================================================

def get_historical_climatology(district: str, month: int, csv_path: str = "karnataka_merged_data.csv") -> Dict[str, float]:
    """
    Computes historical mean and standard deviation of Rainfall_mm for the given
    district and month across all recorded years (2000-2023) in karnataka_merged_data.csv.
    """
    values = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for row in reader:
            if row["District"] == district and int(row["Month"]) == month:
                values.append(float(row["Rainfall_mm"]))

    if not values:
        return {"mean_mm": 0.0, "std_mm": 0.0, "sample_count": 0}

    mean_val = float(np.mean(values))
    std_val = float(np.std(values, ddof=1) if len(values) > 1 else 0.0)

    return {
        "mean_mm": round(mean_val, 2),
        "std_mm": round(std_val, 2),
        "sample_count": len(values)
    }

def get_historical_baseline(district: str, month: int) -> float:
    """Legacy helper returning historical average rainfall for a district and month."""
    stats = get_historical_climatology(district, month)
    return stats["mean_mm"]

# ==============================================================================
# PART 3: WEIGHTED COMBINATION & INFERENCE
# ==============================================================================

def run_model_inference(lat: float, lon: float, month: int, dmi: float, oni: float, mjo_phase: float, mjo_amplitude: float) -> float:
    """Executes inference using the deployed TFLite model."""
    raw_input = np.array([[lat, lon, month, dmi, oni, mjo_phase, mjo_amplitude]], dtype=np.float32)
    scaled_input = (raw_input - MEANS) / SCALES
    
    if _tflite_interpreter is not None:
        input_details = _tflite_interpreter.get_input_details()
        output_details = _tflite_interpreter.get_output_details()
        _tflite_interpreter.set_tensor(input_details[0]["index"], scaled_input.astype(np.float32))
        _tflite_interpreter.invoke()
        return float(_tflite_interpreter.get_tensor(output_details[0]["index"])[0][0])
    else:
        # Exact FlatBuffers forward pass (Keras Sequential: Dense16(relu) -> Dense8(relu) -> Dense1(linear))
        x = scaled_input[0]
        h1 = np.maximum(0.0, np.dot(_tflite_weights["W1"], x) + _tflite_weights["b1"])
        h2 = np.maximum(0.0, np.dot(_tflite_weights["W2"], h1) + _tflite_weights["b2"])
        y = np.dot(_tflite_weights["W3"], h2) + _tflite_weights["b3"]
        return float(y[0])

def compute_weighted_prediction(ensemble_16d_mm: float, historical_mean_mm: float) -> Dict[str, float]:
    """
    Combines near-term meteorological ensemble forecast with historical climatological mean.
    
    UNIT SCALING:
    Open-Meteo forecasts are 16-day sums. We scale this to a 30-day monthly equivalent
    (ensemble_16d_mm * 30/16) so both components share the same monthly mm basis.
    
    DESIGN RATIONALE:
    The 70/30 weighting favors the near-term ensemble forecast over the historical climatological
    mean, since forecast skill is generally higher than a pure historical average at this range -
    however, this exact ratio (70/30 rather than 60/40 or 80/20) is a starting design choice,
    not derived from validation against real outcomes. It should be tuned once enough real
    predicted-vs-actual data has been logged (see Part 4) to empirically determine the optimal
    weighting for this region. Note also that forecast reliability is not flat across the 16-day
    window (near-term days are more reliable than day 14-16) - this implementation treats the full
    16-day ensemble total as equally weighted internally, which is a simplification worth revisiting
    in a future iteration.
    """
    # Scale 16-day forecast to 30-day monthly equivalent estimate
    monthly_scaled_ensemble = ensemble_16d_mm * (30.0 / 16.0)

    # 70% Near-term meteorological ensemble + 30% Climatological baseline
    combined = (0.7 * monthly_scaled_ensemble) + (0.3 * historical_mean_mm)

    return {
        "monthly_scaled_ensemble_mm": round(monthly_scaled_ensemble, 2),
        "combined_prediction_mm": round(combined, 2)
    }

def evaluate_risk_and_advisory(deviation_pct: float, near_term_16d_mm: float, crop_type: str = "ragi") -> Dict[str, Any]:
    """
    UNIFIED SINGLE SOURCE OF TRUTH FOR RISK & ADVISORY GENERATION.
    
    DEVIATION THRESHOLDS (relative to historical climatological mean):
    - deviation_pct <= -30.0%          -> HIGH (Significant dry-spell / severe deficit risk)
    - -30.0% < deviation_pct <= -10.0% -> MODERATE (Moderate rainfall deficit risk)
    - -10.0% < deviation_pct < 10.0%   -> NORMAL (Optimal near-normal seasonal rainfall)
    - deviation_pct >= 10.0%           -> ABOVE_NORMAL (Excessive precipitation / waterlogging risk)
    """
    if deviation_pct <= -30.0:
        risk_category = "HIGH"
        dry_spell_warning = True
    elif deviation_pct <= -10.0:
        risk_category = "MODERATE"
        dry_spell_warning = True
    elif deviation_pct < 10.0:
        risk_category = "NORMAL"
        dry_spell_warning = False
    else:
        risk_category = "ABOVE_NORMAL"
        dry_spell_warning = False

    near_term_dry_flag = (near_term_16d_mm < 15.0)
    crop = crop_type.lower().strip()
    advisory_en = ""
    advisory_kn = ""

    if crop == "ragi":
        if risk_category == "HIGH":
            advisory_en = "High probability of severe dry spell. Delay Kharif sowing, create conservation furrows, and apply mulching to conserve root-zone soil moisture."
            advisory_kn = "ತೀವ್ರ ಶುಷ್ಕ ವಾತಾವರಣದ ಹೆಚ್ಚಿನ ಸಾಧ್ಯತೆ. ಖಾರೀಫ್ ಬಿತ್ತನೆಯನ್ನು ವಿಳಂಬಗೊಳಿಸಿ, ತೇವಾಂಶ ಸಂರಕ್ಷಣಾ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ."
        elif risk_category == "MODERATE":
            advisory_en = "Moderate rainfall deficit anticipated. Adopt drought-hardy ragi cultivars (e.g., GPU-28/ML-365) and prepare supplementary micro-irrigation."
            advisory_kn = "ಮಧ್ಯಮ ಪ್ರಮಾಣದ ಮಳೆ ಕೊರತೆ ಸಾಧ್ಯತೆ. ಬರ ಸಹಿಷ್ಣು ರಾಗಿ ತಳಿಗಳನ್ನು ಆಯ್ಕೆ ಮಾಡಿ ಹಾಗೂ ಪೂರಕ ನೀರಾವರಿಗೆ ಸಿದ್ಧತೆ ಮಾಡಿಕೊಳ್ಳಿ."
        elif risk_category == "NORMAL":
            advisory_en = "Optimal soil moisture expected. Proceed with standard nursery bed preparation, line sowing, and basal fertilizer application."
            advisory_kn = "ಉತ್ತಮ ಮಳೆಯ ನಿರೀಕ್ಷೆಯಿದೆ. ಸಸಿಮಡಿ ಸಿದ್ಧತೆ, ಸಾಲು ಬಿತ್ತನೆ ಮತ್ತು ಗೊಬ್ಬರ ನಿರ್ವಹಣೆಗೆ ಸೂಕ್ತ ಸಮಯ."
        else:  # ABOVE_NORMAL
            advisory_en = "Excessive precipitation predicted. Clear drainage channels across crop fields to prevent waterlogging and seed rot."
            advisory_kn = "ಹೆಚ್ಚಿನ ಮಳೆಯ ಸಾಧ್ಯತೆ. ಹೊಲಗಳಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಹೆಚ್ಚುವರಿ ನೀರು ಹೊರಹೋಗಲು ಚರಂಡಿ ವ್ಯವಸ್ಥೆ ಮಾಡಿ."

    elif crop == "maize":
        if risk_category == "HIGH":
            advisory_en = "Severe dry spell alert. Postpone maize sowing to prevent seed desiccation and seedling mortality; ensure drip line readiness."
            advisory_kn = "ತೀವ್ರ ಮಳೆ ಕೊರತೆ ಎಚ್ಚರಿಕೆ. ಬೀಜ ಒಣಗಿ ಹೋಗುವುದನ್ನು ತಪ್ಪಿಸಲು ಮೆಕ್ಕೆಜೋಳ ಬಿತ್ತನೆಯನ್ನು ಮುಂದೂಡಿ."
        elif risk_category == "MODERATE":
            advisory_en = "Below-normal precipitation expected. Perform broad bed and furrow planting to maximize in-situ rain water harvesting."
            advisory_kn = "ಸಾಧಾರಣ ಮಳೆ ಕೊರತೆ ಸಾಧ್ಯತೆ. ಮಳೆ ನೀರು ಇಂಗಿಸಲು ಸಾಲು ಮತ್ತು ಬದು ಪದ್ಧತಿಯಲ್ಲಿ ಬಿತ್ತನೆ ಮಾಡಿ."
        elif risk_category == "NORMAL":
            advisory_en = "Favorable monsoon conditions. Proceed with ridge-and-furrow planting, weed management, and seed treatment."
            advisory_kn = "ಅನುಕೂಲಕರ ವಾತಾವರಣ. ಬಿತ್ತನೆ ಕಾರ್ಯವನ್ನು ಮುಂದುವರಿಸಿ ಹಾಗೂ ಕಳೆ ನಿರ್ವಹಣೆ ಕೈಗೊಳ್ಳಿ."
        else:  # ABOVE_NORMAL
            advisory_en = "Heavy rainfall risk. Provide rapid field drainage to avoid root hypoxia and delay top-dressing nitrogen fertilization."
            advisory_kn = "ಭಾರೀ ಮಳೆಯ ಎಚ್ಚರಿಕೆ. ಬೇರುಗಳು ಕೊಳೆಯುವುದನ್ನು ತಡೆಯಲು ತಕ್ಷಣವೇ ನೀರು ಬಸಿದು ಹೋಗುವಂತೆ ಮಾಡಿ."

    else:  # General crops fallback
        if risk_category == "HIGH":
            advisory_en = "Substantial seasonal rainfall deficit detected. Defer sensitive sowing and prioritize water-harvesting storage."
            advisory_kn = "ಗಣನೀಯ ಮಳೆ ಕೊರತೆಯ ಮುನ್ಸೂಚನೆ. ಸೂಕ್ಷ್ಮ ಬೆಳೆಗಳ ಬಿತ್ತನೆ ಮುಂದೂಡಿ ಹಾಗೂ ನೀರು ಸಂರಕ್ಷಣೆಗೆ ಆದ್ಯತೆ ನೀಡಿ."
        elif risk_category == "MODERATE":
            advisory_en = "Moderate moisture stress expected. Apply protective irrigation and reduce plant population density."
            advisory_kn = "ಮಧ್ಯಮ ತೇವಾಂಶ ಕೊರತೆ. ಅಗತ್ಯವಿದ್ದಲ್ಲಿ ರಕ್ಷಣಾತ್ಮಕ ನೀರಾವರಿ ಒದಗಿಸಿ."
        elif risk_category == "NORMAL":
            advisory_en = "Normal seasonal conditions forecast. Proceed with scheduled agronomic operations according to seasonal package of practice."
            advisory_kn = "ಸಾಮಾನ್ಯ ಮಳೆಯ ಮುನ್ಸೂಚನೆ. ಶಿಫಾರಸು ಮಾಡಿದ ಕೃಷಿ ಪದ್ಧತಿಗಳಂತೆ ಕಾರ್ಯಗಳನ್ನು ಮುಂದುವರಿಸಿ."
        else:  # ABOVE_NORMAL
            advisory_en = "Surplus precipitation anticipated. Inspect field bunds, maintain drainage outlets, and safeguard harvested produce."
            advisory_kn = "ಹೆಚ್ಚುವರಿ ಮಳೆಯ ನಿರೀಕ್ಷೆ. ಹೊಲದ ಬದುಗಳನ್ನು ಪರಿಶೀಲಿಸಿ ಮತ್ತು ನೀರು ಸರಾಗವಾಗಿ ಹರಿಯಲು ಅನುವು ಮಾಡಿಕೊಡಿ."

    return {
        "risk_category": risk_category,
        "dry_spell_warning": dry_spell_warning,
        "near_term_dry_flag": near_term_dry_flag,
        "advisory_en": advisory_en,
        "advisory_kn": advisory_kn
    }

# ==============================================================================
# PART 4: CROP WATER REQUIREMENT ANALYSIS (FAO-56 PENMAN-MONTEITH METHOD)
# ==============================================================================

def evaluate_crop_water_balance(crop_type: str, ensemble_16d_precip_mm: float, ensemble_16d_et0_mm: float) -> Dict[str, Any]:
    """
    Evaluates crop-specific water requirement and irrigation balance using
    standard FAO Irrigation and Drainage Paper 56 principles.
    
    FORMULA:
      ETc (Crop Water Need, mm) = Kc (Crop Coefficient) * ET0 (Reference Evapotranspiration, mm)
      Water Balance (mm) = 16-day Precipitation - ETc
      
    SCOPE (Top 5 Kharif Crops in Karnataka):
      Ragi (Finger Millet), Maize, Jowar (Sorghum), Groundnut, Cotton.
      (Scope note: Prototype focused on top 5 regional crops; extensible to additional crops via crop_coefficients.json).
      
    GROWTH STAGE ASSUMPTION NOTE:
      Actual stage depends on sowing date, which is not yet tracked by this system.
      Defaulting to peak-demand 'mid_season' stage as a conservative irrigation planning estimate.
    """
    crop_key = crop_type.lower().strip()
    if crop_key not in CROP_COEFFICIENTS:
        return {
            "status": "unsupported_crop",
            "message": f"Crop '{crop_type}' is not yet supported in this prototype. Currently supported crops are: Ragi, Maize, Jowar, Groundnut, Cotton.",
            "supported_crops": ["ragi", "maize", "jowar", "groundnut", "cotton"]
        }

    crop_data = CROP_COEFFICIENTS[crop_key]
    kc_mid = crop_data["kc_mid"]

    # Calculate actual 16-day crop evapotranspiration demand (ETc = Kc * ET0)
    etc_16d_mm = round(kc_mid * ensemble_16d_et0_mm, 2)

    # Calculate 16-day water balance (Precipitation - ETc)
    water_balance_mm = round(ensemble_16d_precip_mm - etc_16d_mm, 2)

    # Classification into irrigation status
    if water_balance_mm < -10.0:
        water_status = "IRRIGATION_NEEDED"
        irrigation_gap_mm = int(round(abs(water_balance_mm) / 5.0) * 5)
        guidance = f"Approximately {irrigation_gap_mm} mm of supplemental irrigation may be needed over the next 16 days to meet peak mid-season crop demand."
    elif water_balance_mm <= 30.0:
        water_status = "SUFFICIENT"
        irrigation_gap_mm = 0
        guidance = "Rainfall is roughly sufficient to cover estimated crop evapotranspiration needs over the next 16 days."
    else:
        water_status = "SURPLUS"
        irrigation_gap_mm = 0
        guidance = f"Estimated rainfall exceeds crop water requirement by {round(water_balance_mm, 1)} mm. Ensure proper field drainage to prevent waterlogging."

    return {
        "status": "success",
        "crop": crop_key,
        "crop_display_name_en": crop_data["display_name_en"],
        "crop_display_name_kn": crop_data["display_name_kn"],
        "growth_stage_assumed": "mid_season",
        "stage_note": "Actual stage depends on sowing date, not yet tracked by this system - defaulting to peak-demand mid_season stage as a conservative estimate.",
        "kc_used": kc_mid,
        "stage_length_days": crop_data["stage_length_days"],
        "etc_16d_mm": etc_16d_mm,
        "ensemble_16d_precip_mm": ensemble_16d_precip_mm,
        "reference_et0_16d_mm": ensemble_16d_et0_mm,
        "water_balance_mm": water_balance_mm,
        "water_status": water_status,
        "irrigation_gap_mm": irrigation_gap_mm if water_status == "IRRIGATION_NEEDED" else None,
        "irrigation_guidance": guidance,
        "methodology_and_sources": {
            "formula": "ETc = Kc * ET0 (FAO Penman-Monteith method, FAO Irrigation and Drainage Paper 56)",
            "kc_source": "FAO-56 Chapter 6 Table 12: Crop coefficients for irrigation",
            "et0_source": "Open-Meteo FAO Penman-Monteith daily reference evapotranspiration",
            "crop_specific_note": crop_data["source_note"]
        }
    }

# ==============================================================================
# TWILIO WHATSAPP DISPATCH & SUBSCRIBERS LIST
# ==============================================================================

def send_whatsapp_alert(phone_number: str, message: str):
    """Twilio WhatsApp send -- fails gracefully when credentials are not configured."""
    TWILIO_SID = "YOUR_TWILIO_ACCOUNT_SID"
    TWILIO_AUTH = "YOUR_TWILIO_AUTH_TOKEN"
    TWILIO_WHATSAPP_FROM = "whatsapp:+14155238886"

    if (
        TWILIO_SID == "YOUR_TWILIO_ACCOUNT_SID"
        or TWILIO_AUTH == "YOUR_TWILIO_AUTH_TOKEN"
        or "XXXXXXXXXX" in phone_number
    ):
        print(f"Twilio not configured - skipping WhatsApp send to {phone_number}, see setup instructions in README.")
        return

    try:
        from twilio.rest import Client
        client = Client(TWILIO_SID, TWILIO_AUTH)
        client.messages.create(
            body=message,
            from_=TWILIO_WHATSAPP_FROM,
            to=f"whatsapp:{phone_number}",
        )
        print(f"WhatsApp alert sent to {phone_number}")
    except Exception as e:
        print(f"WhatsApp send failed for {phone_number}: {e}")

SUBSCRIBERS = [
    {"district": "Bengaluru Rural", "lat": 13.29, "lon": 77.55, "phone": "+91XXXXXXXXXX", "crop": "ragi"},
    {"district": "Mysuru", "lat": 12.30, "lon": 76.65, "phone": "+91XXXXXXXXXX", "crop": "maize"},
]

# ==============================================================================
# PART 5: DAILY SCHEDULED MONSOON MONITORING WITH DATABASE LOGGING
# ==============================================================================

def daily_monsoon_check():
    """
    Automated daily job:
    1. Resolves district coordinates with Haversine distance.
    2. Fetches 3-model meteorological ensemble forecast (GFS, ICON, ECMWF).
    3. Retrieves historical baseline climatology (mean + std dev).
    4. Computes 70/30 weighted combined prediction.
    5. Runs TFLite regional model inference.
    6. Logs full record to SQLite database for future manual validation/retraining.
    7. Sends WhatsApp alert if dry spell or significant anomaly is detected.
    """
    print(f"[{datetime.now()}] Running daily monsoon check with multi-source ensemble & database logging...")
    today = datetime.now()

    for sub in SUBSCRIBERS:
        # Resolve district from coordinates
        resolved = resolve_district(sub["lat"], sub["lon"])
        district_name = resolved["district"]

        # Climate signals placeholder
        dmi, oni, mjo_phase, mjo_amp = 0.1, -0.3, 4.0, 1.0

        # 1. TFLite Model Raw Inference
        predicted_monthly_tflite = run_model_inference(
            sub["lat"], sub["lon"], today.month, dmi, oni, mjo_phase, mjo_amp
        )

        # 2. Multi-Source Meteorological Ensemble
        ensemble = fetch_ensemble_forecast(sub["lat"], sub["lon"], days=16)

        # 3. Climatological Historical Baseline
        climatology = get_historical_climatology(district_name, today.month)
        hist_mean = climatology["mean_mm"]
        hist_std = climatology["std_mm"]

        # 4. Weighted Combined Prediction
        weighted_res = compute_weighted_prediction(ensemble["ensemble_forecast_16d_mm"], hist_mean)
        combined_pred = weighted_res["combined_prediction_mm"]

        # 5. Unified Risk & Advisory Evaluation (Bug 1 Fix)
        deviation_pct = (
            ((combined_pred - hist_mean) / hist_mean * 100)
            if hist_mean > 0 else 0
        )
        eval_res = evaluate_risk_and_advisory(deviation_pct, ensemble["ensemble_forecast_16d_mm"], sub["crop"])
        risk_category = eval_res["risk_category"]

        # Advisory message text
        advisory_msg = (
            f"Monsoon Alert - {district_name}\n"
            f"Risk Level: {risk_category} ({deviation_pct:.1f}% vs normal)\n"
            f"Combined prediction: {combined_pred:.1f}mm (historical avg: {hist_mean:.1f}mm)\n"
            f"16-day ensemble: {ensemble['ensemble_forecast_16d_mm']:.1f}mm "
            f"(GFS: {ensemble['gfs_forecast_mm']}mm, ICON: {ensemble['icon_forecast_mm']}mm, ECMWF: {ensemble['ecmwf_forecast_mm']}mm)\n"
            f"Model Agreement: {ensemble['model_agreement']} (spread: {ensemble['spread_mm']}mm)\n"
            f"Advisory: {eval_res['advisory_en']}"
        )

        # 6. Log everything to SQLite Database (Part 4 + Bug 2 Fix)
        log_record = {
            "timestamp": datetime.now().isoformat(),
            "district": district_name,
            "latitude": sub["lat"],
            "longitude": sub["lon"],
            "district_distance_km": resolved["distance_km"],
            "low_confidence_match": resolved["low_confidence_match"],
            "month": today.month,
            "year": today.year,
            "gfs_forecast_mm": ensemble["gfs_forecast_mm"],
            "icon_forecast_mm": ensemble["icon_forecast_mm"],
            "ecmwf_forecast_mm": ensemble["ecmwf_forecast_mm"],
            "sources_succeeded_count": ensemble["sources_succeeded_count"],
            "ensemble_forecast_mm": ensemble["ensemble_forecast_16d_mm"],
            "spread_mm": ensemble["spread_mm"],
            "model_agreement": ensemble["model_agreement"],
            "historical_mean_mm": hist_mean,
            "historical_std_mm": hist_std,
            "combined_prediction_mm": combined_pred,
            "model_raw_prediction_mm": round(predicted_monthly_tflite, 2),
            "risk_category": risk_category,
            "advisory_given": eval_res["advisory_en"],
            "actual_rainfall_mm": None
        }

        try:
            log_id = db.insert_prediction(log_record)
            print(f"Logged daily prediction [ID: {log_id}] for {district_name} (Combined: {combined_pred}mm, Risk: {risk_category}, Agreement: {ensemble['model_agreement']})")
        except Exception as e:
            print(f"Database logging error for {district_name}: {e}")

        # 7. Dispatch WhatsApp alert if risk is elevated
        if eval_res["dry_spell_warning"] or risk_category in ["HIGH", "ABOVE_NORMAL"]:
            send_whatsapp_alert(sub["phone"], advisory_msg)
        else:
            print(f"{district_name}: normal conditions, no alert sent")

# Scheduler setup
scheduler = BackgroundScheduler()
scheduler.add_job(daily_monsoon_check, CronTrigger(hour=0, minute=0))
scheduler.start()

@app.on_event("shutdown")
def shutdown_scheduler():
    scheduler.shutdown()

# ==============================================================================
# PART 6: FASTAPI ENDPOINTS (API SCHEMAS & ROUTES)
# ==============================================================================

class PredictionRequest(BaseModel):
    latitude: float
    longitude: float
    month: int
    crop_type: str = "ragi"
    dmi: float = 0.0
    oni: float = 0.0
    mjo_phase: float = 1.0
    mjo_amplitude: float = 1.0

class EnsembleCheckRequest(BaseModel):
    latitude: float
    longitude: float
    month: Optional[int] = None
    crop_type: str = "ragi"
    dmi: float = 0.1
    oni: float = -0.3
    mjo_phase: float = 4.0
    mjo_amplitude: float = 1.0

@app.post("/api/v1/trigger-daily-check")
def trigger_daily_check_manually():
    """Manually triggers the daily monsoon check and database logging."""
    daily_monsoon_check()
    return {"status": "daily check triggered manually"}

@app.post("/api/v1/trigger-ensemble-check")
def trigger_ensemble_check(req: EnsembleCheckRequest):
    """
    Executes the multi-source ensemble forecast, historical climatological comparison,
    TFLite inference, and 70/30 weighted combination for any location.
    Logs the full record to SQLite and returns the complete decision breakdown.
    """
    target_month = req.month if req.month is not None else datetime.now().month
    target_year = datetime.now().year

    # 1. Location-to-District Matching (Part 0)
    resolved = resolve_district(req.latitude, req.longitude)
    district_name = resolved["district"]

    # 2. Multi-Source Meteorological Ensemble (Part 1)
    ensemble = fetch_ensemble_forecast(req.latitude, req.longitude, days=16)

    # 3. Climatological Historical Baseline (Part 2)
    climatology = get_historical_climatology(district_name, target_month)
    hist_mean = climatology["mean_mm"]
    hist_std = climatology["std_mm"]

    # 4. TFLite Regional Model Inference
    model_raw = run_model_inference(
        req.latitude, req.longitude, target_month,
        req.dmi, req.oni, req.mjo_phase, req.mjo_amplitude
    )

    # 5. Weighted Combination (Part 3)
    weighted_res = compute_weighted_prediction(ensemble["ensemble_forecast_16d_mm"], hist_mean)
    combined_pred = weighted_res["combined_prediction_mm"]

    # 6. Unified Risk & Advisory Evaluation (Bug 1 Fix)
    deviation_pct = (
        ((combined_pred - hist_mean) / hist_mean * 100)
        if hist_mean > 0 else 0
    )
    eval_res = evaluate_risk_and_advisory(deviation_pct, ensemble["ensemble_forecast_16d_mm"], req.crop_type)

    # 7. Crop-Specific Water Requirement Analysis (FAO-56)
    water_balance_analysis = evaluate_crop_water_balance(
        req.crop_type,
        ensemble["ensemble_forecast_16d_mm"],
        ensemble["ensemble_et0_16d_mm"]
    )

    # 8. Database Logging (Part 4 + Bug 2 Schema Update)
    log_record = {
        "timestamp": datetime.now().isoformat(),
        "district": district_name,
        "latitude": req.latitude,
        "longitude": req.longitude,
        "district_distance_km": resolved["distance_km"],
        "low_confidence_match": resolved["low_confidence_match"],
        "month": target_month,
        "year": target_year,
        "gfs_forecast_mm": ensemble["gfs_forecast_mm"],
        "icon_forecast_mm": ensemble["icon_forecast_mm"],
        "ecmwf_forecast_mm": ensemble["ecmwf_forecast_mm"],
        "sources_succeeded_count": ensemble["sources_succeeded_count"],
        "ensemble_forecast_mm": ensemble["ensemble_forecast_16d_mm"],
        "spread_mm": ensemble["spread_mm"],
        "model_agreement": ensemble["model_agreement"],
        "historical_mean_mm": hist_mean,
        "historical_std_mm": hist_std,
        "combined_prediction_mm": combined_pred,
        "model_raw_prediction_mm": round(model_raw, 2),
        "risk_category": eval_res["risk_category"],
        "advisory_given": eval_res["advisory_en"],
        "actual_rainfall_mm": None
    }

    log_id = db.insert_prediction(log_record)

    return {
        "status": "success",
        "log_id": log_id,
        "location": {
            "query_latitude": req.latitude,
            "query_longitude": req.longitude,
            "matched_district": district_name,
            "distance_to_district_centroid_km": resolved["distance_km"],
            "low_confidence_match": resolved["low_confidence_match"],
            "note": "Historical baseline derived from nearest available Karnataka district dataset" if resolved["low_confidence_match"] else "Authoritative district match"
        },
        "meteorological_ensemble_sources": {
            "gfs_noaa_usa_16d_mm": ensemble["gfs_forecast_mm"],
            "icon_dwd_germany_16d_mm": ensemble["icon_forecast_mm"],
            "ecmwf_ifs_europe_16d_mm": ensemble["ecmwf_forecast_mm"],
            "sources_succeeded_count": ensemble["sources_succeeded_count"],
            "ensemble_16d_mean_mm": ensemble["ensemble_forecast_16d_mm"],
            "spread_mm": ensemble["spread_mm"],
            "model_agreement": ensemble["model_agreement"],
            "agreement_note": ensemble["agreement_note"],
            "monthly_scaled_ensemble_mm": weighted_res["monthly_scaled_ensemble_mm"],
            "scaling_note": "16-day ensemble scaled to 30-day equivalent basis via * (30/16)"
        },
        "historical_climatology": {
            "district": district_name,
            "month": target_month,
            "historical_mean_mm": hist_mean,
            "historical_std_mm": hist_std,
            "period": "2000-2023 (karnataka_merged_data.csv)"
        },
        "prediction_synthesis": {
            "combined_70_30_prediction_mm": combined_pred,
            "tflite_model_prediction_mm": round(model_raw, 2),
            "weighting_formula": "0.7 * monthly_scaled_ensemble + 0.3 * historical_mean",
            "deviation_from_historical_pct": round(deviation_pct, 1)
        },
        "risk_assessment": {
            "risk_category": eval_res["risk_category"],
            "dry_spell_warning": eval_res["dry_spell_warning"],
            "near_term_dry_flag": eval_res["near_term_dry_flag"],
            "evaluation_basis": "Unified deviation of combined prediction vs. historical climatological baseline"
        },
        "crop_water_analysis": water_balance_analysis,
        "agronomic_advisory": {
            "crop": req.crop_type.capitalize(),
            "advisory_en": eval_res["advisory_en"],
            "advisory_kn": eval_res["advisory_kn"]
        }
    }

@app.get("/api/v1/prediction-history")
def get_prediction_history(district: Optional[str] = Query(None, description="Optional district name filter"), limit: int = Query(10, ge=1, le=100)):
    """Retrieves logged prediction records from the SQLite database."""
    records = db.get_recent_predictions(district=district, limit=limit)
    return {
        "status": "success",
        "count": len(records),
        "district_filter": district,
        "records": records
    }

@app.post("/api/v1/predict-monsoon")
def predict_monsoon(req: PredictionRequest):
    """
    Primary endpoint for TFLite inference + Open-Meteo forecast,
    now using unified risk classification and advisory logic.
    """
    predicted_monthly_rain = run_model_inference(
        req.latitude, req.longitude, req.month,
        req.dmi, req.oni, req.mjo_phase, req.mjo_amplitude
    )
    forecast = fetch_forecast(req.latitude, req.longitude, days=16)

    # Resolve district to get historical baseline for unified comparison
    resolved = resolve_district(req.latitude, req.longitude)
    climatology = get_historical_climatology(resolved["district"], req.month)
    hist_mean = climatology["mean_mm"]

    deviation_pct = (
        ((predicted_monthly_rain - hist_mean) / hist_mean * 100)
        if hist_mean > 0 else 0
    )
    eval_res = evaluate_risk_and_advisory(deviation_pct, forecast["total_mm"], req.crop_type)

    return {
        "status": "success",
        "location": {
            "latitude": req.latitude,
            "longitude": req.longitude,
            "matched_district": resolved["district"]
        },
        "forecast": {
            "month": req.month,
            "predicted_monthly_rainfall_mm": round(predicted_monthly_rain, 2),
            "14_day_forecast_mm": round(forecast["total_mm"], 2),
            "historical_baseline_mm": hist_mean,
            "deviation_pct": round(deviation_pct, 1)
        },
        "risk_assessment": {
            "risk_category": eval_res["risk_category"],
            "dry_spell_warning": eval_res["dry_spell_warning"],
            "near_term_dry_flag": eval_res["near_term_dry_flag"],
            "risk_level": eval_res["risk_category"]
        },
        "agronomic_advisory": {
            "crop": req.crop_type.capitalize(),
            "advisory_en": eval_res["advisory_en"],
            "advisory_kn": eval_res["advisory_kn"]
        },
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
