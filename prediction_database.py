# ==============================================================================
# prediction_database.py -- SQLite Database Layer for Monsoon Prediction Logging
# SIH26086: Weather Index Climate Intelligence Platform
#
# PURPOSE:
# Logs multi-source meteorological ensemble forecasts, historical climatological
# baselines, TFLite regional model predictions, multi-model spread/agreement,
# and weighted combination outputs. Stores historical prediction records to
# enable future offline evaluation, manual retraining, and empirical weighting
# calibration against observed ground truth.
#
# HARD CONSTRAINT:
# Strictly logging only. No automated retraining or online weight adaptation.
#
# ==============================================================================
# PROPOSED DATABASE SCHEMA:
# ==============================================================================
# TABLE: predictions_log
# ------------------------------------------------------------------------------
# Column Name              | Type    | Constraints | Description
# -------------------------+---------+-------------+----------------------------
# id                       | INTEGER | PRIMARY KEY | Unique auto-incrementing ID
# timestamp                | TEXT    | NOT NULL    | ISO-8601 UTC/Local timestamp
# district                 | TEXT    | NOT NULL    | Resolved Karnataka district
# latitude                 | REAL    | NOT NULL    | Target coordinate latitude
# longitude                | REAL    | NOT NULL    | Target coordinate longitude
# district_distance_km     | REAL    |             | Distance to district centroid
# low_confidence_match     | INTEGER | DEFAULT 0   | 1 if distance > 50km, else 0
# month                    | INTEGER | NOT NULL    | Calendar month (1-12)
# year                     | INTEGER | NOT NULL    | Calendar year
# gfs_forecast_mm          | REAL    |             | NOAA GFS 16-day total (mm)
# icon_forecast_mm         | REAL    |             | DWD ICON 16-day total (mm)
# ecmwf_forecast_mm        | REAL    |             | ECMWF IFS 16-day total (mm)
# sources_succeeded_count  | INTEGER | NOT NULL    | Number of successful models
# ensemble_forecast_mm     | REAL    | NOT NULL    | Average 16-day forecast (mm)
# spread_mm                | REAL    |             | Max - Min spread across models
# model_agreement          | TEXT    |             | LOW / MODERATE / HIGH
# historical_mean_mm       | REAL    | NOT NULL    | Climatological mean (mm)
# historical_std_mm        | REAL    | NOT NULL    | Climatological std dev (mm)
# combined_prediction_mm   | REAL    | NOT NULL    | 70/30 Weighted estimate (mm)
# model_raw_prediction_mm  | REAL    | NOT NULL    | TFLite raw regression output
# risk_category            | TEXT    | NOT NULL    | HIGH/MODERATE/NORMAL/ABOVE_NORMAL
# advisory_given           | TEXT    |             | Generated agronomic advisory
# actual_rainfall_mm       | REAL    | NULL        | Future ground truth for audit
# ==============================================================================

import sqlite3
from datetime import datetime
from typing import Dict, List, Optional, Any

DEFAULT_DB_PATH = "monsoon_predictions.db"

def get_connection(db_path: str = DEFAULT_DB_PATH) -> sqlite3.Connection:
    conn = sqlite3.connect(db_path)
    conn.row_factory = sqlite3.Row
    return conn

