import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  // Явный IPv4-loopback: если localhost резолвится в ::1 и IPv6 недоступен, сервер отвечает отказом
  server: {
    host: '127.0.0.1',
  },
})
