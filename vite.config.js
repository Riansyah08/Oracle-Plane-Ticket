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
        target: 'http://10.65.255.49:7003', // ⚠ use IPv4, not ::1
        changeOrigin: true,
        secure: false,
      }
    }
  }
})
