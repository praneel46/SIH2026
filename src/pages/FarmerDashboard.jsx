import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { mockCrops } from '../data/mock/mockCrops';
import { KARNATAKA_DISTRICTS } from '../data/mock/mockLocations';
import { CURRENT_CYCLE_INDICES } from '../config/currentCycleIndices';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';
import { 
  CloudRain, 
  AlertTriangle, 
  Sprout, 
  CheckCircle2, 
  Languages, 
  MapPin, 
  Droplets, 
  Calendar, 
  ShieldCheck, 
  ArrowRight,
  Info,
  RefreshCw,
  BellRing,
  Smartphone
} from 'lucide-react';

export const FarmerDashboard = () => {
  const { language, setLanguage, t } = useLanguage();
  const { selectedLocation, setSelectedLocation, selectedCrop, setSelectedCrop } = useRole();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchFarmerAdvisory = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiService.evaluatePrediction({
        latitude: selectedLocation.lat || 13.29,
        longitude: selectedLocation.lon || 77.55,
        month: new Date().getMonth() + 1,
        crop_type: selectedCrop?.key || 'ragi',
        dmi: CURRENT_CYCLE_INDICES.dmi,
        oni: CURRENT_CYCLE_INDICES.oni,
        mjo_phase: CURRENT_CYCLE_INDICES.mjo_phase,
        mjo_amplitude: CURRENT_CYCLE_INDICES.mjo_amplitude
      });

      if (res.success && res.data) {
        setPrediction(res.data);
      } else {
        setError(res.error || 'Failed to load agricultural advisory');
      }
    } catch (err) {
      console.error('Farmer Advisory Fetch Error:', err);
      setError('Unable to connect to prediction service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFarmerAdvisory();
  }, [selectedLocation, selectedCrop]);

  // Plain-Language Risk Interpretation
  const getRiskDetails = (riskCategory, drySpellWarning) => {
    if (riskCategory === 'HIGH' || drySpellWarning) {
      return {
        title_en: "High Chance of Dry Spell / Severe Moisture Deficit",
        title_kn: "ತೀವ್ರ ತೇವಾಂಶ ಕೊರತೆ / ಒಣ ಹವೆಯ ಅಪಾಯ",
        sub_en: "Rainfall is predicted to be significantly below normal. Protect standing crops and plan supplemental irrigation.",
        sub_kn: "ಮಳೆಯು ವಾಡಿಕೆಗಿಂತ ಗಣನೀಯವಾಗಿ ಕಡಿಮೆಯಾಗುವ ಮುನ್ಸೂಚನೆ ಇದೆ. ಬೆಳೆಗಳಿಗೆ ತೇವಾಂಶ ಸಂರಕ್ಷಣಾ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ.",
        badge: "HIGH RISK",
        badge_kn: "ಹೆಚ್ಚಿನ ಅಪಾಯ",
        color: "rose",
        bgLight: "bg-rose-50 border-rose-200 text-rose-800",
        bgDark: "dark:bg-rose-950/40 dark:border-rose-900/60 dark:text-rose-200"
      };
    }
    if (riskCategory === 'MODERATE') {
      return {
        title_en: "Moderate Moisture Stress Expected",
        title_kn: "ಮಧ್ಯಮ ತೇವಾಂಶ ಕೊರತೆಯ ಸಾಧ್ಯತೆ",
        sub_en: "Intermittent dry periods expected. Sowing can proceed with drought-hardy seed varieties.",
        sub_kn: "ಮಧ್ಯಂತರ ಒಣ ಅವಧಿಗಳು ಸಂಭವಿಸಬಹುದು. ಬರ ನಿರೋಧಕ ಬೀಜೋಪಚಾರದೊಂದಿಗೆ ಬಿತ್ತನೆ ಮುಂದುವರಿಸಿ.",
        badge: "MODERATE RISK",
        badge_kn: "ಮಧ್ಯಮ ಅಪಾಯ",
        color: "amber",
        bgLight: "bg-amber-50 border-amber-200 text-amber-800",
        bgDark: "dark:bg-amber-950/40 dark:border-amber-900/60 dark:text-amber-200"
      };
    }
    if (riskCategory === 'ABOVE_NORMAL') {
      return {
        title_en: "Surplus Rainfall / Good Moisture Availability",
        title_kn: "ಸಾಮಾನ್ಯಕ್ಕಿಂತ ಹೆಚ್ಚು ಮಳೆ / ಸಮೃದ್ಧ ತೇವಾಂಶ",
        sub_en: "Abundant rainfall expected. Ensure field drainage channels are clear to prevent waterlogging.",
        sub_kn: "ಸಾಕಷ್ಟು ಮಳೆಯಾಗುವ ನಿರೀಕ್ಷೆಯಿದೆ. ಜಮೀನಿನಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿದು ಹೋಗಲು ಕಾಲುವೆಗಳನ್ನು ಸಿದ್ಧಪಡಿಸಿ.",
        badge: "SURPLUS",
        badge_kn: "ಹೆಚ್ಚುವರಿ ಮಳೆ",
        color: "blue",
        bgLight: "bg-sky-50 border-sky-200 text-sky-800",
        bgDark: "dark:bg-sky-950/40 dark:border-sky-900/60 dark:text-sky-200"
      };
    }
    return {
      title_en: "Optimal Seasonal Soil Moisture",
      title_kn: "ಸೂಕ್ತ ಕಾಲೋಚಿತ ತೇವಾಂಶ ನಿರೀಕ್ಷಿಸಲಾಗಿದೆ",
      sub_en: "Normal seasonal rainfall expected. Favorable conditions for standard crop management.",
      sub_kn: "ವಾಡಿಕೆಯ ಮಳೆ ಮುನ್ಸೂಚನೆ ಇದೆ. ಸಾಮಾನ್ಯ ಬಿತ್ತನೆ ಮತ್ತು ಕೃಷಿ ಚಟುವಟಿಕೆಗಳಿಗೆ ಸೂಕ್ತ ಪರಿಸ್ಥಿತಿ.",
      badge: "OPTIMAL",
      badge_kn: "ಸಾಮಾನ್ಯ / ಸೂಕ್ತ",
      color: "emerald",
      bgLight: "bg-emerald-50 border-emerald-200 text-emerald-800",
      bgDark: "dark:bg-emerald-950/40 dark:border-emerald-900/60 dark:text-emerald-200"
    };
  };

  const risk = getRiskDetails(prediction?.riskCategory, prediction?.drySpellWarning);

  return (
    <div className="max-w-6xl mx-auto space-y-6 font-sans">
      
      {/* Top Header & Fast Selection Bar */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <span className="text-xs font-extrabold uppercase tracking-wider text-sky-600 dark:text-sky-400">
              {language === 'kn' ? 'ರೈತರ ಕೃಷಿ ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ' : 'Farmer Monsoon & Crop Advisory'}
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {language === 'kn' ? 'ಕರ್ನಾಟಕ ಕೃಷಿ ಸಲಹಾ ಕೇಂದ್ರ' : 'Karnataka Hyperlocal Farm Advisory'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'kn' 
                ? 'ನಿಮ್ಮ ಜಿಲ್ಲೆ ಮತ್ತು ಬೆಳೆಯನ್ನು ಆಯ್ಕೆಮಾಡಿ ತಕ್ಷಣದ ಹವಾಮಾನ ಅಪಾಯ ಮತ್ತು ಕೃಷಿ ಸಲಹೆ ಪಡೆಯಿರಿ.'
                : 'Select your district and crop to receive instant 14–30 day rainfall risk and agronomic guidance.'}
            </p>
          </div>

          {/* 1-Click Language Switcher */}
          <div className="flex items-center space-x-2 shrink-0">
            <Languages className="w-4 h-4 text-slate-400" />
            <div className="flex p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
              <button
                onClick={() => setLanguage('kn')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === 'kn' 
                    ? 'bg-sky-500 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                ಕನ್ನಡ (KN)
              </button>
              <button
                onClick={() => setLanguage('en')}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                  language === 'en' 
                    ? 'bg-sky-500 text-white shadow-md' 
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                English (EN)
              </button>
            </div>
          </div>
        </div>

        {/* District & Crop Pickers */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          
          {/* District Picker */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <MapPin className="w-3.5 h-3.5 text-sky-500" />
              <span>{language === 'kn' ? 'ಜಿಲ್ಲೆ ಆಯ್ಕೆಮಾಡಿ (District)' : 'Select District'}</span>
            </label>
            <select
              value={selectedLocation.district}
              onChange={(e) => {
                const d = KARNATAKA_DISTRICTS.find(x => x.name === e.target.value || x.id === e.target.value);
                if (d) {
                  setSelectedLocation(prev => ({
                    ...prev,
                    district: d.name,
                    lat: d.lat,
                    lon: d.lon
                  }));
                }
              }}
              className="w-full px-4 py-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-300 dark:border-slate-700 text-slate-900 dark:text-white text-sm font-semibold focus:outline-none focus:border-sky-500 transition-colors"
            >
              {KARNATAKA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>
                  {d.name} ({d.lat}° N, {d.lon}° E)
                </option>
              ))}
            </select>
          </div>

          {/* Crop Picker (5 FAO Crops) */}
          <div className="space-y-1.5">
            <label className="text-xs font-bold text-slate-700 dark:text-slate-300 flex items-center space-x-1.5">
              <Sprout className="w-3.5 h-3.5 text-emerald-500" />
              <span>{language === 'kn' ? 'ಬೆಳೆ ಆಯ್ಕೆಮಾಡಿ (Crop)' : 'Select Crop'}</span>
            </label>
            <div className="grid grid-cols-5 gap-2">
              {mockCrops.map((c) => {
                const isSelected = (selectedCrop?.key || 'ragi') === c.key;
                return (
                  <button
                    key={c.key}
                    onClick={() => setSelectedCrop(c)}
                    className={`py-2 px-1 rounded-2xl border text-center transition-all flex flex-col items-center justify-center space-y-1 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 text-emerald-600 dark:text-emerald-400 font-bold shadow-sm'
                        : 'bg-slate-50 dark:bg-[#070B19] border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <span className="text-xs">{language === 'kn' ? c.name_kn : c.name.split(' ')[0]}</span>
                    <span className="text-[10px] text-slate-400 opacity-80">{c.name.split(' ')[0]}</span>
                  </button>
                );
              })}
            </div>
          </div>

        </div>

      </div>

      {/* Main Content Area */}
      {loading ? (
        <div className="min-h-[40vh] flex flex-col items-center justify-center space-y-3 p-12">
          <div className="w-10 h-10 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-500 animate-spin">
            <CloudRain className="w-5 h-5" />
          </div>
          <p className="text-xs font-mono text-slate-500 dark:text-slate-400 animate-pulse">
            {language === 'kn' ? 'ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ ಪಡೆಯಲಾಗುತ್ತಿದೆ...' : 'Generating forecast for ' + selectedLocation.district + '...'}
          </p>
        </div>
      ) : error ? (
        <div className="p-6 rounded-3xl bg-rose-500/10 border border-rose-500/30 text-center space-y-3">
          <AlertTriangle className="w-8 h-8 text-rose-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900 dark:text-white">Unable to fetch farm advisory</h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">{error}</p>
          <button
            onClick={fetchFarmerAdvisory}
            className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold inline-flex items-center space-x-2"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          
          {/* 1. PLAIN-LANGUAGE RISK BANNER */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className={`p-6 rounded-3xl border ${risk.bgLight} ${risk.bgDark} shadow-md space-y-3 transition-colors`}
          >
            <div className="flex items-center justify-between">
              <span className="px-3 py-1 rounded-full bg-white/80 dark:bg-black/40 font-extrabold text-xs tracking-wider uppercase border border-current">
                {language === 'kn' ? risk.badge_kn : risk.badge}
              </span>
              <span className="text-xs font-semibold opacity-75">
                {selectedLocation.district} • {CURRENT_CYCLE_INDICES.cycleLabel}
              </span>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'kn' ? risk.title_kn : risk.title_en}
              </h2>
              <p className="text-xs sm:text-sm leading-relaxed opacity-90">
                {language === 'kn' ? risk.sub_kn : risk.sub_en}
              </p>
            </div>
          </motion.div>

          {/* 2. DEDICATED AI MODEL ADVISORY CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4"
          >
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                  <Sprout className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-extrabold text-slate-900 dark:text-white uppercase tracking-wider">
                    {language === 'kn' ? 'ಮಾದರಿ ಆಧಾರಿತ ಕೃಷಿ ಸಲಹೆ' : 'AI Agronomic Advisory (Model Inference)'}
                  </h3>
                  <span className="text-xs text-slate-500 dark:text-slate-400">
                    {language === 'kn' ? `${selectedCrop.name_kn} ಬೆಳೆಗೆ ಶಿಫಾರಸು` : `Specific guidance for ${selectedCrop.name}`}
                  </span>
                </div>
              </div>

              <span className="px-2.5 py-1 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 text-xs font-bold font-mono">
                FAO-56 Grounded
              </span>
            </div>

            {/* Advisory Sentence Displayed Prominently */}
            <div className="p-5 rounded-2xl bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 text-slate-800 dark:text-slate-100">
              <p className="text-base sm:text-lg font-bold leading-relaxed">
                "{language === 'kn' 
                  ? (prediction?.advisory?.kannada || 'ಸಾಮಾನ್ಯ ಬಿತ್ತನೆ ಮತ್ತು ಕೃಷಿ ಚಟುವಟಿಕೆಗಳನ್ನು ಮುಂದುವರಿಸಿ.')
                  : (prediction?.advisory?.english || 'Standard sowing and field operations recommended.')}"
              </p>
            </div>

            {/* Simple Key Numbers for Farmers */}
            <div className="grid grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                  {language === 'kn' ? 'ನಿರೀಕ್ಷಿತ ಮಳೆ' : 'Expected Rain'}
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono block mt-0.5">
                  {prediction?.predictedMonthlyRainfall?.toFixed(1) ?? '--'} mm
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                  {language === 'kn' ? 'ಸಾಮಾನ್ಯ ಸರಾಸರಿ' : 'Normal Baseline'}
                </span>
                <span className="text-lg font-black text-slate-900 dark:text-white font-mono block mt-0.5">
                  {prediction?.historicalBaseline?.toFixed(1) ?? '--'} mm
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-center">
                <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">
                  {language === 'kn' ? 'ವ್ಯತ್ಯಾಸ' : 'Deviation'}
                </span>
                <span className={`text-lg font-black font-mono block mt-0.5 ${
                  (prediction?.deviationPct ?? 0) < -20 ? 'text-rose-500' : 'text-emerald-500'
                }`}>
                  {(prediction?.deviationPct ?? 0) > 0 ? '+' : ''}
                  {prediction?.deviationPct?.toFixed(1) ?? '--'}%
                </span>
              </div>
            </div>

          </motion.div>

          {/* 3. SUPPLEMENTARY STANDARD EXTENSION BEST PRACTICES */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4"
          >
            <div className="flex items-center space-x-2">
              <Info className="w-4 h-4 text-sky-500" />
              <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 dark:text-slate-300">
                {language === 'kn' ? 'ಸಾಮಾನ್ಯ ಕೃಷಿ ವಿಸ್ತರಣಾ ಮಾರ್ಗಸೂಚಿಗಳು (Standard Extension Guidance)' : 'Standard Extension Best Practices'}
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'kn' ? 'ತೇವಾಂಶ ನಿರ್ವಹಣೆ' : 'Moisture Conservation'}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {language === 'kn' 
                    ? 'ನೆಲದಲ್ಲಿ ತೇವಾಂಶ ಉಳಿಸಿಕೊಳ್ಳಲು ಸಾವಯವ ಹೊದಿಕೆ (Mulch) ಮತ್ತು ಅಂತರ ಬೇಸಾಯ ಅನುಸರಿಸಿ.'
                    : 'Apply straw or crop residue mulching to minimize soil evaporation during dry intervals.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'kn' ? 'ಗೊಬ್ಬರ ನಿರ್ವಹಣೆ' : 'Fertilizer Application'}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {language === 'kn' 
                    ? 'ಮಳೆ ಕೊರತೆಯ ಸಂದರ್ಭದಲ್ಲಿ ಸಾರಜನಕ ಗೊಬ್ಬರ ಮೇಲುಗೊಬ್ಬರವಾಗಿ ನೀಡಬೇಡಿ.'
                    : 'Avoid top-dressing nitrogen fertilizers until soil receives sufficient wetting.'}
                </p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                <div className="flex items-center space-x-1.5 font-bold text-slate-900 dark:text-white">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  <span>{language === 'kn' ? 'ಕೀಟ ನಿಯಂತ್ರಣ' : 'Pest Monitoring'}</span>
                </div>
                <p className="text-slate-500 dark:text-slate-400">
                  {language === 'kn' 
                    ? 'ಒಣ ಹವೆಯಲ್ಲಿ ರಸಹೀರುವ ಕೀಟಗಳ ಬಾಧೆಯನ್ನು ನಿಯಮಿತವಾಗಿ ಗಮನಿಸಿ.'
                    : 'Scout regularly for sucking pests which proliferate during extended warm spells.'}
                </p>
              </div>
            </div>
          </motion.div>

          {/* 4. SMS / WHATSAPP BROADCAST PREVIEW CARD */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="p-5 rounded-3xl bg-slate-100/80 dark:bg-[#070B19] border border-slate-300 dark:border-slate-800 space-y-3 text-xs"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Smartphone className="w-4 h-4 text-sky-500" />
                <span className="font-bold text-slate-900 dark:text-white">
                  {language === 'kn' ? 'ಮೊಬೈಲ್ ಸಂದೇಶ ಮುನ್ನೋಟ (SMS / WhatsApp)' : 'Mobile Alert Preview (SMS / WhatsApp)'}
                </span>
              </div>
              <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 font-bold text-[10px]">
                Preview Only — Automated Gateway Pending Live Deployment
              </span>
            </div>

            <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-mono text-xs text-slate-700 dark:text-slate-300 space-y-1">
              <span className="font-bold text-sky-600 dark:text-sky-400">[SIH-MONSOON-KA]</span>
              <p>
                {selectedLocation.district}: {language === 'kn' ? risk.title_kn : risk.title_en}. {selectedCrop?.name || 'Ragi'}: {language === 'kn' ? prediction?.advisory?.kannada : prediction?.advisory?.english}
              </p>
            </div>
          </motion.div>

        </div>
      )}

    </div>
  );
};
