import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './utils/sessionStorageBridge.js'
import './utils/chunkReloadGuard.js'
import './utils/versionGuard.js'
import App from './App.jsx'
import './index.css'

// Capture the install prompt as early as possible: Chrome may fire it before
// React mounts, and the event cannot be re-requested later. The admin login
// button reads this stash and replays it.
window.__ssfInstallPrompt = null
window.addEventListener('beforeinstallprompt', (e) => {
  e.preventDefault()
  window.__ssfInstallPrompt = e
  window.dispatchEvent(new Event('ssf-install-available'))
})

// Register the installable PWA worker without caching pages or private IMS data.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js', { updateViaCache: 'none' }).catch((error) => {
      console.warn('SSF app service worker registration failed:', error)
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
