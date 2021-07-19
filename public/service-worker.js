const CACHE_NAME = "static-cache-v2";
const DATA_CACHE_NAME = "data-cache-v1";

const FILES_TO_CACHE = [
  '/',
  '/index.html',
  '/favicon.ico',
  '/manifest.webmanifest',
  '/assets/css/style.css',
  '/assets/js/loadImages.js',
  '/assets/js/index.js',
  '/assets/images/icons/icon-72x72.png',
  '/assets/images/icons/icon-96x96.png',
  '/assets/images/icons/icon-128x128.png',
  '/assets/images/icons/icon-144x144.png',
  '/assets/images/icons/icon-152x152.png',
  '/assets/images/icons/icon-192x192.png',
  '/assets/images/icons/icon-384x384.png',
  '/assets/images/icons/icon-512x512.png'
];

//install
self.addEventListener('install', function (e) {
    e.waitUntil(
        caches.open(DATA_CACHE_NAME).then((cache) => cache.add('/api/images'))
    );
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(FILES_TO_CACHE))
      );
    self.skipWaiting();
})

// Activate service worker and remove old data from cache
self.addEventListener("activate", function(e) {
e.waitUntil(
    caches.keys().then(keyList => {
    return Promise.all(
        keyList.map(key => {
        if (key !== CACHE_NAME && key !== DATA_CACHE_NAME) {
            console.log("Removing old cache data", key);
            return caches.delete(key);
        }
        })
    );
    })
);

self.ClientRectList.claim();
});

self.addEventListener('fetch', function(evt) {
evt.respondWith(
        caches.open(CACHE_NAME).then(cache => {
            return cache.match(evt.request).then(response => {
            return response || fetch(evt.request);
            });
        })
    );
});