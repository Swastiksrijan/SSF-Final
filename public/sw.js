// SSF PWA service worker.
// Intentionally does not cache pages or API responses: authenticated IMS and
// live website data must always use the current server response.
self.addEventListener('install', () => {
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  // Drop any cache a previous visit left behind. This worker caches nothing, so
  // deleting them only removes a stale copy that could pin an old page.
  event.waitUntil((async () => {
    try {
      const keys = await caches.keys()
      await Promise.all(keys.map(key => caches.delete(key)))
    } catch {
      // Cache Storage unavailable: nothing to clear.
    }
    await self.clients.claim()
  })())
})
