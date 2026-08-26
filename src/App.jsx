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

// Route Wrapper: Protected Application Routes (Dashboard Layout Shell)
const ProtectedDashboardRoute = ({ children }) => {
  return <DashboardLayout>{children}</DashboardLayout>;
};

// Route Wrapper: Public Auth Routes
const PublicAuthRoute = ({ children }) => {
  return children;
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
          
          {/* Public Auth Routes (Login / Register - No Navbar, No Footer) */}
          <Route path="/login" element={<PublicAuthRoute><Login /></PublicAuthRoute>} />
          <Route path="/register" element={<PublicAuthRoute><Register /></PublicAuthRoute>} />

          {/* Protected Application Routes (Dashboard Layout Shell with Left Sidebar & Top Greeting Header) */}
          <Route path="/dashboard" element={<ProtectedDashboardRoute><Dashboard /></ProtectedDashboardRoute>} />
          <Route path="/farmer-dashboard" element={<ProtectedDashboardRoute><FarmerDashboard /></ProtectedDashboardRoute>} />
          <Route path="/officer-dashboard" element={<ProtectedDashboardRoute><OfficerDashboard /></ProtectedDashboardRoute>} />
          <Route path="/predictions" element={<ProtectedDashboardRoute><Predictions /></ProtectedDashboardRoute>} />
          <Route path="/simulator" element={<ProtectedDashboardRoute><Predictions /></ProtectedDashboardRoute>} />
          <Route path="/risk-map" element={<ProtectedDashboardRoute><RiskMap /></ProtectedDashboardRoute>} />
          <Route path="/model-insights" element={<ProtectedDashboardRoute><ModelInsights /></ProtectedDashboardRoute>} />
          <Route path="/model-spec" element={<ProtectedDashboardRoute><ModelInsights /></ProtectedDashboardRoute>} />
          <Route path="/admin-dashboard" element={<ProtectedDashboardRoute><AdminDashboard /></ProtectedDashboardRoute>} />
          <Route path="/system-status" element={<ProtectedDashboardRoute><AdminDashboard /></ProtectedDashboardRoute>} />
          <Route path="/advisory" element={<ProtectedDashboardRoute><Advisory /></ProtectedDashboardRoute>} />
          <Route path="/history" element={<ProtectedDashboardRoute><History /></ProtectedDashboardRoute>} />
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

