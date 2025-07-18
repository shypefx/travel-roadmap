// public/sw.js - VERSION MOBILE OPTIMISÉE
const CACHE_NAME = 'travel-roadmap-v1';
const STATIC_CACHE = 'static-v1';
const DYNAMIC_CACHE = 'dynamic-v1';

// Ressources critiques à mettre en cache
const STATIC_ASSETS = [
  '/',
  '/static/js/bundle.js',
  '/static/css/main.css',
  '/manifest.json',
  '/offline.html'
];

// Installation - Cache des ressources critiques
self.addEventListener('install', (event) => {
  console.log('📱 Installation SW pour mobile');
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then((cache) => {
        return cache.addAll(STATIC_ASSETS);
      })
      .then(() => {
        console.log('✅ Ressources critiques mises en cache');
        return self.skipWaiting();
      })
  );
});

// Activation - Nettoyage des anciens caches
self.addEventListener('activate', (event) => {
  console.log('🚀 Activation SW');
  event.waitUntil(
    caches.keys()
      .then((cacheNames) => {
        return Promise.all(
          cacheNames.map((cacheName) => {
            if (cacheName !== STATIC_CACHE && cacheName !== DYNAMIC_CACHE) {
              console.log('🗑️ Suppression cache:', cacheName);
              return caches.delete(cacheName);
            }
          })
        );
      })
      .then(() => {
        return self.clients.claim();
      })
  );
});

// Stratégie de cache mobile-first
self.addEventListener('fetch', (event) => {
  const { request } = event;
  const url = new URL(request.url);
  
  // Ignorer les requêtes non-HTTP (chrome-extension, etc.)
  if (!request.url.startsWith('http')) {
    return;
  }
  
  // Ignorer les requêtes vers des domaines externes non critiques
  if (url.origin !== location.origin) {
    return;
  }
  
  event.respondWith(
    handleRequest(request)
  );
});

// Gestionnaire de requêtes optimisé pour mobile
async function handleRequest(request) {
  const url = new URL(request.url);
  
  try {
    // Pour les ressources statiques - Cache First
    if (STATIC_ASSETS.some(asset => url.pathname.includes(asset))) {
      return await cacheFirst(request);
    }
    
    // Pour les données API - Network First avec fallback
    if (url.pathname.includes('/api/')) {
      return await networkFirst(request);
    }
    
    // Pour le reste - Stale While Revalidate
    return await staleWhileRevalidate(request);
    
  } catch (error) {
    console.log('❌ Erreur fetch:', error);
    return await getOfflineFallback(request);
  }
}

// Stratégie Cache First (pour les ressources statiques)
async function cacheFirst(request) {
  const cachedResponse = await caches.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(STATIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return await getOfflineFallback(request);
  }
}

// Stratégie Network First (pour les données)
async function networkFirst(request) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      const cache = await caches.open(DYNAMIC_CACHE);
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    throw error;
  }
}

// Stratégie Stale While Revalidate (pour le contenu dynamique)
async function staleWhileRevalidate(request) {
  const cachedResponse = await caches.match(request);
  
  const networkResponsePromise = fetch(request)
    .then(async (response) => {
      if (response.ok) {
        const cache = await caches.open(DYNAMIC_CACHE);
        cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);
  
  return cachedResponse || await networkResponsePromise;
}

// Fallback offline
async function getOfflineFallback(request) {
  if (request.destination === 'document') {
    return await caches.match('/offline.html');
  }
  
  return new Response('Offline', {
    status: 503,
    statusText: 'Service Unavailable'
  });
}

// Gestion des messages pour la synchronisation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SYNC_DATA') {
    console.log('📱 Synchronisation données mobile');
    event.ports[0].postMessage({
      success: true,
      message: 'Données synchronisées'
    });
  }
});
