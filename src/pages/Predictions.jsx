import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { KARNATAKA_DISTRICTS } from '../data/mock/mockLocations';
import { mockCrops } from '../data/mock/mockCrops';
import { RiskBadge } from '../components/common/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { 
  Sliders, 
  BrainCircuit, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Droplets, 
  CloudRain, 
  MapPin, 
  ShieldCheck, 
  Globe, 
  Sprout, 
  TrendingDown, 
  TrendingUp, 
  Cpu, 
  Info 
} from 'lucide-react';

export const Predictions = () => {
  const { language, t } = useLanguage();
  // 7 Real Model Features & Location Inputs
  const [selectedDistrict, setSelectedDistrict] = useState(KARNATAKA_DISTRICTS[2]); // Bengaluru Rural
  const [latitude, setLatitude] = useState(13.28);
  const [longitude, setLongitude] = useState(77.55);
  const [month, setMonth] = useState(8);
  const [cropType, setCropType] = useState('ragi');
  const [dmi, setDmi] = useState(0.10);
  const [oni, setOni] = useState(-0.30);
  const [mjoPhase, setMjoPhase] = useState(4.0);
  const [mjoAmplitude, setMjoAmplitude] = useState(1.20);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  // Apply District Lat/Lon
  const handleDistrictSelect = (d) => {
    setSelectedDistrict(d);
    setLatitude(d.lat);
    setLongitude(d.lon);
  };

  // Scenario Presets
  const applyPreset = (type) => {
    switch (type) {
      case 'POSITIVE_IOD':
        setDmi(0.85);
        setOni(0.20);
        setMjoPhase(3.0);
        setMjoAmplitude(1.5);
        break;
      case 'EL_NINO_DROUGHT':
        setDmi(-0.45);
        setOni(1.80);
        setMjoPhase(1.0);
        setMjoAmplitude(0.8);
        break;
      case 'LA_NINA_SURPLUS':
        setDmi(0.40);
        setOni(-1.60);
        setMjoPhase(5.0);
        setMjoAmplitude(1.8);
        break;
      case 'NEUTRAL_BASELINE':
      default:
        setDmi(0.0);
        setOni(0.0);
        setMjoPhase(4.0);
        setMjoAmplitude(1.0);
        break;
    }
  };

  const handleSimulate = async () => {
    setLoading(true);
    setError(null);
    try {
      // Calls POST /api/v1/predict-monsoon (Non-logging endpoint)
      const res = await apiService.evaluatePrediction({
        latitude: Number(latitude),
        longitude: Number(longitude),
        month: Number(month),
        crop_type: cropType,
        dmi: Number(dmi),
        oni: Number(oni),
        mjo_phase: Number(mjoPhase),
        mjo_amplitude: Number(mjoAmplitude)
      });

      if (res.success && res.data) {
        setResult(res.data);
      } else {
        setError(res.error || 'Failed to simulate scenario');
      }
    } catch (err) {
      console.error('Simulation error:', err);
      setError('Unable to reach prediction service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Cpu className="w-3.5 h-3.5" />
              <span>{t('simLab')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {t('simTitle')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('simSub')}
            </p>
          </div>

          {/* Non-Logging Safeguard Badge */}
          <div className="px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold flex items-center space-x-2">
            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
            <span>{t('simSafeBadge')}</span>
          </div>
        </div>

        {/* Quick Scenario Presets */}
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 dark:text-slate-400 mr-1">
            Climate Presets:
          </span>
          <button
            onClick={() => applyPreset('POSITIVE_IOD')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-sky-500/10 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-sky-500 transition-colors"
          >
            Positive IOD (+0.85)
          </button>
          <button
            onClick={() => applyPreset('EL_NINO_DROUGHT')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-rose-500/10 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-rose-500 transition-colors"
          >
            Strong El Niño (+1.80 ONI)
          </button>
          <button
            onClick={() => applyPreset('LA_NINA_SURPLUS')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-emerald-500/10 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 hover:text-emerald-500 transition-colors"
          >
            Strong La Niña (-1.60 ONI)
          </button>
          <button
            onClick={() => applyPreset('NEUTRAL_BASELINE')}
            className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-700 dark:text-slate-300 transition-colors"
          >
            Neutral Climatology
          </button>
        </div>
      </div>

      {/* Simulator Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: 7 Feature Sliders & Config */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-5">
          
          <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
            <Sliders className="w-4 h-4 text-sky-500" />
            <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
              7 Standardized Model Features
            </h3>
          </div>

          {/* District & Coordinates */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">District Preset</label>
              <select
                value={selectedDistrict.id}
                onChange={(e) => {
                  const d = KARNATAKA_DISTRICTS.find(x => x.id === e.target.value);
                  if (d) handleDistrictSelect(d);
                }}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070B19] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
              >
                {KARNATAKA_DISTRICTS.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300">Target Crop</label>
              <select
                value={cropType}
                onChange={(e) => setCropType(e.target.value)}
                className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-[#070B19] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold"
              >
                {mockCrops.map(c => (
                  <option key={c.key} value={c.key}>{c.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Coordinates Slider Pair */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Latitude</span>
                <span className="font-mono text-sky-500">{latitude}° N</span>
              </div>
              <input
                type="range"
                min="11.5"
                max="18.5"
                step="0.01"
                value={latitude}
                onChange={(e) => setLatitude(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg accent-sky-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">Longitude</span>
                <span className="font-mono text-sky-500">{longitude}° E</span>
              </div>
              <input
                type="range"
                min="74.0"
                max="78.5"
                step="0.01"
                value={longitude}
                onChange={(e) => setLongitude(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg accent-sky-500"
              />
            </div>
          </div>

          {/* Month Slider */}
          <div className="space-y-1">
            <div className="flex justify-between text-xs font-bold">
              <span className="text-slate-600 dark:text-slate-400">Forecast Month (1-12)</span>
              <span className="font-mono text-indigo-500">
                {new Date(2026, month - 1, 1).toLocaleString('default', { month: 'long' })} ({month})
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="12"
              step="1"
              value={month}
              onChange={(e) => setMonth(parseInt(e.target.value))}
              className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg accent-indigo-500"
            />
          </div>

          {/* DMI & ONI */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">DMI Index (&deg;C)</span>
                <span className="font-mono text-amber-500">{dmi > 0 ? '+' : ''}{dmi.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1.5"
                max="1.5"
                step="0.05"
                value={dmi}
                onChange={(e) => setDmi(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg accent-amber-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">ONI Index (&deg;C)</span>
                <span className="font-mono text-rose-500">{oni > 0 ? '+' : ''}{oni.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-3.0"
                max="3.0"
                step="0.05"
                value={oni}
                onChange={(e) => setOni(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg accent-rose-500"
              />
            </div>
          </div>

          {/* MJO Phase & Amplitude */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">MJO Phase (1-8)</span>
                <span className="font-mono text-purple-500">Phase {mjoPhase.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="8.0"
                step="0.5"
                value={mjoPhase}
                onChange={(e) => setMjoPhase(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg accent-purple-500"
              />
            </div>

            <div className="space-y-1">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-slate-600 dark:text-slate-400">MJO Amplitude</span>
                <span className="font-mono text-cyan-500">{mjoAmplitude.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="0.0"
                max="3.0"
                step="0.05"
                value={mjoAmplitude}
                onChange={(e) => setMjoAmplitude(parseFloat(e.target.value))}
                className="w-full h-1.5 bg-slate-200 dark:bg-slate-800 rounded-lg accent-cyan-500"
              />
            </div>
          </div>

          {/* Execute CTA */}
          <button
            onClick={handleSimulate}
            disabled={loading}
            className="w-full py-3 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-500 hover:from-blue-500 hover:to-cyan-400 text-white font-black text-xs uppercase tracking-wider shadow-lg shadow-sky-500/20 flex items-center justify-center space-x-2 transition-all active:scale-98"
          >
            {loading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <BrainCircuit className="w-4 h-4" />}
            <span>{loading ? 'Evaluating TFLite Tensor...' : 'Run Scenario Inference'}</span>
          </button>

        </div>

        {/* Right 6 Cols: Immediate Simulation Telemetry */}
        <div className="lg:col-span-6 p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-5 flex flex-col justify-between">
          
          <div className="space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <BrainCircuit className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Simulation Diagnostics
                </h3>
              </div>
              {result && (
                <RiskBadge category={result.riskCategory} />
              )}
            </div>

            {error ? (
              <div className="p-6 rounded-2xl bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400 text-xs">
                {error}
              </div>
            ) : result ? (
              <div className="space-y-4 font-mono text-xs">
                
                {/* 2 Main Number Cards */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Model Predicted Rain</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white block mt-1">
                      {result.predictedMonthlyRainfall?.toFixed(1) ?? '--'} mm
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-center">
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] block">Historical Baseline</span>
                    <span className="text-3xl font-black text-slate-900 dark:text-white block mt-1">
                      {result.historicalBaseline?.toFixed(1) ?? '--'} mm
                    </span>
                  </div>
                </div>

                {/* Anomaly & Warning Row */}
                <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-600 dark:text-slate-400 font-sans font-bold">Deviation from Normal</span>
                  <span className={`text-base font-black ${
                    (result.deviationPct ?? 0) < -20 ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {(result.deviationPct ?? 0) > 0 ? '+' : ''}{result.deviationPct?.toFixed(1)}%
                  </span>
                </div>

                {/* Advisories */}
                <div className="space-y-3 pt-2 font-sans">
                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">English Advisory</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                      "{result.advisory?.english}"
                    </p>
                  </div>

                  <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                    <span className="font-bold text-slate-900 dark:text-white text-xs block">ಕನ್ನಡ ಕೃಷಿ ಸಲಹೆ</span>
                    <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                      "{result.advisory?.kannada}"
                    </p>
                  </div>
                </div>

              </div>
            ) : (
              <div className="py-16 text-center text-slate-400 text-xs space-y-2">
                <Sliders className="w-8 h-8 mx-auto opacity-50 text-sky-500" />
                <p>Adjust the 7 feature sliders and click "Run Scenario Inference".</p>
              </div>
            )}
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[10px] text-slate-500 dark:text-slate-400 font-mono">
            Model: monsoon_regional_model.tflite • Scaler: scaler_params.json • Input Shape: [1, 7]
          </div>

        </div>

      </div>

    </div>
  );
};
