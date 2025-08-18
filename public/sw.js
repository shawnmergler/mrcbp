// Simple cache-first service worker for Next.js demo
const CACHE = "mr-bp-v1";
const OFFLINE_URL = "/offline.html";

self.addEventListener("install", (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE);
    await cache.addAll([
      "/",
      OFFLINE_URL,
      "/manifest.webmanifest",
      "/icons/icon-192.png",
      "/icons/icon-512.png"
    ]);
  })());
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(self.clients.claim());
});

self.addEventListener("fetch", (event) => {
  const { request } = event;
  if (request.method !== "GET") return;
  event.respondWith((async () => {
    try {
      const network = await fetch(request);
      const cache = await caches.open(CACHE);
      cache.put(request, network.clone());
      return network;
    } catch {
      const cache = await caches.open(CACHE);
      const cached = await cache.match(request);
      return cached || cache.match(OFFLINE_URL);
    }
  })());
});
