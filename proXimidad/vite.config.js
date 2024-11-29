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
      onwarn(warning, warn) {
        if (warning.code === 'DEPRECATED_FEATURE') return;
        if (warning.message.includes('Global built-in functions are deprecated')) return;
        if (warning.message.includes('The legacy JS API is deprecated')) return;
        if (warning.message.includes('lighten() is deprecated')) return;
        if (warning.message.includes('darken() is deprecated')) return;
        warn(warning);
      }
    }
  }
});
