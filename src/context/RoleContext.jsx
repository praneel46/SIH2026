import React, { createContext, useContext, useState } from 'react';

const RoleContext = createContext();

export const RoleProvider = ({ children }) => {
  const [role, setRole] = useState('Officer'); // Default: Agricultural Officer
  const [selectedLocation, setSelectedLocation] = useState({
    state: 'Karnataka',
    district: 'Bengaluru Rural',
    block: 'Doddaballapura',
    village: 'Tubagere',
    lat: 13.29,
    lon: 77.55
  });

  return (
    <RoleContext.Provider value={{ role, setRole, selectedLocation, setSelectedLocation }}>
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
