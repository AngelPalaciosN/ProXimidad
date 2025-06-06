import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@mui/system': '@mui/system/esm'
    }
  },
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler'
      }
    }
  },
  build: {
    rollupOptions: {
      plugins: [],
      onwarn(warning, warn) {
        if (warning.code === 'DEPRECATED_FEATURE') return;
        if (warning.message.includes('Global built-in functions are deprecated')) return;
        if (warning.message.includes('The legacy JS API is deprecated')) return;
        if (warning.message.includes('lighten() is deprecated')) return;
        if (warning.message.includes('darken() is deprecated')) return;
        warn(warning);
      }
    }
  },
  define: {
    process: {
      env: {
        NODE_ENV: JSON.stringify("development")
      }
    }
  },
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    hmr: {
      host: '192.168.1.100',
      port: 5173
    }
  }
});
