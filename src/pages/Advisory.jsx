import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { mockCrops } from '../data/mock/mockCrops';
import { KARNATAKA_DISTRICTS } from '../data/mock/mockLocations';
import { CURRENT_CYCLE_INDICES } from '../config/currentCycleIndices';
import { useLanguage } from '../context/LanguageContext';
import { useRole } from '../context/RoleContext';
import { evaluateCropWaterIntelligence, CROP_WATER_PROFILES } from '../services/cropWaterIntelligence';
import { RiskBadge } from '../components/common/RiskBadge';
import { 
  Sprout, 
  Droplets, 
  MapPin, 
  Calendar, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldCheck, 
  RefreshCw, 
  ArrowRight,
  Info,
  Clock,
  Layers,
  Sparkles,
  Waves
} from 'lucide-react';

export const Advisory = () => {
  const { language, t } = useLanguage();
  const { selectedLocation, setSelectedLocation, selectedCrop, setSelectedCrop } = useRole();
  const [prediction, setPrediction] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAdvisoryData = async () => {
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
      console.error('Advisory Fetch Error:', err);
      setError('Unable to connect to prediction service');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAdvisoryData();
  }, [selectedLocation, selectedCrop]);

  const waterIntel = evaluateCropWaterIntelligence(selectedCrop?.key, prediction);

  // Compute Action Priority
  const getActionPriority = (status, drySpell) => {
    if (status === 'WATER_DEFICIT' || drySpell) return { level: 'HIGH', color: 'rose', badge: 'HIGH PRIORITY', badge_kn: 'ಹೆಚ್ಚಿನ ಆದ್ಯತೆ' };
    if (status === 'EXCESS_WATER_RISK') return { level: 'MEDIUM', color: 'blue', badge: 'MEDIUM PRIORITY', badge_kn: 'ಮಧ್ಯಮ ಆದ್ಯತೆ' };
    return { level: 'LOW', color: 'emerald', badge: 'STANDARD MONITORING', badge_kn: 'ಸಾಮಾನ್ಯ ಪರಿಶೀಲನೆ' };
  };

  const priority = getActionPriority(waterIntel.status, prediction?.drySpellWarning);

  const cardFadeUp = {
    hidden: { opacity: 0, y: 12 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4 font-sans">
        <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-500 animate-spin">
          <Sprout className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-500 dark:text-slate-400 font-mono animate-pulse">
          Synthesizing FAO-56 crop water advisory for {selectedLocation.district} ({selectedCrop?.name || 'Ragi'})...
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Top Header Card: Global Location, Crop & Cycle Context */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-5">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              <Sprout className="w-4 h-4" />
              <span>{language === 'kn' ? 'ಕೃಷಿ ತೀರ್ಮಾನ ಮತ್ತು ಸಲಹಾ ವಿಭಾಗ' : 'Hyperlocal Agricultural Decision Engine'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              {language === 'kn' ? 'ಬೆಳೆ-ನಿರ್ದಿಷ್ಟ ಕೃಷಿ ಮತ್ತು ನೀರಿನ ನಿರ್ವಹಣೆ' : 'Crop-Specific Water & Agronomic Guidance'}
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              {language === 'kn'
                ? 'ಪ್ರಾದೇಶಿಕ ಮಳೆ ಮುನ್ಸೂಚನೆಯನ್ನು ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಕ್ಷೇತ್ರ ಮಟ್ಟದ ನೀರಾವರಿ ಕ್ರಮಗಳಿಗೆ ಅನುವಾದಿಸಲಾಗುತ್ತದೆ.'
                : 'Translating live rainfall predictions into field-level soil moisture, irrigation scheduling, and agronomic actions.'}
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={fetchAdvisoryData}
              className="px-3.5 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-emerald-600 text-xs font-bold flex items-center space-x-2 transition-colors active:scale-95"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>{language === 'kn' ? 'ನವೀಕರಿಸಿ' : 'Refresh Advisory'}</span>
            </button>
          </div>
        </div>

        {/* Global Context Indicator Bar */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-1">
          
          {/* Location Context */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-sky-500/10 text-sky-500">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ಸ್ಥಳ' : 'Selected Location'}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                {selectedLocation.district} ({selectedLocation.block || 'Centroid'})
              </span>
            </div>
          </div>

          {/* Crop Context */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {language === 'kn' ? 'ಆಯ್ಕೆಮಾಡಿದ ಬೆಳೆ' : 'Selected Crop'}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                {language === 'kn' ? selectedCrop?.name_kn : selectedCrop?.name}
              </span>
            </div>
          </div>

          {/* Forecast Horizon Context */}
          <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800/80 flex items-center space-x-3">
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-500">
              <Calendar className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                {language === 'kn' ? 'ಮುನ್ಸೂಚನಾ ಅವಧಿ' : 'Forecast Context'}
              </span>
              <span className="text-xs font-black text-slate-900 dark:text-white truncate block">
                {CURRENT_CYCLE_INDICES.cycleLabel} (16-30 Days)
              </span>
            </div>
          </div>

        </div>

        {/* 5-Crop Quick Switcher */}
        <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 block">
            {language === 'kn' ? 'ಬೆಳೆ ಬದಲಾಯಿಸಿ:' : 'Switch Kharif Crop:'}
          </span>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {mockCrops.map((crop) => {
              const isSelected = (selectedCrop?.key || 'ragi') === crop.key;
              return (
                <button
                  key={crop.key}
                  onClick={() => setSelectedCrop(crop)}
                  className={`px-3 py-2 rounded-2xl border text-xs font-bold transition-all flex items-center justify-between ${
                    isSelected
                      ? 'bg-emerald-500 text-white border-emerald-600 shadow-md shadow-emerald-500/20'
                      : 'bg-slate-50 dark:bg-[#070B19] border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:border-slate-300'
                  }`}
                >
                  <span>{language === 'kn' ? crop.name_kn : crop.name.split(' ')[0]}</span>
                  <span className={`text-[10px] font-mono ${isSelected ? 'text-emerald-100' : 'text-slate-400'}`}>
                    Kc {crop.kc_mid}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

      </div>

      {/* Main Grid: Water Status & Action Plan */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        
        {/* Left 8 Cols: Agricultural Status & Action Protocol */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* Prominent Crop Water Status Banner */}
          <div className={`p-6 rounded-3xl border shadow-md space-y-4 ${
            waterIntel.status === 'WATER_DEFICIT'
              ? 'bg-gradient-to-br from-rose-50 to-amber-50/40 dark:from-rose-950/30 dark:via-[#0B1021] dark:to-rose-950/20 border-rose-300 dark:border-rose-800/80 text-rose-950 dark:text-rose-100'
              : waterIntel.status === 'EXCESS_WATER_RISK'
              ? 'bg-gradient-to-br from-blue-50 to-cyan-50/40 dark:from-blue-950/30 dark:via-[#0B1021] dark:to-cyan-950/20 border-blue-300 dark:border-blue-800/80 text-blue-950 dark:text-blue-100'
              : 'bg-gradient-to-br from-emerald-50 to-teal-50/40 dark:from-emerald-950/30 dark:via-[#0B1021] dark:to-emerald-950/20 border-emerald-300 dark:border-emerald-800/80 text-emerald-950 dark:text-emerald-100'
          }`}>
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Waves className="w-5 h-5" />
                <span className="text-xs font-black uppercase tracking-wider">
                  {language === 'kn' ? 'ಪ್ರಸ್ತುತ ನೀರಿನ ಸ್ಥಿತಿ' : 'Current Water Status'}
                </span>
              </div>

              <div className="flex items-center space-x-2">
                <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider bg-white/80 dark:bg-black/40 border border-current">
                  {language === 'kn' ? priority.badge_kn : priority.badge}
                </span>
              </div>
            </div>

            <div className="space-y-1.5">
              <h2 className="text-xl sm:text-2xl font-black tracking-tight">
                {language === 'kn' ? waterIntel.waterNeedDescription_kn : waterIntel.waterNeedDescription}
              </h2>
              <p className="text-xs sm:text-sm font-semibold opacity-90 leading-relaxed">
                {selectedLocation.district} • {selectedCrop?.name} ({waterIntel.droughtResilience} Drought Resilience)
              </p>
            </div>

            {/* Recommended Action Quote */}
            <div className="p-4 rounded-2xl bg-white/90 dark:bg-[#070B19]/90 border border-slate-200 dark:border-slate-800">
              <span className="text-[10px] font-black uppercase tracking-wider text-slate-400 block mb-1">
                {language === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ರಮ' : 'Recommended Action'}
              </span>
              <p className="text-sm sm:text-base font-black text-slate-900 dark:text-white leading-snug">
                "{language === 'kn' ? waterIntel.recommendation.action_kn : waterIntel.recommendation.action_en}"
              </p>
            </div>
          </div>

          {/* Actionable Field Techniques Card Grid */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {language === 'kn' ? 'ಶಿಫಾರಸು ಮಾಡಿದ ಕ್ಷೇತ್ರ ಮಟ್ಟದ ತಂತ್ರಗಳು' : 'Recommended Agronomic Techniques'}
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400 font-bold">
                Package of Practices
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {(language === 'kn' ? waterIntel.recommendation.techniques_kn : waterIntel.recommendation.techniques_en).map((tech, idx) => (
                <div 
                  key={idx}
                  className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1 flex items-start space-x-3"
                >
                  <CheckCircle2 className={`w-4 h-4 shrink-0 mt-0.5 ${
                    waterIntel.status === 'WATER_DEFICIT' ? 'text-rose-500' : waterIntel.status === 'EXCESS_WATER_RISK' ? 'text-blue-500' : 'text-emerald-500'
                  }`} />
                  <span className="text-xs sm:text-sm font-bold text-slate-800 dark:text-slate-200 leading-relaxed">
                    {tech}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Multi-Crop Comparative Response Matrix */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <div className="flex items-center space-x-2">
                <Layers className="w-4 h-4 text-sky-500" />
                <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                  {language === 'kn' ? 'ಇತರ ಬೆಳೆಗಳ ತುಲನಾತ್ಮಕ ನೀರಿನ ಸ್ಥಿತಿ' : 'Comparative Crop Water Matrix'}
                </h3>
              </div>
              <span className="text-xs text-slate-400 font-mono">
                {selectedLocation.district}
              </span>
            </div>

            <div className="space-y-2">
              {mockCrops.map((c) => {
                const cIntel = evaluateCropWaterIntelligence(c.key, prediction);
                const isSelected = (selectedCrop?.key || 'ragi') === c.key;

                return (
                  <div
                    key={c.key}
                    onClick={() => setSelectedCrop(c)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3 ${
                      isSelected
                        ? 'bg-emerald-500/10 border-emerald-500 ring-1 ring-emerald-500/30'
                        : 'bg-slate-50 dark:bg-[#070B19] border-slate-200 dark:border-slate-800 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="p-2 rounded-xl bg-slate-200/60 dark:bg-slate-800 font-mono text-xs font-bold">
                        Kc {c.kc_mid}
                      </div>
                      <div>
                        <div className="flex items-center space-x-2">
                          <span className="text-xs font-black text-slate-900 dark:text-white">
                            {language === 'kn' ? c.name_kn : c.name}
                          </span>
                          {isSelected && (
                            <span className="px-1.5 py-0.2 rounded bg-emerald-500 text-white text-[9px] font-bold">
                              ACTIVE
                            </span>
                          )}
                        </div>
                        <span className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                          {c.category} • {cIntel.droughtResilience} Resilience
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end space-x-3 shrink-0">
                      <span className={`px-2.5 py-1 rounded-xl text-xs font-black ${
                        cIntel.status === 'WATER_DEFICIT'
                          ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                          : cIntel.status === 'EXCESS_WATER_RISK'
                          ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                          : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                      }`}>
                        {language === 'kn' ? cIntel.waterStatus_kn : cIntel.waterStatus}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Right 4 Cols: Rainfall Outlook & Model Context */}
        <div className="lg:col-span-4 space-y-6">
          
          {/* Rainfall Outlook Summary Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <span className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                Rainfall Outlook
              </span>
              <RiskBadge category={prediction?.riskCategory || 'NORMAL'} />
            </div>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Monthly Model:</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {prediction?.predictedMonthlyRainfall?.toFixed(1) ?? '--'} mm
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">14-Day Ensemble:</span>
                <span className="text-base font-black text-sky-600 dark:text-sky-400">
                  {prediction?.forecast14DayRainfall?.toFixed(1) ?? '--'} mm
                </span>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">2000-2023 Normal:</span>
                <span className="text-base font-black text-slate-900 dark:text-white">
                  {prediction?.historicalBaseline?.toFixed(1) ?? '--'} mm
                </span>
              </div>

              <div className={`p-3.5 rounded-2xl border flex items-center justify-between font-bold ${
                (prediction?.deviationPct ?? 0) < -20
                  ? 'bg-rose-500/10 border-rose-500/30 text-rose-600 dark:text-rose-400'
                  : 'bg-emerald-500/10 border-emerald-500/30 text-emerald-600 dark:text-emerald-400'
              }`}>
                <span>Anomaly Deviation:</span>
                <span>
                  {(prediction?.deviationPct ?? 0) > 0 ? '+' : ''}
                  {prediction?.deviationPct?.toFixed(1) ?? '--'}%
                </span>
              </div>
            </div>
          </div>

          {/* Crop FAO-56 Specification Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center space-x-2 border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <Sparkles className="w-4 h-4 text-emerald-500" />
              <h3 className="text-xs font-black uppercase tracking-wider text-slate-900 dark:text-white">
                FAO-56 Crop Telemetry
              </h3>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Water Demand:</span>
                <span className="font-bold text-slate-900 dark:text-white">{waterIntel.waterDemandCategory}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Mid-Season Kc:</span>
                <span className="font-mono font-bold text-emerald-600 dark:text-emerald-400">{waterIntel.kc_mid}</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-slate-500 dark:text-slate-400">Drought Resilience:</span>
                <span className="font-bold text-slate-900 dark:text-white">{waterIntel.droughtResilience}</span>
              </div>

              <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
                  Critical Growth Stage:
                </span>
                <p className="font-semibold text-slate-800 dark:text-slate-200">
                  {language === 'kn' ? waterIntel.criticalStages_kn : waterIntel.criticalStages}
                </p>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
