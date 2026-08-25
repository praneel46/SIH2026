import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MetricCard } from '../components/common/MetricCard';
import { Cpu, Server, Database, ShieldCheck, Activity } from 'lucide-react';

export const AdminDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Admin Header */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 text-white flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-400">
            <Cpu className="w-4 h-4" />
            <span>System Administrator Console</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">
            Weather Index Infrastructure & Services
          </h1>
          <p className="text-xs text-slate-400">
            Spring Boot REST Orchestrator • FastAPI TFLite Engine • PostgreSQL Node
          </p>
        </div>

        <div className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-bold">
          <Activity className="w-4 h-4 animate-pulse" />
          <span>All Services Operational</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <MetricCard
          title="FastAPI Inference Node"
          value="99.98%"
          unit="uptime"
          status="TFLite Active"
          icon={Cpu}
          color="sky"
        />
        <MetricCard
          title="Spring Boot Gateway"
          value="24 ms"
          unit="avg latency"
          status="Spring Web REST"
          icon={Server}
          color="indigo"
        />
        <MetricCard
          title="PostgreSQL DB"
          value="1.2 GB"
          unit="allocated"
          status="JPA Hibernate"
          icon={Database}
          color="emerald"
        />
        <MetricCard
          title="JWT Auth Engine"
          value="Active"
          unit="Spring Security"
          status="Role Enforced"
          icon={ShieldCheck}
          color="amber"
        />
      </div>

      {/* Services Health Breakdown */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          Microservice Topology & Scaler Health
        </h3>

        <div className="space-y-3 font-mono text-xs">
          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">FastAPI ML Inference Service (Python)</span>
              <span className="block text-[10px] text-slate-400">Loaded: monsoon_model.tflite, scaler_params.json</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">HEALTHY</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">Spring Boot REST Backend (Java Maven)</span>
              <span className="block text-[10px] text-slate-400">Port 8080 • REST Controller & Advisory Rule Engine</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">HEALTHY</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-center justify-between">
            <div>
              <span className="font-bold text-slate-900 dark:text-white">React + Vite Presentation Layer</span>
              <span className="block text-[10px] text-slate-400">Tailwind CSS • Recharts • Leaflet GIS • Framer Motion</span>
            </div>
            <span className="px-2.5 py-1 rounded-lg bg-sky-500/10 text-sky-500 font-bold border border-sky-500/20">ACTIVE</span>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
