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
        content: './src/content.ts',
      },
      output: {
        entryFileNames: (chunk) => {
          switch (chunk.name) {
            case 'background':
              return '[name].js';
            case 'content':
              return '[name].js';
            default:
              return 'assets/[name]-[hash].js';
            
          };
        },
      },
    },
    outDir: 'dist',
  },
})
