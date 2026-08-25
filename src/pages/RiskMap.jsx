import React, { useEffect, useState } from 'react';
import { GlassCard } from '../components/common/GlassCard';
import { RiskBadge } from '../components/common/RiskBadge';
import { apiService } from '../services/apiService';
import { MapPin, Filter, Layers, Info, Sprout, AlertTriangle, ShieldAlert } from 'lucide-react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Custom SVG marker pin generator based on risk color
const createCustomPin = (color) => {
  const svgString = `
    <svg width="32" height="32" viewBox="0 0 24 24" fill="${color}" stroke="#000" stroke-width="1.5" xmlns="http://www.w3.org/2000/svg">
      <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z"/>
    </svg>
  `;
  return L.divIcon({
    className: 'custom-leaflet-pin',
    html: svgString,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -28]
  });
};

export const RiskMap = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [filterRisk, setFilterRisk] = useState('ALL');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadMapData() {
      setLoading(true);
      try {
        const res = await apiService.getRiskMapData();
        if (res.success) {
          setRegions(res.data);
          setSelectedRegion(res.data[0]); // default select Pune Haveli
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadMapData();
  }, []);

  const filteredRegions = filterRisk === 'ALL'
    ? regions
    : regions.filter(r => r.riskCategory === filterRisk);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200/80 dark:border-slate-800/80">
        <div>
          <div className="flex items-center space-x-2 text-xs font-semibold text-sky-500 uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" />
            <span>GIS Spatial Risk Overlay</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white mt-1">
            Interactive Monsoon Risk Map
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Visualizing block-level rainfall risk markers across agricultural zones
          </p>
        </div>

        {/* Risk Category Filters */}
        <div className="flex items-center space-x-2 overflow-x-auto pb-2 md:pb-0">
          {[
            { id: 'ALL', label: 'All Regions' },
            { id: 'BELOW_NORMAL', label: 'Below Normal' },
            { id: 'BREAK_RISK', label: 'Break Risk' },
            { id: 'NORMAL', label: 'Normal' }
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setFilterRisk(f.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
                filterRisk === f.id
                  ? 'bg-sky-500 text-white shadow-md'
                  : 'bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-800'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Column: Leaflet Map Container */}
        <div className="lg:col-span-8">
          <GlassCard className="p-3 relative overflow-hidden h-[540px]">
            
            {/* Legend Overlay */}
            <div className="absolute top-6 right-6 z-[1000] p-3 rounded-xl bg-slate-900/90 backdrop-blur-md border border-slate-800 text-[11px] text-slate-200 space-y-1.5 shadow-xl">
              <span className="block font-bold text-white uppercase text-[10px]">Risk Legend</span>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500" />
                <span>Normal (+/- 5mm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                <span>Below Normal (-5 to -20mm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                <span>Break Risk (&lt; -20mm)</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="w-2.5 h-2.5 rounded-full bg-sky-500" />
                <span>Above Normal (&gt; +10mm)</span>
              </div>
            </div>

            {/* Leaflet React Map */}
            {!loading && (
              <MapContainer
                center={[18.5204, 73.8567]}
                zoom={7}
                scrollWheelZoom={false}
                style={{ width: '100%', height: '100%', borderRadius: '0.75rem' }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="&copy; OpenStreetMap contributors"
                />

                {filteredRegions.map((r) => (
                  <Marker
                    key={r.id}
                    position={[r.lat, r.lng]}
                    icon={createCustomPin(r.color)}
                    eventHandlers={{
                      click: () => setSelectedRegion(r)
                    }}
                  >
                    <Popup>
                      <div className="p-1 space-y-1 text-slate-900 font-sans">
                        <strong className="block text-xs">{r.districtName} - {r.blockName}</strong>
                        <span className="text-[11px] block">{r.riskLabel}</span>
                        <span className="text-[10px] text-slate-500">Click marker to inspect region detail</span>
                      </div>
                    </Popup>
                  </Marker>
                ))}
              </MapContainer>
            )}
          </GlassCard>
        </div>

        {/* Right Column: Selected Region Detail Panel */}
        <div className="lg:col-span-4">
          <GlassCard className="p-6 space-y-6 h-[540px] flex flex-col justify-between overflow-y-auto">
            {selectedRegion ? (
              <div className="space-y-5">
                <div className="flex items-start justify-between pb-3 border-b border-slate-200/60 dark:border-slate-800/60">
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      {selectedRegion.blockName} Block
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      District: {selectedRegion.districtName}, {selectedRegion.state}
                    </p>
                  </div>
                  <RiskBadge category={selectedRegion.riskCategory} />
                </div>

                <div className="space-y-3">
                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Rainfall Anomaly</span>
                    <span className="font-mono font-bold text-slate-900 dark:text-white">{selectedRegion.rainfallAnomaly} mm</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Break Spell Probability</span>
                    <span className="font-mono font-bold text-amber-500">{selectedRegion.breakSpellProbability}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Soil Moisture Status</span>
                    <span className="font-mono font-bold text-sky-500">{selectedRegion.soilMoistureStatus}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/70 border border-slate-200 dark:border-slate-800 flex justify-between items-center text-xs">
                    <span className="text-slate-500">Dominant Crops</span>
                    <span className="font-bold text-emerald-500">{selectedRegion.dominantCrop}</span>
                  </div>
                </div>

                <div className="p-3.5 rounded-xl bg-amber-500/10 border border-amber-500/20 text-xs text-amber-700 dark:text-amber-300 leading-relaxed">
                  <strong className="block font-semibold">Spatial Framing Disclaimer:</strong>
                  <span>{selectedRegion.spatialScopeNote}</span>
                </div>
              </div>
            ) : (
              <div className="text-center py-12 space-y-2">
                <MapPin className="w-10 h-10 text-slate-400 mx-auto opacity-50" />
                <p className="text-xs text-slate-500">Select a region marker on the map to view detailed risk diagnostics.</p>
              </div>
            )}

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 text-center">
              <span className="text-[10px] text-slate-400">
                Leaflet GIS Map Layer • Weather Index SIH26086
              </span>
            </div>
          </GlassCard>
        </div>

      </div>

    </div>
  );
};
