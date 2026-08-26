import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Navigate } from 'react-router-dom';
import { ThemeProvider } from './context/ThemeContext';
import { LanguageProvider } from './context/LanguageContext';
import { RoleProvider } from './context/RoleContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { NotificationProvider } from './context/NotificationContext';
import { Navbar } from './components/layout/Navbar';
import { Footer } from './components/layout/Footer';
import { DashboardLayout } from './components/layout/DashboardLayout';

// Pages
import { Home } from './pages/Home';
import { Dashboard } from './pages/Dashboard';
import { Predictions } from './pages/Predictions';
import { RiskMap } from './pages/RiskMap';
import { Advisory } from './pages/Advisory';
import { History } from './pages/History';
import { ModelInsights } from './pages/ModelInsights';
import { FarmerDashboard } from './pages/FarmerDashboard';
import { OfficerDashboard } from './pages/OfficerDashboard';
import { AdminDashboard } from './pages/AdminDashboard';
import { Login } from './pages/Login';
import { Register } from './pages/Register';

import { AnimatePresence, motion } from 'framer-motion';

// React Error Boundary Class Component
class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Uncaught React Error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center space-y-4 font-sans">
          <div className="p-4 rounded-full bg-rose-500/10 text-rose-500 border border-rose-500/30">
            <svg className="w-10 h-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-xl font-bold text-slate-900 dark:text-white">Something went wrong</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md leading-relaxed">
            An unexpected error occurred while rendering this view. Please retry or return to the main dashboard.
          </p>
          <div className="flex items-center space-x-3 pt-2">
            <button
              onClick={() => this.setState({ hasError: false, error: null })}
              className="px-4 py-2 rounded-xl bg-slate-200 dark:bg-slate-800 text-slate-800 dark:text-slate-200 text-xs font-bold hover:opacity-90"
            >
              Retry View
            </button>
            <a
              href="/dashboard"
              className="px-4 py-2 rounded-xl bg-sky-500 text-white text-xs font-bold hover:bg-sky-600 shadow-md shadow-sky-500/20"
            >
              Go to Dashboard
            </a>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

// Route Guard: General Authenticated User Guard
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }
  return (
    <ErrorBoundary>
      <DashboardLayout>{children}</DashboardLayout>
    </ErrorBoundary>
  );
};

// Route Guard: Farmer Only Guard
const FarmerRoute = ({ children }) => {
  const { isAuthenticated, user, role } = useAuth();
  const currentRole = user?.role || role || 'farmer';
  const isOfficer = String(currentRole).toLowerCase() === 'officer';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (isOfficer) {
    return <Navigate to="/officer-dashboard" replace state={{ authNotice: 'Redirected to Extension Officer Telemetry.' }} />;
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>{children}</DashboardLayout>
    </ErrorBoundary>
  );
};

// Route Guard: Extension Officer Only Guard
const OfficerRoute = ({ children }) => {
  const { isAuthenticated, user, role } = useAuth();
  const currentRole = user?.role || role || 'farmer';
  const isOfficer = String(currentRole).toLowerCase() === 'officer';

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (!isOfficer) {
    return <Navigate to="/dashboard" replace state={{ authError: 'Extension Officer access required.' }} />;
  }

  return (
    <ErrorBoundary>
      <DashboardLayout>{children}</DashboardLayout>
    </ErrorBoundary>
  );
};

// Main Layout Wrapper for Public Pages
const MainLayout = ({ children }) => {
  const location = useLocation();
  const isPublicPage = location.pathname === '/';

  return (
    <div className="min-h-screen flex flex-col justify-between selection:bg-sky-500 selection:text-white">
      {isPublicPage && <Navbar />}
      <main className="flex-grow">{children}</main>
      {isPublicPage && <Footer />}
    </div>
  );
};

const AnimatedRoutes = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -8 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          
          {/* Public Auth Routes */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected Application Routes */}
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/advisory" element={<ProtectedRoute><Advisory /></ProtectedRoute>} />
          <Route path="/risk-map" element={<ProtectedRoute><RiskMap /></ProtectedRoute>} />
          <Route path="/farmer-dashboard" element={<FarmerRoute><FarmerDashboard /></FarmerRoute>} />
          <Route path="/officer-dashboard" element={<OfficerRoute><OfficerDashboard /></OfficerRoute>} />
          <Route path="/predictions" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
          <Route path="/simulator" element={<ProtectedRoute><Predictions /></ProtectedRoute>} />
          <Route path="/model-insights" element={<ProtectedRoute><ModelInsights /></ProtectedRoute>} />
          <Route path="/model-spec" element={<ProtectedRoute><ModelInsights /></ProtectedRoute>} />
          <Route path="/history" element={<ProtectedRoute><History /></ProtectedRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
          <Route path="/system-status" element={<ProtectedRoute><AdminDashboard /></ProtectedRoute>} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RoleProvider>
          <NotificationProvider>
            <AuthProvider>
              <Router>
                <MainLayout>
                  <AnimatedRoutes />
                </MainLayout>
              </Router>
            </AuthProvider>
          </NotificationProvider>
        </RoleProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

