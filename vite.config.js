import path from 'node:path';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

const debugTransforms = () => ({
  name: 'debug-transforms',
  enforce: 'pre',
  transform(_code, id) {
    if (process.env.VITE_DEBUG_BUILD === '1') {
      if (!id.includes('node_modules') || process.env.VITE_DEBUG_NODE_MODULES === '1') {
        console.log(`[vite-transform] ${path.relative(process.cwd(), id)}`);
      }
    }
    return null;
  },
});

export default defineConfig({
  plugins: [debugTransforms(), react()],
  server: {
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'credentialless',
    },
    allowedHosts: true,
  },
  resolve: {
    extensions: ['.jsx', '.js', '.tsx', '.ts', '.json'],
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      external: [
        '@babel/parser',
        '@babel/traverse',
        '@babel/generator',
        '@babel/types',
      ],
    },
  },
});
