# ==============================================================================
# train_model.py -- Training & TFLite Export Pipeline for Monsoon Prediction
# SIH26086: Weather Index Climate Intelligence Platform
#
# Reproduces the TFLite regression model and StandardScaler normalization
# parameters from karnataka_merged_data.csv.
# ==============================================================================

import csv
import json
import numpy as np
import tensorflow as tf
from sklearn.preprocessing import StandardScaler
from sklearn.metrics import mean_absolute_error, mean_squared_error

FEATURE_NAMES = ["Lat", "Lon", "Month", "DMI", "ONI", "MJO_Phase", "MJO_Amp"]
TARGET_NAME = "Rainfall_mm"

def load_data(csv_path="karnataka_merged_data.csv"):
    rows = []
    with open(csv_path, "r", encoding="utf-8") as f:
        reader = csv.DictReader(f)
        for r in reader:
            rows.append({
                "District": r["District"],
                "Year": int(r["Year"]),
                "Month": int(r["Month"]),
                "Lat": float(r["Lat"]),
                "Lon": float(r["Lon"]),
                "Rainfall_mm": float(r["Rainfall_mm"]),
                "DMI": float(r["DMI"]),
                "ONI": float(r["ONI"]),
                "MJO_Phase": float(r["MJO_Phase"]),
                "MJO_Amp": float(r["MJO_Amp"]),
            })
    return rows

def main():
    print("=" * 60)
    print("Starting Monsoon Regional Model Training Pipeline")
    print("=" * 60)

    rows = load_data()
    print(f"Loaded {len(rows)} records from karnataka_merged_data.csv")

    # Time-based split: Train (2000-2018), Test (2019-2023)
    train_rows = [r for r in rows if r["Year"] <= 2018]
    test_rows = [r for r in rows if r["Year"] > 2018]

    print(f"Train samples (2000-2018): {len(train_rows)}")
    print(f"Test samples  (2019-2023): {len(test_rows)}")

    X_all = np.array([[r[f] for f in FEATURE_NAMES] for r in rows], dtype=np.float32)
    y_all = np.array([r[TARGET_NAME] for r in rows], dtype=np.float32)

    X_train_raw = np.array([[r[f] for f in FEATURE_NAMES] for r in train_rows], dtype=np.float32)
    y_train = np.array([r[TARGET_NAME] for r in train_rows], dtype=np.float32)

    X_test_raw = np.array([[r[f] for f in FEATURE_NAMES] for r in test_rows], dtype=np.float32)
    y_test = np.array([r[TARGET_NAME] for r in test_rows], dtype=np.float32)

    # 1. Fit StandardScaler on full dataset to match scaler_params schema
    scaler = StandardScaler()
    scaler.fit(X_all)

    scaler_dict = {
        "mean": [float(m) for m in scaler.mean_],
        "scale": [float(s) for s in scaler.scale_],
        "features": FEATURE_NAMES
    }

    # Save to NEW filename only
    new_scaler_path = "scaler_params_NEW.json"
    with open(new_scaler_path, "w", encoding="utf-8") as f:
        json.dump(scaler_dict, f, indent=2)
    print(f"\n[Artifact] Saved new scaler parameters to: {new_scaler_path}")

    # Scale inputs
    X_train = scaler.transform(X_train_raw)
    X_test = scaler.transform(X_test_raw)

    # 2. Baseline Evaluation (Predicting Historical District/Monthly Mean)
    historical_means = {}
    for r in train_rows:
        key = (r["District"], r["Month"])
        historical_means.setdefault(key, []).append(r["Rainfall_mm"])
    historical_lookup = {k: np.mean(v) for k, v in historical_means.items()}
    
    overall_mean = np.mean(y_train)
    naive_test_preds = [historical_lookup.get((r["District"], r["Month"]), overall_mean) for r in test_rows]
    naive_mae = mean_absolute_error(y_test, naive_test_preds)
    print(f"\n[Baseline] Naive Historical Mean Test MAE: {naive_mae:.2f} mm")

    # 3. Build Keras Sequential Regression Model
    tf.random.set_seed(42)
    np.random.seed(42)

    model = tf.keras.Sequential([
        tf.keras.layers.Input(shape=(len(FEATURE_NAMES),)),
        tf.keras.layers.Dense(16, activation="relu"),
        tf.keras.layers.Dense(8, activation="relu"),
        tf.keras.layers.Dense(1)
    ])

    model.compile(optimizer=tf.keras.optimizers.Adam(learning_rate=0.01), loss="mae", metrics=["mae"])
    print("\nModel Architecture:")
    model.summary()

    # Train
    history = model.fit(
        X_train, y_train,
        validation_data=(X_test, y_test),
        epochs=60,
        batch_size=32,
        verbose=0
    )

    train_preds = model.predict(X_train, verbose=0).flatten()
    test_preds = model.predict(X_test, verbose=0).flatten()

    train_mae = mean_absolute_error(y_train, train_preds)
    test_mae = mean_absolute_error(y_test, test_preds)
    print(f"\n[Model Results]")
    print(f"  Train MAE: {train_mae:.2f} mm")
    print(f"  Test  MAE: {test_mae:.2f} mm (vs Naive Baseline: {naive_mae:.2f} mm)")

    # 4. Convert to TFLite
    converter = tf.lite.TFLiteConverter.from_keras_model(model)
    tflite_model = converter.convert()

    new_tflite_path = "monsoon_regional_model_NEW.tflite"
    with open(new_tflite_path, "wb") as f:
        f.write(tflite_model)
    print(f"\n[Artifact] Saved new TFLite model to: {new_tflite_path} ({len(tflite_model)} bytes)")

    # 5. Verify TFLite Model Loading
    interpreter = tf.lite.Interpreter(model_content=tflite_model)
    interpreter.allocate_tensors()
    in_det = interpreter.get_input_details()
    out_det = interpreter.get_output_details()
    print(f"TFLite Verification:")
    print(f"  Input tensor shape:  {in_det[0]['shape']} ({in_det[0]['dtype']})")
    print(f"  Output tensor shape: {out_det[0]['shape']} ({out_det[0]['dtype']})")

if __name__ == "__main__":
    main()
