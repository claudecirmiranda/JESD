const CACHE_NAME = "jesd-v1";

const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/sobre.html",
  "/produto.html",
  "/portfolio.html",
  "/depoimentos.html",
  "/contato.html",
  "/orcamento.html",
  "/assets/css/reset.css",
  "/assets/css/main.css",
  "/assets/css/components.css",
  "/assets/css/responsive.css",
  "/assets/js/main.js",
  "/assets/js/menu.js",
  "/assets/js/animations.js",
  "/assets/js/forms.js",
  "/assets/images/logo/favicon.ico"
];

self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS_TO_CACHE))
  );
});

self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
