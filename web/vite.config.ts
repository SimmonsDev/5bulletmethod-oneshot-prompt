import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: Number(process.env.WEB_PORT || 5173),
    proxy: {
      '/entries': {
        target: 'http://localhost:7071',
        changeOrigin: true,
      },
      '/streak': {
        target: 'http://localhost:7071',
        changeOrigin: true,
      }
    }
  }
})
