const CACHE_NAME = 'jesd-v2'; // 1. Mude a versão sempre que fizer alterações críticas
const ASSETS = [
  '/',
  '/index.html',
  '/assets/css/main.css',
  '/assets/js/main.js'
];

// Instalação: Salva os arquivos e força a ativação imediata
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting(); // Força o novo SW a assumir o controle sem esperar o app fechar
});

// Ativação: Limpa automaticamente versões antigas de cache (ex: deleta o 'jesd-v1')
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cache => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache); // Deleta caches antigos
          }
        })
      );
    }).then(() => self.clients.claim()) // Assume o controle das abas abertas imediatamente
  );
});

// Busca (Fetch): Estratégia Stale-While-Revalidate
// Entrega o cache instantaneamente, mas atualiza o cache em segundo plano se houver internet
self.addEventListener('fetch', event => {
  // Ignora requisições de fora do seu site (como APIs externas ou extensões)
  if (!event.request.url.startsWith(self.location.origin)) return;

  event.respondWith(
    caches.open(CACHE_NAME).then(cache => {
      return cache.match(event.request).then(cachedResponse => {
        // Dispara a busca na rede em segundo plano
        const fetchPromise = fetch(event.request).then(networkResponse => {
          // Se a resposta for válida, atualiza o cache com a versão mais nova da Vercel
          if (networkResponse.status === 200) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(() => {
          // Silencia erros de rede caso esteja offline para não quebrar o app
        });

        // Retorna o cache imediatamente (se existir) ou espera a rede (se não existir)
        return cachedResponse || fetchPromise;
      });
    })
  );
});
