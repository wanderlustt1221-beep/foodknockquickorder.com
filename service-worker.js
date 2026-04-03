/**
 * FoodKnock Service Worker
 * Provides offline caching and fast loading via Cache-First strategy
 */

const CACHE_NAME   = 'foodknock-v2';
const STATIC_CACHE = 'foodknock-static-v2';

/* ── Assets to pre-cache on install ── */
const PRECACHE_URLS = [
  './',
  './index.html',
  './shop.html',
  './style.css',
  './app.js',
  './data.js',
  './manifest.json',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css',
  'https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js',
  'https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css',
  'https://fonts.googleapis.com/css2?family=Nunito:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800&display=swap',
];

/* ── Install: pre-cache all static assets ── */
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE)
      .then(cache => cache.addAll(PRECACHE_URLS).catch(err => {
        console.warn('[SW] Some precache items failed:', err);
      }))
      .then(() => self.skipWaiting())
  );
});

/* ── Activate: clean up old caches ── */
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(
        keys
          .filter(k => k !== STATIC_CACHE && k !== CACHE_NAME)
          .map(k => caches.delete(k))
      )
    ).then(() => self.clients.claim())
  );
});

/* ── Fetch: Cache-First with Network Fallback ── */
self.addEventListener('fetch', event => {
  /* Skip non-GET and cross-origin requests we don't cache */
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  /* Always go network-first for WhatsApp links */
  if (url.hostname.includes('wa.me') || url.hostname.includes('whatsapp')) return;

  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;

      return fetch(event.request)
        .then(response => {
          /* Only cache valid same-origin or CDN responses */
          if (
            response.ok &&
            (url.origin === self.location.origin ||
             url.hostname.includes('jsdelivr') ||
             url.hostname.includes('fonts.gstatic') ||
             url.hostname.includes('fonts.googleapis'))
          ) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then(c => c.put(event.request, clone));
          }
          return response;
        })
        .catch(() => {
          /* Offline fallback: serve index.html for navigation requests */
          if (event.request.mode === 'navigate') {
            return caches.match('./index.html');
          }
        });
    })
  );
});
