import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { apiService } from '../services/apiService';
import { mockLocations } from '../data/mock/mockLocations';
import { History as HistoryIcon, Calendar, MapPin, Database, RefreshCw, Filter, Layers, Globe } from 'lucide-react';

export const History = () => {
  const karnatakaDistricts = mockLocations.states[0]?.districts || [];
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDistrict, setSelectedDistrict] = useState('ALL');

  const loadHistory = async (distFilter) => {
    setLoading(true);
    try {
      const filter = distFilter === 'ALL' ? null : distFilter;
      const res = await apiService.getPredictionHistory(filter, 30);
      if (res.success && res.data && res.data.length > 0) {
        setRecords(res.data);
      } else {
        // Fallback placeholder if DB is empty
        setRecords([]);
      }
    } catch (err) {
      console.error("Failed to load history:", err);
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadHistory(selectedDistrict);
  }, [selectedDistrict]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-500 uppercase tracking-wider">
            <HistoryIcon className="w-3.5 h-3.5" />
            <span>SQLite Prediction Audit Logs</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Historical Predictions & Multi-Model Ingest Logs
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Persistent audit trail from <code className="font-mono text-sky-400">monsoon_predictions.db</code> capturing model spread, agreement & advisories.
          </p>
        </div>

        {/* District Filter & Refresh */}
        <div className="flex items-center space-x-3">
          <div className="flex items-center space-x-2 p-1.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs">
            <Filter className="w-3.5 h-3.5 text-slate-400 ml-1.5" />
            <select
              value={selectedDistrict}
              onChange={(e) => setSelectedDistrict(e.target.value)}
              className="bg-transparent text-xs font-bold text-slate-800 dark:text-slate-200 focus:outline-none pr-2"
            >
              <option value="ALL">All Districts ({karnatakaDistricts.length})</option>
              {karnatakaDistricts.map(d => (
                <option key={d.id} value={d.name}>{d.name}</option>
              ))}
            </select>
          </div>

          <button
            onClick={() => loadHistory(selectedDistrict)}
            disabled={loading}
            className="p-2.5 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
            title="Refresh database logs"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-sky-400' : ''}`} />
          </button>
        </div>
      </div>

      {/* History Records Table / Cards */}
      {loading ? (
        <div className="py-20 text-center space-y-3">
          <RefreshCw className="w-8 h-8 text-sky-500 animate-spin mx-auto" />
          <p className="text-xs text-slate-400 font-mono">Querying SQLite prediction database...</p>
        </div>
      ) : records.length > 0 ? (
        <div className="space-y-4">
          {records.map((rec) => (
            <GlassCard key={rec.id} className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="flex items-center space-x-3">
                  <span className="font-mono text-xs font-bold text-sky-500">LOG #{rec.id}</span>
                  <RiskBadge category={rec.risk_category} size="small" />
                  {rec.model_agreement && (
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      rec.model_agreement === 'HIGH'
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                        : rec.model_agreement === 'MODERATE'
                        ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                        : 'bg-rose-500/20 text-rose-400 border border-rose-500/30'
                    }`}>
                      Agreement: {rec.model_agreement} (Spread: {rec.spread_mm}mm)
                    </span>
                  )}
                </div>

                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-sky-400" />
                  <span>{rec.district}</span>
                  <span className="text-xs font-normal text-slate-400">({rec.latitude}° N, {rec.longitude}° E)</span>
                </h3>

                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-400">
                  <span className="flex items-center space-x-1">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{new Date(rec.timestamp).toLocaleString()} (Month #{rec.month})</span>
                  </span>
                  <span>•</span>
                  <span>GFS: <strong className="text-slate-300">{rec.gfs_forecast_mm ?? 'N/A'}mm</strong></span>
                  <span>•</span>
                  <span>ICON: <strong className="text-slate-300">{rec.icon_forecast_mm ?? 'N/A'}mm</strong></span>
                  <span>•</span>
                  <span>ECMWF: <strong className="text-slate-300">{rec.ecmwf_forecast_mm ?? 'N/A'}mm</strong></span>
                </div>

                {rec.advisory_given && (
                  <p className="text-[11px] text-slate-400 pt-1 italic">
                    "{rec.advisory_given}"
                  </p>
                )}
              </div>

              <div className="flex items-center space-x-6 text-right shrink-0">
                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">Combined 70/30</span>
                  <span className="text-xl font-extrabold text-sky-400 font-mono">
                    {rec.combined_prediction_mm} mm
                  </span>
                  <span className="block text-[9px] text-slate-500">Hist: {rec.historical_mean_mm} mm</span>
                </div>

                <div>
                  <span className="block text-[10px] text-slate-400 uppercase font-semibold">TFLite Raw</span>
                  <span className="text-xl font-extrabold text-slate-200 font-mono">
                    {rec.model_raw_prediction_mm} mm
                  </span>
                  <span className="block text-[9px] text-slate-500">Regression Output</span>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>
      ) : (
        <GlassCard className="p-12 text-center space-y-3">
          <Database className="w-10 h-10 text-slate-600 mx-auto" />
          <h4 className="text-sm font-bold text-slate-300">No Historical Records Found</h4>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Execute a simulation in the Forecast & Simulator view or trigger a daily check to create persistent audit logs in SQLite.
          </p>
        </GlassCard>
      )}

    </div>
  );
};
