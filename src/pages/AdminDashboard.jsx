import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MetricCard } from '../components/common/MetricCard';
import { Cpu, Database, Activity, Globe, Sparkles, Clock, CheckCircle2 } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4 shadow-sm dark:shadow-xl transition-colors">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400">
            <Cpu className="w-4 h-4" />
            <span>System Infrastructure & Service Status</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Weather Index Active Production Architecture
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            FastAPI Backend (Port 8000) • SQLite Audit Database • Open-Meteo Multi-Model Ensemble • React/Vite Frontend
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>Active Services Operational</span>
        </div>
      </div>

      {/* Metrics Row — Honest Active Components */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <MetricCard
          title="FastAPI Inference Engine"
          value="Port 8000"
          unit="Active"
          status="TFLite + Scaler"
          icon={Cpu}
          color="sky"
        />
        <MetricCard
          title="Audit Database"
          value="SQLite"
          unit="prediction_logs"
          status="Persistent Table"
          icon={Database}
          color="emerald"
        />
        <MetricCard
          title="Meteorological Ensemble"
          value="3 Models"
          unit="GFS • ICON • ECMWF"
          status="Open-Meteo API"
          icon={Globe}
          color="indigo"
        />
        <MetricCard
          title="Agronomic Engine"
          value="FAO-56"
          unit="5 Kharif Crops"
          status="Penman-Monteith ETc"
          icon={Sparkles}
          color="amber"
        />
      </div>

      {/* Active Services Health Breakdown */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <Activity className="w-5 h-5 text-sky-500" />
          <span>Deployed & Active Microservice Topology</span>
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">FastAPI ML Inference Service (Python)</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Model: monsoon_regional_model.tflite (3,060 B) • Scaler: scaler_params.json (7 features)</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">LIVE / 8000</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Audit Logging Database (prediction_database.py)</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Storage: monsoon_predictions.db (SQLite) • Captures GFS/ICON/ECMWF spread, agreement & ground truth</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">ACTIVE</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Multi-Source Ensemble & Evapotranspiration Ingest</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">NOAA GFS + DWD ICON + ECMWF IFS 16-day rainfall & FAO Penman-Monteith ET0 live integration</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold border border-emerald-500/20">CONNECTED</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">React + Vite Presentation Layer</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Tailwind CSS • Recharts • Leaflet GIS • Framer Motion</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400 font-bold border border-sky-500/20">ACTIVE</span>
          </div>
        </div>
      </GlassCard>

      {/* Future Scope Architecture Section */}
      <GlassCard className="p-6 space-y-4 border-amber-500/30">
        <div className="flex items-center space-x-2">
          <Clock className="w-5 h-5 text-amber-500" />
          <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
            Future Scope & Planned Architecture (Not Yet Deployed)
          </h3>
        </div>

        <p className="text-xs text-slate-500 dark:text-slate-400">
          The following components are designed for enterprise production rollout (see documentation in <code className="font-mono text-amber-600 dark:text-amber-400">future-scope/spring-boot-gateway/README.md</code>):
        </p>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Spring Boot API Gateway (Java / Maven)</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Specification: MonsoonController.java • Target: Enterprise rate limiting & SMS/WhatsApp proxy</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">FUTURE SCOPE</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">PostgreSQL TimescaleDB Cluster</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Target: Multi-state geospatial time-series telemetry migration from SQLite</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">FUTURE SCOPE</span>
          </div>

          <div className="p-4 rounded-2xl bg-amber-500/5 border border-amber-500/20 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Enterprise JWT / Spring Security Auth Engine</span>
              <span className="block text-xs text-slate-500 dark:text-slate-400">Target: Government officer RBAC & multi-factor agricultural subscriber authorization</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-amber-500/10 text-amber-600 dark:text-amber-400 font-bold border border-amber-500/20">PLANNED</span>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
