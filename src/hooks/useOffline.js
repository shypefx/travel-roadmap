// src/hooks/useOffline.js - VERSION MOBILE
import { useState, useEffect } from 'react';

export const useOffline = () => {
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [connectionType, setConnectionType] = useState('unknown');

  useEffect(() => {
    const handleOnline = () => {
      setIsOffline(false);
      console.log('📱 Connexion mobile rétablie');
    };

    const handleOffline = () => {
      setIsOffline(true);
      console.log('📱 Mode offline mobile activé');
    };

    const handleConnectionChange = () => {
      // Détection du type de connexion mobile
      if ('connection' in navigator) {
        const connection = navigator.connection;
        setConnectionType(connection.effectiveType || 'unknown');
        
        // Considérer comme offline si connexion très lente
        if (connection.effectiveType === 'slow-2g') {
          setIsOffline(true);
        }
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    // Écouter les changements de connexion mobile
    if ('connection' in navigator) {
      navigator.connection.addEventListener('change', handleConnectionChange);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      if ('connection' in navigator) {
        navigator.connection.removeEventListener('change', handleConnectionChange);
      }
    };
  }, []);

  return { isOffline, connectionType };
};
