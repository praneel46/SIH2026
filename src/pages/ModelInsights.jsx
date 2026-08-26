import React from 'react';
import { motion } from 'framer-motion';
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
  Scale,
  ArrowRight,
  ArrowDown,
  CloudRain,
  Droplets,
  Sprout,
  Info,
  Calendar,
  Compass,
  FileCode
} from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';

export const ModelInsights = () => {
  const { language } = useLanguage();

  return (
    <div className="max-w-7xl mx-auto space-y-8 font-sans">
      
      {/* Header */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-3">
        <div className="flex items-center space-x-2 text-xs font-black text-purple-600 dark:text-purple-400 uppercase tracking-wider">
          <BrainCircuit className="w-4 h-4" />
          <span>Scientific Transparency & Neural Architecture</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-black text-slate-900 dark:text-white tracking-tight">
          AI Prediction Intelligence & Model Pipeline
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-3xl leading-relaxed">
          Comprehensive specification of the 7-feature regional TensorFlow Lite regression model, 
          StandardScaler normalization parameters, and multi-tier agricultural decision pipeline.
        </p>
      </div>

      {/* SECTION A: 7 VERIFIED INPUT FEATURES */}
      <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-5">
        <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div>
            <div className="flex items-center space-x-2 text-xs font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
              <Compass className="w-3.5 h-3.5" />
              <span>Standardized Feature Contract</span>
            </div>
            <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
              Verified 7-Feature Input Vector
            </h2>
          </div>
          <span className="px-3 py-1 rounded-xl bg-sky-500/10 text-sky-600 dark:text-sky-400 font-mono text-xs font-black border border-sky-500/20">
            Vector Shape: [1, 7]
          </span>
        </div>

        <p className="text-xs text-slate-600 dark:text-slate-300">
          The verified regional machine learning model expects precisely 7 standardized meteorological and spatial features in the exact sequential order below:
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 font-mono text-xs">
          
          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Index #0</span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Latitude (Lat)</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">Centroid: 11.5°N – 18.5°N</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Index #1</span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Longitude (Lon)</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">Centroid: 74.0°E – 78.5°E</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Index #2</span>
            <h4 className="text-sm font-black text-slate-900 dark:text-white">Month (1–12)</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">Monsoon cycle integer</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Index #3</span>
            <h4 className="text-sm font-black text-sky-600 dark:text-sky-400">DMI (IOD Index)</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">Dipole Mode Index (°C)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Index #4</span>
            <h4 className="text-sm font-black text-amber-600 dark:text-amber-400">ONI (ENSO Index)</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">Oceanic Niño Index (°C)</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Index #5</span>
            <h4 className="text-sm font-black text-purple-600 dark:text-purple-400">MJO Phase</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">Phase 1 through 8</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Index #6</span>
            <h4 className="text-sm font-black text-purple-600 dark:text-purple-400">MJO Amplitude</h4>
            <span className="text-xs text-slate-500 dark:text-slate-400 block font-sans">MJO oscillation strength</span>
          </div>

          <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-1 flex flex-col justify-center">
            <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider block">Model Output</span>
            <h4 className="text-sm font-black text-emerald-600 dark:text-emerald-400">Predicted Rainfall</h4>
            <span className="text-xs text-slate-600 dark:text-slate-300 block font-sans">Monthly depth in mm</span>
          </div>

        </div>
      </div>

      {/* SECTION B: VISUAL AI PREDICTION PIPELINE */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-6">
        <div className="border-b border-slate-200 dark:border-slate-800/80 pb-4">
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wider">
            <Zap className="w-3.5 h-3.5" />
            <span>End-to-End Inference Flow</span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white tracking-tight mt-0.5">
            AI Prediction & Agricultural Decision Pipeline
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            How raw global teleconnection signals and local spatial coordinates are synthesized into farmer-ready field actions.
          </p>
        </div>

        {/* Pipeline Cards Flow */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          
          {/* Step 1 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-sky-500 text-white font-black text-xs flex items-center justify-center">1</span>
              <Globe className="w-4 h-4 text-sky-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Input Signals</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Global Climate Indices (DMI, ONI, MJO) + Karnataka Coordinates + Active Month.
              </p>
            </div>
          </div>

          {/* Step 2 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-purple-500 text-white font-black text-xs flex items-center justify-center">2</span>
              <Sliders className="w-4 h-4 text-purple-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">StandardScaler</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Z-score normalization via <code className="text-purple-400">scaler_params.json</code> (fitted on 2000–2023 dataset).
              </p>
            </div>
          </div>

          {/* Step 3 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-indigo-500 text-white font-black text-xs flex items-center justify-center">3</span>
              <Cpu className="w-4 h-4 text-indigo-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">TFLite Model</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Sequential Dense NN executes fast low-latency regional rainfall regression.
              </p>
            </div>
          </div>

          {/* Step 4 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-3 relative">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-blue-500 text-white font-black text-xs flex items-center justify-center">4</span>
              <CloudRain className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">14-Day Ensemble</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                NOAA GFS + DWD ICON + ECMWF IFS real-time numerical weather forecast integration.
              </p>
            </div>
          </div>

        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
          
          {/* Step 5 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-amber-500 text-white font-black text-xs flex items-center justify-center">5</span>
              <ShieldAlert className="w-4 h-4 text-amber-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Risk & Anomaly Assessment</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Calculates percentage anomaly vs 2000–2023 climatological baseline and dry spell risks.
              </p>
            </div>
          </div>

          {/* Step 6 */}
          <div className="p-5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-teal-500 text-white font-black text-xs flex items-center justify-center">6</span>
              <Droplets className="w-4 h-4 text-teal-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-slate-900 dark:text-white">Crop Water Balance</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                Evaluates crop-specific moisture thresholds (<code className="text-teal-400">Kc mid</code>) for Water Deficit / Optimal / Excess.
              </p>
            </div>
          </div>

          {/* Step 7 */}
          <div className="p-5 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 space-y-3">
            <div className="flex items-center justify-between">
              <span className="w-6 h-6 rounded-full bg-emerald-500 text-white font-black text-xs flex items-center justify-center">7</span>
              <Sprout className="w-4 h-4 text-emerald-500" />
            </div>
            <div>
              <h4 className="font-extrabold text-sm text-emerald-600 dark:text-emerald-400">Actionable Field Guidance</h4>
              <p className="text-xs text-slate-700 dark:text-slate-300 mt-1 leading-relaxed">
                Bilingual Kannada & English guidance with specific techniques (mulching, irrigation, drainage).
              </p>
            </div>
          </div>

        </div>
      </div>

      {/* SECTION C & D: MODEL SPECS & TRANSPARENT SCOPE */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left 6 Cols: Neural Network & Scaler Specs */}
        <div className="lg:col-span-6 space-y-6">
          
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800/80 pb-3">
              <h3 className="font-extrabold text-sm text-slate-900 dark:text-white uppercase tracking-wider flex items-center space-x-2">
                <Cpu className="w-4 h-4 text-purple-500" />
                <span>TensorFlow Lite Specification</span>
              </h3>
              <span className="px-2.5 py-0.5 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-600 dark:text-purple-400 text-xs font-bold font-mono">
                3,060 Bytes Binary
              </span>
            </div>

            <div className="space-y-2.5 font-mono text-xs">
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Model File</span>
                <span className="text-purple-600 dark:text-purple-400 font-bold">monsoon_regional_model.tflite</span>
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
              <div className="p-3 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 flex justify-between items-center">
                <span className="text-slate-600 dark:text-slate-400">Held-Out Test MAE</span>
                <span className="text-sky-600 dark:text-sky-400 font-bold">58.17 mm (Ground truth)</span>
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
              <span className="text-slate-400 text-xs">// 7 Standardized Feature Means & Scales (Fitted on 2000–2023 Karnataka Records)</span>
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

        {/* Right 6 Cols: Grounded Scope & Engineering Roadmap */}
        <div className="lg:col-span-6 space-y-6">
          
          {/* Transparency & Current Prototype Scope Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-slate-200 dark:border-slate-800/90 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-sky-600 dark:text-sky-400 font-extrabold text-sm uppercase tracking-wider">
              <Info className="w-4 h-4" />
              <span>Current Prototype Scope & Scientific Transparency</span>
            </div>

            <div className="space-y-3 text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Current Prototype Scope:</span>
                <p>31 Karnataka district meteorological centroids (5,184 historical month-district observation records).</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Decision Support Purpose:</span>
                <p>Localized rainfall guidance, early dry spell warnings, and crop-specific moisture management for rainfed agriculture.</p>
              </div>

              <div className="p-3.5 rounded-2xl bg-slate-50 dark:bg-[#070B19] border border-slate-200 dark:border-slate-800 space-y-1">
                <span className="font-bold text-slate-900 dark:text-white block">Multi-Layer Ensemble:</span>
                <p>Combines macro ML inference with numerical short-range NWP forecasts (NOAA GFS, DWD ICON, ECMWF IFS) to prevent prediction drift.</p>
              </div>
            </div>
          </div>

          {/* Future Scope & Expansion Roadmap Card */}
          <div className="p-6 rounded-3xl bg-white dark:bg-[#0B1021]/90 border border-amber-500/30 dark:border-amber-500/30 shadow-sm dark:shadow-xl space-y-4">
            <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400 font-extrabold text-sm uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Engineering Expansion Roadmap (Future Scope)</span>
            </div>

            <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Hyperlocal Taluk & Panchayat Grid:</strong> High-density 1km x 1km spatial grid resolution.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>IoT Soil Moisture Probes:</strong> Real-time in-situ volumetric soil water content integration.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Expanded Crop Cultivars:</strong> Additional horticulture, pulses, and plantation crop models.</span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle2 className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <span><strong>Automated Dispatch Gateways:</strong> Integration with state K-Kisan SMS & WhatsApp alert relays.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

    </div>
  );
};
