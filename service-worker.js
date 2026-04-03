/**
 * FoodKnock Service Worker v4
 * Provides offline caching and fast loading via Cache-First strategy
 * Fixed for GitHub Pages deployment
 */

const CACHE_VERSION = 'foodknock-v4';
const STATIC_CACHE = 'foodknock-static-v4';
const RUNTIME_CACHE = 'foodknock-runtime-v4';

/* ── GitHub Pages base path ── */
const BASE_PATH = '/foodknockquickorder.com';

/* ── Assets to pre-cache on install ── */
const PRECACHE_URLS = [
  `${BASE_PATH}/`,
  `${BASE_PATH}/index.html`,
  `${BASE_PATH}/shop.html`,
  `${BASE_PATH}/style.css`,
  `${BASE_PATH}/app.js`,
  `${BASE_PATH}/data.js`,
  `${BASE_PATH}/manifest.json`,
  `${BASE_PATH}/icon-192.png`,
  `${BASE_PATH}/icon-512.png`,
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap',
];

/* ── Install: pre-cache all static assets ── */
self.addEventListener('install', event => {
  console.log('[SW] Installing service worker v4...');
  
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => {
        console.log('[SW] Precaching static assets...');
        return cache.addAll(PRECACHE_URLS)
          .catch(err => {
            console.warn('[SW] Some precache items failed:', err);
            // Continue even if some items fail
            return Promise.resolve();
          });
      })
      .then(() => {
        console.log('[SW] Install complete, skipping waiting...');
        return self.skipWaiting();
      })
  );
});

/* ── Activate: clean up old caches ── */
self.addEventListener('activate', event => {
  console.log('[SW] Activating service worker v4...');
  
  event.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames
            .filter(cacheName => {
              // Delete old caches that don't match current version
              return cacheName !== STATIC_CACHE && 
                     cacheName !== RUNTIME_CACHE &&
                     cacheName.startsWith('foodknock-');
            })
            .map(cacheName => {
              console.log('[SW] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            })
        );
      })
      .then(() => {
        console.log('[SW] Claiming clients...');
        return self.clients.claim();
      })
      .then(() => {
        console.log('[SW] Activation complete!');
      })
  );
});

/* ── Fetch: Cache-First with Network Fallback ── */
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Skip non-GET requests
  if (request.method !== 'GET') {
    return;
  }

  // Always bypass cache for WhatsApp
  if (url.hostname.includes('wa.me') || url.hostname.includes('whatsapp')) {
    return;
  }

  // Cache-First Strategy
  event.respondWith(
    caches.match(request)
      .then(cachedResponse => {
        if (cachedResponse) {
          console.log('[SW] Serving from cache:', url.pathname);
          return cachedResponse;
        }

        // Not in cache, fetch from network
        return fetch(request)
          .then(networkResponse => {
            // Only cache valid responses
            if (!networkResponse || networkResponse.status !== 200 || networkResponse.type === 'error') {
              return networkResponse;
            }

            // Check if we should cache this resource
            const shouldCache = 
              url.origin === self.location.origin || // Same origin
              url.hostname.includes('jsdelivr') ||    // CDN
              url.hostname.includes('fonts.gstatic') ||
              url.hostname.includes('fonts.googleapis') ||
              url.hostname.includes('bootstrapcdn');

            if (shouldCache) {
              const responseToCache = networkResponse.clone();
              
              caches.open(RUNTIME_CACHE)
                .then(cache => {
                  console.log('[SW] Caching new resource:', url.pathname);
                  cache.put(request, responseToCache);
                })
                .catch(err => {
                  console.warn('[SW] Cache put failed:', err);
                });
            }

            return networkResponse;
          })
          .catch(error => {
            console.log('[SW] Fetch failed, trying offline fallback:', error);
            
            // Offline fallback for navigation requests
            if (request.mode === 'navigate') {
              return caches.match(`${BASE_PATH}/index.html`)
                .then(fallback => {
                  return fallback || new Response(
                    '<html><body><h1>Offline</h1><p>Please check your internet connection.</p></body></html>',
                    { headers: { 'Content-Type': 'text/html' } }
                  );
                });
            }
            
            return new Response('Network error', {
              status: 408,
              headers: { 'Content-Type': 'text/plain' }
            });
          });
      })
  );
});

/* ── Message Handler (for debugging and cache updates) ── */
self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    console.log('[SW] Received SKIP_WAITING message');
    self.skipWaiting();
  }
  
  if (event.data && event.data.type === 'CLIENTS_CLAIM') {
    console.log('[SW] Received CLIENTS_CLAIM message');
    self.clients.claim();
  }
});

console.log('[SW] Service Worker v4 loaded');
