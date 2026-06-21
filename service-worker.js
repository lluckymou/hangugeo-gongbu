/* ==================================================================
   service-worker.js — Hangugeo offline cache (cache-first).
   Precaches the full app shell + data so the PWA works fully
   offline after the first visit. Bump CACHE to invalidate old assets.
   ================================================================== */
'use strict';

const CACHE = 'hangugeo-v4';

const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './assets/hangugeo.png',
  './assets/css/styles.css',
  './assets/fonts/font-awesome.min.css',
  './assets/fonts/fontawesome-webfont.woff2',
  './assets/fonts/fontawesome-webfont.woff',
  './assets/hangul.js',
  './assets/js/i18n.js',
  './assets/js/icons.js',
  './assets/js/ui.js',
  './assets/js/store.js',
  './assets/js/tts.js',
  './assets/js/staticdata.js',
  './assets/hanja-utils.js',
  './assets/hanja.js',
  './assets/js/lexicon.js',
  './assets/js/app.js',
  './assets/hangugeo_data_fallback.js',
  './assets/hangugeo_data.js',
];

// Precache the shell. Individual failures (e.g. optional big data file)
// must not abort the whole install.
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) =>
      Promise.allSettled(ASSETS.map((url) => cache.add(url)))
    ).then(() => self.skipWaiting())
  );
});

// Drop old caches on activate.
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k)))
    ).then(() => self.clients.claim())
  );
});

// Cache-first; fall back to network and cache the result. Navigations
// fall back to the cached index.html when offline.
self.addEventListener('fetch', (event) => {
  const req = event.request;
  if (req.method !== 'GET') return;

  event.respondWith(
    caches.match(req).then((cached) => {
      if (cached) return cached;
      return fetch(req)
        .then((res) => {
          if (res && res.ok && res.type === 'basic') {
            const copy = res.clone();
            caches.open(CACHE).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() => {
          if (req.mode === 'navigate') return caches.match('./index.html');
          return new Response('', { status: 504, statusText: 'offline' });
        });
    })
  );
});
