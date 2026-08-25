import React, { useState } from 'react';
import { MapContainer, TileLayer, useMapEvents, Marker } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

// Required override for Leaflet marker icons in React
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const LocationMarker = ({ setLocationData }) => {
  const [position, setPosition] = useState(null);
  useMapEvents({
    click(e) {
      setPosition(e.latlng);
      setLocationData(e.latlng);
    },
  });
  return position === null ? null : <Marker position={position}></Marker>;
};

export default function MonsoonMap() {
  const [advisory, setAdvisory] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cropType, setCropType] = useState('ragi');

  const handleMapClick = async (latlng) => {
    setLoading(true);
    try {
      const response = await fetch('http://localhost:8080/api/weather/advisory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          latitude: latlng.lat,
          longitude: latlng.lng,
          month: new Date().getMonth() + 1,
          crop_type: cropType,
          dmi: 0.15, 
          oni: -0.3,
          mjo_phase: 3.0,
          mjo_amplitude: 1.2
        })
      });
      const data = await response.json();
      setAdvisory(data);
    } catch (error) {
      console.error("API Error:", error);
    }
    setLoading(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', fontFamily: 'system-ui' }}>
      <div style={{ padding: '15px', textAlign: 'center', backgroundColor: '#f8f9fa', borderBottom: '1px solid #ddd' }}>
        <h2 style={{ margin: '0 0 10px 0' }}>Monsoon & Agronomic Risk Engine</h2>
        <label style={{ fontWeight: 'bold' }}>Crop Selection: </label>
        <select value={cropType} onChange={(e) => setCropType(e.target.value)} style={{ padding: '5px', marginLeft: '10px' }}>
          <option value="ragi">Ragi (Finger Millet)</option>
          <option value="maize">Maize (Corn)</option>
        </select>
      </div>

      <div style={{ flex: 1, position: 'relative' }}>
        <MapContainer center={[15.31, 75.71]} zoom={7} style={{ height: '100%', width: '100%' }}>
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
          <LocationMarker setLocationData={handleMapClick} />
        </MapContainer>
      </div>

      {loading && <div style={{ padding: '15px', textAlign: 'center', background: '#e3f2fd' }}>Computing ML predictions...</div>}
      
      {advisory && advisory.status === "success" && (
        <div style={{ padding: '20px', background: advisory.risk_assessment.risk_level === 'HIGH' ? '#ffebee' : '#e8f5e9' }}>
          <h3 style={{ margin: '0 0 10px 0' }}>Location: {advisory.location.latitude.toFixed(4)}, {advisory.location.longitude.toFixed(4)}</h3>
          <p><strong>Predicted Monthly Anomaly Baseline:</strong> {advisory.forecast.predicted_monthly_rainfall_mm} mm</p>
          <p><strong>Immediate 14-Day Forecast:</strong> {advisory.forecast["14_day_forecast_mm"]} mm</p>
          <hr style={{ borderColor: 'rgba(0,0,0,0.1)' }} />
          <h4 style={{ margin: '10px 0 5px 0' }}>Agronomic Advisory ({advisory.agronomic_advisory.crop})</h4>
          <p style={{ margin: '0 0 5px 0', fontSize: '15px' }}>🇬🇧 {advisory.agronomic_advisory.advisory_en}</p>
          <p style={{ margin: 0, fontSize: '18px', fontWeight: 'bold' }}>🇮🇳 {advisory.agronomic_advisory.advisory_kn}</p>
        </div>
      )}
    </div>
  );
}