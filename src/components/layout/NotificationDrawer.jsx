import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Bell, AlertTriangle, Info, CheckCircle2, ShieldAlert } from 'lucide-react';

export const NotificationDrawer = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Monsoon Break Risk Alert',
      message: 'High probability of severe dry spell (-46.9% deviation) detected in Bengaluru Rural & Kolar districts.',
      time: '12 mins ago',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/20'
    },
    {
      id: 2,
      type: 'advisory',
      title: 'FAO-56 Crop Advisory Released',
      message: 'Ragi soil moisture conservation & protective furrow guidelines issued for Southern Karnataka agro-climatic zone.',
      time: '1 hour ago',
      icon: Info,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/20'
    },
    {
      id: 3,
      type: 'system',
      title: 'Meteorological Ensemble Ingested',
      message: 'NOAA GFS, DWD ICON, and ECMWF IFS 16-day forecast feeds synchronized with SQLite audit layer.',
      time: '3 hours ago',
      icon: CheckCircle2,
      color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20'
    }
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-slate-900 border-l border-slate-800 text-slate-100 z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto"
          >
            <div>
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-lg bg-sky-500/10 border border-sky-500/20 text-sky-400">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg text-white">Climate & Risk Alerts</h3>
                    <p className="text-xs text-slate-400">Live intelligence notifications</p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-6 space-y-4">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  return (
                    <div
                      key={n.id}
                      className={`p-4 rounded-xl border backdrop-blur-md ${n.color} transition-all hover:translate-y-[-1px]`}
                    >
                      <div className="flex items-start space-x-3">
                        <Icon className="w-5 h-5 mt-0.5 shrink-0" />
                        <div>
                          <div className="flex items-center justify-between">
                            <h4 className="text-sm font-semibold text-white">{n.title}</h4>
                            <span className="text-[10px] text-slate-400">{n.time}</span>
                          </div>
                          <p className="text-xs text-slate-300 mt-1 leading-relaxed">{n.message}</p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="pt-4 border-t border-slate-800 text-center">
              <span className="text-[11px] text-slate-500">
                WEATHER INDEX • Automated Climate Dispatch Engine
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
