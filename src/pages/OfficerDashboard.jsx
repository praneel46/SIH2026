import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { Users, AlertTriangle, Radio, Map, FileSpreadsheet } from 'lucide-react';

export const OfficerDashboard = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Officer Welcome Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-sky-500/10 via-indigo-500/10 to-transparent border border-sky-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-500">
            <Radio className="w-4 h-4" />
            <span>Agricultural Officer Control Center</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            District Monsoon Risk & Advisory Broadcast
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Jurisdiction: Pune District (Haveli, Baramati, Shirur Blocks)
          </p>
        </div>

        <button className="px-4 py-2.5 rounded-xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs shadow-lg shadow-sky-500/20 flex items-center space-x-2 transition-all">
          <Radio className="w-4 h-4" />
          <span>Broadcast Advisory Alert</span>
        </button>
      </div>

      {/* Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
        <MetricCard
          title="Registered Farmers"
          value="14,280"
          unit="active users"
          status="Haveli & Baramati"
          icon={Users}
          color="indigo"
        />
        <MetricCard
          title="High Risk Blocks"
          value="2"
          unit="of 13 blocks"
          status="Baramati & Daund"
          icon={AlertTriangle}
          color="amber"
        />
        <MetricCard
          title="Avg Rainfall Anomaly"
          value="-22.1 mm"
          unit="district mean"
          status="Deficit Trend"
          icon={Map}
          color="sky"
        />
        <MetricCard
          title="Active Advisories"
          value="8"
          unit="dispatched"
          status="94% delivery rate"
          icon={FileSpreadsheet}
          color="emerald"
        />
      </div>

      {/* Block-wise Risk Breakdown */}
      <GlassCard className="p-6 space-y-4">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
          Block-Level Risk Status Overview
        </h3>

        <div className="space-y-3">
          {[
            { block: 'Baramati', anomaly: '-28.9 mm', risk: 'BREAK_RISK', moisture: '24% (Deficit)', action: 'Canal release requested' },
            { block: 'Haveli', anomaly: '-18.4 mm', risk: 'BELOW_NORMAL', moisture: '38% (Moderate)', action: 'Mulching advisory active' },
            { block: 'Shirur', anomaly: '-6.2 mm', risk: 'BELOW_NORMAL', moisture: '48% (Optimal)', action: 'Monitoring phase' },
            { block: 'Junner', anomaly: '+14.2 mm', risk: 'ABOVE_NORMAL', moisture: '78% (Surplus)', action: 'Drainage warning' }
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-2xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs">
              <div className="space-y-0.5">
                <span className="font-bold text-slate-900 dark:text-white text-sm">{item.block} Block</span>
                <span className="block text-[11px] text-slate-400">Soil Moisture: {item.moisture}</span>
              </div>
              <div className="flex items-center space-x-4">
                <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{item.anomaly}</span>
                <RiskBadge category={item.risk} />
                <span className="text-[11px] text-slate-400 hidden sm:inline">{item.action}</span>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

    </div>
  );
};
