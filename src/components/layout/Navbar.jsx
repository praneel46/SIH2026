import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';
import { CloudRain, ArrowRight, Menu, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { name: 'Home', path: '/' },
    { name: 'Features', path: '#capabilities' },
    { name: 'How It Works', path: '#how-it-works' },
    { name: 'About Platform', path: '/model-insights' }
  ];

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#060913]/90 backdrop-blur-xl border-b border-slate-800/80 shadow-2xl py-3.5'
            : 'bg-transparent py-6'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 flex items-center justify-between">
          
          {/* Brand Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-sky-500 to-blue-600 p-[1.5px] shadow-lg shadow-sky-500/25 group-hover:scale-105 transition-transform duration-300">
              <div className="w-full h-full rounded-[14px] bg-[#060913] flex items-center justify-center">
                <CloudRain className="w-4.5 h-4.5 text-sky-400" />
              </div>
            </div>
            <div>
              <span className="font-black tracking-tight text-lg text-white font-sans">
                WEATHER <span className="text-sky-400">INDEX</span>
              </span>
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => {
              const isHome = item.path === '/' && location.pathname === '/';
              return (
                <a
                  key={item.name}
                  href={item.path}
                  className={`text-xs font-semibold tracking-wide transition-colors ${
                    isHome
                      ? 'text-sky-400 font-bold border-b-2 border-sky-400 pb-1'
                      : 'text-slate-300 hover:text-white'
                  }`}
                >
                  {item.name}
                </a>
              );
            })}
          </nav>

          {/* Right Action Button */}
          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/dashboard"
              className="px-5 py-2.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs shadow-[0_0_25px_rgba(56,189,248,0.35)] transition-all hover:scale-[1.03] active:scale-98 flex items-center space-x-2"
            >
              <span>Get Started</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="fixed top-20 left-0 right-0 md:hidden bg-[#060913]/95 border-b border-slate-800 px-6 py-6 space-y-3 z-40 backdrop-blur-2xl"
          >
            {navItems.map((item) => (
              <a
                key={item.name}
                href={item.path}
                onClick={() => setIsMobileMenuOpen(false)}
                className="block px-4 py-3 rounded-xl text-sm font-semibold text-slate-300 hover:bg-slate-900"
              >
                {item.name}
              </a>
            ))}
            <div className="pt-4 border-t border-slate-800">
              <Link
                to="/dashboard"
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-blue-600 to-cyan-400 text-white font-bold text-sm text-center flex items-center justify-center space-x-2 shadow-lg"
              >
                <span>Explore Platform</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
