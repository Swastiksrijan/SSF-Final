// SSF PWA service worker.
// Intentionally does not cache pages or API responses: authenticated IMS and
// live website data must always use the current server response.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})
