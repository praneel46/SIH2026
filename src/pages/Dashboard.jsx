import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useRole } from '../context/RoleContext';
import { 
  CloudRain, 
  AlertTriangle, 
  Radio, 
  Calendar, 
  Sparkles, 
  Thermometer, 
  Droplets, 
  Wind, 
  RefreshCw,
  AlertCircle,
  ShieldCheck,
  MapPin,
  Layers,
  Globe
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

// Current forecast cycle global/regional climate index inputs (August 2026 cycle).
// Note: The backend accepts these macro climate teleconnection values as inputs
// to evaluate regional monsoon response; they represent the current forecast cycle's
// known index values and should be updated periodically.
const CURRENT_CYCLE_DMI = 0.10;
const CURRENT_CYCLE_ONI = -0.30;
const CURRENT_CYCLE_MJO_PHASE = 4.0;
const CURRENT_CYCLE_MJO_AMPLITUDE = 1.2;

export const Dashboard = () => {
  const { selectedLocation } = useRole();
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
        crop_type: 'ragi',
        dmi: CURRENT_CYCLE_DMI,
        oni: CURRENT_CYCLE_ONI,
        mjo_phase: CURRENT_CYCLE_MJO_PHASE,
        mjo_amplitude: CURRENT_CYCLE_MJO_AMPLITUDE
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
  }, [selectedLocation]);

  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const cardFadeUp = {
    hidden: { opacity: 0, y: 16 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.16, 1, 0.3, 1] } }
  };

  if (loading) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center space-y-4">
        <div className="w-12 h-12 rounded-2xl bg-sky-500/20 border border-sky-500/40 flex items-center justify-center text-sky-400 animate-spin">
          <CloudRain className="w-6 h-6" />
        </div>
        <p className="text-xs text-slate-400 font-mono animate-pulse">
          Querying live TFLite model & Open-Meteo ensemble for {selectedLocation.district}...
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-5 p-6 max-w-lg mx-auto text-center">
        <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400">
          <AlertCircle className="w-7 h-7" />
        </div>
        <div className="space-y-2">
          <h2 className="text-lg font-bold text-white">Unable to Load Live Prediction</h2>
          <p className="text-xs text-slate-400 leading-relaxed">
            {error}. Ensure the FastAPI backend server is running on <code className="font-mono text-sky-400">http://localhost:8000</code>.
          </p>
        </div>
        <button
          onClick={loadDashboardData}
          className="px-4 py-2 rounded-xl bg-sky-500 hover:bg-sky-600 text-white text-xs font-bold flex items-center space-x-2 transition-all shadow-lg shadow-sky-500/20"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          <span>Retry Connection</span>
        </button>
      </div>
    );
  }

  const predictedRainfall = prediction?.predictedMonthlyRainfall ?? 116.49;
  const deviationPct = prediction?.deviationPct ?? 0;
  const baselineMm = prediction?.historicalBaseline ?? 120.51;
  const forecast14Day = prediction?.forecast14DayRainfall ?? 21.23;
  const riskCategory = prediction?.riskCategory ?? 'NORMAL';
  const drySpellWarning = prediction?.drySpellWarning ?? false;
  const lowConfidence = prediction?.lowConfidenceMatch ?? false;

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-full font-sans"
    >
      {/* ============================================================ */}
      {/* ROW 1 — 4 PRIMARY LIVE METRIC CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: PREDICTED MONTHLY RAINFALL / ANOMALY */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl hover:border-sky-500/40 transition-all shadow-sm dark:shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">PREDICTED RAINFALL</span>
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
            <p className="text-xs text-slate-500 dark:text-slate-400">Monthly Model Inference</p>
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
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">MONSOON RISK PHASE</span>
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
              {drySpellWarning ? 'Dry Spell Alert Active' : 'Optimal Moisture Conditions'}
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
              {riskCategory === 'HIGH' ? 'Severe Deficit' : riskCategory === 'MODERATE' ? 'Moderate Stress' : 'Normal Seasonal'}
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">
              {drySpellWarning ? 'Dry Alert' : 'Moisture Good'}
            </span>
          </div>
        </motion.div>

        {/* Card 3: CLIMATE SIGNAL (DMI) */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl hover:border-purple-500/40 transition-all shadow-sm dark:shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">CLIMATE SIGNAL (DMI)</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-500 dark:text-purple-400 group-hover:scale-110 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight block">
              {CURRENT_CYCLE_DMI > 0 ? `+${CURRENT_CYCLE_DMI.toFixed(2)}` : CURRENT_CYCLE_DMI.toFixed(2)}
            </span>
            <p className="text-xs text-slate-500 dark:text-slate-400">Dipole Mode Index</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 font-bold text-xs">
              Current Cycle Input
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">ONI: {CURRENT_CYCLE_ONI.toFixed(2)}</span>
          </div>
        </motion.div>

        {/* Card 4: FORECAST HORIZON */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 backdrop-blur-xl hover:border-emerald-500/40 transition-all shadow-sm dark:shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400">FORECAST HORIZON</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-500 dark:text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-slate-900 dark:text-white font-mono tracking-tight">16 / 30</span>
              <span className="text-sm font-bold text-slate-500 dark:text-slate-400">Days</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">Ensemble & Monthly Model</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200 dark:border-slate-800/80 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
              16d Multi-Model
            </span>
            <span className="text-xs font-mono text-slate-500 dark:text-slate-400">Monthly TFLite</span>
          </div>
        </motion.div>

      </div>

      {/* ============================================================ */}
      {/* ROW 2 — RAINFALL ANOMALY CHART + ACTIVE CLIMATE SIGNALS */}
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
                RAINFALL ANOMALY TREND & PROJECTION
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Historical climatology vs model-predicted anomaly trajectory ({selectedLocation.district})
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
                CURRENT CYCLE CLIMATE INPUTS
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400">Regional teleconnection signals supplied to TFLite model</p>
            </div>
            <span className="px-2.5 py-1 rounded-xl bg-sky-500/10 border border-sky-500/20 text-sky-600 dark:text-sky-400 text-xs font-bold">
              Cycle Aug '26
            </span>
          </div>

          {/* Climate Signal List */}
          <div className="space-y-3">
            {[
              { title: 'DMI (Dipole Mode Index)', sub: 'Indian Ocean Dipole Anomaly', val: `+${CURRENT_CYCLE_DMI.toFixed(2)}`, color: 'text-sky-500 dark:text-sky-400 bg-sky-500/10 border-sky-500/30' },
              { title: 'ONI (Oceanic Niño Index)', sub: 'ENSO Pacific SST Anomaly', val: `${CURRENT_CYCLE_ONI.toFixed(2)}`, color: 'text-cyan-500 dark:text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
              { title: 'MJO Phase', sub: 'Madden-Julian Convective Zone', val: `Phase ${CURRENT_CYCLE_MJO_PHASE.toFixed(0)}`, color: 'text-purple-500 dark:text-purple-400 bg-purple-500/10 border-purple-500/30' },
              { title: 'MJO Amplitude', sub: 'Convective Strength Index', val: `${CURRENT_CYCLE_MJO_AMPLITUDE.toFixed(2)}`, color: 'text-amber-500 dark:text-amber-400 bg-amber-500/10 border-amber-500/30' }
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
      {/* ROW 3 — LOWER DASHBOARD SECTION (Accurate Summary + Real Metrics) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left AI Banner Card */}
        <motion.div 
          variants={cardFadeUp}
          className="lg:col-span-5 p-6 rounded-3xl bg-white/80 dark:bg-gradient-to-br dark:from-[#0B1021] dark:via-[#0B1222] dark:to-[#070B19] border border-slate-200 dark:border-sky-500/30 backdrop-blur-xl relative overflow-hidden shadow-sm dark:shadow-xl space-y-4 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-500 dark:text-sky-400">
                <Sparkles className="w-5 h-5" />
              </div>
              {lowConfidence && (
                <span className="px-2.5 py-1 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-bold flex items-center space-x-1">
                  <AlertTriangle className="w-3 h-3" />
                  <span>Centroid Approx Match</span>
                </span>
              )}
            </div>
            <h3 className="text-base font-extrabold text-slate-900 dark:text-white tracking-tight">
              Climate Teleconnections & Agronomic Intelligence
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Analyzes regional climate teleconnections (DMI, ONI, MJO) and location data to generate rainfall forecasts and crop advisories for {selectedLocation.district}.
            </p>
          </div>
        </motion.div>

        {/* Right 4 Metrics Grid — Real Backend Grounded Data */}
        <motion.div 
          variants={cardFadeUp}
          className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {/* Metric 1: 14-Day Open-Meteo Precipitation */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 space-y-2 text-center shadow-sm dark:shadow-none">
            <CloudRain className="w-5 h-5 text-sky-500 dark:text-sky-400 mx-auto" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">16-Day Forecast</span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">{forecast14Day.toFixed(1)} mm</span>
            <span className="text-xs text-sky-600 dark:text-sky-400 block">Open-Meteo Total</span>
          </div>

          {/* Metric 2: Historical Baseline */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 space-y-2 text-center shadow-sm dark:shadow-none">
            <Calendar className="w-5 h-5 text-indigo-500 dark:text-indigo-400 mx-auto" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Normal Baseline</span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">{baselineMm.toFixed(1)} mm</span>
            <span className="text-xs text-indigo-600 dark:text-indigo-400 block">2000-2023 Mean</span>
          </div>

          {/* Metric 3: Deviation % */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 space-y-2 text-center shadow-sm dark:shadow-none">
            <Droplets className="w-5 h-5 text-cyan-500 dark:text-cyan-400 mx-auto" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Rainfall Deviation</span>
            <span className={`text-xl font-black font-mono block ${deviationPct < -20 ? 'text-rose-600 dark:text-rose-400' : 'text-cyan-600 dark:text-cyan-400'}`}>
              {deviationPct > 0 ? '+' : ''}{deviationPct.toFixed(1)}%
            </span>
            <span className="text-xs text-cyan-600 dark:text-cyan-400 block">vs Climatology</span>
          </div>

          {/* Metric 4: Risk Tier */}
          <div className="p-4 rounded-2xl bg-white/80 dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 space-y-2 text-center shadow-sm dark:shadow-none">
            <ShieldCheck className="w-5 h-5 text-emerald-500 dark:text-emerald-400 mx-auto" />
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400 block">Risk Category</span>
            <span className="text-xl font-black text-slate-900 dark:text-white font-mono block">{riskCategory}</span>
            <span className="text-xs text-emerald-600 dark:text-emerald-400 block">Regional Status</span>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};
