import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from 'tailwindcss'
import autoprefixer from 'autoprefixer'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss,
        autoprefixer,
      ],
    },
  },
  server: {
    port: parseInt(import.meta.env.VITE_PORT) || 5000, // Usar el puerto de Vite o 5000 como fallback
    host: true  // Esto permite que la aplicación sea accesible externamente
  }
})
