import React from 'react';

export const RiskBadge = ({ category, size = 'normal' }) => {
  let config = {
    label: 'Normal',
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
  };

  switch (category) {
    case 'HIGH':
    case 'BREAK_RISK':
      config = {
        label: 'High Deficit Alert',
        bg: 'bg-rose-500/10 dark:bg-rose-500/20 text-rose-600 dark:text-rose-400 border-rose-500/30 animate-pulse'
      };
      break;
    case 'MODERATE':
    case 'BELOW_NORMAL':
      config = {
        label: 'Moderate Deficit',
        bg: 'bg-amber-500/10 dark:bg-amber-500/20 text-amber-600 dark:text-amber-400 border-amber-500/30'
      };
      break;
    case 'ABOVE_NORMAL':
      config = {
        label: 'Above Normal',
        bg: 'bg-sky-500/10 dark:bg-sky-500/20 text-sky-600 dark:text-sky-400 border-sky-500/30'
      };
      break;
    case 'NORMAL':
    default:
      config = {
        label: 'Optimal / Normal',
        bg: 'bg-emerald-500/10 dark:bg-emerald-500/20 text-emerald-600 dark:text-emerald-400 border-emerald-500/30'
      };
  }

  const padding = size === 'small' ? 'px-2 py-0.5 text-xs' : 'px-3 py-1 text-xs';

  return (
    <span className={`inline-flex items-center font-bold rounded-full border ${padding} ${config.bg}`}>
      {config.label}
    </span>
  );
};
