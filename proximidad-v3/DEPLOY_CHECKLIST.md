# 🚀 Checklist de Deploy - ProXimidad V3

## ✅ Pre-Deployment (Verificar antes de subir)

### 🔍 1. Testing Local
- [ ] Todos los endpoints de la API funcionan correctamente
- [ ] Login y registro funcionan sin errores
- [ ] Sistema de solicitudes completo (crear, aceptar, rechazar, completar)
- [ ] Sistema de calificaciones funciona
- [ ] Emails se envían correctamente (verificar Gmail SMTP)
- [ ] Panel de proveedor muestra calificación promedio real
- [ ] Colores azules aplicados correctamente en todas las cajas
- [ ] Texto blanco visible en todas las métricas

### 🗄️ 2. Base de Datos
- [ ] Backup de la base de datos actual: `scripts/crear_backup.ps1`
- [ ] Todas las migraciones aplicadas: `python manage.py migrate`
- [ ] Verificar tablas: `solicitudes`, `comentarios`, `servicios`, `usuarios`
- [ ] Verificar que existen categorías pobladas
- [ ] Probar queries pesadas con EXPLAIN para optimización

### 🔐 3. Seguridad
- [ ] **CRÍTICO**: Cambiar `DEBUG = False` en `settings.py`
- [ ] **CRÍTICO**: Cambiar `SECRET_KEY` a una nueva clave aleatoria
- [ ] Configurar `ALLOWED_HOSTS` con tu dominio/IP
- [ ] Verificar configuración CORS en `settings.py`
- [ ] Revisar que no haya contraseñas hardcodeadas
- [ ] Verificar que EMAIL_HOST_PASSWORD esté en variables de entorno

### 📁 4. Archivos Estáticos y Media
- [ ] Ejecutar: `python manage.py collectstatic`
- [ ] Verificar que la carpeta `media/` tenga permisos correctos (755)
- [ ] Configurar NGINX para servir archivos estáticos
- [ ] Verificar que las imágenes de servicios se suban correctamente

### 🌐 5. Frontend
- [ ] Build de producción: `npm run build` (en carpeta frontend)
- [ ] Verificar que el build esté en `frontend/dist/`
- [ ] Actualizar `API_BASE_URL` en `env.js` con la IP/dominio del servidor
- [ ] Revisar que no haya `console.log()` innecesarios
- [ ] Minificar CSS y JS (automático con Vite)

---

## 🛠️ Deployment Steps

### Paso 1: Preparar Backend

```powershell
# En: proximidad-v2/backend/

# 1. Activar entorno virtual (si usas uno)
# venv\Scripts\Activate.ps1

# 2. Actualizar dependencias
pip install -r requirements.txt

# 3. Aplicar migraciones
python manage.py migrate

# 4. Recolectar archivos estáticos
python manage.py collectstatic --noinput

# 5. Verificar configuración
python manage.py check --deploy
```

### Paso 2: Configurar settings.py para Producción

**Archivo**: `backend/core/settings.py`

```python
# CAMBIAR ESTAS LÍNEAS:

DEBUG = False  # ⚠️ IMPORTANTE

ALLOWED_HOSTS = [
    '192.168.1.70',  # Tu IP local
    'tu-dominio.com',  # Tu dominio si tienes
    'www.tu-dominio.com',
]

# SECRET_KEY - Generar una nueva:
# python -c "from django.core.management.utils import get_random_secret_key; print(get_random_secret_key())"
SECRET_KEY = 'TU-NUEVA-SECRET-KEY-AQUI'

# Email - Usar variables de entorno
EMAIL_HOST_USER = os.environ.get('EMAIL_USER', 'palaciosangeldavidn@gmail.com')
EMAIL_HOST_PASSWORD = os.environ.get('EMAIL_PASSWORD', 'tu-password-aqui')

# Database - Verificar credenciales
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'proxima',
        'USER': 'root',
        'PASSWORD': 'tu-password-mysql',
        'HOST': 'localhost',
        'PORT': '3306',
    }
}

# CORS - Ajustar según tu dominio
CORS_ALLOWED_ORIGINS = [
    'http://192.168.1.70:5173',  # Development
    'http://tu-dominio.com',      # Production
]

# Static files
STATIC_ROOT = os.path.join(BASE_DIR, 'staticfiles')
MEDIA_ROOT = os.path.join(BASE_DIR, 'media')
```

