import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRole } from './RoleContext';
import { evaluateCropWaterIntelligence } from '../services/cropWaterIntelligence';
import { AlertTriangle, Droplets, CloudRain, CheckCircle2, ShieldAlert } from 'lucide-react';

const NotificationContext = createContext();

export const NotificationProvider = ({ children }) => {
  const { selectedLocation, selectedCrop } = useRole();
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Read read IDs from localStorage
  const [readIds, setReadIds] = useState(() => {
    try {
      const saved = localStorage.getItem('weather_index_read_notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('weather_index_read_notifications', JSON.stringify(readIds));
    } catch {}
  }, [readIds]);

  // Compute dynamic notifications derived from selectedLocation & selectedCrop
  const cropWater = evaluateCropWaterIntelligence(selectedCrop?.key, {
    predictedMonthlyRainfall: 116.5,
    forecast14DayRainfall: 21.2,
    deviationPct: -15.0,
    riskCategory: 'HIGH',
    drySpellWarning: true
  });

  const notifications = [
    {
      id: `notif-dryspell-${selectedLocation.district}`,
      type: 'warning',
      category: 'DRY_SPELL',
      title: `Dry Spell Risk Detected — ${selectedLocation.district}`,
      message: `${selectedLocation.district} has a high probability of low rainfall. Review protective irrigation requirements.`,
      actionLabel: 'Review Irrigation',
      route: '/dashboard',
      time: '10 mins ago',
      icon: AlertTriangle,
      color: 'text-amber-500 bg-amber-500/10 border-amber-500/30'
    },
    {
      id: `notif-crop-${selectedCrop?.key || 'ragi'}-${selectedLocation.district}`,
      type: 'crop_water',
      category: 'CROP_WATER',
      title: `${cropWater.waterStatus}: ${selectedCrop?.name || 'Ragi'}`,
      message: `${cropWater.waterNeedDescription} in ${selectedLocation.district}. Recommended: ${cropWater.recommendation.action_en}`,
      actionLabel: 'View Detailed Advisory',
      route: '/advisory',
      time: '45 mins ago',
      icon: Droplets,
      color: cropWater.status === 'WATER_DEFICIT' 
        ? 'text-rose-500 bg-rose-500/10 border-rose-500/30' 
        : 'text-emerald-500 bg-emerald-500/10 border-emerald-500/30'
    },
    {
      id: `notif-drainage-${selectedLocation.district}`,
      type: 'excess_water',
      category: 'DRAINAGE',
      title: `Field Soil Moisture & Drainage Watch`,
      message: `Ensure dead furrows and peripheral drainage channels are cleared for ${selectedLocation.district} field plots.`,
      actionLabel: 'Check Risk Map',
      route: '/risk-map',
      time: '2 hours ago',
      icon: ShieldAlert,
      color: 'text-sky-500 bg-sky-500/10 border-sky-500/30'
    },
    {
      id: `notif-ensemble-${selectedLocation?.district || 'Bengaluru Rural'}`,
      type: 'forecast_update',
      category: 'FORECAST_UPDATE',
      title: `New Monsoon Cycle Forecast Ingested`,
      message: `Multi-model ensemble (NOAA GFS, DWD ICON, ECMWF IFS) updated for ${selectedLocation?.district || 'Bengaluru Rural'} (${Number(selectedLocation?.lat ?? 13.29).toFixed(2)}°N, ${Number(selectedLocation?.lon ?? 77.55).toFixed(2)}°E).`,
      actionLabel: 'Open Dashboard',
      route: '/dashboard',
      time: '3 hours ago',
      icon: CheckCircle2,
      color: 'text-indigo-500 bg-indigo-500/10 border-indigo-500/30'
    }
  ];

  const unreadNotifications = notifications.filter(n => !readIds.includes(n.id));
  const unreadCount = unreadNotifications.length;

  const markAsRead = (id) => {
    if (!readIds.includes(id)) {
      setReadIds(prev => [...prev, id]);
    }
  };

  const markAllAsRead = () => {
    const allIds = notifications.map(n => n.id);
    setReadIds(allIds);
  };

  const clearNotifications = () => {
    markAllAsRead();
  };

  return (
    <NotificationContext.Provider 
      value={{
        notifications,
        unreadCount,
        readIds,
        isDrawerOpen,
        setIsDrawerOpen,
        markAsRead,
        markAllAsRead,
        clearNotifications
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};
