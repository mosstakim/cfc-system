import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'http://backend:3000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ''),
      },
      // Also proxying specific endpoints used in our script if they don't start with /api
      // Ideally backend should serve everything under /api but our controllers are at root (e.g. /users, /academic)
      // So let's proxy everything that isn't a static asset or index.html... 
      // ACTUALLY, usually we prefix backend with /api. 
      // Since we haven't changed backend to use global prefix /api, 
      // we need to proxy the specific routes or everything. 
      // Proxying /users, /academic, /registration for now.
      '/users': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
      '/academic': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
      '/registration': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
      '/auth': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
      '/dossier': {
        target: 'http://backend:3000',
        changeOrigin: true,
      },
      '/uploads': {
        target: 'http://backend:3000',
        changeOrigin: true,
      }
    }
  }
})
