import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './utils/sessionStorageBridge.js'
import './utils/chunkReloadGuard.js'
import './utils/versionGuard.js'
import App from './App.jsx'
import './index.css'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>
)
