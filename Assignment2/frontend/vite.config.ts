import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],

  // --- THIS IS THE FIX ---
  // This proxy tells Vite to forward any request that starts
  // with '/api' to your C# backend on port 5130.
  server: {
    proxy: {
      '/api': {
        target: 'http://localhost:5130', // Your C# backend URL
        changeOrigin: true, // Recommended
      },
    },
  },
});

