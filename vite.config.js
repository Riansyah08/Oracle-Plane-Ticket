import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
  ],
  server: {
    host: true,
    port: 5173,
    proxy: {
      '/Ticket': {
        target: 'http://10.143.191.86:15103', // ⚠ use IPv4, not ::1
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
