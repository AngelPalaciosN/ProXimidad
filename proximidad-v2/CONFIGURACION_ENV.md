# 🔧 Configuración de Variables de Entorno - ProXimidad

Este documento explica cómo configurar y usar las variables de entorno en el proyecto ProXimidad.

## 📋 Estructura de Archivos de Configuración

```
proximidad-v2/
├── .env.example           # Plantilla principal con todas las variables
├── .env                   # Variables globales del proyecto (crear manualmente)
├── backend/
│   ├── .env              # Variables específicas del backend (crear manualmente)
│   └── verificar_env.py  # Script de verificación
└── frontend/
    └── .env              # Variables específicas del frontend (crear manualmente)
```

## 🚀 Configuración Inicial

### 1. Configurar el Backend

```bash
# Navegar al directorio backend
cd backend

# Copiar el archivo de ejemplo
copy ..\.env.example .env

# Editar las variables según tu entorno
# Especialmente importante configurar:
# - SECRET_KEY
# - DEBUG
# - ALLOWED_HOSTS
# - Configuración de base de datos
```

### 2. Configurar el Frontend

```bash
# Navegar al directorio frontend
cd frontend

# El archivo .env ya está configurado, pero puedes ajustarlo
# Especialmente importante verificar:
# - VITE_API_BASE_URL
# - VITE_APP_TITLE
```

### 3. Verificar la Configuración

```bash
# Para el backend
cd backend
python verificar_env.py

# Para el frontend
cd frontend
npm run build
```

## 📝 Variables Importantes

### Variables del Backend (Django)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `SECRET_KEY` | Clave secreta de Django | `django-insecure-change-this` |
| `DEBUG` | Modo debug | `True` |
| `ALLOWED_HOSTS` | Hosts permitidos | `localhost,127.0.0.1` |
| `DB_NAME` | Nombre de la base de datos | `proxima` |
| `CORS_ALLOWED_ORIGINS` | Orígenes permitidos para CORS | `http://localhost:5173` |

### Variables del Frontend (React/Vite)

| Variable | Descripción | Ejemplo |
|----------|-------------|---------|
| `VITE_API_BASE_URL` | URL base de la API | `http://localhost:8000/api` |
| `VITE_APP_TITLE` | Título de la aplicación | `ProXimidad` |
| `VITE_DEFAULT_LOCATION` | Ubicación por defecto | `Bogotá, Colombia` |
| `VITE_PAGINATION_SIZE` | Tamaño de paginación | `10` |
| `VITE_IMAGE_MAX_SIZE` | Tamaño máximo de imagen | `5242880` |

## ⚙️ Uso en el Código

### Backend (Django)

```python
from decouple import config

# Leer variables de entorno
SECRET_KEY = config('SECRET_KEY')
DEBUG = config('DEBUG', default=False, cast=bool)
ALLOWED_HOSTS = config('ALLOWED_HOSTS', default='localhost').split(',')
```

### Frontend (React/Vite)

```javascript
import { config, buildApiUrl } from './config/env.js';

// Usar variables de configuración
const apiUrl = buildApiUrl('/servicios/');
const maxFileSize = config.IMAGE_MAX_SIZE;
const appTitle = config.APP_TITLE;
```

## 🔒 Seguridad

- ❌ **NUNCA** subas archivos `.env` al repositorio
- ✅ Usa `.env.example` como plantilla
- ✅ Cambia `SECRET_KEY` en producción
- ✅ Usa `DEBUG=False` en producción
- ✅ Configura `ALLOWED_HOSTS` apropiadamente

## 🏃‍♂️ Comandos Rápidos

```bash
# Clonar configuración inicial
copy .env.example backend\.env
copy .env.example frontend\.env

# Verificar backend
cd backend && python verificar_env.py

# Verificar frontend
cd frontend && npm run build

# Instalar dependencias del backend (si es necesario)
cd backend && pip install python-decouple

# Iniciar servicios
cd backend && python manage.py runserver
cd frontend && npm run dev
```

## 🐛 Solución de Problemas

### Error: "ModuleNotFoundError: No module named 'decouple'"
```bash
cd backend
pip install python-decouple
```

### Error: "Cannot read properties of undefined"
- Verifica que las variables `VITE_*` estén en `frontend/.env`
- Asegúrate de que el servidor de desarrollo esté reiniciado

### Error: CORS
- Verifica `CORS_ALLOWED_ORIGINS` en el backend
- Asegúrate de que la URL del frontend esté incluida

### Error: "SECRET_KEY not found"
- Verifica que `backend/.env` exista
- Copia desde `.env.example` si es necesario

## 📚 Más Información

- [Django Decouple Documentation](https://pypi.org/project/python-decouple/)
- [Vite Environment Variables](https://vitejs.dev/guide/env-and-mode.html)
- [Django Settings Best Practices](https://docs.djangoproject.com/en/stable/topics/settings/)

---

✅ **Configuración completada exitosamente**

Tu proyecto ProXimidad está ahora configurado para usar variables de entorno de manera centralizada y segura.