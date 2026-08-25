from fastapi import FastAPI
from pydantic import BaseModel
import numpy as np
import json
import requests
import uvicorn
import tensorflow as tf # Changed to standard tensorflow for hackathon reliability

app = FastAPI(title="Monsoon Inference API")

# Load ML Artifacts
with open("scaler_params.json", "r") as f:
    scaler_params = json.load(f)
    
MEANS = np.array(scaler_params["mean"])
SCALES = np.array(scaler_params["scale"])

# Load TFLite Model using standard TF
interpreter = tf.lite.Interpreter(model_path="monsoon_regional_model.tflite")
interpreter.allocate_tensors()
input_details = interpreter.get_input_details()
output_details = interpreter.get_output_details()

class PredictionRequest(BaseModel):
    latitude: float
    longitude: float
    month: int
    crop_type: str = "ragi"
    dmi: float = 0.0
    oni: float = 0.0
    mjo_phase: float = 1.0
    mjo_amplitude: float = 1.0

def fetch_14_day_forecast(lat: float, lon: float) -> float:
    url = f"https://api.open-meteo.com/v1/forecast?latitude={lat}&longitude={lon}&daily=precipitation_sum&timezone=auto&forecast_days=14"
    try:
        response = requests.get(url)
        if response.status_code == 200:
            return sum(response.json()["daily"]["precipitation_sum"])
    except Exception as e:
        print(f"Weather API Error: {e}")
    return 0.0

@app.post("/api/v1/predict-monsoon")
def predict_monsoon(req: PredictionRequest):
    # 1. Scale Input
    raw_input = np.array([[req.latitude, req.longitude, req.month, req.dmi, req.oni, req.mjo_phase, req.mjo_amplitude]], dtype=np.float32)
    scaled_input = (raw_input - MEANS) / SCALES
    
    # 2. Model Inference
    interpreter.set_tensor(input_details[0]["index"], scaled_input.astype(np.float32))
    interpreter.invoke()
    predicted_monthly_rain = float(interpreter.get_tensor(output_details[0]["index"])[0][0])
    
    # 3. Live Context Integration
    forecast_14d = fetch_14_day_forecast(req.latitude, req.longitude)
    is_dry_spell = forecast_14d < 15.0
    
    # 4. Expert Agronomic Engine
    advisory_en, advisory_kn = "", ""
    if req.crop_type.lower() == "ragi":
        if is_dry_spell:
            advisory_en = "High probability of dry spell. Delay Kharif sowing and conserve soil moisture."
            advisory_kn = "ಶುಷ್ಕ ವಾತಾವರಣದ ಹೆಚ್ಚಿನ ಸಾಧ್ಯತೆ. ಖಾರೀಫ್ ಬಿತ್ತನೆಯನ್ನು ವಿಳಂಬಗೊಳಿಸಿ."
        else:
            advisory_en = "Optimal soil moisture expected. Proceed with nursery preparation."
            advisory_kn = "ಉತ್ತಮ ಮಳೆಯ ನಿರೀಕ್ಷೆಯಿದೆ. ಸಸಿಮಡಿ ಸಿದ್ಧತೆಗೆ ಸೂಕ್ತ ಸಮಯ."
    elif req.crop_type.lower() == "maize":
        if is_dry_spell:
            advisory_en = "Warning: 14-day dry spell predicted. Postpone sowing to prevent seed desiccation."
            advisory_kn = "ಎಚ್ಚರಿಕೆ: ಮುಂದಿನ 14 ದಿನ ಮಳೆ ಕಡಿಮೆ. ಬಿತ್ತನೆಯನ್ನು ಮುಂದೂಡಿ."
        else:
            advisory_en = "Favorable conditions. Proceed with ridge-and-furrow planting."
            advisory_kn = "ಅನುಕೂಲಕರ ವಾತಾವರಣ. ಬಿತ್ತನೆ ಕಾರ್ಯವನ್ನು ಮುಂದುವರಿಸಿ."
            
    return {
        "status": "success",
        "location": {"latitude": req.latitude, "longitude": req.longitude},
        "forecast": {
            "month": req.month,
            "predicted_monthly_rainfall_mm": round(predicted_monthly_rain, 2),
            "14_day_forecast_mm": round(forecast_14d, 2)
        },
        "risk_assessment": {
            "dry_spell_warning": is_dry_spell,
            "risk_level": "HIGH" if is_dry_spell else "LOW"
        },
        "agronomic_advisory": {
            "crop": req.crop_type.capitalize(),
            "advisory_en": advisory_en,
            "advisory_kn": advisory_kn
        }
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)