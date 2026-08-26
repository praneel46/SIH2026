import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('weather_index_user');
      return savedUser ? JSON.parse(savedUser) : {
        name: 'Agri Officer',
        email: 'officer@moes.gov.in',
        role: 'Officer',
        avatar: null
      };
    } catch {
      return {
        name: 'Agri Officer',
        email: 'officer@moes.gov.in',
        role: 'Officer',
        avatar: null
      };
    }
  });

  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    try {
      const savedAuth = localStorage.getItem('weather_index_auth');
      return savedAuth !== 'false';
    } catch {
      return true;
    }
  });

  const login = (email, password) => {
    const userData = {
      name: email ? email.split('@')[0].toUpperCase() : 'Agri Officer',
      email: email || 'officer@moes.gov.in',
      role: 'Officer'
    };
    setUser(userData);
    setIsAuthenticated(true);
    try {
      localStorage.setItem('weather_index_user', JSON.stringify(userData));
      localStorage.setItem('weather_index_auth', 'true');
    } catch {}
    return { success: true };
  };

  const register = (name, email, password) => {
    const userData = {
      name: name || 'New User',
      email: email || 'user@moes.gov.in',
      role: 'Officer'
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
      role: 'Officer',
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
    <AuthContext.Provider value={{ user, isAuthenticated, login, register, loginWithGoogle, logout }}>
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
