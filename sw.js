/* UniTask Service Worker v1.2 */
const CACHE_NAME = 'unitask-cache-v3';
const STATIC_ASSETS = [
  './',
  './index.html',
  './agenda_universitaria.html',
  './manifest.json',
  './assets/logo.png',
  './assets/icon-192.png',
  './assets/icon-512.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(STATIC_ASSETS);
    }).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const req = event.request;
  // Ignore non-GET requests or chrome extension schemes
  if (req.method !== 'GET' || !req.url.startsWith('http')) return;

  // Bypass Firebase Firestore streams, WebSockets, and Google APIs
  if (req.url.includes('googleapis.com') || req.url.includes('firebaseio.com') || req.url.includes('identitytoolkit')) {
    return;
  }

  event.respondWith(
    caches.match(req).then((cachedResponse) => {
      // Return cached response if available, then fetch update in background (stale-while-revalidate)
      const fetchPromise = fetch(req).then((networkResponse) => {
        if (networkResponse && networkResponse.status === 200) {
          const responseToCache = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => {
            cache.put(req, responseToCache);
          });
        }
        return networkResponse;
      }).catch(() => {
        // Fallback when network is unavailable and not in cache
        if (req.mode === 'navigate') {
          return caches.match('./index.html') || caches.match('./agenda_universitaria.html');
        }
      });

      return cachedResponse || fetchPromise;
    })
  );
});
