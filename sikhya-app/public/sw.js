/* Sikhya service worker — offline support for a low-connectivity audience.
 * Strategy:
 *  - Precache the app shell + offline fallback.
 *  - Navigations: network-first, fall back to cached page, then /offline.
 *  - Static assets (_next/static, fonts, images): cache-first (stale-while-revalidate).
 *  - API calls: network-only (never cache user/AI data).
 */
const VERSION = 'sikhya-v1';
const STATIC_CACHE = `${VERSION}-static`;
const PAGE_CACHE = `${VERSION}-pages`;
const PRECACHE = ['/', '/offline', '/manifest.json', '/icon.svg'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;

  // Never cache API responses (auth, AI, user data).
  if (url.pathname.startsWith('/api/')) return;

  // Navigation requests → network-first with offline fallback.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((res) => {
          const copy = res.clone();
          caches.open(PAGE_CACHE).then((c) => c.put(request, copy));
          return res;
        })
        .catch(async () =>
          (await caches.match(request)) || (await caches.match('/offline')) || Response.error()
        )
    );
    return;
  }

  // Static assets → cache-first, revalidate in background.
  if (url.pathname.startsWith('/_next/static') || /\.(?:js|css|woff2?|png|jpg|jpeg|svg|webp)$/.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then((cached) => {
        const network = fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(STATIC_CACHE).then((c) => c.put(request, copy));
          return res;
        }).catch(() => cached);
        return cached || network;
      })
    );
  }
});
