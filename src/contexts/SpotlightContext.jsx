import React, { createContext, useContext, useState, useEffect } from 'react';

const SpotlightContext = createContext({
  spotlightEnabled: true,
  setSpotlightEnabled: () => {},
  toggleSpotlight: () => {},
});

export function SpotlightProvider({ children }) {
  const [spotlightEnabled, setSpotlightEnabled] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('herzberg_spotlight_mode');
      if (saved !== null) {
        return saved === 'true';
      }
    }
    return true; // Habilitado por defecto para facilitar el foco de RH
  });

  const toggleSpotlight = () => {
    setSpotlightEnabled(prev => {
      const next = !prev;
      if (typeof window !== 'undefined') {
        localStorage.setItem('herzberg_spotlight_mode', String(next));
      }
      return next;
    });
  };

  return (
    <SpotlightContext.Provider value={{ spotlightEnabled, setSpotlightEnabled, toggleSpotlight }}>
      {children}
    </SpotlightContext.Provider>
  );
}

export function useSpotlight() {
  const context = useContext(SpotlightContext);
  if (!context) {
    return {
      spotlightEnabled: true,
      setSpotlightEnabled: () => {},
      toggleSpotlight: () => {},
    };
  }
  return context;
}
