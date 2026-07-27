// Service worker: cache-first dla plików aplikacji, sieć dla API GitHuba.
const CACHE = "magazyn-v1";
const ASSETS = ["./", "index.html", "site.webmanifest",
  "icon-192.png", "icon-512.png", "apple-touch-icon.png", "favicon-32.png"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(CACHE).then(c => c.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(ks =>
    Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))
  ).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const url = new URL(e.request.url);
  if (url.origin !== location.origin) return; // GitHub API zawsze z sieci
  // network-first dla nawigacji (świeża apka gdy online), cache jako fallback offline
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(CACHE).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request, { ignoreSearch: true })
      .then(r => r || caches.match("index.html")))
  );
});
