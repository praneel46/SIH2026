import React, { createContext, useContext, useState } from 'react';
import { mockCrops } from '../data/mock/mockCrops';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState(() => {
    try {
      const savedUser = localStorage.getItem('weather_index_user');
      if (savedUser) {
        const parsed = JSON.parse(savedUser);
        if (parsed?.role) return parsed.role;
      }
    } catch {}
    return 'farmer'; // SAFE DEFAULT: 'farmer'
  });
  
  // Central application location state with full administrative hierarchy
  const [selectedLocation, setSelectedLocation] = useState({
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    block: 'Doddaballapura',
    village: 'Tubagere',
    lat: 13.29,
    lon: 77.55
  });

  // Central application crop state
  const [selectedCrop, setSelectedCrop] = useState(mockCrops[0]); // Default: Ragi

  return (
    <RoleContext.Provider 
      value={{ 
        role, 
        setRole, 
        selectedLocation, 
        setSelectedLocation,
        selectedCrop,
        setSelectedCrop
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

// Convenient alias for location and crop context consumers
export const useAppContext = useRole;

