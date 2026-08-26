import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { 
  BrainCircuit, 
  Cpu, 
  ShieldAlert, 
  CheckCircle2, 
  Sliders, 
  Layers, 
  Radio, 
  Globe, 
  Zap,
  BarChart3,
  Scale
} from 'lucide-react';

export const ModelInsights = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 font-sans">
      
      {/* Header */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-2">
        <div className="flex items-center space-x-2 text-xs font-bold text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Scientific Transparency & Model Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight mt-1">
          Model Insights & Inference Pipeline
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Complete technical specification of the 7-feature TensorFlow Lite regional regression model, StandardScaler normalization parameters, and benchmark evaluation.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Neural Network & Preprocessing Specs */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Architecture Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-500" />
                <span>Keras / TFLite Sequential Architecture</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold font-mono">
                [1, 7] &rarr; [1, 1]
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Input Vector Order</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">[Lat, Lon, Month, DMI, ONI, MJO_Phase, MJO_Amp]</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Layer 1 (Dense)</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">16 units, ReLU</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Layer 2 (Dense)</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">8 units, ReLU</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Output Layer (Dense)</span>
                <span className="text-emerald-600 dark:text-emerald-400 font-bold">1 unit, Linear (Monthly mm)</span>
              </div>
            </div>
          </div>

          {/* StandardScaler Json Viewer */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
              <Sliders className="w-4 h-4 text-sky-500" />
              <span>StandardScaler Normalization (scaler_params.json)</span>
            </h3>

            <div className="p-4 rounded-2xl bg-slate-900 dark:bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
              <span className="text-slate-400 text-xs">// 7 Standardized Feature Means & Scales (Fitted on 2000-2023 Karnataka Dataset)</span>
              <pre className="text-sky-300 text-xs leading-relaxed">
{`{
  "features": [
    "Lat", "Lon", "Month", 
    "DMI", "ONI", 
    "MJO_Phase", "MJO_Amp"
  ],
  "mean": [
    14.1633, 76.1756, 6.5000,
    0.0425, -0.0202,
    4.3980, 1.2995
  ],
  "scale": [
    1.5488, 1.1657, 3.4521,
    0.3015, 0.8200,
    1.1228, 0.4372
  ]
}`}
              </pre>
            </div>
          </div>

        </div>

        {/* Right Column: Grounded Assessment & Benchmark Report */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Scientific Benchmark Disclosure Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-extrabold text-sm uppercase tracking-wider">
              <Scale className="w-4 h-4" />
              <span>Held-Out Benchmark Evaluation (2019–2023 Test Split)</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-mono">
                <thead>
                  <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400">
                    <th className="py-2 px-3">Model / Strategy</th>
                    <th className="py-2 px-3">Test MAE</th>
                    <th className="py-2 px-3">vs Naive Baseline</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 dark:divide-slate-800/60 text-slate-800 dark:text-slate-200">
                  <tr className="bg-emerald-500/5">
                    <td className="py-2.5 px-3 font-bold">Naive Historical Climatology</td>
                    <td className="py-2.5 px-3 font-bold text-emerald-600 dark:text-emerald-400">57.76 mm</td>
                    <td className="py-2.5 px-3">Reference (0.0%)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3">Retrained Regional Model</td>
                    <td className="py-2.5 px-3 font-bold text-sky-600 dark:text-sky-400">58.17 mm</td>
                    <td className="py-2.5 px-3">+0.7% (Close to Baseline)</td>
                  </tr>
                  <tr>
                    <td className="py-2.5 px-3 text-slate-500">Legacy Binary (Uncalibrated)</td>
                    <td className="py-2.5 px-3 font-bold text-rose-500">98.85 mm</td>
                    <td className="py-2.5 px-3 text-rose-500">+71.1% (Severe Drift)</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed pt-1">
              <strong>Transparent Evaluation:</strong> Macro teleconnection indices (DMI/ONI/MJO) alone provide limited marginal gain over historical seasonal averages on held-out test data. The system combines numerical forecasts (ECMWF, GFS, ICON) with regional climatology to ensure reliable agronomic alerts.
            </p>
          </div>

          {/* System Engineering Roadmap */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider">
              Engineering Scaling Roadmap
            </h3>

            <div className="space-y-3">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Phases 1 & 2 (Deployed & Verified):</strong>
                  <span className="text-slate-500 dark:text-slate-400">7-feature spatial & teleconnection model + Open-Meteo ensemble synthesis + FAO-56 crop water balance engine.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
                <span className="w-4 h-4 rounded-full border border-sky-400 flex items-center justify-center text-[10px] font-bold text-sky-400 shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="block text-slate-900 dark:text-white">Phase 3 — Real-Time Teleconnections Feed:</strong>
                  <span className="text-slate-500 dark:text-slate-400">Background pipeline to automatically ingest live DMI/ONI/MJO daily indices from NOAA CPC / BOM / IITM.</span>
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
                <span className="w-4 h-4 rounded-full border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0 mt-0.5">4</span>
                <div>
                  <strong className="block text-slate-900 dark:text-white">Phase 4 — Sub-District Taluk & Radar Mesh:</strong>
                  <span className="text-slate-500 dark:text-slate-400">Scale training resolution from 18 district centroids to 175+ Karnataka taluk AWS stations and IMD radar grids.</span>
                </div>
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
