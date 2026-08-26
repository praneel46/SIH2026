import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { apiService } from '../services/apiService';
import { mockLocations, KARNATAKA_DISTRICTS } from '../data/mock/mockLocations';
import { mockCrops } from '../data/mock/mockCrops';
import { evaluateCropWaterIntelligence } from '../services/cropWaterIntelligence';
import { RiskBadge } from '../components/common/RiskBadge';
import { useLanguage } from '../context/LanguageContext';
import { 
  History as HistoryIcon, 
  Calendar, 
  MapPin, 
  Database, 
  RefreshCw, 
  Filter, 
  Layers, 
  Globe,
  Search,
  Sprout,
  Droplets,
  CloudRain,
  ChevronRight,
  X,
  CheckCircle2,
  ShieldAlert,
  Info,
  ExternalLink,
  Cpu
} from 'lucide-react';

export const History = () => {
  const { language, t } = useLanguage();
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [districtFilter, setDistrictFilter] = useState('ALL');
  const [cropFilter, setCropFilter] = useState('ALL');
  const [riskFilter, setRiskFilter] = useState('ALL');
  const [selectedRecord, setSelectedRecord] = useState(null);

  const loadHistory = async () => {
    setLoading(true);
    try {
      const res = await apiService.getPredictionHistory({
        district: districtFilter === 'ALL' ? null : districtFilter,
        limit: 50
      });
      const historyList = res.records || res.data || [];
      if (res.success && historyList.length > 0) {
        setRecords(historyList);
      } else {
        // Prototype seed records if database is empty on fresh local dev
        setRecords([
          {
            id: 101,
            timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
            district: 'Bengaluru Rural',
            latitude: 13.29,
            longitude: 77.55,
            crop_type: 'ragi',
            month: 8,
            dmi: 0.40,
            oni: -0.60,
            mjo_phase: 5,
            mjo_amplitude: 1.20,
            model_raw_prediction_mm: 98.4,
            gfs_forecast_mm: 22.4,
            icon_forecast_mm: 19.8,
            ecmwf_forecast_mm: 21.5,
            combined_prediction_mm: 116.5,
            historical_mean_mm: 137.1,
            deviation_pct: -15.0,
            risk_category: 'HIGH',
            dry_spell_warning: 1,
            model_agreement: 'HIGH',
            spread_mm: 2.6,
            advisory_given: 'Dry spell stress projected. Apply protective mulching and plan supplemental irrigation from farm ponds.'
          },
          {
            id: 102,
            timestamp: new Date(Date.now() - 3 * 3600 * 1000).toISOString(),
            district: 'Mysuru',
            latitude: 12.30,
            longitude: 76.64,
            crop_type: 'maize',
            month: 8,
            dmi: 0.40,
            oni: -0.60,
            mjo_phase: 5,
            mjo_amplitude: 1.20,
            model_raw_prediction_mm: 125.0,
            gfs_forecast_mm: 38.0,
            icon_forecast_mm: 35.5,
            ecmwf_forecast_mm: 36.8,
            combined_prediction_mm: 128.2,
            historical_mean_mm: 132.0,
            deviation_pct: -2.9,
            risk_category: 'NORMAL',
            dry_spell_warning: 0,
            model_agreement: 'HIGH',
            spread_mm: 2.5,
            advisory_given: 'Normal soil moisture expected. Proceed with scheduled top-dressing of nitrogen and inter-cultivation.'
          },
          {
            id: 103,
            timestamp: new Date(Date.now() - 8 * 3600 * 1000).toISOString(),
            district: 'Kalaburagi',
            latitude: 17.33,
            longitude: 76.83,
            crop_type: 'jowar',
            month: 8,
            dmi: 0.40,
            oni: -0.60,
            mjo_phase: 5,
            mjo_amplitude: 1.20,
            model_raw_prediction_mm: 74.2,
            gfs_forecast_mm: 14.1,
            icon_forecast_mm: 12.0,
            ecmwf_forecast_mm: 13.5,
            combined_prediction_mm: 78.4,
            historical_mean_mm: 142.6,
            deviation_pct: -45.0,
            risk_category: 'HIGH',
            dry_spell_warning: 1,
            model_agreement: 'MODERATE',
            spread_mm: 2.1,
            advisory_given: 'Critical dry spell detected. Postpone non-essential top dressing and prepare micro-irrigation systems.'
          },
          {
            id: 104,
            timestamp: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
            district: 'Udupi',
            latitude: 13.34,
            longitude: 74.74,
            crop_type: 'paddy',
            month: 8,
            dmi: 0.40,
            oni: -0.60,
            mjo_phase: 5,
            mjo_amplitude: 1.20,
            model_raw_prediction_mm: 310.5,
            gfs_forecast_mm: 120.0,
            icon_forecast_mm: 115.0,
            ecmwf_forecast_mm: 125.0,
            combined_prediction_mm: 320.0,
            historical_mean_mm: 275.0,
            deviation_pct: 16.4,
            risk_category: 'ABOVE_NORMAL',
            dry_spell_warning: 0,
            model_agreement: 'HIGH',
            spread_mm: 10.0,
            advisory_given: 'Abundant coastal rainfall. Clear field drainage channels to prevent root waterlogging.'
          }
        ]);
      }
    } catch (err) {
      console.error('History Fetch Error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [districtFilter]);

  // Filter records by search query, crop, and risk
  const filteredRecords = records.filter((r) => {
    const matchesSearch = 
      (r.district || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.crop_type || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (r.advisory_given || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCrop = cropFilter === 'ALL' || (r.crop_type || '').toLowerCase() === cropFilter.toLowerCase();
    const matchesRisk = riskFilter === 'ALL' || (r.risk_category || '') === riskFilter;

    return matchesSearch && matchesCrop && matchesRisk;
  });

  return (
    <div className="max-w-7xl mx-auto space-y-6 font-sans">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
        
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-black uppercase tracking-wider text-sky-600 dark:text-sky-400">
              <HistoryIcon className="w-4 h-4" />
              <span>{language === 'kn' ? 'ಮುನ್ಸೂಚನೆ ಇತಿಹಾಸ ಮತ್ತು ಲೆಕ್ಕಪರಿಶೋಧನೆ' : 'Prediction History & Audit Trail'}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
              Historical Predictions & Ingest Timeline
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
              Logged prediction inferences, multi-model ensemble spreads, and agronomic decisions.
            </p>
          </div>

          <div className="flex items-center space-x-3 shrink-0">
            <button
              onClick={loadHistory}
              disabled={loading}
              className="px-4 py-2 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-sky-500 text-xs font-bold flex items-center space-x-2 transition-colors active:scale-95"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{loading ? 'Refreshing...' : 'Refresh Logs'}</span>
            </button>
          </div>
        </div>

        {/* Search & Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 pt-1">
          
          {/* Search Box */}
          <div className="sm:col-span-5 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by district, crop, advisory..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          {/* District Filter */}
          <div className="sm:col-span-3">
            <select
              value={districtFilter}
              onChange={(e) => setDistrictFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Districts ({KARNATAKA_DISTRICTS.length})</option>
              {KARNATAKA_DISTRICTS.map((d) => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          {/* Crop Filter */}
          <div className="sm:col-span-2">
            <select
              value={cropFilter}
              onChange={(e) => setCropFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Crops</option>
              {mockCrops.map((c) => (
                <option key={c.key} value={c.key}>{c.name.split(' ')[0]}</option>
              ))}
            </select>
          </div>

          {/* Risk Filter */}
          <div className="sm:col-span-2">
            <select
              value={riskFilter}
              onChange={(e) => setRiskFilter(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-900 dark:text-white focus:outline-none focus:border-sky-500"
            >
              <option value="ALL">All Risks</option>
              <option value="HIGH">High Deficit</option>
              <option value="MODERATE">Moderate</option>
              <option value="NORMAL">Normal</option>
              <option value="ABOVE_NORMAL">Surplus</option>
            </select>
          </div>

        </div>

      </div>

      {/* History Records Timeline */}
      {loading ? (
        <div className="py-20 text-center space-y-3 font-mono text-xs text-slate-400">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
          <p>Querying prediction audit records...</p>
        </div>
      ) : filteredRecords.length > 0 ? (
        <div className="space-y-3">
          {filteredRecords.map((rec) => {
            const cropWater = evaluateCropWaterIntelligence(rec.crop_type || 'ragi', {
              predictedMonthlyRainfall: rec.combined_prediction_mm,
              forecast14DayRainfall: rec.ecmwf_forecast_mm || rec.gfs_forecast_mm || 20.0,
              deviationPct: rec.deviation_pct,
              riskCategory: rec.risk_category,
              drySpellWarning: Boolean(rec.dry_spell_warning)
            });

            return (
              <div
                key={rec.id}
                onClick={() => setSelectedRecord(rec)}
                className="p-5 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm hover:border-sky-500/60 dark:hover:border-sky-500/60 transition-all cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-4 group"
              >
                <div className="space-y-2 flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-mono text-xs font-black text-sky-500">LOG #{rec.id}</span>
                    <RiskBadge category={rec.risk_category} />
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase ${
                      cropWater.status === 'WATER_DEFICIT'
                        ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400 border border-rose-500/30'
                        : cropWater.status === 'EXCESS_WATER_RISK'
                        ? 'bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/30'
                        : 'bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                    }`}>
                      {cropWater.waterStatus}
                    </span>
                    <span className="text-[11px] text-slate-400 font-mono flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(rec.timestamp).toLocaleString()}</span>
                    </span>
                  </div>

                  <div className="flex items-center space-x-2">
                    <MapPin className="w-4 h-4 text-sky-500 shrink-0" />
                    <h3 className="text-base font-black text-slate-900 dark:text-white">
                      {rec.district}
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">
                      ({rec.latitude?.toFixed(2)}°N, {rec.longitude?.toFixed(2)}°E)
                    </span>
                    <span className="px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-[11px] font-bold text-slate-700 dark:text-slate-300">
                      Crop: {rec.crop_type?.toUpperCase() || 'RAGI'}
                    </span>
                  </div>

                  {rec.advisory_given && (
                    <p className="text-xs text-slate-600 dark:text-slate-300 line-clamp-1 italic">
                      "{rec.advisory_given}"
                    </p>
                  )}
                </div>

                {/* Right Metrics & Arrow */}
                <div className="flex items-center space-x-6 text-right shrink-0">
                  <div className="font-mono">
                    <span className="text-[10px] text-slate-400 uppercase block">Prediction</span>
                    <span className="text-base font-black text-slate-900 dark:text-white">
                      {rec.combined_prediction_mm?.toFixed(1) ?? '--'} mm
                    </span>
                    <span className={`text-[10px] font-bold block ${
                      (rec.deviation_pct ?? 0) < -20 ? 'text-rose-500' : 'text-emerald-500'
                    }`}>
                      {(rec.deviation_pct ?? 0) > 0 ? '+' : ''}{rec.deviation_pct?.toFixed(1)}% vs norm
                    </span>
                  </div>

                  <div className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 group-hover:bg-sky-500 group-hover:text-white text-slate-400 transition-colors">
                    <ChevronRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 text-center space-y-2">
          <Database className="w-8 h-8 text-slate-400 mx-auto" />
          <h4 className="text-sm font-bold text-slate-900 dark:text-white">No Matching Historical Ingest Logs</h4>
          <p className="text-xs text-slate-500">Try adjusting your search query or filters.</p>
        </div>
      )}

      {/* SECTION 3: EXPANDED PREDICTION DETAILS MODAL */}
      <AnimatePresence>
        {selectedRecord && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedRecord(null)}
              className="fixed inset-0 bg-slate-950/70 backdrop-blur-sm"
            />

            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative w-full max-w-2xl bg-white dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl z-10 max-h-[90vh] overflow-y-auto space-y-6 font-sans"
            >
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <div>
                  <span className="text-[10px] font-mono font-bold text-sky-500 uppercase">Audit Record #{selectedRecord.id}</span>
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">
                    Prediction & Climate Ingest Details
                  </h3>
                  <span className="text-xs text-slate-400">{new Date(selectedRecord.timestamp).toLocaleString()}</span>
                </div>
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* District & Crop Summary */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Location Jurisdiction</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5">{selectedRecord.district}</span>
                  <span className="text-slate-400 font-mono text-[11px]">{selectedRecord.latitude}° N, {selectedRecord.longitude}° E</span>
                </div>

                <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-slate-800">
                  <span className="text-slate-400 block text-[10px] uppercase font-bold">Target Crop Profile</span>
                  <span className="text-sm font-black text-slate-900 dark:text-white block mt-0.5 uppercase">{selectedRecord.crop_type || 'Ragi'}</span>
                  <span className="text-emerald-500 font-bold text-[11px]">FAO-56 Calibrated</span>
                </div>
              </div>

              {/* Rainfall Comparison Numbers */}
              <div className="grid grid-cols-3 gap-3 font-mono text-xs">
                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Predicted Rain</span>
                  <span className="text-base font-black text-slate-900 dark:text-white mt-1 block">
                    {selectedRecord.combined_prediction_mm?.toFixed(1)} mm
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">14-Day Ensemble</span>
                  <span className="text-base font-black text-sky-500 mt-1 block">
                    {(selectedRecord.ecmwf_forecast_mm || selectedRecord.gfs_forecast_mm || 20.0).toFixed(1)} mm
                  </span>
                </div>

                <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-slate-800 text-center">
                  <span className="text-slate-400 block text-[10px]">Climatology Norm</span>
                  <span className="text-base font-black text-slate-900 dark:text-white mt-1 block">
                    {selectedRecord.historical_mean_mm?.toFixed(1) ?? '--'} mm
                  </span>
                </div>
              </div>

              {/* Advisory Given */}
              <div className="p-4 rounded-2xl bg-sky-500/10 border border-sky-500/20 text-xs space-y-1">
                <span className="font-bold text-sky-600 dark:text-sky-400 uppercase text-[10px] block">
                  Agronomic Advisory Issued
                </span>
                <p className="text-slate-800 dark:text-slate-200 font-medium leading-relaxed">
                  "{selectedRecord.advisory_given || 'Standard moisture conservation and sowing recommendations applied.'}"
                </p>
              </div>

              {/* Expandable Technical ML Details */}
              <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#0B1021] border border-slate-200 dark:border-slate-800 space-y-2">
                <span className="font-black text-slate-900 dark:text-white text-xs uppercase tracking-wider flex items-center space-x-1.5">
                  <Cpu className="w-3.5 h-3.5 text-purple-500" />
                  <span>Technical Inference Internals</span>
                </span>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 font-mono text-[11px] pt-1">
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">DMI Index:</span>
                    <span className="font-bold">{selectedRecord.dmi ?? '+0.40'}°C</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">ONI Index:</span>
                    <span className="font-bold">{selectedRecord.oni ?? '-0.60'}°C</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">MJO Phase:</span>
                    <span className="font-bold">Phase {selectedRecord.mjo_phase ?? '5'}</span>
                  </div>
                  <div className="p-2 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
                    <span className="text-slate-400 block text-[9px]">MJO Amp:</span>
                    <span className="font-bold">{selectedRecord.mjo_amplitude ?? '1.20'}</span>
                  </div>
                </div>
              </div>

              <div className="pt-2 text-right">
                <button
                  onClick={() => setSelectedRecord(null)}
                  className="px-5 py-2 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-md transition-all"
                >
                  Close Details
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