### Paso 3: Configurar Frontend

**Archivo**: `frontend/src/config/env.js`

```javascript
// Cambiar a la IP/dominio de producción
export const config = {
  API_BASE_URL: 'http://192.168.1.70:8000/api',  // Ajustar según tu servidor
  // O si tienes dominio:
  // API_BASE_URL: 'https://api.tu-dominio.com/api',
}
```

### Paso 4: Build de Producción

```powershell
# En: proximidad-v2/frontend/

# 1. Instalar dependencias (si es necesario)
npm install

# 2. Crear build de producción
npm run build

# Esto genera la carpeta: frontend/dist/
```

### Paso 5: Configurar Gunicorn (Producción)

**Archivo**: `backend/gunicorn_config.py` (ya existe)

Verificar configuración:
```python
workers = 4  # Ajustar según CPU disponibles
bind = '0.0.0.0:8000'
timeout = 120
```

### Paso 6: Configurar NGINX (Servidor Web)

**Archivo**: `backend/nginx_config.conf` (ya existe)

Copiar a NGINX:
```bash
sudo cp nginx_config.conf /etc/nginx/sites-available/proximidad
sudo ln -s /etc/nginx/sites-available/proximidad /etc/nginx/sites-enabled/
sudo nginx -t  # Verificar configuración
sudo systemctl restart nginx
```

### Paso 7: Iniciar Servicios

**Opción A: Systemd Service (Recomendado para producción)**

```bash
# Copiar service file
sudo cp proximidad.service /etc/systemd/system/

# Recargar systemd
sudo systemctl daemon-reload

# Iniciar servicio
sudo systemctl start proximidad

# Habilitar inicio automático
sudo systemctl enable proximidad

# Ver estado
sudo systemctl status proximidad
```

**Opción B: Script Manual**

```powershell
# Windows (desarrollo/testing)
.\scripts\start.ps1

# Linux/Mac (producción)
chmod +x backend/start_gunicorn.sh
./backend/start_gunicorn.sh
```

---

## 🔍 Post-Deployment Verification

### 1. Verificar Backend
```bash
# Healthcheck
curl http://192.168.1.70:8000/api/v2/health/

# Login test
curl -X POST http://192.168.1.70:8000/api/login/ \
  -H "Content-Type: application/json" \
  -d '{"correo_electronico":"test@test.com","cedula":"1234567890"}'

# API Proveedor test
curl http://192.168.1.70:8000/api/proveedor/dashboard/?proveedor_id=1
```

### 2. Verificar Frontend
- [ ] Abrir en navegador: `http://192.168.1.70` (si usas NGINX)
- [ ] Verificar que cargue sin errores de consola
- [ ] Probar login
- [ ] Probar crear solicitud
- [ ] Verificar que lleguen emails

### 3. Verificar Logs
```bash
# Backend logs (Gunicorn)
tail -f /var/log/gunicorn/error.log

# NGINX logs
tail -f /var/log/nginx/error.log
tail -f /var/log/nginx/access.log

# Django logs (si configuraste)
tail -f backend/logs/django.log
```

### 4. Monitoreo de Performance
- [ ] Verificar tiempo de respuesta de endpoints críticos
- [ ] Monitorear uso de CPU/RAM del servidor
- [ ] Verificar conexiones a la base de datos
- [ ] Revisar que no haya memory leaks

---

## 📦 Archivos Importantes de Deploy

```
proximidad-v2/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── gunicorn_config.py          ✅ Configurado
│   ├── nginx_config.conf           ✅ Configurado
│   ├── proximidad.service          ✅ Configurado
│   ├── start_gunicorn.sh           ✅ Configurado
│   ├── verify_setup.sh             ✅ Script de verificación
│   └── core/
│       └── settings.py             ⚠️ CAMBIAR DEBUG=False
├── frontend/
│   ├── package.json
│   ├── vite.config.js
│   ├── dist/                       📦 Build de producción
│   └── src/
│       └── config/
│           └── env.js              ⚠️ CAMBIAR API_BASE_URL
└── scripts/
    ├── start.ps1                   ✅ Script de inicio
    ├── crear_backup.ps1            ✅ Backup de BD
    └── install.ps1                 ✅ Instalación inicial
```

---

## 🚨 Troubleshooting Común

