import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://capstone-backend-ax50.onrender.com', 
    },
    host: true, 
    allowedHosts: ['capstone-frontend-wctm.onrender.com']
  },
})
