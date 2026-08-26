import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useRole } from '../context/RoleContext';
import { useLanguage } from '../context/LanguageContext';
import { mockCrops } from '../data/mock/mockCrops';
import { evaluateCropWaterIntelligence } from '../services/cropWaterIntelligence';
import { CURRENT_CYCLE_INDICES } from '../config/currentCycleIndices';
import { 
  CloudRain, 
  AlertTriangle, 
  Radio, 
  Calendar, 
  Sparkles, 
  Droplets, 
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Sprout,
  CheckCircle2,
  HelpCircle,
  Waves,
  ArrowRight,
  Info
} from 'lucide-react';
import { 
  ResponsiveContainer, 
  ComposedChart, 
  Line, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  CartesianGrid, 
  ReferenceLine 
} from 'recharts';

export const Dashboard = () => {
  const { selectedLocation, selectedCrop, setSelectedCrop } = useRole();
  const { language } = useLanguage();
  const [prediction, setPrediction] = useState(null);
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const loadDashboardData = async () => {
    setLoading(true);
    setError(null);
    try {
      // 1. Real live API call to POST /api/v1/predict-monsoon via apiService
      const predRes = await apiService.evaluatePrediction({
        latitude: selectedLocation.lat || 13.29,
        longitude: selectedLocation.lon || 77.55,
        month: new Date().getMonth() + 1,
        crop_type: selectedCrop?.key || 'ragi',
        dmi: CURRENT_CYCLE_INDICES.dmi,
        oni: CURRENT_CYCLE_INDICES.oni,
        mjo_phase: CURRENT_CYCLE_INDICES.mjo_phase,
        mjo_amplitude: CURRENT_CYCLE_INDICES.mjo_amplitude
      });

      // 2. Load anomaly trends
      const trendRes = await apiService.getAnomalyTrends(selectedLocation.district);

      if (predRes.success && predRes.data) {
        setPrediction(predRes.data);
      } else {
        setError(predRes.error || 'Unable to connect to live prediction service');
      }

      if (trendRes.success && trendRes.data) {
        setTrends(trendRes.data);
      }
    } catch (err) {
      console.error("Dashboard fetch error:", err);
      setError(err.message || 'Failed to load live forecast data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, [selectedLocation, selectedCrop]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.06,
        delayChildren: 0.04
      }
    }
  };

  const cardFadeUp = {
    hidden: { opacity: 0, y: 14 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-14 h-14 rounded-3xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 animate-spin">
          <CloudRain className="w-7 h-7" />
        </div>
        <div className="text-center space-y-1">
          <p className="text-sm font-bold text-slate-800 dark:text-slate-200">
            {language === 'kn' ? 'ನೇರ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಪಡೆಯಲಾಗುತ್ತಿದೆ...' : 'Fetching Live Climate Intelligence...'}
          </p>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-mono animate-pulse">
            {selectedLocation.district} ({selectedLocation.lat?.toFixed(2)}°N, {selectedLocation.lon?.toFixed(2)}°E) • {selectedCrop?.name || 'Ragi'}
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-5 p-6 max-w-lg mx-auto text-center font-sans">
        <div className="w-16 h-16 rounded-3xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-500">
          <AlertCircle className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-slate-900 dark:text-white">
            {language === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಲೋಡ್ ಮಾಡಲು ಸಾಧ್ಯವಾಗಿಲ್ಲ' : 'Unable to Load Live Prediction'}
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">
            {error}. Ensure the FastAPI backend server is running on <code className="font-mono text-sky-500 dark:text-sky-400 font-bold">http://localhost:8000</code>.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-5 py-2.5 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-sky-500/20 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          <span>{language === 'kn' ? 'ಮತ್ತೆ ಪ್ರಯತ್ನಿಸಿ' : 'Retry Connection'}</span>
        </button>
      </div>
    );
  }

  // Real backend metrics
  const predictedRainfall = prediction?.predictedMonthlyRainfall ?? 116.5;
  const deviationPct = prediction?.deviationPct ?? 0;
  const baselineMm = prediction?.historicalBaseline ?? 120.5;
  const forecast14Day = prediction?.forecast14DayRainfall ?? 21.2;
  const riskCategory = prediction?.riskCategory ?? 'NORMAL';
  const drySpellWarning = prediction?.drySpellWarning ?? false;
  const lowConfidence = prediction?.lowConfidenceMatch ?? false;

  // Agricultural water status evaluation
  const waterIntel = evaluateCropWaterIntelligence(selectedCrop?.key, prediction);

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-full font-sans"
    >
      {/* ============================================================ */}
      {/* SECTION 1: GLOBAL LOCATION CONTEXT & CROP SELECTOR BAR */}
      {/* ============================================================ */}
      <motion.div 
        variants={cardFadeUp}
        className="p-5 sm:p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4"
      >
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 border-b border-slate-100 dark:border-slate-800/80 pb-4">
          
          {/* Location Breadcrumb & Coordinates */}
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <span className="p-1.5 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400">
                <MapPin className="w-4 h-4" />
              </span>
              <span className="text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
                {language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ಸ್ಥಳ ಮಾಹಿತಿ' : 'Active Location Context'}
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-2 pt-0.5">
              <span className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
                {selectedLocation.district}
              </span>
              <span className="text-slate-300 dark:text-slate-600 font-bold">•</span>
              <span className="text-sm sm:text-base font-bold text-slate-700 dark:text-slate-300">
                {selectedLocation.block ? `Block: ${selectedLocation.block}` : 'Centroid'}
              </span>
              {selectedLocation.village && (
                <>
                  <span className="text-slate-300 dark:text-slate-600 font-bold">•</span>
                  <span className="text-xs sm:text-sm font-semibold text-slate-500 dark:text-slate-400">
                    {selectedLocation.village}
                  </span>
                </>
              )}
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-[11px] font-mono text-slate-600 dark:text-slate-400 font-semibold">
                {selectedLocation.lat?.toFixed(2)}° N, {selectedLocation.lon?.toFixed(2)}° E
              </span>
            </div>
          </div>

          {/* Quick Context Badges */}
          <div className="flex items-center space-x-3 shrink-0">
            <div className="px-3.5 py-1.5 rounded-2xl bg-sky-50 dark:bg-sky-950/40 border border-sky-200 dark:border-sky-800/60 text-xs font-bold text-sky-700 dark:text-sky-300 flex items-center space-x-2">
              <span className="w-2 h-2 rounded-full bg-sky-500 animate-pulse" />
              <span>{CURRENT_CYCLE_INDICES.cycleLabel}</span>
            </div>
          </div>
        </div>

        {/* Global Crop Selector */}
        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <label className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300 flex items-center space-x-2">
              <Sprout className="w-4 h-4 text-emerald-500" />
              <span>{language === 'kn' ? 'ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ (Crop Selection)' : 'Select Crop for Water & Agronomic Intelligence'}</span>
            </label>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'kn' ? `ಪ್ರಸ್ತುತ: ${selectedCrop?.name_kn || 'ರಾಗಿ'}` : `Active: ${selectedCrop?.name || 'Ragi'}`}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-2.5">
            {mockCrops.map((crop) => {
              const isSelected = (selectedCrop?.key || 'ragi') === crop.key;
              return (
                <button
                  key={crop.key}
                  onClick={() => setSelectedCrop(crop)}
                  className={`p-3 rounded-2xl border text-left transition-all relative overflow-hidden flex flex-col justify-between space-y-1.5 ${
                    isSelected
                      ? 'bg-emerald-500/10 border-emerald-500 text-emerald-900 dark:text-emerald-300 shadow-md shadow-emerald-500/10 ring-1 ring-emerald-500/30'
                      : 'bg-slate-50 dark:bg-[#070B19] border-slate-200 dark:border-slate-800/80 text-slate-700 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black">
                      {language === 'kn' ? crop.name_kn : crop.name.split(' ')[0]}
                    </span>
                    {isSelected && (
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 shrink-0" />
                    )}
                  </div>
                  <div className="flex items-center justify-between text-[10px] text-slate-400 dark:text-slate-500 font-medium">
                    <span>{crop.category}</span>
                    <span className="font-mono">Kc {crop.kc_mid}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* SECTION 2: CURRENT AGRICULTURAL WATER STATUS (PROMINENT DECISION LAYER) */}
      {/* ============================================================ */}
      <motion.div
        variants={cardFadeUp}
        className={`p-6 rounded-3xl border shadow-md space-y-5 transition-all ${
          waterIntel.status === 'WATER_DEFICIT'
            ? 'bg-gradient-to-br from-rose-50 to-amber-50/40 dark:from-rose-950/30 dark:via-[#0B1021] dark:to-rose-950/20 border-rose-300 dark:border-rose-800/80'
            : waterIntel.status === 'EXCESS_WATER_RISK'
            ? 'bg-gradient-to-br from-blue-50 to-cyan-50/40 dark:from-blue-950/30 dark:via-[#0B1021] dark:to-cyan-950/20 border-blue-300 dark:border-blue-800/80'
            : 'bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/30 dark:via-[#0B1021] dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-800/80'
        }`}
      >
        {/* Header Question & Status Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200/80 dark:border-slate-800 pb-4">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <Waves className={`w-5 h-5 ${
                waterIntel.status === 'WATER_DEFICIT' ? 'text-rose-500' : waterIntel.status === 'EXCESS_WATER_RISK' ? 'text-blue-500' : 'text-emerald-500'
              }`} />
              <span className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300">
                {language === 'kn' ? 'ಕೃಷಿ ತೇವಾಂಶ ಮತ್ತು ನೀರಿನ ಸ್ಥಿತಿ ವಿಶ್ಲೇಷಣೆ' : 'Agricultural Crop Water Requirement Status'}
              </span>
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight">
              {language === 'kn' 
                ? `${selectedLocation.district} ಜಿಲ್ಲೆಯಲ್ಲಿ ${selectedCrop?.name_kn || 'ರಾಗಿ'} ಬೆಳೆಗೆ ನೀರಿನ ಸ್ಥಿತಿ:`
                : `Current Water Need for ${selectedCrop?.name || 'Ragi'} in ${selectedLocation.district}:`}
            </h2>
          </div>

          {/* Large Actionable Water Need Banner */}
          <div className="shrink-0 flex items-center space-x-2">
            <span className={`px-4 py-2 rounded-2xl font-black text-xs sm:text-sm uppercase tracking-wider border shadow-sm ${
              waterIntel.status === 'WATER_DEFICIT'
                ? 'bg-rose-500 text-white border-rose-600 shadow-rose-500/20'
                : waterIntel.status === 'EXCESS_WATER_RISK'
                ? 'bg-blue-600 text-white border-blue-700 shadow-blue-500/20'
                : 'bg-emerald-600 text-white border-emerald-700 shadow-emerald-500/20'
            }`}>
              {language === 'kn' ? waterIntel.waterNeedDescription_kn : waterIntel.waterNeedDescription}
            </span>
          </div>
        </div>

        {/* Core Decision Summary Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
          
          {/* Left: Recommended Action */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-white/90 dark:bg-[#070B19]/90 border border-slate-200 dark:border-slate-800 space-y-3 flex flex-col justify-between">
            <div className="space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
                {language === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ತುರ್ತು ಕೃಷಿ ಕ್ರಮ' : 'Recommended Agronomic Action'}
              </span>
              <p className="text-base sm:text-lg font-black text-slate-900 dark:text-white leading-snug">
                "{language === 'kn' ? waterIntel.recommendation.action_kn : waterIntel.recommendation.action_en}"
              </p>
            </div>

            {/* Stage and Resilience Context */}
            <div className="pt-3 border-t border-slate-100 dark:border-slate-800 text-xs flex flex-wrap items-center justify-between gap-2 text-slate-500 dark:text-slate-400 font-medium">
              <span>
                <strong>{language === 'kn' ? 'ನಿರ್ಣಾಯಕ ಹಂತ:' : 'Critical Stage:'}</strong> {language === 'kn' ? waterIntel.criticalStages_kn : waterIntel.criticalStages}
              </span>
              <span className="px-2.5 py-0.5 rounded-full bg-slate-100 dark:bg-slate-800 text-[11px] font-bold">
                {waterIntel.droughtResilience} Resilience
              </span>
            </div>
          </div>

          {/* Right: Recommended Agricultural Techniques */}
          <div className="lg:col-span-6 p-5 rounded-2xl bg-white/90 dark:bg-[#070B19]/90 border border-slate-200 dark:border-slate-800 space-y-3">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
              {language === 'kn' ? 'ಅನುಸರಿಸಬೇಕಾದ ಕೃಷಿ ಪದ್ಧತಿಗಳು' : 'Recommended Field Techniques'}
            </span>
            <ul className="space-y-2">
              {(language === 'kn' ? waterIntel.recommendation.techniques_kn : waterIntel.recommendation.techniques_en).map((tech, idx) => (
                <li key={idx} className="text-xs sm:text-sm font-semibold text-slate-800 dark:text-slate-200 flex items-start space-x-2.5">
                  <CheckCircle2 className={`w-4 h-4 mt-0.5 shrink-0 ${
                    waterIntel.status === 'WATER_DEFICIT' ? 'text-rose-500' : waterIntel.status === 'EXCESS_WATER_RISK' ? 'text-blue-500' : 'text-emerald-500'
                  }`} />
                  <span className="leading-relaxed">{tech}</span>
                </li>
              ))}
            </ul>
          </div>

        </div>
      </motion.div>

      {/* ============================================================ */}
      {/* SECTION 3: 4 PRIMARY LIVE RAINFALL & RISK METRIC CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: PREDICTED MONTHLY RAINFALL */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl hover:border-sky-500/40 transition-all shadow-sm dark:shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'kn' ? 'ನಿರೀಕ್ಷಿತ ಮಾಸಿಕ ಮಳೆ' : 'PREDICTED RAINFALL'}
            </span>
            <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-500 dark:text-sky-400 group-hover:scale-110 transition-transform">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {predictedRainfall.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">mm</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'kn' ? 'ಪ್ರಾದೇಶಿಕ TFLite ಮುನ್ಸೂಚನೆ' : 'Monthly Model Inference'}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
              deviationPct < -30
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                : deviationPct < -10
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}>
              {deviationPct > 0 ? '+' : ''}{deviationPct.toFixed(1)}% vs Normal
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Base: {baselineMm.toFixed(1)} mm</span>
          </div>
        </motion.div>

        {/* Card 2: MONSOON RISK PHASE */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl hover:border-amber-500/40 transition-all shadow-sm dark:shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'kn' ? 'ಮಾನ್ಸೂನ್ ಅಪಾಯ ಹಂತ' : 'MONSOON RISK PHASE'}
            </span>
            <div className={`p-2.5 rounded-2xl border group-hover:scale-110 transition-transform ${
              riskCategory === 'HIGH'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-500 dark:text-rose-400'
                : riskCategory === 'MODERATE'
                ? 'bg-amber-500/10 border-amber-500/30 text-amber-500 dark:text-amber-400'
                : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-500 dark:text-emerald-400'
            }`}>
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className={`text-3xl font-black tracking-tight block ${
              riskCategory === 'HIGH' ? 'text-rose-600 dark:text-rose-400' : riskCategory === 'MODERATE' ? 'text-amber-600 dark:text-amber-400' : 'text-emerald-600 dark:text-emerald-400'
            }`}>
              {riskCategory}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {drySpellWarning 
                ? (language === 'kn' ? 'ಒಣ ಹವೆಯ ಎಚ್ಚರಿಕೆ ಸಕ್ರಿಯವಾಗಿದೆ' : 'Dry Spell Warning Active') 
                : (language === 'kn' ? 'ಸಾಮಾನ್ಯ ತೇವಾಂಶ ಪರಿಸ್ಥಿತಿ' : 'Optimal Moisture Conditions')}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
            <span className={`px-2.5 py-0.5 rounded-full font-bold text-xs ${
              riskCategory === 'HIGH'
                ? 'bg-rose-500/10 border border-rose-500/30 text-rose-600 dark:text-rose-400'
                : riskCategory === 'MODERATE'
                ? 'bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400'
                : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
            }`}>
              {riskCategory === 'HIGH' ? 'Severe Deficit' : riskCategory === 'MODERATE' ? 'Moderate Stress' : 'Optimal Soil'}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {drySpellWarning ? 'Dry Alert' : 'Moisture Good'}
            </span>
          </div>
        </motion.div>

        {/* Card 3: 16-DAY NEAR TERM FORECAST */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl hover:border-indigo-500/40 transition-all shadow-sm dark:shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'kn' ? '16-ದಿನಗಳ ಮುನ್ಸೂಚನೆ' : '16-DAY FORECAST'}
            </span>
            <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-500 dark:text-indigo-400 group-hover:scale-110 transition-transform">
              <Droplets className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {forecast14Day.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">mm</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'kn' ? 'ಮಲ್ಟಿ-ಸೋರ್ಸ್ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ' : 'Open-Meteo Ensemble Total'}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              GFS + ICON + ECMWF
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">16-Day Window</span>
          </div>
        </motion.div>

        {/* Card 4: HISTORICAL BASELINE */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl hover:border-emerald-500/40 transition-all shadow-sm dark:shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {language === 'kn' ? 'ಸಾಮಾನ್ಯ ಸರಾಸರಿ ಮಳೆ' : 'NORMAL BASELINE'}
            </span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">
                {baselineMm.toFixed(1)}
              </span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">mm</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {language === 'kn' ? '2000-2023 ಸರಾಸರಿ ಮಳೆ ಪ್ರಮಾಣ' : '2000-2023 Climatology Mean'}
            </p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              24-Year Dataset
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Ground Truth</span>
          </div>
        </motion.div>

      </div>

      {/* ============================================================ */}
      {/* SECTION 4: RAINFALL ANOMALY CHART + TELECONNECTION SIGNALS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 7 Columns: Rainfall Anomaly Chart */}
        <motion.div 
          variants={cardFadeUp}
          className="lg:col-span-7 p-6 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl space-y-5 shadow-sm dark:shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                {language === 'kn' ? 'ಮಳೆ ವ್ಯತ್ಯಾಸದ ಪ್ರವೃತ್ತಿ ಮತ್ತು ಮುನ್ಸೂಚನೆ' : 'RAINFALL ANOMALY TREND & PROJECTION'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'kn' 
                  ? `ಐತಿಹಾಸಿಕ ವಾಡಿಕೆ ಮಳೆಗೆ ಹೋಲಿಸಿದಾಗ ಮಾದರಿ ಲೆಕ್ಕಾಚಾರ ಮಾಡಿದ ಪ್ರವೃತ್ತಿ (${selectedLocation.district})`
                  : `Historical climatology vs model-predicted anomaly trajectory (${selectedLocation.district})`}
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-sky-600 dark:text-sky-400 shrink-0">
              August 2026 Cycle
            </div>
          </div>

          {/* Guaranteed Non-Zero Height Recharts Chart Container */}
          <div className="h-[280px] w-full min-h-[280px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trends} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#CBD5E1" vertical={false} className="dark:stroke-slate-800" />
                <XAxis dataKey="day" stroke="#64748B" fontSize={12} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={12} tickLine={false} unit="mm" domain={[-30, 30]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                  itemStyle={{ color: '#38BDF8' }}
                />
                <ReferenceLine y={0} stroke="#94A3B8" strokeDasharray="3 3" />
                <Bar dataKey="observed" fill="#0284C7" radius={[4, 4, 0, 0]} name="Observed Anomaly" />
                <Line 
                  type="monotone" 
                  dataKey="projected" 
                  stroke="#38BDF8" 
                  strokeWidth={3} 
                  dot={{ r: 4, fill: '#38BDF8', stroke: '#070B19', strokeWidth: 2 }} 
                  activeDot={{ r: 6, fill: '#38BDF8', stroke: '#FFF' }} 
                  name="Model Projection" 
                />
              </ComposedChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Right 5 Columns: Active Climate Signals (Current Cycle Inputs) */}
        <motion.div 
          variants={cardFadeUp}
          className="lg:col-span-5 p-6 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl space-y-5 shadow-sm dark:shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight uppercase">
                {language === 'kn' ? 'ಹವಾಮಾನ ನಿಯತಾಂಕಗಳು' : 'CURRENT CYCLE CLIMATE INPUTS'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {language === 'kn' ? 'TFLite ಮಾದರಿಗೆ ನೀಡಲಾದ ಜಾಗತಿಕ ಹವಾಮಾನ ಸೂಚ್ಯಂಕಗಳು' : 'Regional teleconnection signals supplied to TFLite model'}
              </p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold font-mono">
              Aug '26
            </span>
          </div>

          {/* Climate Signal List */}
          <div className="space-y-3">
            {[
              { title: 'DMI (Dipole Mode Index)', sub: 'Indian Ocean Dipole Anomaly', val: `+${CURRENT_CYCLE_INDICES.dmi.toFixed(2)}`, color: 'text-sky-500 dark:text-sky-400 bg-sky-500/10 border-sky-500/30' },
              { title: 'ONI (Oceanic Niño Index)', sub: 'ENSO Pacific SST Anomaly', val: `${CURRENT_CYCLE_INDICES.oni.toFixed(2)}`, color: 'text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
              { title: 'MJO Phase', sub: 'Madden-Julian Convective Zone', val: `Phase ${CURRENT_CYCLE_INDICES.mjo_phase.toFixed(0)}`, color: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/30' },
              { title: 'MJO Amplitude', sub: 'Convective Strength Index', val: `${CURRENT_CYCLE_INDICES.mjo_amplitude.toFixed(2)}`, color: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' }
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800/80 flex items-center justify-between hover:border-sky-500/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border ${item.color}`}>
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{item.title}</h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{item.sub}</p>
                  </div>
                </div>
                <span className={`text-xs font-mono font-black ${item.val.startsWith('-') ? 'text-rose-500 dark:text-rose-400' : 'text-sky-600 dark:text-sky-400'}`}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ============================================================ */}
      {/* SECTION 5: AI ADVISORY & INTELLIGENCE SUMMARY */}
      {/* ============================================================ */}
      <motion.div 
        variants={cardFadeUp}
        className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4"
      >
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
          <div className="flex items-center space-x-2">
            <div className="w-9 h-9 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-500">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                {language === 'kn' ? 'ಮಾದರಿ ಆಧಾರಿತ ಕೃಷಿ ಮುನ್ಸೂಚನಾ ಸಲಹೆ' : 'AI Agronomic Model Advisory'}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                {selectedLocation.district} • {selectedCrop?.name || 'Ragi'}
              </p>
            </div>
          </div>
          <span className="px-3 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold font-mono">
            FastAPI Grounded
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800">
          <p className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
            {language === 'kn' 
              ? (prediction?.advisory?.kannada || 'ಸಾಮಾನ್ಯ ಬಿತ್ತನೆ ಮತ್ತು ಕೃಷಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಮುಂದುವರಿಸಿ.')
              : (prediction?.advisory?.english || 'Standard sowing and field operations recommended.')}
          </p>
        </div>
      </motion.div>

    </motion.div>
  );
};
