/* ============================================================
   Fabrik des Idées : Service Worker
   Permet à l'appli de marcher hors-ligne (interface uniquement)
   ============================================================ */

var CACHE_NAME = 'fabrik-v2';
var FILES_TO_CACHE = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];

/* Installation : met en cache les fichiers de base */
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_NAME).then(function (cache) {
      return cache.addAll(FILES_TO_CACHE);
    }).then(function () {
      return self.skipWaiting();
    })
  );
});

/* Activation : nettoie les vieux caches */
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (key) {
        if (key !== CACHE_NAME) return caches.delete(key);
      }));
    }).then(function () {
      return self.clients.claim();
    })
  );
});

/* Interception des requêtes */
self.addEventListener('fetch', function (event) {
  var url = event.request.url;

  /* Les appels API ne sont PAS mis en cache (toujours en direct) */
  if (url.indexOf('agnes-ai.com') >= 0 || url.indexOf('apihub') >= 0 ||
      url.indexOf('api.') >= 0 || url.indexOf('groq') >= 0 ||
      url.indexOf('openrouter') >= 0) {
    return;
  }

  /* Pour le reste : cache d'abord, réseau ensuite */
  event.respondWith(
    caches.match(event.request).then(function (cached) {
      return cached || fetch(event.request).then(function (response) {
        /* On met en cache les nouvelles ressources */
        if (event.request.method === 'GET' && response.status === 200) {
          var clone = response.clone();
          caches.open(CACHE_NAME).then(function (cache) {
            cache.put(event.request, clone);
          });
        }
        return response;
      });
    }).catch(function () {
      /* Hors-ligne et pas en cache : on retourne l'index */
      return caches.match('./index.html');
    })
  );
});

/* Message reçu du client (pour vider le cache si besoin) */
self.addEventListener('message', function (event) {
  if (event.data === 'skip-waiting') {
    self.skipWaiting();
  }
  if (event.data === 'clear-cache') {
    caches.delete(CACHE_NAME);
  }
});