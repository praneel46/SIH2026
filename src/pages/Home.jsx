import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { 
  CloudRain, 
  ArrowRight, 
  Play, 
  AlertTriangle, 
  Sprout, 
  Radio, 
  MapPin, 
  Globe, 
  BarChart3, 
  Target, 
  Users, 
  Zap, 
  ChevronDown, 
  RotateCw 
} from 'lucide-react';
import stormBg from '../assets/hero-storm-bg.jpg';

export const Home = () => {
  const [flippedCard, setFlippedCard] = useState(null);

  // Staggered entrance animation variants
  const heroContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.15
      }
    }
  };

  const itemFadeUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } }
  };

  const scrollRevealSection = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } }
  };

  // Word-by-word heading animation variants
  const headingWords = ["Intelligence", "That", "Empowers", "Better", "Decisions"];
  const wordContainerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.08
      }
    }
  };
  const wordItemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } }
  };

  return (
    <div className="min-h-screen bg-[#060913] text-slate-100 selection:bg-sky-500 selection:text-white overflow-hidden font-sans">
      
      {/* ============================================================ */}
      {/* SECTION 1 — HERO SECTION (With Subtle Atmospheric Weather Effects) */}
      {/* ============================================================ */}
      <section 
        className="relative min-h-screen flex flex-col justify-between items-start bg-cover bg-center bg-no-repeat overflow-hidden"
        style={{ backgroundImage: `url(${stormBg})` }}
      >
        {/* Atmospheric Weather Overlay (Subtle Rain Streaks & Distant Lightning Glow) */}
        <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden">
          {/* Soft Distant Lightning Flash */}
          <div className="absolute inset-0 bg-sky-300/10 animate-lightning-glow" />

          {/* Rain Particle Streaks (Low Opacity, Non-Distracting) */}
          <div className="absolute top-0 left-[15%] w-[1px] h-24 bg-gradient-to-b from-transparent via-sky-300/30 to-transparent animate-rain-1" />
          <div className="absolute top-0 left-[35%] w-[1px] h-32 bg-gradient-to-b from-transparent via-cyan-300/25 to-transparent animate-rain-2" />
          <div className="absolute top-0 left-[60%] w-[1px] h-20 bg-gradient-to-b from-transparent via-blue-300/30 to-transparent animate-rain-3" />
          <div className="absolute top-0 left-[80%] w-[1px] h-28 bg-gradient-to-b from-transparent via-sky-300/20 to-transparent animate-rain-1" />
        </div>

        {/* Hero Content Container */}
        <div className="w-full max-w-7xl mx-auto px-6 sm:px-8 lg:px-12 relative z-10 my-auto">
          <motion.div
            variants={heroContainerVariants}
            initial="hidden"
            animate="visible"
            className="text-left max-w-xl space-y-6 pt-32 sm:pt-36 pb-16"
          >
            {/* Eyebrow Badge Pill (Neumorphic Soft Depth) */}
            <motion.div variants={itemFadeUp} className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-[#060913]/70 border border-cyan-400/50 text-cyan-300 text-xs font-semibold tracking-wide shadow-[0_0_20px_rgba(6,182,212,0.4)] backdrop-blur-md neu-inset">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
              <span className="drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">Climate Intelligence for Smarter Decisions</span>
            </motion.div>

            {/* Main Hero Headline */}
            <motion.h1 
              variants={itemFadeUp}
              className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.08] text-white font-sans drop-shadow-[0_4px_16px_rgba(0,0,0,0.95)]"
            >
              Understand <br />
              the Monsoon. <br />
              Prepare{' '}
              <span className="bg-gradient-to-r from-sky-300 via-cyan-300 to-blue-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(56,189,248,0.8)]">
                Before
              </span>{' '}
              It <br />
              <span className="bg-gradient-to-r from-blue-400 via-indigo-300 to-purple-400 bg-clip-text text-transparent drop-shadow-[0_0_30px_rgba(129,140,248,0.8)]">
                Changes.
              </span>
            </motion.h1>

            {/* Supporting Subtitle */}
            <motion.p 
              variants={itemFadeUp}
              className="text-sm sm:text-base text-slate-100 max-w-lg font-normal leading-relaxed text-balance drop-shadow-[0_2px_10px_rgba(0,0,0,0.95)]"
            >
              AI-powered climate intelligence for localized rainfall prediction, monsoon risk assessment, and crop advisory.
            </motion.p>

            {/* CTA Buttons (Neumorphic + Glassmorphic Blend) */}
            <motion.div variants={itemFadeUp} className="flex flex-wrap items-center gap-4 pt-1">
              <Link
                to="/login"
                className="px-7 py-3 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs shadow-[0_0_30px_rgba(56,189,248,0.5)] hover:scale-[1.03] active:scale-98 transition-all flex items-center space-x-2 neu-button"
              >
                <span>Get Started</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="#how-it-works"
                className="px-6 py-3 rounded-full bg-[#0B1021]/80 hover:bg-[#0B1021] border border-slate-700/80 text-slate-100 font-semibold text-xs flex items-center space-x-2 backdrop-blur-md transition-all hover:border-slate-500 shadow-[0_4px_12px_rgba(0,0,0,0.5)]"
              >
                <Play className="w-3.5 h-3.5 fill-slate-100 text-slate-100" />
                <span>How It Works</span>
              </a>
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
          className="relative z-10 w-full pb-6 text-center space-y-1.5"
        >
          <span className="text-[11px] uppercase tracking-widest text-slate-200 font-semibold block drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            Scroll to explore
          </span>
          <ChevronDown className="w-4 h-4 text-cyan-400 mx-auto animate-bounce drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]" />
        </motion.div>

      </section>

      {/* ============================================================ */}
      {/* SECTION 2 — OUR CAPABILITIES (Word-by-Word Scroll & Glass 3D Flip Cards) */}
      {/* ============================================================ */}
      <section id="capabilities" className="py-24 relative border-t border-slate-900 bg-[#060913]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={wordContainerVariants}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">OUR CAPABILITIES</span>
            
            {/* Word-by-Word Scroll Entrance Heading */}
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white flex flex-wrap justify-center gap-x-2">
              {headingWords.map((word, wIdx) => (
                <motion.span 
                  key={wIdx} 
                  variants={wordItemVariants}
                  className={word === 'Better' ? 'bg-gradient-to-r from-sky-400 via-cyan-300 to-emerald-400 bg-clip-text text-transparent' : ''}
                >
                  {word}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          {/* 5 Capability Glass 3D Flip Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5 mt-16">
            {[
              {
                id: 1,
                title: 'Localized Rainfall Prediction',
                desc: 'AI-driven monthly rainfall outlook at hyperlocal level using global climate signals.',
                details: 'Uses TFLite & Keras neural networks trained on DMI memory, ONI index, and ERA5 historical baselines.',
                icon: CloudRain,
                color: 'text-sky-400 bg-sky-500/10 border-sky-500/30'
              },
              {
                id: 2,
                title: 'Monsoon Break Risk Assessment',
                desc: 'Identify dry spell probability and break patterns before they impact crops.',
                details: 'Detects break phase triggers 7–14 days in advance to mitigate agricultural drought risk.',
                icon: AlertTriangle,
                color: 'text-amber-400 bg-amber-500/10 border-amber-500/30'
              },
              {
                id: 3,
                title: 'Crop Advisory Engine',
                desc: 'Personalized agronomic advisory in English & Kannada for better farm decisions.',
                details: 'Translates climate departure into actionable advisories for Rice, Ragi, Maize, Groundnut, Cotton & Sugarcane.',
                icon: Sprout,
                color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30'
              },
              {
                id: 4,
                title: 'Climate Signal Insights',
                desc: 'Real-time monitoring of DMI, ONI, MJO and other key climate drivers influencing rainfall.',
                details: 'Monitors Indian Ocean Dipole memory (Lag 1 & Lag 2) to compute normalized sea-surface temperature anomalies.',
                icon: Radio,
                color: 'text-purple-400 bg-purple-500/10 border-purple-500/30'
              },
              {
                id: 5,
                title: 'Spatial Risk Visualization',
                desc: 'Interactive risk maps to visualize rainfall anomaly and risk across Karnataka.',
                details: 'Renders village & block-scale geospatial risk maps with React Leaflet GIS overlays.',
                icon: MapPin,
                color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/30'
              }
            ].map((card, idx) => {
              const Icon = card.icon;
              const isFlipped = flippedCard === card.id;

              return (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 40, scale: 0.95 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.1, duration: 0.6 }}
                  className="h-72 cursor-pointer group [perspective:1000px]"
                  onMouseEnter={() => setFlippedCard(card.id)}
                  onMouseLeave={() => setFlippedCard(null)}
                  onClick={() => setFlippedCard(isFlipped ? null : card.id)}
                >
                  <div 
                    className={`relative w-full h-full duration-700 [transform-style:preserve-3d] transition-transform ${
                      isFlipped ? '[transform:rotateY(180deg)]' : ''
                    }`}
                  >
                    {/* FRONT SIDE (Glassmorphic + Soft Neumorphic Inset) */}
                    <div className="absolute inset-0 w-full h-full p-6 rounded-2xl bg-[#0B1021]/90 border border-slate-800/90 backdrop-blur-xl group-hover:border-sky-500/50 [backface-visibility:hidden] flex flex-col justify-between shadow-xl neu-inset">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className={`p-3 w-fit rounded-2xl border ${card.color}`}>
                            <Icon className="w-5 h-5" />
                          </div>
                          <span className="text-[10px] text-slate-500 font-mono flex items-center space-x-1">
                            <RotateCw className="w-3 h-3 text-slate-400 animate-spin" />
                            <span>Inspect</span>
                          </span>
                        </div>
                        <h3 className="text-sm font-bold text-white leading-snug">{card.title}</h3>
                        <p className="text-[11px] text-slate-400 leading-relaxed">{card.desc}</p>
                      </div>
                      <div className="text-[10px] text-sky-400 font-bold tracking-wide flex items-center justify-between pt-2 border-t border-slate-800/80">
                        <span>Hover / Tap for Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </div>
                    </div>

                    {/* BACK SIDE (Flipped Glass Panel) */}
                    <div className="absolute inset-0 w-full h-full p-6 rounded-2xl bg-[#070B19] border border-sky-500/50 backdrop-blur-2xl [transform:rotateY(180deg)] [backface-visibility:hidden] flex flex-col justify-between shadow-2xl text-left neu-inset">
                      <div className="space-y-3">
                        <span className="text-[10px] font-mono font-bold text-sky-400 uppercase tracking-wider">SYSTEM DETAIL</span>
                        <h4 className="text-xs font-extrabold text-white">{card.title}</h4>
                        <p className="text-[11px] text-slate-300 leading-relaxed">{card.details}</p>
                      </div>
                      <Link 
                        to="/login"
                        className="w-full py-2 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 border border-sky-500/40 text-sky-300 font-bold text-[11px] text-center flex items-center justify-center space-x-1.5 transition-colors"
                      >
                        <span>Access Intelligence</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </div>

                  </div>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 3 — HOW IT WORKS */}
      {/* ============================================================ */}
      <section id="how-it-works" className="py-24 relative bg-[#060913]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <motion.div 
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={scrollRevealSection}
            className="text-center max-w-3xl mx-auto space-y-3"
          >
            <span className="text-xs font-extrabold uppercase tracking-widest text-sky-400">HOW IT WORKS</span>
            <h2 className="text-3xl sm:text-4xl font-black tracking-tight text-white">
              From Climate Signals to{' '}
              <span className="bg-gradient-to-r from-sky-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">
                Actionable
              </span>{' '}
              Insights
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mt-16 relative">
            {[
              { step: '01', title: 'Collect Climate Signals', desc: 'We gather global climate indices like DMI, ONI, MJO and atmospheric data.', icon: CloudRain },
              { step: '02', title: 'AI Model Processes', desc: 'Our AI model processes signals along with location & season to predict rainfall.', icon: BarChart3 },
              { step: '03', title: 'Risk & Forecast Generated', desc: 'We generate rainfall outlook, break risk, and departure from normal.', icon: Target },
              { step: '04', title: 'Advisory & Action', desc: 'Personalized crop advisory helps farmers take the right action in time.', icon: Sprout }
            ].map((item, idx) => {
              const Icon = item.icon;
              return (
                <motion.div 
                  key={idx}
                  initial={{ opacity: 0, scale: 0.9 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: idx * 0.12, duration: 0.5 }}
                  className="text-center space-y-4 relative"
                >
                  <div className="w-14 h-14 rounded-full bg-[#0B1021] border border-sky-500/40 flex items-center justify-center text-sky-400 mx-auto shadow-[0_0_20px_rgba(56,189,248,0.2)] neu-inset">
                    <Icon className="w-6 h-6" />
                  </div>
                  <span className="block font-mono text-xs font-bold text-sky-400">{item.step}</span>
                  <h3 className="text-sm font-extrabold text-white">{item.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed max-w-xs mx-auto">{item.desc}</p>
                </motion.div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 4 — STATISTICS STRIP */}
      {/* ============================================================ */}
      <section className="py-16 relative border-t border-slate-900 bg-[#060913]">
        <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
          
          <div className="p-8 rounded-3xl bg-[#0B1021]/90 border border-slate-800/90 backdrop-blur-xl grid grid-cols-2 lg:grid-cols-4 gap-6 text-center divide-y lg:divide-y-0 lg:divide-x divide-slate-800/80 neu-inset">
            <div className="p-2 space-y-1">
              <div className="flex items-center justify-center space-x-2 text-sky-400">
                <Users className="w-5 h-5" />
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">18+</span>
              </div>
              <span className="text-xs font-bold text-white block">Districts Covered</span>
              <span className="text-[10px] text-slate-400 block">Across Karnataka</span>
            </div>

            <div className="p-2 space-y-1">
              <div className="flex items-center justify-center space-x-2 text-sky-400">
                <BarChart3 className="w-5 h-5" />
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">20+</span>
              </div>
              <span className="text-xs font-bold text-white block">Years of Data</span>
              <span className="text-[10px] text-slate-400 block">2000 – 2023</span>
            </div>

            <div className="p-2 space-y-1">
              <div className="flex items-center justify-center space-x-2 text-sky-400">
                <CloudRain className="w-5 h-5" />
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">95%</span>
              </div>
              <span className="text-xs font-bold text-white block">Forecast Accuracy</span>
              <span className="text-[10px] text-slate-400 block">In Key Seasons</span>
            </div>

            <div className="p-2 space-y-1">
              <div className="flex items-center justify-center space-x-2 text-emerald-400">
                <Sprout className="w-5 h-5" />
                <span className="text-3xl sm:text-4xl font-black text-white font-mono">2+</span>
              </div>
              <span className="text-xs font-bold text-white block">Supported Crops</span>
              <span className="text-[10px] text-slate-400 block">And Growing</span>
            </div>
          </div>

        </div>
      </section>

      {/* ============================================================ */}
      {/* SECTION 5 — STAY AHEAD OF THE MONSOON */}
      {/* ============================================================ */}
      <section className="py-20 relative max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        <div className="p-8 sm:p-10 rounded-3xl bg-[#0B1021]/90 border border-sky-500/30 backdrop-blur-xl shadow-[0_0_30px_rgba(56,189,248,0.15)] flex flex-col md:flex-row items-center justify-between gap-6 neu-inset">
          
          <div className="flex items-center space-x-5 text-left">
            <div className="w-14 h-14 rounded-2xl bg-sky-500/10 border border-sky-500/30 flex items-center justify-center text-sky-400 shrink-0 shadow-[0_0_20px_rgba(56,189,248,0.2)]">
              <Zap className="w-7 h-7" />
            </div>
            <div className="space-y-1">
              <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Stay Ahead of the Monsoon
              </h2>
              <p className="text-xs sm:text-sm text-slate-300">
                Get intelligent rainfall forecasts and advisory delivered when it matters most.
              </p>
            </div>
          </div>

          <div className="shrink-0">
            <Link
              to="/login"
              className="px-7 py-3.5 rounded-full bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs inline-flex items-center space-x-2 shadow-[0_0_25px_rgba(56,189,248,0.4)] hover:scale-105 transition-all neu-button"
            >
              <span>Get Started</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

        </div>
      </section>

    </div>
  );
};
