import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('weather_index_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch {
      return null;
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('weather_index_auth');
      return savedAuth === 'true';
    } catch {
      return false;
    }
  });

  const loginFarmer = (email, password) => {
    const userData = {
      name: email ? email.split('@')[0].toUpperCase() : 'Farmer User',
      email: email || 'farmer@krishi.gov.in',
      role: 'farmer'
    };
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('weather_index_user', JSON.stringify(userData));
      localStorage.setItem('weather_index_auth', 'true');
    } catch {}
    return { success: true };
  };

  const loginOfficer = (officerId, password) => {
    const userData = {
      name: officerId ? `Officer ${officerId}` : 'Extension Officer',
      email: officerId ? `${officerId.toLowerCase()}@moes.gov.in` : 'officer@moes.gov.in',
      role: 'officer'
    };
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('weather_index_user', JSON.stringify(userData));
      localStorage.setItem('weather_index_auth', 'true');
    } catch {}
    return { success: true };
  };

  const login = (email, password) => {
    if (email && email.toLowerCase().includes('officer')) {
      return loginOfficer(email, password);
    }
    return loginFarmer(email, password);
  };

  const register = (name, email, password) => {
    const userData = {
      name: name || 'Registered Farmer',
      email: email || 'farmer@krishi.gov.in',
      role: 'farmer'
    };
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('weather_index_user', JSON.stringify(userData));
      localStorage.setItem('weather_index_auth', 'true');
    } catch {}
    return { success: true };
  };

  const loginWithGoogle = () => {
    const googleUser = {
      name: 'Dr. Ramesh Kumar',
      email: 'ramesh.kumar@gmail.com',
      role: 'farmer',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80'
    };
    setUser(googleUser);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('weather_index_user', JSON.stringify(googleUser));
      localStorage.setItem('weather_index_auth', 'true');
    } catch {}
    return { success: true };
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    try {
      localStorage.removeItem('weather_index_user');
      localStorage.setItem('weather_index_auth', 'false');
    } catch {}
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        isAuthenticated, 
        role: user?.role || 'farmer', 
        login, 
        loginFarmer, 
        loginOfficer, 
        register, 
        loginWithGoogle, 
        logout 
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
