import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { TanStackRouterVite } from '@tanstack/router-plugin/vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    // Split every file-based route into its own chunk so a visitor downloads
    // only the page they opened instead of the whole app. Also splits heavy
    // libraries out of the main bundle.
    TanStackRouterVite({ autoCodeSplitting: true }),
    react(),
    tailwindcss()
  ],
  server: {
    port: 5173,
    host: true,
    allowedHosts: true
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // Shared vendor libs that every page needs — cached once, reused across
          // routes. Heavy route-only libs (exceljs, jspdf, html2canvas) are left
          // to Vite's own lazy chunking so they load only on the pages that use them.
          react: ['react', 'react-dom'],
          icons: ['react-icons', 'lucide-react'],
        }
      }
    }
  }
})
