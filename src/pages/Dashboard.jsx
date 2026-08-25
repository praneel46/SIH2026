import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { apiService } from '../services/apiService';
import { useRole } from '../context/RoleContext';
import { 
  CloudRain, 
  AlertTriangle, 
  Radio, 
  Calendar, 
  TrendingDown, 
  TrendingUp, 
  ChevronRight, 
  Sparkles, 
  Globe, 
  Thermometer, 
  Droplets, 
  Wind, 
  Zap, 
  Activity 
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
  const { selectedLocation } = useRole();
  const [prediction, setPrediction] = useState(null);
  const [trends, setTrends] = useState([]);
  const [climateSignals, setClimateSignals] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true);
      try {
        const [predRes, trendRes, signalRes] = await Promise.all([
          apiService.getLatestPrediction(selectedLocation.district),
          apiService.getAnomalyTrends(selectedLocation.district),
          apiService.getClimateSignals()
        ]);
        if (predRes.success) setPrediction(predRes.data);
        if (trendRes.success) setTrends(trendRes.data);
        if (signalRes.success) setClimateSignals(signalRes.data);
      } catch (err) {
        console.error("Dashboard fetch error:", err);
      } finally {
        setLoading(false);
      }
    }
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
          Processing climate signals for {selectedLocation.district}...
        </p>
      </div>
    );
  }

  return (
    <motion.div 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6 max-w-full font-sans"
    >
      {/* ============================================================ */}
      {/* ROW 1 — 4 PRIMARY METRIC CARDS */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Card 1: PREDICTED ANOMALY */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-[#0B1021]/90 border border-slate-800/90 backdrop-blur-xl hover:border-sky-500/40 transition-all shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">PREDICTED ANOMALY</span>
            <div className="p-2.5 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-400 group-hover:scale-110 transition-transform">
              <CloudRain className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white font-mono tracking-tight">-18.4</span>
              <span className="text-sm font-bold text-slate-400">mm</span>
            </div>
            <p className="text-xs text-slate-400">deviation from normal</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 font-bold text-[10px]">
              Below Normal
            </span>
            <span className="text-[10px] font-mono text-slate-400">-18.4 mm vs 30y mean</span>
          </div>
        </motion.div>

        {/* Card 2: MONSOON RISK PHASE */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-[#0B1021]/90 border border-slate-800/90 backdrop-blur-xl hover:border-amber-500/40 transition-all shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">MONSOON RISK PHASE</span>
            <div className="p-2.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 group-hover:scale-110 transition-transform">
              <AlertTriangle className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-amber-400 tracking-tight block">MODERATE</span>
            <p className="text-xs text-slate-400">Break Risk</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 font-bold text-[10px]">
              Break Spell Alert
            </span>
            <span className="text-[10px] font-mono text-slate-400">65% probability</span>
          </div>
        </motion.div>

        {/* Card 3: CLIMATE SIGNAL (DMI) */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-[#0B1021]/90 border border-slate-800/90 backdrop-blur-xl hover:border-purple-500/40 transition-all shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">CLIMATE SIGNAL (DMI)</span>
            <div className="p-2.5 rounded-2xl bg-purple-500/10 border border-purple-500/30 text-purple-400 group-hover:scale-110 transition-transform">
              <Radio className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <span className="text-3xl font-black text-white font-mono tracking-tight block">+0.42</span>
            <p className="text-xs text-slate-400">Dipole Mode Index</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-400 font-bold text-[10px]">
              Positive IOD
            </span>
            <span className="text-[10px] font-mono text-slate-400">Lag 1: +0.35</span>
          </div>
        </motion.div>

        {/* Card 4: FORECAST HORIZON */}
        <motion.div 
          variants={cardFadeUp}
          whileHover={{ y: -3, transition: { duration: 0.2 } }}
          className="p-5 rounded-3xl bg-[#0B1021]/90 border border-slate-800/90 backdrop-blur-xl hover:border-emerald-500/40 transition-all shadow-xl relative overflow-hidden group space-y-4"
        >
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-extrabold uppercase tracking-wider text-slate-400">FORECAST HORIZON</span>
            <div className="p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex items-baseline space-x-2">
              <span className="text-3xl font-black text-white font-mono tracking-tight">7 - 14</span>
              <span className="text-sm font-bold text-slate-400">Days</span>
            </div>
            <p className="text-xs text-slate-400">Days Lookahead</p>
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-800/80 text-xs">
            <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold text-[10px]">
              Model Prototype
            </span>
            <span className="text-[10px] font-mono text-slate-400">DMI Lag Trained</span>
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
          className="lg:col-span-7 p-6 rounded-3xl bg-[#0B1021]/90 border border-slate-800/90 backdrop-blur-xl space-y-5 shadow-xl"
        >
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-base font-extrabold text-white tracking-tight uppercase">
                RAINFALL ANOMALY TREND & PROJECTION
              </h3>
              <p className="text-xs text-slate-400">
                Historical observations vs model-predicted anomaly trajectory
              </p>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800 text-xs font-semibold text-sky-400 shrink-0">
              August 2026 Cycle
            </div>
          </div>

          {/* Guaranteed Non-Zero Height Recharts Chart Container */}
          <div className="h-[280px] w-full min-h-[280px] pt-2">
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={trends} margin={{ top: 15, right: 15, left: -15, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1E293B" vertical={false} />
                <XAxis dataKey="day" stroke="#64748B" fontSize={11} tickLine={false} />
                <YAxis stroke="#64748B" fontSize={11} tickLine={false} unit="mm" domain={[-30, 30]} />
                <Tooltip 
                  contentStyle={{ backgroundColor: '#0F172A', borderColor: '#334155', borderRadius: '12px', color: '#FFF', fontSize: '12px' }}
                  itemStyle={{ color: '#38BDF8' }}
                />
                <ReferenceLine y={0} stroke="#475569" strokeDasharray="3 3" />
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

        {/* Right 5 Columns: Active Climate Signals */}
        <motion.div 
          variants={cardFadeUp}
          className="lg:col-span-5 p-6 rounded-3xl bg-[#0B1021]/90 border border-slate-800/90 backdrop-blur-xl space-y-5 shadow-xl flex flex-col justify-between"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-base font-extrabold text-white tracking-tight uppercase">
              ACTIVE CLIMATE SIGNALS
            </h3>
            <button className="text-xs text-sky-400 font-bold hover:underline">
              View All
            </button>
          </div>

          {/* Climate Signal List */}
          <div className="space-y-3">
            {[
              { title: 'DMI (Current)', sub: 'Indian Ocean Dipole', val: '+0.42', color: 'text-sky-400 bg-sky-500/10 border-sky-500/30' },
              { title: 'DMI Lag 1', sub: '1-Month Prior Memory', val: '+0.35', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30' },
              { title: 'DMI Lag 2', sub: '2-Month Prior Memory', val: '-0.12', color: 'text-rose-400 bg-rose-500/10 border-rose-500/30' },
              { title: 'ENSO Status', sub: 'Neutral Conditions', val: '0.00', color: 'text-amber-400 bg-amber-500/10 border-amber-500/30' }
            ].map((item, idx) => (
              <div key={idx} className="p-3.5 rounded-2xl bg-[#070B19] border border-slate-800/80 flex items-center justify-between hover:border-sky-500/30 transition-colors">
                <div className="flex items-center space-x-3">
                  <div className={`p-2.5 rounded-xl border ${item.color}`}>
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">{item.title}</h4>
                    <p className="text-[10px] text-slate-400">{item.sub}</p>
                  </div>
                </div>
                <span className={`text-sm font-mono font-black ${item.val.startsWith('-') ? 'text-rose-400' : 'text-sky-400'}`}>
                  {item.val}
                </span>
              </div>
            ))}
          </div>
        </motion.div>

      </div>

      {/* ============================================================ */}
      {/* ROW 3 — LOWER DASHBOARD SECTION (AI Intelligence + 4 Metrics) */}
      {/* ============================================================ */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left AI Banner Card */}
        <motion.div 
          variants={cardFadeUp}
          className="lg:col-span-5 p-6 rounded-3xl bg-gradient-to-br from-[#0B1021] via-[#0B1222] to-[#070B19] border border-sky-500/30 backdrop-blur-xl relative overflow-hidden shadow-xl space-y-4 flex flex-col justify-between"
        >
          <div className="absolute top-0 right-0 w-32 h-32 bg-sky-500/10 rounded-full blur-2xl pointer-events-none" />
          <div className="space-y-3">
            <div className="w-10 h-10 rounded-2xl bg-sky-500/10 border border-sky-400/30 flex items-center justify-center text-sky-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <h3 className="text-base font-extrabold text-white tracking-tight">
              AI-Powered Climate Intelligence
            </h3>
            <p className="text-xs text-slate-300 leading-relaxed">
              Our AI models analyze 15+ global & regional datasets to deliver accurate rainfall forecasts, risk assessment & actionable advisory for {selectedLocation.district}.
            </p>
          </div>
        </motion.div>

        {/* Right 4 Metrics Grid */}
        <motion.div 
          variants={cardFadeUp}
          className="lg:col-span-7 grid grid-cols-2 sm:grid-cols-4 gap-4"
        >
          {/* Metric 1 */}
          <div className="p-4 rounded-2xl bg-[#0B1021]/90 border border-slate-800/90 space-y-2 text-center">
            <CloudRain className="w-5 h-5 text-sky-400 mx-auto" />
            <span className="text-[10px] font-bold text-slate-400 block">Seasonal Rainfall</span>
            <span className="text-xl font-black text-white font-mono block">842 mm</span>
            <span className="text-[10px] text-sky-400 block">vs normal: -12%</span>
          </div>

          {/* Metric 2 */}
          <div className="p-4 rounded-2xl bg-[#0B1021]/90 border border-slate-800/90 space-y-2 text-center">
            <Thermometer className="w-5 h-5 text-rose-400 mx-auto" />
            <span className="text-[10px] font-bold text-slate-400 block">Temperature</span>
            <span className="text-xl font-black text-white font-mono block">27.6 °C</span>
            <span className="text-[10px] text-rose-400 block">vs normal: +0.8 °C</span>
          </div>

          {/* Metric 3 */}
          <div className="p-4 rounded-2xl bg-[#0B1021]/90 border border-slate-800/90 space-y-2 text-center">
            <Droplets className="w-5 h-5 text-cyan-400 mx-auto" />
            <span className="text-[10px] font-bold text-slate-400 block">Humidity</span>
            <span className="text-xl font-black text-white font-mono block">78%</span>
            <span className="text-[10px] text-cyan-400 block">vs normal: +5%</span>
          </div>

          {/* Metric 4 */}
          <div className="p-4 rounded-2xl bg-[#0B1021]/90 border border-slate-800/90 space-y-2 text-center">
            <Wind className="w-5 h-5 text-emerald-400 mx-auto" />
            <span className="text-[10px] font-bold text-slate-400 block">Wind Speed</span>
            <span className="text-xl font-black text-white font-mono block">12.4 km/h</span>
            <span className="text-[10px] text-emerald-400 block">vs normal: +1.2</span>
          </div>
        </motion.div>

      </div>

    </motion.div>
  );
};
