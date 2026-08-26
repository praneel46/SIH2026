import React from 'react';
import { motion } from 'framer-motion';

export const GlassCard = ({ children, className = '', hoverEffect = true, onClick }) => {
  return (
    <motion.div
      whileHover={hoverEffect ? { y: -3, transition: { duration: 0.2 } } : {}}
      onClick={onClick}
      className={`glass-card rounded-2xl p-6 transition-all duration-300 shadow-xl shadow-slate-900/5 dark:shadow-black/20 overflow-hidden min-w-0 ${className}`}
    >
      {children}
    </motion.div>
  );
};
