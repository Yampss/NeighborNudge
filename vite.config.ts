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
        secure: true,
        rewrite: (path) => path.replace(/^\/reddit-api/, ''),
        headers: {
          'User-Agent': 'NeighborNudgeApp/1.0 (by u/YourRedditUsername)'
        }
      },
      '/reddit-oauth': {
        target: 'https://www.reddit.com',
        changeOrigin: true,
        secure: true,
        rewrite: (path) => path.replace(/^\/reddit-oauth/, ''),
        headers: {
          'User-Agent': 'NeighborNudgeApp/1.0 (by u/YourRedditUsername)'
        }
      }
    }
  }
})