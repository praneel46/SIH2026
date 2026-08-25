import React from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { BrainCircuit, Cpu, ShieldAlert, CheckCircle2, Sliders, Layers } from 'lucide-react';

export const ModelInsights = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div className="flex items-center space-x-2 text-xs font-semibold text-purple-500 uppercase tracking-wider">
          <BrainCircuit className="w-3.5 h-3.5" />
          <span>Scientific Transparency & ML Roadmap</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
          Model Insights & Architecture Specification
        </h1>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
          Honest technical evaluation of the TensorFlow/TFLite prototype model, StandardScaler z-score normalization, and future feature expansion.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Neural Network & Preprocessing Specs */}
        <div className="lg:col-span-6 space-y-6">
          
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Cpu className="w-5 h-5 text-purple-500" />
              <span>Keras / TFLite Sequential Architecture</span>
            </h3>

            <div className="space-y-3 font-mono text-xs">
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span>Input Tensor Shape</span>
                <span className="text-sky-500 font-bold">[1, 5]</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span>Layer 1 (Dense)</span>
                <span className="text-purple-400 font-bold">32 units, ReLU</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span>Layer 2 (Dense)</span>
                <span className="text-purple-400 font-bold">16 units, ReLU</span>
              </div>
              <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex justify-between">
                <span>Output Layer (Dense)</span>
                <span className="text-emerald-400 font-bold">1 unit, Linear</span>
              </div>
            </div>
          </GlassCard>

          {/* StandardScaler Json Viewer */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center space-x-2">
              <Sliders className="w-5 h-5 text-sky-500" />
              <span>StandardScaler Parameters (scaler_params.json)</span>
            </h3>

            <div className="p-4 rounded-xl bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto border border-slate-800 space-y-2">
              <span className="text-slate-500 text-[10px]">// Order: [dmi, dmi_lag1, dmi_lag2, month_sin, month_cos]</span>
              <pre className="text-sky-300">
{`{
  "mean": [-0.2476, -0.2483, -0.2485, 0.00079, -0.00079],
  "scale": [0.3349, 0.3352, 0.3350, 0.7077, 0.7066]
}`}
              </pre>
            </div>
          </GlassCard>

        </div>

        {/* Right Column: Underfitting Assessment & Roadmap */}
        <div className="lg:col-span-6 space-y-6">
          
          <GlassCard className="p-6 space-y-4 border-amber-500/30 bg-amber-500/5">
            <div className="flex items-center space-x-2 text-amber-500 font-extrabold text-sm">
              <ShieldAlert className="w-5 h-5" />
              <span>Prototype Evaluation & Underfitting Assessment</span>
            </div>
            
            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              Backtesting indicates that current model predictions stay close to the mean baseline while actual rainfall anomalies display significantly larger variance.
            </p>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>No Fake Metrics:</strong> We explicitly refrain from displaying fabricated accuracy metrics or false confidence percentages.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-amber-500 font-bold">•</span>
                <span><strong>No Spatial Inputs Yet:</strong> The model currently lacks district, block, or village features. UI map representations are regional signals projected onto mock spatial boundaries.</span>
              </li>
            </ul>
          </GlassCard>

          {/* Model Retraining Roadmap */}
          <GlassCard className="p-6 space-y-4">
            <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
              Model Retraining Roadmap
            </h3>

            <div className="space-y-3">
              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
                <CheckCircle2 className="w-4 h-4 text-sky-500 shrink-0 mt-0.5" />
                <div>
                  <strong className="block text-slate-900 dark:text-white">Phase 1 (Current):</strong>
                  <span className="text-slate-500">5-feature DMI lag regression prototype in TFLite.</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
                <span className="w-4 h-4 rounded-full border border-indigo-400 flex items-center justify-center text-[10px] font-bold text-indigo-400 shrink-0 mt-0.5">2</span>
                <div>
                  <strong className="block text-slate-900 dark:text-white">Phase 2 (Planned):</strong>
                  <span className="text-slate-500">Integration of Oceanic Niño Index (ONI/ENSO) & Madden-Julian Oscillation (MJO).</span>
                </div>
              </div>

              <div className="p-3 rounded-xl bg-slate-100/80 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 flex items-start space-x-3 text-xs">
                <span className="w-4 h-4 rounded-full border border-emerald-400 flex items-center justify-center text-[10px] font-bold text-emerald-400 shrink-0 mt-0.5">3</span>
                <div>
                  <strong className="block text-slate-900 dark:text-white">Phase 3 (Hyperlocal):</strong>
                  <span className="text-slate-500">Spatial coordinate grid embeddings & high-resolution precipitation memory grids for true block/village scale forecasting.</span>
                </div>
              </div>
            </div>
          </GlassCard>

        </div>

      </div>

    </div>
  );
};
