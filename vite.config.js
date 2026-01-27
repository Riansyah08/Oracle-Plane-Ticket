import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    proxy: {
      '/soa-infra': {
        target: 'http://127.0.0.1:7003', // ⚠ use IPv4, not ::1
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