def init_db(db_path: str = DEFAULT_DB_PATH) -> None:
    """Initializes the SQLite database and migrates columns if not present."""
    conn = get_connection(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute("""
            CREATE TABLE IF NOT EXISTS predictions_log (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                timestamp TEXT NOT NULL,
                district TEXT NOT NULL,
                latitude REAL NOT NULL,
                longitude REAL NOT NULL,
                district_distance_km REAL,
                low_confidence_match INTEGER DEFAULT 0,
                month INTEGER NOT NULL,
                year INTEGER NOT NULL,
                gfs_forecast_mm REAL,
                icon_forecast_mm REAL,
                ecmwf_forecast_mm REAL,
                sources_succeeded_count INTEGER NOT NULL,
                ensemble_forecast_mm REAL NOT NULL,
                spread_mm REAL,
                model_agreement TEXT,
                historical_mean_mm REAL NOT NULL,
                historical_std_mm REAL NOT NULL,
                combined_prediction_mm REAL NOT NULL,
                model_raw_prediction_mm REAL NOT NULL,
                risk_category TEXT NOT NULL,
                advisory_given TEXT,
                actual_rainfall_mm REAL
            )
        """)
        conn.commit()

        # Check existing columns to add new fields if migrating from earlier schema
        cursor.execute("PRAGMA table_info(predictions_log)")
        existing_cols = [row["name"] for row in cursor.fetchall()]

        if "spread_mm" not in existing_cols:
            cursor.execute("ALTER TABLE predictions_log ADD COLUMN spread_mm REAL")
        if "model_agreement" not in existing_cols:
            cursor.execute("ALTER TABLE predictions_log ADD COLUMN model_agreement TEXT")

        # Create performance indexes for instant query execution
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_predictions_district ON predictions_log(district)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_predictions_id_desc ON predictions_log(id DESC)")
        cursor.execute("CREATE INDEX IF NOT EXISTS idx_predictions_risk ON predictions_log(risk_category)")

        conn.commit()
    finally:
        conn.close()

def insert_prediction(record: Dict[str, Any], db_path: str = DEFAULT_DB_PATH) -> int:
    """Inserts a new prediction log record into the database."""
    init_db(db_path)
    conn = get_connection(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute("""
            INSERT INTO predictions_log (
                timestamp,
                district,
                latitude,
                longitude,
                district_distance_km,
                low_confidence_match,
                month,
                year,
                gfs_forecast_mm,
                icon_forecast_mm,
                ecmwf_forecast_mm,
                sources_succeeded_count,
                ensemble_forecast_mm,
                spread_mm,
                model_agreement,
                historical_mean_mm,
                historical_std_mm,
                combined_prediction_mm,
                model_raw_prediction_mm,
                risk_category,
                advisory_given,
                actual_rainfall_mm
            ) VALUES (
                :timestamp,
                :district,
                :latitude,
                :longitude,
                :district_distance_km,
                :low_confidence_match,
                :month,
                :year,
                :gfs_forecast_mm,
                :icon_forecast_mm,
                :ecmwf_forecast_mm,
                :sources_succeeded_count,
                :ensemble_forecast_mm,
                :spread_mm,
                :model_agreement,
                :historical_mean_mm,
                :historical_std_mm,
                :combined_prediction_mm,
                :model_raw_prediction_mm,
                :risk_category,
                :advisory_given,
                :actual_rainfall_mm
            )
        """, {
            "timestamp": record.get("timestamp", datetime.now().isoformat()),
            "district": record["district"],
            "latitude": float(record["latitude"]),
            "longitude": float(record["longitude"]),
            "district_distance_km": float(record.get("district_distance_km", 0.0)),
            "low_confidence_match": 1 if record.get("low_confidence_match") else 0,
            "month": int(record["month"]),
            "year": int(record.get("year", datetime.now().year)),
            "gfs_forecast_mm": record.get("gfs_forecast_mm"),
            "icon_forecast_mm": record.get("icon_forecast_mm"),
            "ecmwf_forecast_mm": record.get("ecmwf_forecast_mm"),
            "sources_succeeded_count": int(record.get("sources_succeeded_count", 0)),
            "ensemble_forecast_mm": float(record.get("ensemble_forecast_mm", 0.0)),
            "spread_mm": record.get("spread_mm"),
            "model_agreement": record.get("model_agreement", "MODERATE"),
            "historical_mean_mm": float(record.get("historical_mean_mm", 0.0)),
            "historical_std_mm": float(record.get("historical_std_mm", 0.0)),
            "combined_prediction_mm": float(record.get("combined_prediction_mm", 0.0)),
            "model_raw_prediction_mm": float(record.get("model_raw_prediction_mm", 0.0)),
            "risk_category": str(record.get("risk_category", "NORMAL")),
            "advisory_given": record.get("advisory_given", ""),
            "actual_rainfall_mm": record.get("actual_rainfall_mm")
        })
        conn.commit()
        return cursor.lastrowid
    finally:
        conn.close()

def update_actual_rainfall(record_id: int, actual_mm: float, db_path: str = DEFAULT_DB_PATH) -> bool:
    """Updates a record with observed ground truth rainfall once measured."""
    init_db(db_path)
    conn = get_connection(db_path)
    try:
        cursor = conn.cursor()
        cursor.execute("""
            UPDATE predictions_log
            SET actual_rainfall_mm = ?
            WHERE id = ?
        """, (actual_mm, record_id))
        conn.commit()
        return cursor.rowcount > 0
    finally:
        conn.close()

def get_recent_predictions(district: Optional[str] = None, limit: int = 10, db_path: str = DEFAULT_DB_PATH) -> List[Dict[str, Any]]:
    """Retrieves recent prediction logs, optionally filtered by district."""
    init_db(db_path)
    conn = get_connection(db_path)
    try:
        cursor = conn.cursor()
        if district:
            cursor.execute("""
                SELECT * FROM predictions_log
                WHERE LOWER(district) = LOWER(?)
                ORDER BY id DESC
                LIMIT ?
            """, (district, limit))
        else:
            cursor.execute("""
                SELECT * FROM predictions_log
                ORDER BY id DESC
                LIMIT ?
            """, (limit,))
        
        rows = cursor.fetchall()
        return [dict(r) for r in rows]
    finally:
        conn.close()

def get_all_predictions_report(limit: int = 50, db_path: str = DEFAULT_DB_PATH) -> List[Dict[str, Any]]:
    """Generates a summary list of logged predictions."""
    return get_recent_predictions(district=None, limit=limit, db_path=db_path)
