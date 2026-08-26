import React from 'react';
import { useLanguage } from '../../context/LanguageContext';
import { Languages } from 'lucide-react';
import { motion } from 'framer-motion';

export const LanguageToggle = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center p-1 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm">
      <button
        onClick={() => setLanguage('kn')}
        aria-label="Kannada Language"
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
          language === 'kn'
            ? 'bg-sky-500 text-white shadow-sm'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span>ಕನ್ನಡ</span>
      </button>
      <button
        onClick={() => setLanguage('en')}
        aria-label="English Language"
        className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center space-x-1 ${
          language === 'en'
            ? 'bg-sky-500 text-white shadow-md'
            : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
        }`}
      >
        <span>EN</span>
      </button>
    </div>
  );
};
