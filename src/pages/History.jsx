import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { mockPredictions } from '../data/mock/mockPredictions';
import { History as HistoryIcon, Calendar, MapPin, Database } from 'lucide-react';

export const History = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-semibold text-sky-500 uppercase tracking-wider">
          <HistoryIcon className="w-3.5 h-3.5" />
          <span>Prediction Execution History</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Historical Anomaly Evaluation Logs
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Trace past model evaluations, input vectors, and generated risk categories
        </p>
      </div>

      {/* History Cards / Table */}
      <div className="space-y-4">
        {mockPredictions.map((pred) => (
          <GlassCard key={pred.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center space-x-3">
                <span className="font-mono text-xs font-bold text-sky-500">{pred.id}</span>
                <RiskBadge category={pred.riskCategory} size="small" />
              </div>
              <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                {pred.location}
              </h3>
              <div className="flex items-center space-x-4 text-xs text-slate-400">
                <span className="flex items-center space-x-1">
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{pred.date} ({pred.targetPeriod})</span>
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-6 text-right">
              <div>
                <span className="block text-[10px] text-slate-400 uppercase font-semibold">Predicted Anomaly</span>
                <span className="text-xl font-extrabold text-slate-900 dark:text-white font-mono">
                  {pred.rainfallAnomaly} mm
                </span>
              </div>

              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-left font-mono text-[10px] text-slate-400">
                <span>DMI: {pred.dmiInput.dmi}</span> • <span>Lag 1: {pred.dmiInput.dmi_lag1}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
};
