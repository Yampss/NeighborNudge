import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/reddit-api': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/reddit-api/, ''),
        headers: {
          'User-Agent': 'web:NeighborNudge:v1.0.0 (by /u/neighbornudge)'
        }
      },
      '/reddit-oauth': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        secure: false,
        rewrite: (path) => path.replace(/^\/reddit-oauth/, ''),
        headers: {
          'User-Agent': 'web:NeighborNudge:v1.0.0 (by /u/neighbornudge)'
        }
      }
    }
  }
})