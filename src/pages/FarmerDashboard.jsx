import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { MetricCard } from '../components/common/MetricCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { Sprout, CloudRain, Droplets, MapPin, Bell, ShieldCheck } from 'lucide-react';
import { useRole } from '../context/RoleContext';

export const FarmerDashboard = () => {
  const { selectedLocation } = useRole();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Farmer Welcome Header */}
      <div className="p-6 rounded-3xl bg-gradient-to-r from-emerald-500/10 via-sky-500/10 to-indigo-500/5 border border-emerald-500/20 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400">
            <Sprout className="w-4 h-4" />
            <span>Farmer Advisory Portal</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            Monsoon Outlook for {selectedLocation.village}
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Block: {selectedLocation.block} • District: {selectedLocation.district}, {selectedLocation.state}
          </p>
        </div>

        <div className="px-4 py-2 rounded-2xl bg-white/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-xs font-bold text-slate-800 dark:text-slate-200">
          Selected Crop: <span className="text-emerald-500">Ragi (Finger Millet)</span>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <MetricCard
          title="Monsoon Rainfall Status"
          value="-18.4 mm"
          unit="below normal"
          status="Moderate Deficit"
          icon={CloudRain}
          color="sky"
        />
        <MetricCard
          title="Break Phase Probability"
          value="65%"
          unit="dry spell risk"
          status="7+ Days Dry Risk"
          icon={Droplets}
          color="amber"
        />
        <MetricCard
          title="Soil Moisture Index"
          value="38%"
          unit="volumetric water"
          status="Needs Mulching"
          icon={Sprout}
          color="emerald"
        />
      </div>

      {/* Action Plan Card */}
      <GlassCard className="p-6 space-y-4 border-emerald-500/30">
        <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
          <ShieldCheck className="w-5 h-5 text-emerald-500" />
          <span>Actionable Guidance for Next 10 Days</span>
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-emerald-600 dark:text-emerald-400">1. Soil Moisture Retention</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Spread dry crop residue or organic mulch between ragi rows immediately to suppress soil evaporation during upcoming dry spells.
            </p>
          </div>

          <div className="p-4 rounded-2xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 space-y-2">
            <h4 className="font-bold text-sky-600 dark:text-sky-400">2. Irrigation Management</h4>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
              Prepare drip/ditch channels for life-saving protective irrigation if rainfall remains absent beyond Day 7 of flowering.
            </p>
          </div>
        </div>
      </GlassCard>

    </div>
  );
};
