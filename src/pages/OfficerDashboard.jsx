import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { mockCrops } from '../data/mock/mockCrops';
import { KARNATAKA_DISTRICTS } from '../data/mock/mockLocations';
import { CURRENT_CYCLE_INDICES } from '../config/currentCycleIndices';
import { useLanguage } from '../context/LanguageContext';
import { 
  Radio, 
  MapPin, 
  Sprout, 
  Layers, 
  Globe, 
  Cpu, 
  Droplets, 
  AlertTriangle, 
  ShieldCheck, 
  History, 
  FileText, 
  Copy, 
  Check, 
  RefreshCw, 
  Sparkles,
  BarChart3,
  Calendar,
  Send
} from 'lucide-react';

export const OfficerDashboard = () => {
  const { language, t } = useLanguage();
  const [selectedDistrict, setSelectedDistrict] = useState(KARNATAKA_DISTRICTS[2]); // Bengaluru Rural
  const [selectedCrop, setSelectedCrop] = useState(mockCrops[0]); // Ragi
  const [ensembleData, setEnsembleData] = useState(null);
  const [historyLogs, setHistoryLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  const fetchOfficerData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Live call to trigger-ensemble-check (GFS/ICON/ECMWF + FAO-56 + DB log)
      const res = await apiService.getEnsembleCheck({
        latitude: selectedDistrict.lat,
        longitude: selectedDistrict.lon,
        crop_type: selectedCrop.key,
        dmi: CURRENT_CYCLE_INDICES.dmi,
        oni: CURRENT_CYCLE_INDICES.oni,
        mjo_phase: CURRENT_CYCLE_INDICES.mjo_phase
      });

      if (res.success && res.data) {
        setEnsembleData(res.data);
      } else {
        setError(res.error || 'Failed to trigger multi-model ensemble check');
      }
    } catch (err) {
      console.error('Officer Ensemble Error:', err);
      setError('Unable to connect to ensemble inference service');
    } finally {
      setLoading(false);
    }
  };

  const fetchHistoryLogs = async () => {
    setHistoryLoading(true);
    try {
      const res = await apiService.getPredictionHistory({
        district: selectedDistrict.name,
        limit: 10
      });
      if (res.success && res.data) {
        setHistoryLogs(res.data);
      }
    } catch (err) {
      console.error('History Fetch Error:', err);
    } finally {
      setHistoryLoading(false);
    }
  };

  useEffect(() => {
    fetchOfficerData();
    fetchHistoryLogs();
  }, [selectedDistrict, selectedCrop]);

  const handleCopyBulletin = () => {
    if (!ensembleData) return;
    const text = `[GOVT OF KARNATAKA - AGRONOMIC ADVISORY]
District: ${selectedDistrict.name} | Crop: ${selectedCrop.name}
Risk Assessment: ${ensembleData.risk_assessment?.risk_category} (Dry Spell Warning: ${ensembleData.risk_assessment?.dry_spell_warning ? 'Active' : 'No'})
Multi-Model 16-Day Rainfall: ${ensembleData.prediction_synthesis?.combined_prediction_mm?.toFixed(1)} mm (Spread: ${ensembleData.multi_model_ensemble?.spread_mm?.toFixed(1)} mm)
Crop ETc Water Balance: ${ensembleData.crop_water_analysis?.water_balance_mm?.toFixed(1)} mm (${ensembleData.crop_water_analysis?.water_status})
Advisory (EN): ${ensembleData.agronomic_advisory?.advisory_en}
Advisory (KN): ${ensembleData.agronomic_advisory?.advisory_kn}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top Officer Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-6">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Radio className="w-3.5 h-3.5" />
              <span>{t('officerHeader')}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {t('officerTitle')}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {t('officerSub')}
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <button
              onClick={() => { fetchOfficerData(); fetchHistoryLogs(); }}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 text-xs font-bold flex items-center space-x-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{t('refresh')}</span>
            </button>

            <button
              onClick={handleCopyBulletin}
              className="px-4 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md shadow-sky-500/20 flex items-center space-x-2 transition-all active:scale-95"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-300" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? t('copiedBulletin') : t('copyBulletin')}</span>
            </button>
          </div>
        </div>

        {/* District & Crop Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>District Target Jurisdiction</span>
            </label>
            <select
              value={selectedDistrict.id}
              onChange={(e) => {
                const d = KARNATAKA_DISTRICTS.find(x => x.id === e.target.value);
                if (d) setSelectedDistrict(d);
              }}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-sky-500"
            >
              {KARNATAKA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name} ({d.lat}° N, {d.lon}° E)
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-500" />
              <span>Target Kharif Crop (FAO-56)</span>
            </label>
            <select
              value={selectedCrop.key}
              onChange={(e) => {
                const c = mockCrops.find(x => x.key === e.target.value);
                if (c) setSelectedCrop(c);
              }}
              className="w-full px-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-xs font-semibold focus:outline-none focus:border-emerald-500"
            >
              {mockCrops.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.name} ({c.name_kn}) — Kc Mid: {c.kc_mid}
                </option>
              ))}
            </select>
          </div>
        </div>

      </div>

      {/* Main Section */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3 p-12">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-500 animate-spin">
            <Globe className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 animate-pulse">
            Querying Open-Meteo ensemble (GFS/ICON/ECMWF) & computing FAO-56 water balance...
          </p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Ensemble Check Failed</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* ROW 1: MULTI-MODEL ENSEMBLE SPREAD & AGREEMENT */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left 8 Cols: Ensemble Breakdown */}
            <div className="lg:col-span-8 p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4 text-sky-500" />
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    Multi-Model Meteorological Ensemble (16-Day Forecast)
                  </h3>
                </div>
                <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
                  ensembleData?.multi_model_ensemble?.model_agreement === 'HIGH'
                    ? 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
                    : 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400'
                }`}>
                  Agreement: {ensembleData?.multi_model_ensemble?.model_agreement}
                </span>
              </div>

              {/* 3 Model Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <span className="text-xs font-bold text-sky-600 dark:text-sky-400 block">NOAA GFS</span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white block">
                    {ensembleData?.multi_model_ensemble?.gfs_16d_mm?.toFixed(1) ?? '--'} mm
                  </span>
                  <span className="text-[10px] text-slate-400 block">Global Forecast System</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400 block">DWD ICON</span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white block">
                    {ensembleData?.multi_model_ensemble?.icon_16d_mm?.toFixed(1) ?? '--'} mm
                  </span>
                  <span className="text-[10px] text-slate-400 block">German Weather Service</span>
                </div>

                <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-center space-y-1">
                  <span className="text-xs font-bold text-purple-600 dark:text-purple-400 block">ECMWF IFS</span>
                  <span className="text-2xl font-black font-mono text-slate-900 dark:text-white block">
                    {ensembleData?.multi_model_ensemble?.ecmwf_16d_mm?.toFixed(1) ?? '--'} mm
                  </span>
                  <span className="text-[10px] text-slate-400 block">European Centre 0.25°</span>
                </div>
              </div>

              {/* Spread & Synthesis Comparison */}
              <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Ensemble Spread (&sigma;)</span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {ensembleData?.multi_model_ensemble?.spread_mm?.toFixed(1) ?? '--'} mm
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">70/30 Blended Synthesis</span>
                  <span className="text-sm font-bold font-mono text-sky-600 dark:text-sky-400">
                    {ensembleData?.prediction_synthesis?.combined_prediction_mm?.toFixed(1) ?? '--'} mm
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Climatology Mean (2000-2023)</span>
                  <span className="text-sm font-bold font-mono text-slate-900 dark:text-white">
                    {ensembleData?.historical_climatology?.historical_mean_mm?.toFixed(1) ?? '--'} mm
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 dark:text-slate-400 block">Synthesized Deviation</span>
                  <span className={`text-sm font-bold font-mono ${
                    (ensembleData?.prediction_synthesis?.deficit_pct ?? 0) > 20 ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {ensembleData?.prediction_synthesis?.deficit_pct > 0 ? '-' : '+'}
                    {Math.abs(ensembleData?.prediction_synthesis?.deficit_pct ?? 0).toFixed(1)}%
                  </span>
                </div>
              </div>
            </div>

            {/* Right 4 Cols: FAO-56 Water Balance Summary */}
            <div className="lg:col-span-4 p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4 flex flex-col justify-between">
              <div className="flex items-center space-x-2">
                <Droplets className="w-4 h-4 text-emerald-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  FAO-56 Water Balance
                </h3>
              </div>

              <div className="space-y-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Crop ETc (16-Day)</span>
                  <span className="font-bold text-slate-900 dark:text-white">
                    {ensembleData?.crop_water_analysis?.etc_16d_mm?.toFixed(1) ?? '--'} mm
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Water Balance (P - ETc)</span>
                  <span className={`font-bold ${
                    (ensembleData?.crop_water_analysis?.water_balance_mm ?? 0) < 0 ? 'text-rose-500' : 'text-emerald-500'
                  }`}>
                    {(ensembleData?.crop_water_analysis?.water_balance_mm ?? 0) > 0 ? '+' : ''}
                    {ensembleData?.crop_water_analysis?.water_balance_mm?.toFixed(1) ?? '--'} mm
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Status Tier</span>
                  <span className="font-bold text-amber-500">
                    {ensembleData?.crop_water_analysis?.water_status ?? 'DEFICIT'}
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                  <span className="text-slate-500 dark:text-slate-400">Irrigation Gap</span>
                  <span className="font-bold text-rose-500">
                    {ensembleData?.crop_water_analysis?.irrigation_gap_mm?.toFixed(1) ?? '0.0'} mm
                  </span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-xs text-emerald-800 dark:text-emerald-300">
                <strong className="block font-semibold">Irrigation Directive:</strong>
                <span>{ensembleData?.crop_water_analysis?.irrigation_guidance || 'Monitor moisture.'}</span>
              </div>
            </div>

          </div>

          {/* ROW 2: BROADCAST BULLETIN COMPOSER */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Send className="w-4 h-4 text-sky-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Broadcast Bulletin Composer (Preview / Staging)
                </h3>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-[10px] font-bold">
                Preview Only — SMS/WhatsApp Gateway Pending Live Deployment
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">English Broadcast Text</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-mono">
                  {ensembleData?.agronomic_advisory?.advisory_en || 'Standard seasonal guidance issued.'}
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-bold text-slate-900 dark:text-white block">ಕನ್ನಡ ಪ್ರಸಾರ ಸಂದೇಶ (Kannada Text)</span>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
                  {ensembleData?.agronomic_advisory?.advisory_kn || 'ವಾಡಿಕೆಯ ಕೃಷಿ ಸಲಹೆ ನೀಡಲಾಗಿದೆ.'}
                </p>
              </div>
            </div>
          </div>

          {/* ROW 3: HISTORICAL SQLITE AUDIT LOGS */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <History className="w-4 h-4 text-indigo-500" />
                <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                  Logged Prediction Audit Trail (SQLite: monsoon_predictions.db)
                </h3>
              </div>
              <span className="text-xs font-mono text-slate-400">
                District: {selectedDistrict.name}
              </span>
            </div>

            {historyLoading ? (
              <p className="text-xs text-slate-400 animate-pulse">Loading SQLite logs...</p>
            ) : historyLogs.length === 0 ? (
              <div className="p-8 text-center text-slate-400 text-xs">
                No past logs recorded yet for {selectedDistrict.name}. Triggering ensemble checks automatically writes persistent audit records.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-mono">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                      <th className="py-2.5 px-3">Timestamp</th>
                      <th className="py-2.5 px-3">Crop</th>
                      <th className="py-2.5 px-3">Predicted</th>
                      <th className="py-2.5 px-3">Historical Baseline</th>
                      <th className="py-2.5 px-3">Spread (&sigma;)</th>
                      <th className="py-2.5 px-3">Agreement</th>
                      <th className="py-2.5 px-3">Risk Tier</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                    {historyLogs.map((log, i) => (
                      <tr key={i} className="hover:bg-slate-50 dark:hover:bg-slate-900/40 transition-colors">
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-500 dark:text-slate-400">
                          {log.created_at ? new Date(log.created_at).toLocaleString() : '--'}
                        </td>
                        <td className="py-2.5 px-3 uppercase font-bold text-emerald-600 dark:text-emerald-400">
                          {log.crop_type || 'ragi'}
                        </td>
                        <td className="py-2.5 px-3 font-bold text-sky-600 dark:text-sky-400">
                          {log.combined_prediction_mm?.toFixed(1) ?? '--'} mm
                        </td>
                        <td className="py-2.5 px-3 text-slate-500 dark:text-slate-400">
                          {log.historical_mean_mm?.toFixed(1) ?? '--'} mm
                        </td>
                        <td className="py-2.5 px-3">
                          {log.spread_mm?.toFixed(1) ?? '--'} mm
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.model_agreement === 'HIGH' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-amber-500/10 text-amber-500'
                          }`}>
                            {log.model_agreement || 'NORMAL'}
                          </span>
                        </td>
                        <td className="py-2.5 px-3">
                          <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            log.risk_category === 'HIGH' ? 'bg-rose-500/10 text-rose-500' : log.risk_category === 'MODERATE' ? 'bg-amber-500/10 text-amber-500' : 'bg-emerald-500/10 text-emerald-500'
                          }`}>
                            {log.risk_category || 'NORMAL'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

          </div>

        </div>
      )}

    </div>
  );
};
