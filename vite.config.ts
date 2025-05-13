// ./vite.config.ts
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tsconfigPaths from 'vite-tsconfig-paths';
import { nodePolyfills } from 'vite-plugin-node-polyfills';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // Enables path aliases from tsconfig.json
    nodePolyfills({
      // Whether to polyfill specific globals
      globals: {
        Buffer: true,
        global: true,
        process: true,
      },
      // Whether to polyfill Node.js built-ins
      protocolImports: true,
    }),
  ],
  resolve: {
    alias: {
      '@': '/src', // Path alias for imports
      // Add aliases for browser-compatible versions
      stream: 'stream-browserify',
      events: 'events',
      path: 'path-browserify',
      util: 'util',
      fs: 'browserify-fs',
    },
  },
  server: {
    port: 3000, // Changed to port 3000 as requested
    proxy: {
      '/api': {
        target: 'http://localhost:3003', // Updated to match the actual Express server port (3003)
        changeOrigin: true,
        secure: false,
        ws: true, // Support WebSocket
        rewrite: (path) => path
      },
    },
  },
  build: {
    outDir: 'dist', // Output directory for the build
    rollupOptions: {
      // External packages that should not be bundled
      external: [],
    },
  },
  optimizeDeps: {
    esbuildOptions: {
      // Node.js global to browser globalThis
      define: {
        global: 'globalThis',
      },
    },
  },
});
