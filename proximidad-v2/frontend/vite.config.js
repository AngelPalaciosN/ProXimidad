import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  // Cargar variables de entorno basadas en el modo
  const env = loadEnv(mode, process.cwd(), '');
  
  return {
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
      },
      postcss: {
        plugins: []
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
          NODE_ENV: JSON.stringify(mode),
          VITE_API_BASE_URL: JSON.stringify(env.VITE_API_BASE_URL),
          VITE_BACKEND_URL: JSON.stringify(env.VITE_BACKEND_URL)
        }
      }
    },
    server: {
      host: env.SERVER_HOST || '0.0.0.0',
      port: parseInt(env.FRONTEND_PORT) || 5173,
      strictPort: true,
      hmr: {
        host: env.SERVER_HOST || '192.168.1.61',
        port: parseInt(env.FRONTEND_PORT) || 5173
      }
    }
  };
});