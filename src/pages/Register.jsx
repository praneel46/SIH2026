import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  CloudRain, 
  User, 
  Mail, 
  Lock, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  BrainCircuit, 
  Sprout 
} from 'lucide-react';
import authBg from '../assets/auth-bg.jpg';
import { motion } from 'framer-motion';

export const Register = () => {
  const { register, loginWithGoogle } = useAuth();
  const navigate = useNavigate();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !email || !password || !confirmPassword) {
      setError('Please fill in all fields.');
      return;
    }
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    const res = register(fullName, email, password);
    if (res.success) {
      navigate('/dashboard');
    }
  };

  const handleGoogleSignUp = () => {
    const res = loginWithGoogle();
    if (res.success) {
      navigate('/dashboard');
    }
  };

  return (
    <div className="min-h-screen w-full relative flex flex-col justify-between items-center font-sans selection:bg-sky-500 selection:text-white bg-transparent">
      
      {/* Full-Screen Edge-to-Edge Background Layer (Covering 100% Viewport) */}
      <div className="fixed inset-0 w-full h-full z-0 overflow-hidden pointer-events-none">
        <img
          src={authBg}
          alt="Weather Index Climate Intelligence"
          className="w-full h-full object-cover object-center"
        />
      </div>

      {/* Interactive Content Container */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between items-center px-4 py-5 bg-transparent space-y-6">
        
        {/* Top Header Logo */}
        <div className="w-full max-w-7xl flex justify-between items-center pt-1">
          <Link to="/" className="flex items-center space-x-2.5 group">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 p-[1px] shadow-lg">
              <div className="w-full h-full rounded-[11px] bg-[#060913] flex items-center justify-center">
                <CloudRain className="w-4 h-4 text-sky-400" />
              </div>
            </div>
            <span className="font-extrabold text-sm text-white tracking-tight">
              VARSHA <span className="text-sky-400">SETU</span>
            </span>
          </Link>
        </div>

        {/* Centered Glassmorphism Authentication Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.96, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-[420px] my-auto"
        >
          <div className="p-6 sm:p-7 rounded-3xl bg-[#0A0F1D]/80 border border-sky-500/40 backdrop-blur-xl shadow-[0_0_45px_rgba(6,182,212,0.25)] space-y-3.5 text-center relative">
            
            {/* Header Icon */}
            <div className="w-12 h-12 rounded-full bg-sky-500/10 border border-sky-400/40 flex items-center justify-center text-sky-400 mx-auto shadow-[0_0_15px_rgba(56,189,248,0.3)]">
              <CloudRain className="w-6 h-6" />
            </div>

            {/* Branding & Subtitles */}
            <div className="space-y-0.5">
              <h1 className="text-xl font-black text-white tracking-tight">
                VARSHA <span className="text-sky-400">SETU</span>
              </h1>
              <p className="text-xs font-semibold text-slate-300">
                Create Your Account
              </p>
              <p className="text-[10px] font-medium text-sky-300">
                Personalized Climate Predictions & Risk Advisories
              </p>
            </div>

            {/* Auth Mode Tabs */}
            <div className="flex border-b border-slate-800 text-xs font-bold pt-1">
              <Link to="/login" className="flex-1 py-1.5 text-slate-400 hover:text-slate-200 transition-colors">
                Sign In
              </Link>
              <button className="flex-1 py-1.5 text-sky-400 border-b-2 border-sky-400">
                Create Account
              </button>
            </div>

            {error && (
              <div className="p-2 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-[11px] font-semibold">
                {error}
              </div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-2.5 text-left">
              {/* Full Name */}
              <div className="relative">
                <User className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Full Name"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B1222]/90 border border-slate-700/80 text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-all shadow-inner"
                />
              </div>

              {/* Email Address */}
              <div className="relative">
                <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B1222]/90 border border-slate-700/80 text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-all shadow-inner"
                />
              </div>

              {/* Password */}
              <div className="relative">
                <Lock className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-9 pr-9 py-2 rounded-xl bg-[#0B1222]/90 border border-slate-700/80 text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-all shadow-inner"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Confirm Password */}
              <div className="relative">
                <ShieldCheck className="w-3.5 h-3.5 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Confirm Password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#0B1222]/90 border border-slate-700/80 text-xs font-medium text-white placeholder-slate-400 focus:outline-none focus:border-sky-400 transition-all shadow-inner"
                />
              </div>

              {/* Primary CTA Button */}
              <button
                type="submit"
                className="w-full py-2.5 rounded-xl bg-gradient-to-r from-blue-600 via-sky-500 to-cyan-400 hover:from-blue-500 hover:to-cyan-300 text-white font-bold text-xs shadow-[0_0_20px_rgba(56,189,248,0.4)] hover:scale-[1.01] active:scale-98 transition-all flex items-center justify-center space-x-2 mt-1"
              >
                <span>Create Account</span>
              </button>
            </form>

            {/* Divider */}
            <div className="relative flex items-center justify-center py-0.5">
              <div className="border-t border-slate-800 w-full" />
              <span className="bg-[#0A0F1D] px-2.5 text-[10px] uppercase font-bold text-slate-500 relative">
                or
              </span>
            </div>

            {/* Official Google Sign Up Button */}
            <button
              onClick={handleGoogleSignUp}
              className="w-full py-2.5 rounded-xl bg-white hover:bg-slate-100 text-slate-900 font-bold text-xs flex items-center justify-center space-x-2.5 shadow-md hover:scale-[1.01] active:scale-98 transition-all"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
                <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
              </svg>
              <span>Sign up with Google</span>
            </button>

            {/* Bottom Switcher Link */}
            <div className="text-[11px] text-slate-400 pt-0.5">
              Already have an account?{' '}
              <Link to="/login" className="text-sky-400 font-bold hover:underline">
                Sign In
              </Link>
            </div>
          </div>
        </motion.div>

        {/* 4 Feature Cards Strip - Neatly Arranged & Fully Visible Below Card */}
        <div className="w-full max-w-3xl space-y-3 text-center z-10 pb-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
            <div className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-[#0B1021]/80 border border-slate-800/80 backdrop-blur-md shadow-md">
              <div className="p-1.5 rounded-full bg-cyan-500/10 text-cyan-400 border border-cyan-500/20">
                <BrainCircuit className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-white">AI-Powered</span>
              <span className="text-[9px] text-slate-400">Insights</span>
            </div>

            <div className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-[#0B1021]/80 border border-slate-800/80 backdrop-blur-md shadow-md">
              <div className="p-1.5 rounded-full bg-sky-500/10 text-sky-400 border border-sky-500/20">
                <CloudRain className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-white">Accurate</span>
              <span className="text-[9px] text-slate-400">Forecasts</span>
            </div>

            <div className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-[#0B1021]/80 border border-slate-800/80 backdrop-blur-md shadow-md">
              <div className="p-1.5 rounded-full bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
                <ShieldCheck className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-white">Risk</span>
              <span className="text-[9px] text-slate-400">Assessment</span>
            </div>

            <div className="flex flex-col items-center space-y-1 p-2.5 rounded-xl bg-[#0B1021]/80 border border-slate-800/80 backdrop-blur-md shadow-md">
              <div className="p-1.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                <Sprout className="w-3.5 h-3.5" />
              </div>
              <span className="text-[10px] font-bold text-white">Actionable</span>
              <span className="text-[9px] text-slate-400">Advisory</span>
            </div>
          </div>

          <p className="text-[10px] text-slate-400 font-mono pt-1">
            © 2026 VarshaSetu. All rights reserved.
          </p>
        </div>

      </div>

    </div>
  );
};
