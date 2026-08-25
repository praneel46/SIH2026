import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { apiService } from '../services/apiService';
import { Sprout, Filter, Droplets, ShieldCheck, CheckCircle2, AlertTriangle } from 'lucide-react';

export const Advisory = () => {
  const [advisories, setAdvisories] = useState([]);
  const [crops, setCrops] = useState([]);
  const [selectedCrop, setSelectedCrop] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadAdvisories() {
      setLoading(true);
      try {
        const [advRes, cropRes] = await Promise.all([
          apiService.getAdvisories(),
          apiService.getCrops()
        ]);
        if (advRes.success) setAdvisories(advRes.data);
        if (cropRes.success) setCrops(cropRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadAdvisories();
  }, []);

  const filteredAdvisories = selectedCrop === 'ALL'
    ? advisories
    : advisories.filter(a => a.cropId === selectedCrop);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-emerald-500 uppercase tracking-wider">
            <Sprout className="w-3.5 h-3.5" />
            <span>Agricultural Decision Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Crop-Specific Agricultural Guidance
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Translating predicted rainfall anomalies into field-level soil moisture & irrigation actions
          </p>
        </div>

        {/* Crop Selector Tabs */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          <button
            onClick={() => setSelectedCrop('ALL')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCrop === 'ALL'
                ? 'bg-emerald-500 text-white shadow-md'
                : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
            }`}
          >
            All Crops
          </button>
          {crops.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCrop(c.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                selectedCrop === c.id
                  ? 'bg-emerald-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {c.name}
            </button>
          ))}
        </div>
      </div>

      {/* Advisory Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredAdvisories.map((adv) => (
          <GlassCard key={adv.id} className="p-6 space-y-6 flex flex-col justify-between">
            <div className="space-y-4">
              
              <div className="flex items-center justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center space-x-3">
                  <div className="p-2 rounded-xl bg-emerald-500/10 text-emerald-500">
                    <Sprout className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {adv.cropName} Advisory
                    </h3>
                    <span className="text-[10px] text-slate-400">Broadcast: {adv.broadcastDate}</span>
                  </div>
                </div>
                <RiskBadge category={adv.riskCategory} />
              </div>

              <div>
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">{adv.title}</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                  {adv.summary}
                </p>
              </div>

              {/* Action Points List */}
              <div className="space-y-2">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Recommended Action Points</span>
                <ul className="space-y-2">
                  {adv.actionPoints.map((pt, idx) => (
                    <li key={idx} className="flex items-start space-x-2 text-xs text-slate-700 dark:text-slate-300">
                      <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                      <span>{pt}</span>
                    </li>
                  ))}
                </ul>
              </div>

            </div>

            {/* Bottom Irrigation Callout */}
            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center space-x-2 text-xs text-sky-700 dark:text-sky-300 bg-sky-500/10 p-3 rounded-xl">
              <Droplets className="w-4 h-4 text-sky-500 shrink-0" />
              <span><strong>Irrigation Scheduling:</strong> {adv.irrigationGuidance}</span>
            </div>
          </GlassCard>
        ))}
      </div>

    </div>
  );
};
