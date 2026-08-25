import React from 'react';
import { GlassCard } from './GlassCard';
import { motion } from 'framer-motion';

export const MetricCard = ({ title, value, unit, status, icon: Icon, trend, color = 'sky' }) => {
  const colorStyles = {
    sky: 'text-sky-500 bg-sky-500/10 border-sky-500/20',
    indigo: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/20',
    amber: 'text-amber-500 bg-amber-500/10 border-amber-500/20',
    rose: 'text-rose-500 bg-rose-500/10 border-rose-500/20',
    emerald: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
  };

  return (
    <GlassCard>
      <div className="flex items-start justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">
          {title}
        </span>
        {Icon && (
          <div className={`p-2.5 rounded-xl border ${colorStyles[color]}`}>
            <Icon className="w-5 h-5" />
          </div>
        )}
      </div>

      <div className="mt-4 flex items-baseline space-x-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
          {value}
        </span>
        {unit && (
          <span className="text-xs text-slate-500 dark:text-slate-400 font-medium">
            {unit}
          </span>
        )}
      </div>

      <div className="mt-3 flex items-center justify-between pt-3 border-t border-slate-200/60 dark:border-slate-800/60 text-xs">
        {status && (
          <span className="font-semibold text-slate-700 dark:text-slate-300 flex items-center space-x-1">
            <span>{status}</span>
          </span>
        )}
        {trend && (
          <span className="text-[11px] text-slate-400">
            {trend}
          </span>
        )}
      </div>
    </GlassCard>
  );
};
