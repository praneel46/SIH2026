import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { mockLocations } from '../../data/mock/mockLocations';
import { generateClimateReport } from '../../utils/reportGenerator';
import { 
  CloudRain, 
  LayoutDashboard, 
  BarChart3, 
  AlertTriangle, 
  MapPin, 
  Radio, 
  Sprout, 
  FileText, 
  Settings, 
  Menu, 
  X, 
  Bell, 
  ChevronDown, 
  ChevronLeft,
  ChevronRight,
  LogOut, 
  Search, 
  Map, 
  TrendingUp, 
  BrainCircuit,
  Sparkles,
  Droplets
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { ThemeToggle } from './ThemeToggle';
import { LanguageToggle } from './LanguageToggle';
import { NotificationDrawer } from './NotificationDrawer';
import { useLanguage } from '../../context/LanguageContext';
import { useNotifications } from '../../context/NotificationContext';
import { useRole } from '../../context/RoleContext';

export const DashboardLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const { role, setRole, selectedLocation, setSelectedLocation } = useRole();
  const { unreadCount, setIsDrawerOpen } = useNotifications();
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isLocationMenuOpen, setIsLocationMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const sidebarNavItems = [
    { name: t('dashboardOverview') || 'Monsoon Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: t('cropAdvisoryGuidance') || 'Crop Advisory', path: '/advisory', icon: Sprout },
    { name: t('karnatakaRiskMap'), path: '/risk-map', icon: AlertTriangle },
    { name: t('farmerAdvisory') || 'Farmer Outlook', path: '/farmer-dashboard', icon: Droplets },
    { name: t('officerTelemetry'), path: '/officer-dashboard', icon: Radio },
    { name: t('scenarioSimulator'), path: '/predictions', icon: BarChart3 },
    { name: t('modelSpecification'), path: '/model-insights', icon: BrainCircuit },
    { name: t('predictionHistory') || 'Prediction History', path: '/history', icon: FileText },
    { name: t('systemStatus'), path: '/admin-dashboard', icon: Settings },
  ];

  // Extract flat locations list for location search
  const availableLocations = [];
  mockLocations.states.forEach(st => {
    st.districts.forEach(dt => {
      dt.blocks.forEach(blk => {
        availableLocations.push({
          state: st.name,
          district: dt.name,
          lat: dt.lat,
          lon: dt.lon,
          block: blk.name,
          village: blk.villages[0] || 'Center'
        });
      });
    });
  });

  const filteredLocations = availableLocations.filter(loc => 
    loc.district.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.state.toLowerCase().includes(searchQuery.toLowerCase()) ||
    loc.block.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleSelectLocation = (loc) => {
    setSelectedLocation(loc);
    setIsLocationMenuOpen(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-[#04060E] text-slate-900 dark:text-slate-100 font-sans flex flex-col md:flex-row overflow-x-hidden selection:bg-sky-500 selection:text-white transition-colors">
      
      {/* ============================================================ */}
      {/* LEFT SIDEBAR (Desktop Collapse/Expand & Mobile Drawer) */}
      {/* ============================================================ */}
      
      {/* Desktop Collapsible Sidebar */}
      <aside 
        className={`hidden lg:flex flex-col bg-white dark:bg-[#070B19] border-r border-slate-200 dark:border-slate-800/80 p-4 shrink-0 justify-between min-h-screen sticky top-0 z-30 transition-all duration-300 ease-in-out ${
          isCollapsed ? 'w-20' : 'w-64'
        }`}
      >
        <div className="space-y-6">
          
          {/* Top Brand Header & Collapse Toggle */}
          <div className="flex items-center justify-between px-1 pt-1">
            <Link to="/" className="flex items-center space-x-3 overflow-hidden">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-[1px] shadow-[0_0_20px_rgba(56,189,248,0.3)] shrink-0">
                <div className="w-full h-full rounded-[15px] bg-slate-900 flex items-center justify-center">
                  <CloudRain className="w-5 h-5 text-sky-400" />
                </div>
              </div>
              {!isCollapsed && (
                <div className="whitespace-nowrap transition-opacity duration-200">
                  <span className="font-extrabold text-base text-slate-900 dark:text-white tracking-tight block">
                    WEATHER <span className="text-sky-500 dark:text-sky-400">INDEX</span>
                  </span>
                  <span className="text-xs text-slate-500 dark:text-slate-400 font-medium block">Climate Intelligence</span>
                </div>
              )}
            </Link>

            {/* Collapse / Expand Control Button */}
            <button 
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="p-1.5 rounded-xl bg-slate-100 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:border-slate-300 dark:hover:border-slate-700 transition-colors shrink-0"
              title={isCollapsed ? "Expand Sidebar" : "Collapse Sidebar"}
            >
              {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </button>
          </div>

          {/* Navigation Links */}
          <nav className="space-y-1.5 pt-2">
            {sidebarNavItems.map((item) => {
              const Icon = item.icon;
              const isActive = location.pathname === item.path;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  title={isCollapsed ? item.name : undefined}
                  className={`flex items-center rounded-2xl text-xs font-semibold transition-all duration-200 ${
                    isCollapsed ? 'justify-center p-3' : 'space-x-3.5 px-4 py-3'
                  } ${
                    isActive 
                      ? 'bg-gradient-to-r from-blue-600 to-sky-500 text-white shadow-[0_0_20px_rgba(56,189,248,0.35)] border border-sky-400/40' 
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900/60'
                  }`}
                >
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  {!isCollapsed && <span className="whitespace-nowrap">{item.name}</span>}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section: Monsoon Watch Widget & Sidebar Logout */}
        <div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800/80">
          
          {/* Monsoon Watch Bottom Widget */}
          {!isCollapsed ? (
            <div className="p-3.5 rounded-2xl bg-slate-100/80 dark:bg-[#0B1222] border border-slate-200 dark:border-sky-500/30 space-y-1.5 relative overflow-hidden">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">Monsoon Watch</span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              </div>
              <p className="text-xs font-semibold text-slate-800 dark:text-white">Aug 26, 2026</p>
              <div className="inline-flex items-center space-x-1 px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-bold">
                <span>Active Monitoring</span>
              </div>
            </div>
          ) : (
            <div className="w-10 h-10 mx-auto rounded-2xl bg-slate-100 dark:bg-[#0B1222] border border-slate-200 dark:border-sky-500/30 flex items-center justify-center text-emerald-500" title="Monsoon Watch Active">
              <Sparkles className="w-4 h-4 animate-pulse" />
            </div>
          )}

          {/* SIDEBAR LOGOUT */}
          <button
            onClick={handleLogout}
            title="Logout"
            className={`w-full flex items-center rounded-2xl text-xs font-semibold text-rose-500 dark:text-rose-400 hover:bg-rose-500/10 hover:border-rose-500/30 border border-transparent transition-all ${
              isCollapsed ? 'justify-center p-3' : 'space-x-3 px-4 py-3'
            }`}
          >
            <LogOut className="w-4 h-4 shrink-0 text-rose-500 dark:text-rose-400" />
            {!isCollapsed && <span>Logout</span>}
          </button>

        </div>

      </aside>

      {/* Mobile Header Bar */}
      <div className="lg:hidden flex items-center justify-between px-5 py-4 bg-white dark:bg-[#070B19] border-b border-slate-200 dark:border-slate-800 sticky top-0 z-40">
        <Link to="/" className="flex items-center space-x-2">
          <div className="w-8 h-8 rounded-xl bg-sky-500/20 border border-sky-400/40 flex items-center justify-center text-sky-500">
            <CloudRain className="w-4 h-4" />
          </div>
          <span className="font-black text-sm text-slate-900 dark:text-white">WEATHER <span className="text-sky-500 dark:text-sky-400">INDEX</span></span>
        </Link>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0, x: -250 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -250 }}
            className="lg:hidden fixed inset-0 z-50 bg-white dark:bg-[#070B19] p-6 space-y-6 overflow-y-auto flex flex-col justify-between"
          >
            <div className="space-y-6">
              <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
                <span className="font-black text-slate-900 dark:text-white text-base">Navigation</span>
                <button onClick={() => setIsSidebarOpen(false)} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-900 text-slate-700 dark:text-slate-300">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <nav className="space-y-2">
                {sidebarNavItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.name}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center space-x-3.5 px-4 py-3 rounded-2xl text-xs font-semibold ${
                        isActive ? 'bg-sky-500 text-white font-bold' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-900'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={() => { setIsSidebarOpen(false); handleLogout(); }}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-2xl text-xs font-semibold text-rose-500 dark:text-rose-400 bg-rose-500/10 border border-rose-500/30"
            >
              <LogOut className="w-4 h-4 text-rose-500 dark:text-rose-400" />
              <span>Logout</span>
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ============================================================ */}
      {/* MAIN DASHBOARD CONTENT AREA */}
      {/* ============================================================ */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen overflow-y-auto">
        
        {/* Top Header Bar */}
        <header className="px-6 py-5 bg-white/80 dark:bg-[#070B19]/60 border-b border-slate-200 dark:border-slate-800/80 backdrop-blur-md sticky top-0 z-20 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-colors">
          
          {/* Greeting */}
          <div className="space-y-0.5">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <span>Good Morning, {user?.name?.split(' ')[0] || 'Agricultural Officer'}</span>
              <span>👋</span>
            </h1>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Here's your climate intelligence overview for <span className="text-sky-600 dark:text-sky-400 font-semibold">{selectedLocation.district}, {selectedLocation.state}</span>
            </p>
          </div>

          {/* Location Selector Pill & Action Buttons */}
          <div className="flex items-center space-x-3 flex-wrap gap-y-2">
            
            {/* Dynamic Hierarchical Location Selector */}
            <div className="relative">
              <button
                onClick={() => setIsLocationMenuOpen(!isLocationMenuOpen)}
                className="flex items-center space-x-2.5 px-3.5 py-2 rounded-2xl bg-white dark:bg-[#0B1222] border border-slate-300 dark:border-sky-500/40 text-xs font-semibold text-slate-800 dark:text-white hover:border-sky-400 transition-all shadow-sm dark:shadow-md group"
              >
                <div className="p-1 rounded-lg bg-sky-500/10 text-sky-500 dark:text-sky-400">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="text-left leading-tight">
                  <div className="flex items-center space-x-1.5">
                    <span className="text-[10px] text-slate-400 dark:text-slate-400 uppercase tracking-wider font-bold">
                      {selectedLocation.state || 'Karnataka'}
                    </span>
                    <span className="text-slate-300 dark:text-slate-600">•</span>
                    <span className="font-extrabold text-slate-900 dark:text-white">
                      {selectedLocation.district}
                    </span>
                  </div>
                  <div className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">
                    {selectedLocation.block ? `${selectedLocation.block}` : 'Centroid'} {selectedLocation.village ? `• ${selectedLocation.village}` : ''}
                  </div>
                </div>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-400 transition-transform ${isLocationMenuOpen ? 'rotate-180' : ''}`} />
              </button>

              {/* Location Dropdown Modal */}
              <AnimatePresence>
                {isLocationMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10, scale: 0.98 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.98 }}
                    className="absolute right-0 mt-2 w-80 p-3.5 rounded-3xl bg-white dark:bg-[#0B1021] border border-slate-200 dark:border-slate-800 shadow-2xl z-50 space-y-3 backdrop-blur-2xl"
                  >
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
                        Select Karnataka Location
                      </span>
                      <span className="text-[10px] font-mono text-sky-500 dark:text-sky-400 bg-sky-500/10 px-2 py-0.5 rounded-full">
                        Centroid Synced
                      </span>
                    </div>

                    <div className="relative">
                      <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Search district, block, village..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:outline-none focus:border-sky-400"
                        autoFocus
                      />
                    </div>

                    <div className="max-h-56 overflow-y-auto space-y-1 text-xs pr-1">
                      {filteredLocations.length > 0 ? (
                        filteredLocations.map((loc, i) => {
                          const isSelected = selectedLocation.district === loc.district && selectedLocation.block === loc.block;
                          return (
                            <button
                              key={i}
                              onClick={() => handleSelectLocation(loc)}
                              className={`w-full text-left px-3 py-2 rounded-xl transition-all flex items-center justify-between ${
                                isSelected
                                  ? 'bg-sky-500 text-white font-bold shadow-md shadow-sky-500/20'
                                  : 'hover:bg-sky-500/10 hover:text-sky-600 dark:hover:text-sky-400 text-slate-700 dark:text-slate-300'
                              }`}
                            >
                              <div className="space-y-0.5">
                                <div className="font-bold flex items-center space-x-1.5">
                                  <span>{loc.district}</span>
                                  <span className="text-[10px] opacity-75">({loc.block})</span>
                                </div>
                                <div className={`text-[10px] ${isSelected ? 'text-sky-100' : 'text-slate-400 dark:text-slate-500'}`}>
                                  {loc.state} • {loc.village}
                                </div>
                              </div>
                              <span className={`text-[10px] font-mono shrink-0 ml-2 ${isSelected ? 'text-white' : 'text-slate-400'}`}>
                                {loc.lat}°N, {loc.lon}°E
                              </span>
                            </button>
                          );
                        })
                      ) : (
                        <div className="py-4 text-center text-xs text-slate-400">
                          No matching Karnataka location found
                        </div>
                      )}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Language Switcher (Global Kannada / English Toggle) */}
            <LanguageToggle />

            {/* Theme Toggle Button */}
            <ThemeToggle />

            {/* Notification Bell */}
            <button 
              onClick={() => setIsDrawerOpen(true)}
              className="p-2 rounded-2xl bg-white dark:bg-[#0B1222] border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white relative shadow-sm dark:shadow-md transition-colors"
              title="View Climate & Risk Notifications"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-sky-500 text-[10px] font-black text-white flex items-center justify-center shadow-sm animate-pulse">
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Download Report CTA Button */}
            <button 
              onClick={() => generateClimateReport(selectedLocation, selectedCrop, null)}
              className="px-4 py-2 rounded-2xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs shadow-[0_0_20px_rgba(56,189,248,0.35)] transition-all hover:scale-[1.02] flex items-center space-x-2"
            >
              <FileText className="w-3.5 h-3.5" />
              <span>{t('downloadReport')}</span>
            </button>

          </div>

        </header>

        {/* Dynamic Notification Drawer */}
        <NotificationDrawer />

        {/* Dashboard Content Injector */}
        <main className="p-6 space-y-6 flex-1 bg-slate-50 dark:bg-[#04060E] transition-colors">
          {children}
        </main>

      </div>

    </div>
  );
};
