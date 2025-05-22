import react from '@vitejs/plugin-react-swc';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      input: {
        main: './index.html',
        background: './src/background.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          return chunk.name === 'background' ? '[name].js' : 'assets/[name]-[hash].js';
        },
      },
    },
    outDir: 'dist',
  },
})
