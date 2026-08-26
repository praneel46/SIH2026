# Live Model Benchmark Report: Existing vs. Baseline Evaluation

## Evaluation Setup
- **Dataset:** karnataka_merged_data.csv (Read-only, 5,184 total records across 18 Karnataka districts)
- **Time-Based Split:**
  - **Training Set (2000–2018):** 4,104 rows
  - **Held-Out Test Set (2019–2023):** 1,080 rows
- **Evaluated Model:** monsoon_regional_model.tflite (Existing live model, 12,412 bytes)
- **Normalization:** Scaled using existing parameters from scaler_params.json (7 features: Lat, Lon, Month, DMI, ONI, MJO_Phase, MJO_Amp)
- **Naive Baseline:** Per-district-per-month historical average rainfall computed strictly from the 2000–2018 training split

---

## Benchmark Results (Held-Out Test Set: 2019–2023)

- **Naive Baseline MAE (2019-2023 test set):** 57.76 mm
- **Live Model MAE (2019-2023 test set):** 98.85 mm
- **Live model vs baseline:** 71.1% worse

---

## Comparison with Retrained Prototype Model

| Model / Baseline | Test MAE (2019–2023) | Performance vs. Naive Baseline |
| :--- | :---: | :---: |
| **Naive Baseline (Historical District-Month Mean)** | **57.76 mm** | *Reference Benchmark (0.0%)* |
| **Retrained Model (monsoon_regional_model_NEW.tflite)** | **58.17 mm** | 0.7% worse |
| **Existing Live Model (monsoon_regional_model.tflite)** | **98.85 mm** | **71.1% worse** |

---

## Honest Interpretation
The existing live model (monsoon_regional_model.tflite) **does not exhibit predictive skill beyond the historical seasonal baseline** on held-out test data (2019–2023), with an error margin (.85\text{ mm}$) that is substantially higher than simply predicting the historical monthly mean for each district (.76\text{ mm}$). This indicates significant drift, underfitting, or miscalibration relative to recent monsoon seasons in the pre-existing binary weights. By contrast, the retrained model (58.17\text{ mm}) closely tracks the seasonal baseline, demonstrating that while macro climate indices (DMI/ONI/MJO) alone provide limited marginal gain over historical climatology, the live binary has severe residual error that warrants replacement or transparent disclosure during presentations.
