import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'


export default defineConfig({
  server: {
    proxy: {
      '/api': 'https://capstone-backend-url.onrender.com', 
    },
    host: true, 
  },
})
