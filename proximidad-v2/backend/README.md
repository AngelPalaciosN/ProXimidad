# ProXimidad Backend - Estructura Limpia

## 📁 Estructura del Backend

```
backend/
├── .env                           # Variables de entorno
├── manage.py                      # Script principal de Django
├── requirements.txt               # Dependencias de Python
├── django.log                     # Logs de la aplicación
├── crear_servicios_usuarios.py    # Script para crear servicios de ejemplo
├── build.bat / build.sh          # Scripts de construcción
├── venv/                         # Entorno virtual de Python
├── media/                        # Archivos multimedia (imágenes de usuarios)
├── core/                         # Configuración principal de Django
│   ├── __init__.py
│   ├── settings.py               # Configuración principal
│   ├── urls.py                   # URLs principales
│   ├── wsgi.py                   # Configuración WSGI
│   └── asgi.py                   # Configuración ASGI
└── proximidad_app/               # Aplicación principal (ÚNICA EN USO)
    ├── __init__.py
    ├── admin.py                  # Panel de administración
    ├── apps.py                   # Configuración de la app
    ├── auth_views.py             # Vistas de autenticación
    ├── models.py                 # Modelos de datos
    ├── serializer.py             # Serializers REST
    ├── urls.py                   # URLs de la aplicación
    ├── views.py                  # Vistas principales
    ├── views_optimizadas.py      # Vistas optimizadas (v2)
    ├── migrations/               # Migraciones de base de datos
    └── management/commands/      # Comandos personalizados
```

## 🗑️ Archivos/Carpetas Eliminados

- ❌ `proxiApp/` - Duplicado innecesario
- ❌ `Django/` - Carpeta duplicada
- ❌ `test_*.py` - Archivos de prueba temporales
- ❌ `verificar_*.py` - Scripts de verificación básicos
- ❌ `crear_servicios_ejemplo.py` - Ya cumplió su función
- ❌ `insertar_servicios_prueba.py` - Ya cumplió su función

## 🚀 Aplicación Principal: `proximidad_app`

Esta es la **ÚNICA** aplicación Django en uso que contiene:

### Modelos principales:
- `Usuario` - Gestión de usuarios (proveedores y arrendadores)
- `Servicios` - Catálogo de servicios
- `Categoria` - Categorías de servicios
- `Comentarios` - Sistema de comentarios y calificaciones
- `Favoritos` - Sistema de favoritos

### APIs disponibles:
- `/api/usuarios/` - CRUD de usuarios
- `/api/servicios/` - CRUD de servicios
- `/api/categorias/` - Listado de categorías
- `/api/comentarios/` - Sistema de comentarios
- `/api/favoritos/` - Sistema de favoritos
- `/api/v2/` - APIs optimizadas

### Características:
- ✅ Sistema de autenticación por código
- ✅ Upload de imágenes
- ✅ Filtros avanzados
- ✅ CORS configurado
- ✅ APIs RESTful completas
- ✅ Serializers optimizados
- ✅ Validaciones robustas

## 🔧 Scripts Útiles Mantenidos

- `crear_servicios_usuarios.py` - Crear servicios de ejemplo para usuarios existentes
- `build.bat/build.sh` - Scripts de construcción y deployment

## 🌐 Configuración

- **Base de datos**: MySQL configurada via `.env`
- **Media files**: Servidos desde `/media/`
- **CORS**: Configurado para desarrollo
- **Logs**: Guardados en `django.log`