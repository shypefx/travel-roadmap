// src/components/OfflineIndicator.js - VERSION MOBILE
import React from 'react';
import { useOffline } from '../hooks/useOffline';
import '../styles/OfflineIndicator.css';

const OfflineIndicator = () => {
  const { isOffline, connectionType } = useOffline();

  if (!isOffline) {
    // Afficher un indicateur discret de connexion lente
    if (connectionType === 'slow-2g' || connectionType === '2g') {
      return (
        <div className="slow-connection-indicator">
          <span>🐌 Connexion lente</span>
        </div>
      );
    }
    return null;
  }

  return (
    <div className="offline-indicator mobile">
      <div className="offline-banner">
        <span className="offline-icon">📱</span>
        <span className="offline-text">Mode offline</span>
        <span className="offline-status">Données sauvegardées</span>
      </div>
    </div>
  );
};

export default OfflineIndicator;
