import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useNotifications } from '../../context/NotificationContext';
import { 
  X, 
  Bell, 
  AlertTriangle, 
  Droplets, 
  CheckCircle2, 
  ShieldAlert, 
  Check, 
  ArrowRight,
  ExternalLink
} from 'lucide-react';

export const NotificationDrawer = () => {
  const navigate = useNavigate();
  const { 
    notifications, 
    unreadCount, 
    readIds, 
    isDrawerOpen, 
    setIsDrawerOpen, 
    markAsRead, 
    markAllAsRead 
  } = useNotifications();

  const handleNotificationClick = (item) => {
    markAsRead(item.id);
    setIsDrawerOpen(false);
    if (item.route) {
      navigate(item.route);
    }
  };

  return (
    <AnimatePresence>
      {isDrawerOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsDrawerOpen(false)}
            className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm z-50"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 bottom-0 w-full max-w-md bg-white dark:bg-[#070B19] border-l border-slate-200 dark:border-slate-800 text-slate-900 dark:text-slate-100 z-50 p-6 shadow-2xl flex flex-col justify-between overflow-y-auto font-sans"
          >
            <div className="space-y-5">
              
              {/* Header */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
                <div className="flex items-center space-x-2.5">
                  <div className="p-2 rounded-2xl bg-sky-500/10 border border-sky-500/30 text-sky-500">
                    <Bell className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-base text-slate-900 dark:text-white">
                      Climate & Risk Alerts
                    </h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400">
                      {unreadCount > 0 ? `${unreadCount} unread intelligence alerts` : 'All alerts caught up'}
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Action Toolbar */}
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider text-[11px]">
                  Real-time Application Context
                </span>
                {unreadCount > 0 && (
                  <button
                    onClick={markAllAsRead}
                    className="text-xs font-bold text-sky-600 dark:text-sky-400 hover:underline flex items-center space-x-1"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Mark all as read</span>
                  </button>
                )}
              </div>

              {/* Notifications List */}
              <div className="space-y-3">
                {notifications.map((n) => {
                  const Icon = n.icon;
                  const isRead = readIds.includes(n.id);

                  return (
                    <div
                      key={n.id}
                      onClick={() => handleNotificationClick(n)}
                      className={`p-4 rounded-2xl border transition-all cursor-pointer relative group ${
                        isRead
                          ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800/80 opacity-75'
                          : 'bg-white dark:bg-[#0B1021] border-slate-300 dark:border-slate-700 shadow-sm hover:border-sky-500 dark:hover:border-sky-500/60'
                      }`}
                    >
                      <div className="flex items-start space-x-3">
                        <div className={`p-2 rounded-xl border shrink-0 ${n.color}`}>
                          <Icon className="w-4 h-4" />
                        </div>

                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center justify-between gap-2">
                            <h4 className="text-xs font-black text-slate-900 dark:text-white tracking-tight truncate">
                              {n.title}
                            </h4>
                            {!isRead && (
                              <span className="w-2 h-2 rounded-full bg-sky-500 shrink-0" />
                            )}
                          </div>

                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            {n.message}
                          </p>

                          <div className="flex items-center justify-between pt-2 text-[11px] text-slate-400 font-medium">
                            <span>{n.time}</span>
                            <span className="font-bold text-sky-600 dark:text-sky-400 flex items-center space-x-1 group-hover:translate-x-0.5 transition-transform">
                              <span>{n.actionLabel}</span>
                              <ArrowRight className="w-3 h-3" />
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-slate-200 dark:border-slate-800 text-center">
              <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500 block">
                WEATHER INDEX • Hyperlocal Agricultural Alert Engine
              </span>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};
