import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            if (id.includes('@mui')) return 'mui';
            if (id.includes('react')) return 'vendor';
            // split firebase by sub-packages to reduce single huge chunk
            if (id.includes('firebase') && id.includes('auth')) return 'firebase-auth';
            if (id.includes('firebase') && id.includes('firestore')) return 'firebase-firestore';
            if (id.includes('firebase') && id.includes('storage')) return 'firebase-storage';
            if (id.includes('firebase')) return 'firebase';
          }
        }
      }
    }
  }
})
