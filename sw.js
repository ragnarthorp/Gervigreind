/* ---------------------------------------------------------------------
 * Service worker — Gervigreind (vefbók)
 *
 * Strategía:
 *   • App-shell og static eignir cache-aðar við installation.
 *   • Allar GET-requestir: cache-first, með network-fallback.
 *   • Nýjar útgáfur sem ná inn um net eru lagðar í cache.
 *   • Cache-bust querystring (?v=...) er klippt af áður en pakkanum
 *     er flett upp í cache, svo við vistum ekki margar útgáfur af
 *     sömu skrá.
 *   • Þegar nýrri SW kemur upp er CACHE_VERSION bumpa upp,
 *     gamli cache hreinsaður.
 * ------------------------------------------------------------------- */

var CACHE_VERSION = 'gervigreind-v1';

// Shell og helstu eignir — fyrir-hlaðnar svo bókin opnast jafnvel ef
// nemandi smellir á hlekk strax án að hafa heimsótt kafla áður.
var PRECACHE = [
  './',
  './index.html',
  './style.css',
  './kaflar-json/book-toc.json'
];

// ---- install: pre-cache shell ----
self.addEventListener('install', function (event) {
  event.waitUntil(
    caches.open(CACHE_VERSION).then(function (cache) {
      // Notum addAll en með no-cache request svo við fáum ferskar útgáfur.
      var reqs = PRECACHE.map(function (url) {
        return new Request(url, { cache: 'reload' });
      });
      return cache.addAll(reqs);
    }).then(function () {
      // virkjum nýja SW strax án að bíða eftir reload
      return self.skipWaiting();
    })
  );
});

// ---- activate: hreinsa gamla cache ----
self.addEventListener('activate', function (event) {
  event.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        if (k !== CACHE_VERSION) return caches.delete(k);
      }));
    }).then(function () {
      // grípa öll opin tab strax
      return self.clients.claim();
    })
  );
});

// ---- fetch: cache-first með network-fallback ----
self.addEventListener('fetch', function (event) {
  var req = event.request;

  // Bara GET. Sleppum POST/HEAD og fleiri aðferðum.
  if (req.method !== 'GET') return;

  var url = new URL(req.url);

  // Ekki cache-a á þvert lén (utan af okkar uppruna).
  if (url.origin !== self.location.origin) return;

  // Lykill í cache — án ?v=... querystring og án hash.
  // Notum URL án query svo cache-bust skemmi ekki uppflettingu.
  var lookupUrl = new URL(req.url);
  lookupUrl.search = '';
  var cacheReq = new Request(lookupUrl.toString(), {
    method: 'GET',
    headers: req.headers,
    credentials: req.credentials,
    redirect: 'follow'
  });

  event.respondWith(
    caches.open(CACHE_VERSION).then(function (cache) {
      return cache.match(cacheReq).then(function (cached) {
        // network-fallback: reynum að ná ferskri útgáfu í bakgrunninum
        var network = fetch(req).then(function (res) {
          // Vistum árangursrík svör í cache (klónum áður en svar er notað).
          if (res && res.ok && res.type === 'basic') {
            cache.put(cacheReq, res.clone());
          }
          return res;
        }).catch(function () {
          // ef ekki er net og ekki í cache, fellur þetta í gegnum.
          return cached;
        });

        // Ef við erum með cached útgáfu, skilum henni strax (hraðast).
        // Network-promise heldur áfram í bakgrunninum og uppfærir cache.
        return cached || network;
      });
    })
  );
});
