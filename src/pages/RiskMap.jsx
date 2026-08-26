import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { KARNATAKA_DISTRICTS } from '../data/mock/mockLocations';
import { mockRiskData } from '../data/mock/mockRiskData';
import { CURRENT_CYCLE_INDICES } from '../config/currentCycleIndices';
import { useLanguage } from '../context/LanguageContext';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  MapPin, 
  Filter, 
  Layers, 
  Info, 
  Sprout, 
  AlertTriangle, 
  RefreshCw, 
  ShieldCheck, 
  TrendingDown, 
  TrendingUp, 
  Globe 
} from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// SVG pin generator for Leaflet markers
const createCustomPin = (color) => {
  const svgString = `
    <svg width="34" height="34" viewBox="0 0 24 24" fill="${color}" stroke="#ffffff" stroke-width="1.8" xmlns="http://www.w3.org/2000/svg" style="filter: drop-shadow(0px 2px 4px rgba(0,0,0,0.4));">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: svgString,
    iconSize: [34, 34],
    iconAnchor: [17, 34],
    popupAnchor: [0, -30]
  });
};

export const RiskMap = () => {
  const { language, t } = useLanguage();
  const [districtData, setDistrictData] = useState([]);
  const [selectedDistrict, setSelectedDistrict] = useState(null);
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [loading, setLoading] = useState(true);
  const [cropFilter, setCropFilter] = useState('ragi');

  // Parallel fetch: query POST /api/v1/predict-monsoon for all 18 Karnataka districts
  const fetchAllDistrictRisks = async () => {
    setLoading(true);
    try {
      const promises = KARNATAKA_DISTRICTS.map(async (dist) => {
        try {
          const res = await apiService.evaluatePrediction({
            latitude: dist.lat,
            longitude: dist.lon,
            month: new Date().getMonth() + 1,
            crop_type: cropFilter,
            dmi: CURRENT_CYCLE_INDICES.dmi,
            oni: CURRENT_CYCLE_INDICES.oni,
            mjo_phase: CURRENT_CYCLE_INDICES.mjo_phase,
            mjo_amplitude: CURRENT_CYCLE_INDICES.mjo_amplitude
          });

          if (res.success && res.data) {
            const d = res.data;
            return {
              id: dist.id,
              name: dist.name,
              lat: dist.lat,
              lon: dist.lon,
              riskCategory: d.riskCategory || 'NORMAL',
              predictedMonthlyRainfall: d.predictedMonthlyRainfall ?? 85.0,
              historicalBaseline: d.historicalBaseline ?? 110.0,
              deviationPct: d.deviationPct ?? -15.0,
              drySpellWarning: d.drySpellWarning ?? false,
              advisory_en: d.advisory?.english || 'Standard seasonal practices recommended.',
              advisory_kn: d.advisory?.kannada || 'ಸಾಮಾನ್ಯ ಬಿತ್ತನೆ ಮತ್ತು ಕೃಷಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಮುಂದುವರಿಸಿ.'
            };
          }
        } catch (e) {
          console.warn(`Fallback for district ${dist.name}:`, e);
        }

        // Fallback default
        const mockMatch = mockRiskData.find(m => m.district === dist.name) || {};
        return {
          id: dist.id,
          name: dist.name,
          lat: dist.lat,
          lon: dist.lon,
          riskCategory: mockMatch.riskCategory || 'NORMAL',
          predictedMonthlyRainfall: mockMatch.predictedRainfall || 75.0,
          historicalBaseline: mockMatch.historicalNormal || 115.0,
          deviationPct: mockMatch.anomalyPercentage || -10.0,
          drySpellWarning: mockMatch.riskCategory === 'HIGH',
          advisory_en: mockMatch.advisorySummary || 'Standard moisture management.',
          advisory_kn: 'ತೇವಾಂಶ ಸಂರಕ್ಷಣಾ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ.'
        };
      });

      const results = await Promise.all(promises);
      setDistrictData(results);
      setSelectedDistrict(results.find(r => r.name === 'Bengaluru Rural') || results[0]);
    } catch (err) {
      console.error('Failed to load multi-district risk map:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAllDistrictRisks();
  }, [cropFilter]);

  const getPinColor = (category) => {
    switch (category) {
      case 'HIGH':
      case 'BREAK_RISK':
        return '#EF4444'; // Red
      case 'MODERATE':
      case 'BELOW_NORMAL':
        return '#EAB308'; // Amber
      case 'ABOVE_NORMAL':
        return '#3B82F6'; // Blue
      case 'NORMAL':
      default:
        return '#22C55E'; // Green
    }
  };

  const filteredDistricts = filterRisk === 'ALL'
    ? districtData
    : districtData.filter(d => d.riskCategory === filterRisk);

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Globe className="w-3.5 h-3.5" />
              <span>{t('gisTitle')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {t('gisHeader')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('gisSub')}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={fetchAllDistrictRisks}
              disabled={loading}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 text-xs font-bold flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? (language === 'kn' ? '18 ಜಿಲ್ಲೆಗಳನ್ನು ಪರಿಶೀಲಿಸಲಾಗುತ್ತಿದೆ...' : 'Querying 18 Districts...') : (language === 'kn' ? 'ಎಲ್ಲಾ ಜಿಲ್ಲೆಗಳನ್ನು ನವೀಕರಿಸಿ' : 'Refresh All Districts')}</span>
            </button>
          </div>
        </div>

        {/* Filter Controls & Spatial Resolution Disclosure */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          
          {/* Risk Filter Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1 flex items-center space-x-1">
              <Filter className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ಫಿಲ್ಟರ್:' : 'Filter:'}</span>
            </span>
            {[
              { label: t('filterAll'), value: 'ALL' },
              { label: t('filterHigh'), value: 'HIGH', color: 'text-rose-500' },
              { label: t('filterModerate'), value: 'MODERATE', color: 'text-amber-500' },
              { label: t('filterNormal'), value: 'NORMAL', color: 'text-emerald-500' },
              { label: t('filterSurplus'), value: 'ABOVE_NORMAL', color: 'text-sky-500' }
            ].map(tab => (
              <button
                key={tab.value}
                onClick={() => setFilterRisk(tab.value)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  filterRisk === tab.value
                    ? 'bg-sky-500 text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <span className={filterRisk === tab.value ? 'text-white' : tab.color}>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Honest Spatial Notice Badge */}
          <div className="px-3 py-1 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center space-x-1.5">
            <Info className="w-3.5 h-3.5 shrink-0" />
            <span>{t('districtCentroidNote')}</span>
          </div>

        </div>

      </div>

      {/* Map & Detail Split View */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 8 Cols: Leaflet Karnataka Map */}
        <div className="lg:col-span-8 p-3 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl overflow-hidden relative min-h-[520px]">
          
          <MapContainer 
            center={[15.3173, 75.7139]} 
            zoom={7} 
            className="w-full h-full min-h-[500px] rounded-2xl z-0"
            scrollWheelZoom={false}
          >
            <TileLayer
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {filteredDistricts.map((d) => {
              const pin = createCustomPin(getPinColor(d.riskCategory));
              return (
                <Marker
                  key={d.id}
                  position={[d.lat, d.lon]}
                  icon={pin}
                  eventHandlers={{
                    click: () => setSelectedDistrict(d)
                  }}
                >
                  <Popup className="custom-leaflet-popup">
                    <div className="p-1 space-y-1 font-sans text-xs">
                      <strong className="block text-sm text-slate-900">{d.name}</strong>
                      <span className="block text-slate-600">Risk: <strong>{d.riskCategory}</strong></span>
                      <span className="block text-slate-600">Rainfall: <strong>{d.predictedMonthlyRainfall.toFixed(1)} mm</strong></span>
                      <span className="block text-slate-500 text-[10px]">Deviation: {d.deviationPct > 0 ? '+' : ''}{d.deviationPct.toFixed(1)}%</span>
                    </div>
                  </Popup>
                </Marker>
              );
            })}
          </MapContainer>

          {/* Floating Map Legend */}
          <div className="absolute bottom-6 right-6 p-3 rounded-2xl bg-white/95 dark:bg-[#070B19]/95 backdrop-blur border border-slate-200 dark:border-slate-800 text-xs font-bold space-y-1.5 shadow-lg z-[400]">
            <span className="text-[10px] uppercase tracking-wider text-slate-500 dark:text-slate-400 block pb-1 border-b border-slate-200 dark:border-slate-800">
              Risk Tiers
            </span>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rose-500"></span>
              <span className="text-slate-700 dark:text-slate-300">High Deficit (&lt; -30%)</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-amber-500"></span>
              <span className="text-slate-700 dark:text-slate-300">Moderate Deficit</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
              <span className="text-slate-700 dark:text-slate-300">Optimal / Normal</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="w-2.5 h-2.5 rounded-full bg-sky-500"></span>
              <span className="text-slate-700 dark:text-slate-300">Surplus (&gt; +20%)</span>
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Selected District Intelligence Panel */}
        <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <MapPin className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  District Telemetry
                </h3>
              </div>
              {selectedDistrict && (
                <RiskBadge category={selectedDistrict.riskCategory} />
              )}
            </div>

            {selectedDistrict ? (
              <div className="space-y-4">
                <div>
                  <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                    {selectedDistrict.name}
                  </h2>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                    Centroid: {selectedDistrict.lat}° N, {selectedDistrict.lon}° E
                  </span>
                </div>

                {/* Key Numbers */}
                <div className="grid grid-cols-2 gap-3 font-mono text-xs">
                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Predicted Rain</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white block mt-0.5">
                      {selectedDistrict.predictedMonthlyRainfall.toFixed(1)} mm
                    </span>
                  </div>

                  <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-500 dark:text-slate-400 block text-[10px]">Normal Baseline</span>
                    <span className="text-lg font-black text-slate-900 dark:text-white block mt-0.5">
                      {selectedDistrict.historicalBaseline.toFixed(1)} mm
                    </span>
                  </div>
                </div>

                {/* Anomaly deviation badge */}
                <div className={`p-3 rounded-2xl border flex items-center justify-between text-xs font-bold ${
                  selectedDistrict.deviationPct < -20
                    ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                    : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                }`}>
                  <div className="flex items-center space-x-1.5">
                    {selectedDistrict.deviationPct < -20 ? <TrendingDown className="w-4 h-4" /> : <TrendingUp className="w-4 h-4" />}
                    <span>Seasonal Anomaly</span>
                  </div>
                  <span className="font-mono text-sm">
                    {selectedDistrict.deviationPct > 0 ? '+' : ''}{selectedDistrict.deviationPct.toFixed(1)}%
                  </span>
                </div>

                {/* English & Kannada Advisory Snippets */}
                <div className="space-y-3 pt-2 text-xs">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">Advisory (English)</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                      "{selectedDistrict.advisory_en}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white block">ಕನ್ನಡ ಸಲಹೆ (Kannada)</span>
                    <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      "{selectedDistrict.advisory_kn}"
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-400 text-center py-8">Select a district pin on the map</p>
            )}
          </div>

          <div className="text-[10px] text-slate-400 font-mono text-center pt-2 border-t border-slate-200 dark:border-slate-800">
            Source: 2000–2023 Climatology (5,184 District-Month Observations)
          </div>

        </div>

      </div>

    </div>
  );
};
