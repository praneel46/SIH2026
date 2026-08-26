import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  CloudRain, 
  X, 
  Download, 
  MapPin, 
  Sprout, 
  AlertTriangle, 
  Droplets, 
  Calendar, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  Cpu, 
  Globe 
} from 'lucide-react';
import { generateClimateReport } from '../../utils/reportGenerator';

export const ReportPreviewModal = ({ isOpen, onClose, location = {}, crop = {}, predictionData = null }) => {
  const [downloading, setDownloading] = useState(false);

  if (!isOpen) return null;

  const districtName = location.district || 'Bengaluru Rural';
  const stateName = location.state || 'Karnataka';
  const blockName = location.block || 'Centroid';
  const villageName = location.village || 'Center';

  const cropName = crop.name || crop.key || 'Ragi';
  const timestamp = new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', dateStyle: 'medium', timeStyle: 'short' });

  const predRain = predictionData?.predictedMonthlyRainfall ?? predictionData?.forecast?.predicted_monthly_rainfall_mm ?? 116.5;
  const baselineRain = predictionData?.historicalBaseline ?? predictionData?.forecast?.historical_baseline_mm ?? 120.5;
  const deviation = predictionData?.deviationPct ?? predictionData?.forecast?.deviation_pct ?? -3.3;
  const forecast14Day = predictionData?.forecast14DayRainfall ?? predictionData?.forecast?.['14_day_forecast_mm'] ?? 24.5;

  const riskCategory = predictionData?.riskCategory ?? predictionData?.risk_assessment?.risk_category ?? 'NORMAL';
  const drySpellWarning = predictionData?.drySpellWarning ?? predictionData?.risk_assessment?.dry_spell_warning ?? false;

  const advisoryEn = predictionData?.advisory?.english ?? predictionData?.agronomic_advisory?.advisory_en ?? 'Maintain adequate field bunds and monitor soil moisture for Kharif crop management.';
  const advisoryKn = predictionData?.advisory?.kannada ?? predictionData?.agronomic_advisory?.advisory_kn ?? 'ಬೆಳೆಗಳಿಗೆ ತೇವಾಂಶ ಸಂರಕ್ಷಣಾ ಕ್ರಮಗಳನ್ನು ಕೈಗೊಳ್ಳಿ ಮತ್ತು ಪೂರಕ ನೀರಾವರಿ ಒದಗಿಸಿ.';

  const handleDownload = async () => {
    setDownloading(true);
    try {
      generateClimateReport(location, crop, predictionData);
    } catch (err) {
      console.error('PDF download error:', err);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md overflow-y-auto selection:bg-sky-500 selection:text-white font-sans">
        
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 15 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-3xl my-auto rounded-3xl bg-[#0A0F1D] border border-sky-500/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] text-left flex flex-col max-h-[90vh] overflow-hidden"
        >
          {/* Modal Header */}
          <div className="p-5 sm:p-6 border-b border-slate-800/80 flex items-center justify-between bg-[#060913]">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-[1.5px] shadow-lg shadow-sky-500/30">
                <div className="w-full h-full rounded-[14px] bg-[#060913] flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              <div>
                <h2 className="text-lg font-black text-white tracking-tight flex items-center space-x-2">
                  <span>VARSHA <span className="text-sky-400">SETU</span></span>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/30 font-bold uppercase tracking-wider">
                    Official Report
                  </span>
                </h2>
                <p className="text-xs text-slate-400">
                  Localized Agricultural Climate Intelligence Bulletin
                </p>
              </div>
            </div>

            <button
              onClick={onClose}
              className="p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal Body / Report Printable Area */}
          <div className="p-6 overflow-y-auto space-y-6 flex-1 text-slate-200 text-xs leading-relaxed" id="varsha-setu-report-container">
            
            {/* Header Banner Inside Report */}
            <div className="p-4 rounded-2xl bg-gradient-to-r from-sky-950/60 via-slate-900 to-slate-950 border border-sky-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="space-y-1">
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-sky-400">
                  CLIMATE INTELLIGENCE REPORT
                </span>
                <h3 className="text-base font-black text-white">
                  {districtName} Monsoon & Crop Analysis
                </h3>
                <div className="flex items-center space-x-2 text-[11px] text-slate-400">
                  <Calendar className="w-3.5 h-3.5 text-sky-400" />
                  <span>Generated: {timestamp}</span>
                </div>
              </div>
              <div className="px-3 py-1.5 rounded-xl bg-slate-900/90 border border-slate-800 text-right shrink-0">
                <span className="text-[10px] text-slate-400 block font-semibold">Assessment ID</span>
                <span className="text-xs font-mono font-bold text-sky-400">VS-REP-{Date.now().toString().slice(-6)}</span>
              </div>
            </div>

            {/* Grid 1: Location & Crop Parameters */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-sky-400 font-bold uppercase tracking-wider text-[10px]">
                  <MapPin className="w-3.5 h-3.5" />
                  <span>Geographic Target</span>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-sm font-bold text-white">{districtName}, {stateName}</div>
                  <div className="text-slate-400 text-[11px]">{blockName} Block • {villageName}</div>
                  <div className="text-slate-500 text-[10px] font-mono">Location Centroid Synced</div>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400 font-bold uppercase tracking-wider text-[10px]">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Target Crop & Phenology</span>
                </div>
                <div className="space-y-1 pt-1">
                  <div className="text-sm font-bold text-white">{cropName}</div>
                  <div className="text-slate-400 text-[11px]">Kharif Monsoon Season</div>
                  <div className="text-slate-500 text-[10px]">FAO-56 Mid-Season Peak Demand</div>
                </div>
              </div>
            </div>

            {/* Grid 2: Rainfall Forecast & Risk Status */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center justify-between border-b border-slate-800 pb-2">
                <div className="flex items-center space-x-2 text-sky-400 font-bold uppercase tracking-wider text-[10px]">
                  <CloudRain className="w-3.5 h-3.5" />
                  <span>Monsoon Rainfall Prediction</span>
                </div>
                <div className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border ${
                  riskCategory === 'HIGH' || drySpellWarning
                    ? 'bg-rose-500/10 text-rose-400 border-rose-500/30'
                    : riskCategory === 'MODERATE'
                    ? 'bg-amber-500/10 text-amber-400 border-amber-500/30'
                    : 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                }`}>
                  {riskCategory} RISK
                </div>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center pt-1">
                <div className="p-2.5 rounded-xl bg-[#060913] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Monthly Forecast</span>
                  <span className="text-base font-black text-sky-400">{Number(predRain).toFixed(1)} mm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#060913] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">14-Day Outlook</span>
                  <span className="text-base font-black text-white">{Number(forecast14Day).toFixed(1)} mm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#060913] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Climatology Mean</span>
                  <span className="text-base font-black text-slate-300">{Number(baselineRain).toFixed(1)} mm</span>
                </div>
                <div className="p-2.5 rounded-xl bg-[#060913] border border-slate-800">
                  <span className="text-[10px] text-slate-400 block font-medium">Deviation %</span>
                  <span className={`text-base font-black ${Number(deviation) < 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
                    {Number(deviation) > 0 ? `+${Number(deviation).toFixed(1)}%` : `${Number(deviation).toFixed(1)}%`}
                  </span>
                </div>
              </div>
            </div>

            {/* Agronomic Advisory Section */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-3">
              <div className="flex items-center space-x-2 text-indigo-400 font-bold uppercase tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Bilingual AI Agronomic Advisory</span>
              </div>
              
              <div className="space-y-2 pt-1">
                <div className="p-3 rounded-xl bg-[#060913] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-sky-400 uppercase tracking-wider block">English Advisory</span>
                  <p className="text-slate-200">{advisoryEn}</p>
                </div>

                <div className="p-3 rounded-xl bg-[#060913] border border-slate-800/80 space-y-1">
                  <span className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider block">ಕನ್ನಡ ಸಲಹೆ (Kannada Advisory)</span>
                  <p className="text-slate-200 font-sans">{advisoryKn}</p>
                </div>
              </div>
            </div>

            {/* Model Metadata Footer */}
            <div className="pt-2 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-[10px] text-slate-500 gap-2">
              <div className="flex items-center space-x-2">
                <Cpu className="w-3.5 h-3.5 text-sky-500" />
                <span>TensorFlow Lite Monsoon Model • NOAA GFS + DWD ICON + ECMWF IFS Ensemble</span>
              </div>
              <div className="font-mono text-sky-400/80">VarshaSetu v2.0</div>
            </div>

          </div>

          {/* Modal Action Buttons */}
          <div className="p-5 border-t border-slate-800/80 bg-[#060913] flex items-center justify-end space-x-3">
            <button
              onClick={onClose}
              className="px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 font-bold text-xs transition-all"
            >
              Close
            </button>

            <button
              onClick={handleDownload}
              disabled={downloading}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs shadow-md hover:scale-[1.02] active:scale-98 transition-all flex items-center space-x-2 disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>{downloading ? 'Generating PDF...' : 'Download PDF'}</span>
            </button>
          </div>

        </motion.div>
      </div>
    </AnimatePresence>
  );
};
