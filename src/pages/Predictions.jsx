import React, { useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { apiService } from '../services/apiService';
import { 
  Sliders, 
  BrainCircuit, 
  RefreshCw, 
  CheckCircle2, 
  AlertCircle, 
  Layers, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export const Predictions = () => {
  const [dmi, setDmi] = useState(0.42);
  const [dmiLag1, setDmiLag1] = useState(0.35);
  const [dmiLag2, setDmiLag2] = useState(0.28);
  const [month, setMonth] = useState(8);

  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);

  const handleSimulate = async () => {
    setLoading(true);
    try {
      const res = await apiService.evaluatePrediction({
        dmi,
        dmi_lag1: dmiLag1,
        dmi_lag2: dmiLag2,
        month
      });
      if (res.success) {
        setResult(res.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-semibold text-sky-500 uppercase tracking-wider">
          <Sliders className="w-3.5 h-3.5" />
          <span>Interactive Prediction Simulator</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Climate Signal Anomaly Evaluator
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Adjust Indian Ocean Dipole lag metrics to test prototype TFLite regression outputs & z-score scaling.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Input Sliders Form */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6 space-y-6">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <BrainCircuit className="w-5 h-5 text-sky-500" />
              <span>Input Signal Vector (5 Features)</span>
            </h3>

            {/* DMI Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">DMI (Current Month)</label>
                <span className="font-mono font-bold text-sky-500">{dmi.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.01"
                value={dmi}
                onChange={(e) => setDmi(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
              <p className="text-[10px] text-slate-400">Indian Ocean Dipole mode index value (-1.0 to +1.0)</p>
            </div>

            {/* DMI Lag 1 Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">DMI Lag 1 (Previous Month)</label>
                <span className="font-mono font-bold text-sky-500">{dmiLag1.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.01"
                value={dmiLag1}
                onChange={(e) => setDmiLag1(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* DMI Lag 2 Slider */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">DMI Lag 2 (2 Months Prior)</label>
                <span className="font-mono font-bold text-sky-500">{dmiLag2.toFixed(2)}</span>
              </div>
              <input
                type="range"
                min="-1.0"
                max="1.0"
                step="0.01"
                value={dmiLag2}
                onChange={(e) => setDmiLag2(parseFloat(e.target.value))}
                className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-sky-500"
              />
            </div>

            {/* Target Month Selector */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <label className="font-bold text-slate-700 dark:text-slate-300">Target Month (Cyclical Encoding)</label>
                <span className="font-mono font-bold text-sky-500">Month #{month}</span>
              </div>
              <select
                value={month}
                onChange={(e) => setMonth(parseInt(e.target.value, 10))}
                className="w-full p-2.5 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                {[5, 6, 7, 8, 9, 10].map((m) => (
                  <option key={m} value={m}>Month {m} (Monsoon Season Phase)</option>
                ))}
              </select>
            </div>

            <button
              onClick={handleSimulate}
              disabled={loading}
              className="w-full py-3.5 rounded-xl bg-gradient-to-r from-sky-500 to-indigo-600 text-white font-bold text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-sky-500/25 hover:scale-[1.01] active:scale-98 transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <RefreshCw className="w-4 h-4 animate-spin" />
                  <span>Computing TFLite Inference...</span>
                </>
              ) : (
                <>
                  <Sparkles className="w-4 h-4" />
                  <span>Run Prediction Simulator</span>
                </>
              )}
            </button>
          </GlassCard>
        </div>

        {/* Right Column: Simulated Result Panel */}
        <div className="lg:col-span-6 space-y-6">
          <GlassCard className="p-6 space-y-6 min-h-[420px] flex flex-col justify-between">
            {result ? (
              <div className="space-y-6">
                <div className="flex items-center justify-between pb-4 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div className="flex items-center space-x-2">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">TFLite Inference Complete</h3>
                  </div>
                  <RiskBadge category={result.riskCategory} />
                </div>

                <div className="text-center py-4 space-y-2">
                  <span className="text-xs uppercase font-semibold text-slate-400">Evaluated Rainfall Anomaly</span>
                  <div className="text-5xl font-black text-slate-900 dark:text-white font-mono">
                    {result.rainfallAnomaly} <span className="text-lg font-normal text-slate-500">mm</span>
                  </div>
                  <p className="text-xs text-slate-500">Unit: {result.unit}</p>
                </div>

                {/* Scaled Input Vector Inspection */}
                <div className="p-4 rounded-xl bg-slate-900 text-slate-200 border border-slate-800 space-y-2 font-mono text-[11px]">
                  <span className="block text-[10px] uppercase text-sky-400 font-bold">StandardScaler Normalized Vector Z = (X - μ) / σ</span>
                  <div className="grid grid-cols-5 gap-1 text-center py-1">
                    {result.scaledInputs.map((val, idx) => (
                      <div key={idx} className="p-1 rounded bg-slate-800 border border-slate-700">
                        <span className="block text-[9px] text-slate-400">f[{idx}]</span>
                        <span className="font-bold text-sky-300">{val.toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-sky-500/10 border border-sky-500/20 text-xs text-sky-700 dark:text-sky-300 leading-relaxed">
                  <strong>Metadata:</strong> {result.modelMetadata.note}
                </div>
              </div>
            ) : (
              <div className="my-auto text-center space-y-3 py-12">
                <BrainCircuit className="w-12 h-12 text-slate-400 mx-auto opacity-50" />
                <h4 className="text-sm font-bold text-slate-700 dark:text-slate-300">Simulator Ready</h4>
                <p className="text-xs text-slate-500 max-w-xs mx-auto">
                  Adjust the DMI signal sliders on the left and click "Run Prediction Simulator" to execute preprocessed TFLite regression.
                </p>
              </div>
            )}
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
