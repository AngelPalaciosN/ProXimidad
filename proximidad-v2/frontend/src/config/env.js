// Configuración de variables de entorno
export const config = {
  // API Configuration
  API_BASE_URL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
  
  // App Configuration
  APP_TITLE: import.meta.env.VITE_APP_TITLE || 'ProXimidad',
  APP_DESCRIPTION: import.meta.env.VITE_APP_DESCRIPTION || 'Encuentra servicios cerca de ti',
  
  // Location Configuration
  DEFAULT_LOCATION: import.meta.env.VITE_DEFAULT_LOCATION || 'Bogotá, Colombia',
  MAP_DEFAULT_ZOOM: parseInt(import.meta.env.VITE_MAP_DEFAULT_ZOOM) || 12,
  
  // UI Configuration
  PAGINATION_SIZE: parseInt(import.meta.env.VITE_PAGINATION_SIZE) || 10,
  SEARCH_DEBOUNCE_MS: parseInt(import.meta.env.VITE_SEARCH_DEBOUNCE_MS) || 300,
  
  // File Configuration
  IMAGE_MAX_SIZE: parseInt(import.meta.env.VITE_IMAGE_MAX_SIZE) || 5242880, // 5MB
  SUPPORTED_IMAGE_TYPES: (import.meta.env.VITE_SUPPORTED_IMAGE_TYPES || 'image/jpeg,image/png,image/webp').split(','),
  
  // Development
  IS_DEVELOPMENT: import.meta.env.DEV,
  IS_PRODUCTION: import.meta.env.PROD,
};

// Helper function para construir URLs de API
export const buildApiUrl = (endpoint) => {
  const baseUrl = config.API_BASE_URL.endsWith('/') 
    ? config.API_BASE_URL.slice(0, -1) 
    : config.API_BASE_URL;
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  return `${baseUrl}${cleanEndpoint}`;
};

// Helper function para validar archivos
export const validateImageFile = (file) => {
  if (!file) return { valid: false, error: 'No se seleccionó archivo' };
  
  if (file.size > config.IMAGE_MAX_SIZE) {
    return { 
      valid: false, 
      error: `El archivo es muy grande. Máximo ${(config.IMAGE_MAX_SIZE / 1024 / 1024).toFixed(1)}MB` 
    };
  }
  
  if (!config.SUPPORTED_IMAGE_TYPES.includes(file.type)) {
    return { 
      valid: false, 
      error: `Tipo de archivo no soportado. Use: ${config.SUPPORTED_IMAGE_TYPES.join(', ')}` 
    };
  }
  
  return { valid: true };
};

export default config;