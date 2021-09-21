/* global self, caches, fetch */
/* eslint-disable no-restricted-globals */

const CACHE = 'cache-7ac1988';

self.addEventListener('install', e => {
  e.waitUntil(precache()).then(() => self.skipWaiting());
});

self.addEventListener('activate', event => {
  self.clients
    .matchAll({
      includeUncontrolled: true,
    })
    .then(clientList => {
      const urls = clientList.map(client => client.url);
      console.log('[ServiceWorker] Matching clients:', urls.join(', '));
    });

  event.waitUntil(
    caches
      .keys()
      .then(cacheNames =>
        Promise.all(
          cacheNames.map(cacheName => {
            if (cacheName !== CACHE) {
              console.log('[ServiceWorker] Deleting old cache:', cacheName);
              return caches.delete(cacheName);
            }
            return null;
          })
        )
      )
      .then(() => {
        console.log('[ServiceWorker] Claiming clients for version', CACHE);
        return self.clients.claim();
      })
  );
});

function precache() {
  return caches.open(CACHE).then(cache => cache.addAll(["./","./colophon.html","./favicon.png","./index.html","./manifest.json","./resources.html","./tankovy_prapor_001.html","./tankovy_prapor_002.html","./tankovy_prapor_003.html","./tankovy_prapor_005.html","./tankovy_prapor_006.html","./tankovy_prapor_007.html","./tankovy_prapor_008.html","./tankovy_prapor_009.html","./tankovy_prapor_010.html","./tankovy_prapor_011.html","./tankovy_prapor_012.html","./tankovy_prapor_013.html","./tankovy_prapor_014.html","./tankovy_prapor_015.html","./tankovy_prapor_016.html","./tankovy_prapor_017.html","./resources/image001_fmt.jpeg","./resources/image002_fmt.jpeg","./resources/index.xml","./resources/obalka_tankovy_prapor_fmt.jpeg","./resources/upoutavka_eknihy_fmt.jpeg","./resources/vzorec_fmt.jpeg","./scripts/bundle.js","./style/style.min.css"]));
}

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.open(CACHE).then(cache => {
      return cache.match(e.request).then(matching => {
        if (matching) {
          console.log('[ServiceWorker] Serving file from cache.');
          console.log(e.request);
          return matching;
        }

        return fetch(e.request);
      });
    })
  );
});
