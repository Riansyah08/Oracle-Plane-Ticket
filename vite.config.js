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
      '/Ticket': {
        target: 'http://localhost:15103', // ⚠ use IPv4, not ::1
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
