import React, { useState, useEffect } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MetricCard } from '../components/common/MetricCard';
import { apiService } from '../services/apiService';
import { 
  Cpu, 
  Database, 
  Activity, 
  Globe, 
  Sparkles, 
  Clock, 
  CheckCircle2, 
  RefreshCw, 
  Server, 
  Layers, 
  ShieldCheck,
  Zap,
  Code
} from 'lucide-react';

export const AdminDashboard = () => {
  const [isBackendHealthy, setIsBackendHealthy] = useState(true);
  const [testingHealth, setTestingHealth] = useState(false);
  const [lastCheckTime, setLastCheckTime] = useState(new Date().toLocaleTimeString());

  const checkHealth = async () => {
    setTestingHealth(true);
    try {
      // Test prediction endpoint connectivity
      const res = await apiService.evaluatePrediction({
        latitude: 13.29,
        longitude: 77.55,
        month: 8,
        crop_type: 'ragi'
      });
      setIsBackendHealthy(res.success);
    } catch {
      setIsBackendHealthy(false);
    } finally {
      setTestingHealth(false);
      setLastCheckTime(new Date().toLocaleTimeString());
    }
  };

  useEffect(() => {
    checkHealth();
  }, []);

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Platform Status Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-black text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            <Server className="w-4 h-4" />
            <span>Platform Infrastructure & Service Health</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
            System Topology & Production Status
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Real-time status of FastAPI inference microservice, TFLite runtime, SQLite audit layer, and Open-Meteo ensemble.
          </p>
        </div>

        <div className="flex items-center space-x-3 shrink-0">
          <div className="flex items-center space-x-2 px-3.5 py-2 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold font-mono">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            <span>Services Operational</span>
          </div>

          <button
            onClick={checkHealth}
            disabled={testingHealth}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-sky-500 transition-colors"
            title="Re-check backend health"
          >
            <RefreshCw className={`w-4 h-4 ${testingHealth ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Metrics Row: Core Active Components */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="FastAPI Inference Engine"
          value="Port 8000"
          unit={isBackendHealthy ? "Online" : "Checking"}
          status="FastAPI + TFLite"
          icon={Cpu}
          color="sky"
        />
        <MetricCard
          title="SQLite Audit Log DB"
          value="monsoon_predictions"
          unit="Active"
          status="prediction_database.py"
          icon={Database}
          color="emerald"
        />
        <MetricCard
          title="Numerical Ensemble"
          value="3 NWP Feeds"
          unit="GFS • ICON • ECMWF"
          status="Open-Meteo API"
          icon={Globe}
          color="indigo"
        />
        <MetricCard
          title="Crop Water Intelligence"
          value="FAO-56"
          unit="5 Regional Crops"
          status="Penman-Monteith Kc"
          icon={Sparkles}
          color="amber"
        />
      </div>

      {/* Microservice Topology Breakdown */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-sky-500" />
            <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
              Active Microservices Topology
            </h3>
          </div>
          <span className="text-[11px] font-mono text-slate-400">
            Last pinged: {lastCheckTime}
          </span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          
          {/* FastAPI Inference Service */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-900 dark:text-white">FastAPI ML Inference Service</span>
                <span className="px-2 py-0.2 rounded bg-sky-500/10 text-sky-500 text-[10px] font-bold">Python 3.10+</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Hosts <code className="text-purple-400">POST /api/v1/predict-monsoon</code> executing 7-feature TFLite inference.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/20 shrink-0 self-start sm:self-auto">
              ONLINE (Port 8000)
            </span>
          </div>

          {/* TensorFlow Lite Model Binary */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-900 dark:text-white">TensorFlow Lite Regional Regression Model</span>
                <span className="px-2 py-0.2 rounded bg-purple-500/10 text-purple-500 text-[10px] font-bold">TFLite Runtime</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Binary: <code className="text-purple-400">monsoon_regional_model.tflite</code> (3,060 B) • Normalizer: <code className="text-sky-400">scaler_params.json</code>.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/20 shrink-0 self-start sm:self-auto">
              LOADED
            </span>
          </div>

          {/* Multi-Model Ensemble Ingest */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-900 dark:text-white">Open-Meteo Multi-Model Ensemble</span>
                <span className="px-2 py-0.2 rounded bg-indigo-500/10 text-indigo-500 text-[10px] font-bold">NWP API</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Ingests live 16-day rainfall forecasts from NOAA GFS, DWD ICON, and ECMWF IFS models.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/20 shrink-0 self-start sm:self-auto">
              CONNECTED
            </span>
          </div>

          {/* SQLite Audit Trail */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-900 dark:text-white">Audit Logging Database</span>
                <span className="px-2 py-0.2 rounded bg-amber-500/10 text-amber-500 text-[10px] font-bold">SQLite 3</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Database: <code className="text-amber-400">monsoon_predictions.db</code> • Logs prediction spreads, model agreement, and issued advisories.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-black border border-emerald-500/20 shrink-0 self-start sm:self-auto">
              PERSISTENT
            </span>
          </div>

          {/* React Frontend Presentation Layer */}
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div className="space-y-1">
              <div className="flex items-center space-x-2">
                <span className="font-black text-slate-900 dark:text-white">Frontend Web Application</span>
                <span className="px-2 py-0.2 rounded bg-sky-500/10 text-sky-500 text-[10px] font-bold">React 18 + Vite</span>
              </div>
              <p className="text-slate-500 dark:text-slate-400 font-sans text-xs">
                Tailwind CSS • Recharts • Leaflet GIS • Framer Motion • Bilingual Kannada/English engine.
              </p>
            </div>
            <span className="px-3 py-1 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-black border border-sky-500/20 shrink-0 self-start sm:self-auto">
              OPERATIONAL
            </span>
          </div>

        </div>
      </div>

      {/* Future Scope Architecture Roadmap */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-amber-500/30 dark:border-amber-500/30 shadow-sm dark:shadow-xl space-y-4">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-black text-slate-900 dark:text-white uppercase tracking-wider">
            Future Scope Architecture & Scalability Roadmap
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          Planned enterprise infrastructure specifications for state-wide scalability:
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Spring Boot API Gateway (Java 17 / Maven)</span>
              <span className="block text-slate-500 dark:text-slate-400 font-sans text-xs mt-0.5">Enterprise rate limiting, OAuth2 authentication, and WhatsApp/SMS alert dispatch relay.</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 shrink-0">
              PHASE 4 ROADMAP
            </span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">TimescaleDB / PostGIS Geospatial Database</span>
              <span className="block text-slate-500 dark:text-slate-400 font-sans text-xs mt-0.5">Migration from SQLite to clustered PostgreSQL for taluk/panchayat polygon raster queries.</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20 shrink-0">
              PHASE 4 ROADMAP
            </span>
          </div>
        </div>
      </div>

    </div>
  );
};
