import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './utils/sessionStorageBridge.js'
import './utils/chunkReloadGuard.js'
import './utils/versionGuard.js'
import App from './App.jsx'
import './index.css'

// Register the installable PWA worker without caching pages or private IMS data.
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch((error) => {
      console.warn('SSF app service worker registration failed:', error)
    })
  })
}

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