### Error: "Bad Gateway 502"
- Verificar que Gunicorn esté corriendo
- Revisar logs: `/var/log/nginx/error.log`
- Verificar configuración NGINX

### Error: "CORS policy"
- Verificar `CORS_ALLOWED_ORIGINS` en `settings.py`
- Agregar dominio frontend a la lista

### Error: "Static files not loading"
- Ejecutar: `python manage.py collectstatic`
- Verificar configuración NGINX para `/static/`

### Error: "Database connection failed"
- Verificar credenciales en `settings.py`
- Verificar que MySQL esté corriendo: `systemctl status mysql`

### Error: "Emails not sending"
- Verificar configuración SMTP en `settings.py`
- Verificar contraseña de aplicación de Gmail
- Revisar logs de Django

---

## 🎯 Optimizaciones Recomendadas

### Base de Datos
```sql
-- Agregar índices si no existen
ALTER TABLE solicitudes ADD INDEX idx_estado_fecha (estado, fecha_solicitud);
ALTER TABLE comentarios ADD INDEX idx_calificacion (calificacion);
ALTER TABLE servicios ADD INDEX idx_proveedor_activo (proveedor_id, activo);

-- Limpiar tablas antiguas si existen
-- TRUNCATE TABLE django_session;  -- Solo si hay muchas sesiones viejas
```

### Django Settings (Producción)
```python
# Cache (opcional pero recomendado)
CACHES = {
    'default': {
        'BACKEND': 'django.core.cache.backends.redis.RedisCache',
        'LOCATION': 'redis://127.0.0.1:6379/1',
    }
}

# Logging
LOGGING = {
    'version': 1,
    'disable_existing_loggers': False,
    'handlers': {
        'file': {
            'level': 'ERROR',
            'class': 'logging.FileHandler',
            'filename': '/var/log/proximidad/django.log',
        },
    },
    'loggers': {
        'django': {
            'handlers': ['file'],
            'level': 'ERROR',
            'propagate': True,
        },
    },
}
```

---

## 📊 Checklist Final antes de GO LIVE

- [ ] ✅ Todos los tests pasados
- [ ] ✅ Backup de base de datos creado
- [ ] ✅ `DEBUG = False`
- [ ] ✅ `SECRET_KEY` cambiada
- [ ] ✅ `ALLOWED_HOSTS` configurado
- [ ] ✅ CORS configurado correctamente
- [ ] ✅ Archivos estáticos recolectados
- [ ] ✅ Build de frontend generado
- [ ] ✅ NGINX configurado
- [ ] ✅ Gunicorn corriendo
- [ ] ✅ Emails funcionando
- [ ] ✅ Permisos de archivos correctos
- [ ] ✅ Logs configurados
- [ ] ✅ Monitoreo activo
- [ ] ✅ Plan de rollback preparado

---

## 🔄 Plan de Rollback (si algo falla)

```powershell
# 1. Detener servicios
sudo systemctl stop proximidad
sudo systemctl stop nginx

# 2. Restaurar backup de BD
.\scripts\crear_backup.ps1  # Verificar que tienes backup reciente
# mysql -u root -p proxima < backup_YYYYMMDD_HHMMSS.sql

# 3. Volver a versión anterior (Git)
git checkout <commit-anterior>

# 4. Reiniciar servicios
sudo systemctl start nginx
sudo systemctl start proximidad
```

---

## 📞 Contactos de Soporte

- **Desarrollador**: AngelPalaciosN
- **Repositorio**: github.com/AngelPalaciosN/ProXimidad
- **Documentación API**: /API_ARCHITECTURE.md

---

## 🎉 ¡Listo para Producción!

Una vez completados todos los pasos:

1. ✅ Servidor corriendo en: `http://TU-IP:80` (NGINX) o `http://TU-DOMINIO.com`
2. ✅ API disponible en: `http://TU-IP:8000/api/`
3. ✅ Panel admin: `http://TU-IP:8000/admin/`

**Próximos pasos (V4)**:
- Implementar sistema de pagos con MercadoPago
- Agregar notificaciones push con WebSockets
- Implementar chat en tiempo real
- Dashboard de analytics avanzado
- App móvil con React Native

---

**Última actualización**: Diciembre 2, 2025  
**Versión**: ProXimidad V3.0  
**Estado**: ✅ LISTO PARA DEPLOY
