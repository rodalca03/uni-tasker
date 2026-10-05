/* Studeo Service Worker v3.0 - Always-Fresh Network-First Architecture */
const CACHE_NAME = 'studeo-cache-v11';
const STATIC_ASSETS = [
  './',
  './index.html',
  './agenda_universitaria.html',
  './manifest.json',
  './assets/logo.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

// Install: pre-cache static assets and skip waiting immediately
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    })
  );
});

// Activate: purge old caches and claim all clients immediately
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            console.log('[SW] Purgando caché obsoleta:', key);
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()).then(async () => {
      // Reload any existing open clients so they immediately run the latest code
      const clients = await self.clients.matchAll({ type: 'window', includeUncontrolled: true });
      for (const client of clients) {
        if (client.url && 'navigate' in client) {
          try {
            await client.navigate(client.url);
          } catch (e) {
            // Ignore if cross-origin or navigation cannot proceed
          }
        }
      }
    })
  );
});

// Listen for explicit skip waiting request from page
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event: Network-First strategy
self.addEventListener('fetch', (event) => {
  const req = event.request;

  // Ignore non-GET requests or browser extension URLs
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  // Bypass Firestore live streams, Google APIs, and auth endpoints
  if (req.url.includes('googleapis.com') || req.url.includes('firebaseio.com') || req.url.includes('identitytoolkit')) {
    return;
  }

  const isHtmlNavigation = req.mode === 'navigate' ||
                           req.destination === 'document' ||
                           (req.headers.get('accept') && req.headers.get('accept').includes('text/html')) ||
                           req.url.endsWith('.html') ||
                           req.url.endsWith('/');

  if (isHtmlNavigation) {
    // ALWAYS fetch fresh HTML from network first.
    // If online, this completely eliminates the need for manual Ctrl+Shift+R!
    event.respondWith(
      fetch(req, { cache: 'no-cache' })
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const responseToCache = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => {
              cache.put(req, responseToCache);
              cache.put('./', responseToCache.clone());
              cache.put('./index.html', responseToCache.clone());
              cache.put('./agenda_universitaria.html', responseToCache.clone());
            });
          }
          return networkResponse;
        })
        .catch(async () => {
          // Fallback to cache ONLY when device is offline
          const cached = await caches.match(req);
          if (cached) return cached;
          return (await caches.match('./index.html')) || (await caches.match('./agenda_universitaria.html')) || (await caches.match('./'));
        })
    );
    return;
  }

  // For static local assets (logo, icons, manifest, etc.):
  // Network-First with cache fallback
  event.respondWith(
    fetch(req, { cache: 'no-cache' })
      .then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      })
      .catch(() => caches.match(req))
  );
});
