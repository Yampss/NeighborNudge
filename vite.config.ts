import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Remove Reddit proxy configuration as it causes CORS issues
  // Reddit's API doesn't allow cross-origin requests from browsers
})