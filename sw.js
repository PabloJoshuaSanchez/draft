/* Draft War Room - offline service worker
 *
 * Strategy: stale-while-revalidate. A cached copy is served immediately so the
 * app opens instantly and works with no connection, while a fresh copy is
 * fetched in the background and used on the next launch. That matters here:
 * cache-only would mean updates never arrive, and network-first would mean a
 * dead venue wifi could leave you staring at a spinner mid-draft.
 *
 * Bump CACHE when you upload a new index.html, so old files get cleaned out.
 */
var CACHE = 'warroom-v2';
var ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-192.png',
  './icon-512.png',
  './icon-maskable-512.png',
  './apple-touch-icon.png',
  './favicon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      // Don't let one missing file abort the whole install.
      return Promise.all(ASSETS.map(function (u) {
        return c.add(u).catch(function () { return null; });
      }));
    }).then(function () { return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  var req = e.request;
  if (req.method !== 'GET') return;
  // Only handle our own origin; never interfere with anything external.
  if (new URL(req.url).origin !== self.location.origin) return;

  e.respondWith(
    caches.match(req).then(function (hit) {
      var net = fetch(req).then(function (res) {
        if (res && res.status === 200) {
          var copy = res.clone();
          caches.open(CACHE).then(function (c) { c.put(req, copy); });
        }
        return res;
      }).catch(function () {
        // Offline and nothing cached for this exact request: fall back to the
        // app shell so a hard refresh with no connection still opens the app.
        return hit || caches.match('./index.html');
      });
      return hit || net;
    })
  );
});
