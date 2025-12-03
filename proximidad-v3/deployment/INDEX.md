# 📦 Sistema Completo de Deployment ProXimidad V3

## 🎯 Visión General

Este sistema de deployment está diseñado para facilitar el despliegue de ProXimidad V3 en Raspberry Pi, manteniendo la estabilidad de la versión 2 mientras soporta la nueva arquitectura de 2 aplicaciones Django.

---

## 📁 Estructura Completa

```
proximidad-v3/
│
├── deployment/                              # 🚀 SISTEMA DE DEPLOYMENT
│   │
│   ├── nginx/                               # Configuración Nginx
│   │   └── proximidad_v3.conf              # Config con routing a 2 backends
│   │
│   ├── systemd/                             # Servicios del Sistema
│   │   ├── proximidad_app1.service         # Gunicorn App1 (puerto 8000)
│   │   └── proximidad_app2.service         # Gunicorn App2 (puerto 8001)
│   │
│   ├── scripts/                             # Scripts de Automatización
│   │   ├── deploy_backend.sh               # Deploy automático del backend
│   │   ├── deploy_frontend.sh              # Deploy automático del frontend
│   │   ├── start_server_v3.sh              # Inicio completo del servidor
│   │   ├── rollback_to_v2.sh               # Rollback a versión 2
│   │   └── verify_v3_deployment.sh         # Verificación post-deploy
│   │
│   ├── autostart/                           # Auto-inicio del Sistema
│   │   └── proximidad.desktop              # Desktop entry para auto-start
│   │
│   ├── .env.example                         # Template de variables de entorno
│   ├── README_DEPLOY.md                     # Documentación completa
│   ├── QUICK_START.md                       # Guía rápida de deployment
│   └── INDEX.md                             # Este archivo
│
├── scripts/                                 # Scripts de Build (Local)
│   └── build_frontend.ps1                  # Build de frontend en Windows
│
├── backend/                                 # Código Backend Django
│   ├── core/                               # Configuración Django
│   ├── proximidad_app/                     # App 1: API Pública
│   ├── proximidad_app2/                    # App 2: API Privada
│   └── requirements.txt                    # Dependencias Python
│
└── frontend/                                # Código Frontend React
    ├── src/                                # Código fuente
    └── dist/                               # Build de producción (generado)
```

---

## 🎯 Arquitectura del Sistema

### Backend (2 Aplicaciones Django)

```
┌─────────────────────────────────────────┐
│          NGINX (Puerto 80)               │
│                                          │
│  Routing basado en endpoints:           │
│  /api/servicios/     → App 1             │
│  /api/categorias/    → App 1             │
│  /api/usuarios/      → App 1             │
│  /api/comentarios/   → App 1             │
│  /api/favoritos/     → App 1             │
│                                          │
│  /api/solicitudes/   → App 2             │
│  /api/proveedor/     → App 2             │
│  /api/contacto/      → App 2             │
│  /api/newsletters/   → App 2             │
└─────────────────────────────────────────┘
            │                   │
            ▼                   ▼
    ┌───────────────┐   ┌───────────────┐
    │  App 1        │   │  App 2        │
    │  Puerto 8000  │   │  Puerto 8001  │
    │  (Gunicorn)   │   │  (Gunicorn)   │
    └───────────────┘   └───────────────┘
            │                   │
            └───────┬───────────┘
                    ▼
            ┌───────────────┐
            │   MariaDB     │
            │  Puerto 3306  │
            └───────────────┘
```

### Frontend (React SPA)

```
Frontend Build (dist/)
        │
        ▼
/var/www/proximidad/frontend_build/
        │
        ▼
    Nginx sirve archivos estáticos
    con fallback a index.html
```

---

## 📋 Archivos y su Propósito

### 1. Configuración Nginx (`nginx/proximidad_v3.conf`)

**Propósito:** Configurar el servidor web para:
- Servir frontend en `/`
- Rutear APIs a backends correctos
- Servir archivos estáticos y media
- Manejar CORS y seguridad

**Características:**
- 2 upstreams: `proximidad_app1` y `proximidad_app2`
- Routing inteligente basado en URL patterns
- Cache headers para optimización
- Health check endpoint

### 2. Servicios Systemd

#### `proximidad_app1.service`
**Propósito:** Gestionar App 1 (API Pública)
- Auto-inicio en boot
- Auto-reinicio en caso de fallo
- Logging a journald y archivos

#### `proximidad_app2.service`
**Propósito:** Gestionar App 2 (API Privada)
- Configuración idéntica a App 1
- Puerto diferente (8001)

### 3. Scripts de Deployment

#### `deploy_backend.sh`
**Propósito:** Deploy completo del backend
**Funciones:**
1. Crea backup automático
2. Detiene servicios
3. Instala dependencias
4. Ejecuta migraciones
5. Recolecta archivos estáticos
6. Configura permisos
7. Inicia servicios
8. Verifica deployment

**Uso:**
```bash
sudo bash deploy_backend.sh
```

#### `deploy_frontend.sh`
**Propósito:** Deploy del frontend compilado
**Funciones:**
1. Verifica archivo dist.tar.gz
2. Crea backup del frontend actual
3. Detiene Nginx
4. Extrae nuevo build
5. Configura permisos
6. Inicia Nginx
7. Verifica acceso

**Uso:**
```bash
sudo bash deploy_frontend.sh
```

#### `start_server_v3.sh`
**Propósito:** Inicio completo del sistema
**Funciones:**
1. Configura No-IP DNS
2. Inicia MariaDB
3. Inicia ambas Apps Django
4. Inicia Nginx
5. Habilita auto-inicio
6. Verifica conectividad
7. Muestra resumen de estado

**Uso:**
```bash
sudo bash /home/proximidad/Desktop/start_server_v3.sh
```

#### `rollback_to_v2.sh`
**Propósito:** Revertir a versión 2 en caso de problemas
**Funciones:**
1. Detiene servicios V3
2. Busca backups más recientes
3. Guarda V3 actual
4. Restaura backend V2
5. Restaura frontend V2
6. Restaura configuración Nginx V2
7. Inicia servicios V2
8. Verifica funcionamiento

**Uso:**
```bash
sudo bash rollback_to_v2.sh
```

#### `verify_v3_deployment.sh`
**Propósito:** Verificación completa post-deploy
**Verifica:**
- ✅ Estructura de archivos
- ✅ Servicios systemd
- ✅ Puertos abiertos
- ✅ Configuración Nginx
- ✅ Conectividad APIs
- ✅ Frontend accesible
- ✅ Archivos estáticos
- ✅ Base de datos
- ✅ Logs
- ✅ Permisos
- ✅ Conectividad externa

**Uso:**
```bash
bash verify_v3_deployment.sh
```

### 4. Build Script

#### `build_frontend.ps1`
**Propósito:** Compilar frontend en Windows
**Funciones:**
1. Verifica Node.js
2. Instala dependencias
3. Limpia build anterior
4. Genera build de producción
5. Calcula estadísticas
6. Crea tarball comprimido

**Uso:**
```powershell
.\scripts\build_frontend.ps1
```

### 5. Auto-inicio

#### `proximidad.desktop`
**Propósito:** Iniciar servidor automáticamente al boot
**Ubicación:** `~/.config/autostart/`
**Ejecuta:** `start_server_v3.sh`

---

## 🚀 Flujo de Deployment

### Desarrollo Local → Producción

```
1. DESARROLLO (Windows)
   ├─ Codificar features
   ├─ Probar localmente
   └─ Commit a Git
          │
          ▼
2. BUILD (Windows)
   ├─ .\scripts\build_frontend.ps1
   └─ Genera: dist.tar.gz
          │
          ▼
3. TRANSFERENCIA
   ├─ SCP backend/ → Raspberry
   ├─ SCP dist.tar.gz → Raspberry
   └─ SCP deployment/ → Raspberry
          │
          ▼
4. CONFIGURACIÓN (Raspberry)
   ├─ Copiar configs de deployment/
   ├─ Configurar Nginx
   ├─ Configurar Systemd
   └─ Configurar auto-inicio
          │
          ▼
5. DEPLOY BACKEND (Raspberry)
   ├─ bash deploy_backend.sh
   ├─ Migrar BD
   ├─ Collectstatic
   └─ Iniciar servicios
          │
          ▼
6. DEPLOY FRONTEND (Raspberry)
   ├─ bash deploy_frontend.sh
   ├─ Extraer build
   └─ Iniciar Nginx
          │
          ▼
7. VERIFICACIÓN
   ├─ bash verify_v3_deployment.sh
   ├─ Test APIs
   ├─ Test Frontend
   └─ Monitorear logs
```

---

## 🔒 Seguridad y Backups

### Backups Automáticos

Cada deployment crea backups automáticos:

```
/home/proximidad/backups/
├── backend_backup_20240115_143022.tar.gz
├── frontend_backup_20240115_143022.tar.gz
├── backend_v3_before_rollback_20240115_150000.tar.gz
└── frontend_v3_before_rollback_20240115_150000.tar.gz
```

### Estrategia de Rollback

1. **Automático:** `rollback_to_v2.sh` restaura última versión estable
2. **Manual:** Extrae backups específicos
3. **BD:** Restaurar desde dumps SQL

---

## 📊 Monitoreo y Logs

### Ubicación de Logs

```
/home/proximidad/logs/
├── startup_YYYYMMDD_HHMMSS.log      # Logs de inicio
├── app1_access.log                   # Accesos a App 1
├── app1_error.log                    # Errores de App 1
├── app2_access.log                   # Accesos a App 2
└── app2_error.log                    # Errores de App 2

/var/log/nginx/
├── proximidad_access.log             # Accesos a Nginx
└── proximidad_error.log              # Errores de Nginx

Systemd Journal:
├── sudo journalctl -u proximidad_app1 -f
└── sudo journalctl -u proximidad_app2 -f
```

### Comandos de Monitoreo

```bash
# Ver todos los logs en tiempo real
sudo tail -f /home/proximidad/logs/*.log /var/log/nginx/proximidad_*.log

# Estado de servicios
sudo systemctl status proximidad_app1 proximidad_app2 nginx mariadb

# Puertos activos
netstat -tuln | grep -E ':80|:8000|:8001|:3306'

# Procesos de Gunicorn
ps aux | grep gunicorn
```

---

## ✅ Checklist de Deployment

### Pre-Deploy
- [ ] Backup de V2 existe
- [ ] BD respaldada
- [ ] Código testeado localmente
- [ ] `.env` configurado
- [ ] DNS funcionando

### Deploy
- [ ] Frontend compilado sin errores
- [ ] Archivos copiados a Raspberry
- [ ] Configs de Nginx/Systemd instalados
- [ ] Backend migrado
- [ ] Frontend extraído
- [ ] Servicios iniciados

### Post-Deploy
- [ ] Verificación completa pasada (>90%)
- [ ] APIs responden correctamente
- [ ] Frontend carga sin errores
- [ ] Emails funcionan
- [ ] Auto-inicio configurado
- [ ] Monitoreo activo

---

## 🆘 Troubleshooting Rápido

### Problema: App no inicia
```bash
sudo journalctl -u proximidad_app1 -n 50
```

### Problema: API no responde
```bash
curl http://localhost:8000/api/servicios/
netstat -tuln | grep 8000
```

### Problema: Frontend en blanco
```bash
ls -la /var/www/proximidad/frontend_build/
sudo tail -f /var/log/nginx/error.log
```

### Problema: BD no conecta
```bash
sudo systemctl status mariadb
mysql -u root -p -e "SHOW DATABASES;"
```

---

## 📚 Documentación Completa

- **[README_DEPLOY.md](README_DEPLOY.md)** - Documentación exhaustiva (600+ líneas)
- **[QUICK_START.md](QUICK_START.md)** - Guía rápida de deployment
- **[.env.example](.env.example)** - Template de configuración

---

## 🎯 Características Principales

✅ **Deployment en un comando:** Scripts automatizados  
✅ **Backups automáticos:** Antes de cada deployment  
✅ **Rollback seguro:** Vuelta a V2 en segundos  
✅ **Verificación completa:** 50+ checks automáticos  
✅ **Auto-inicio:** Sistema arranca automáticamente  
✅ **Logs centralizados:** Fácil debugging  
✅ **Zero-downtime:** Nginx sirve mientras backend reinicia  

---

## 🔄 Mantenimiento

### Actualizar Backend
```bash
# 1. Detener servicios
sudo systemctl stop proximidad_app1 proximidad_app2

# 2. Actualizar código
cd /home/proximidad/backend
# Copiar nuevos archivos

# 3. Migrar y reiniciar
python3 manage.py migrate
sudo systemctl start proximidad_app1 proximidad_app2
```

### Actualizar Frontend
```bash
# 1. Compilar localmente
.\scripts\build_frontend.ps1

# 2. Copiar a Raspberry
scp dist.tar.gz proximidad@192.168.1.50:/home/proximidad/

# 3. Deploy
sudo bash deploy_frontend.sh
```

---

## 📞 Información del Sistema

**Hardware:** Raspberry Pi  
**OS:** Raspberry Pi OS (Debian based)  
**Web Server:** Nginx  
**App Server:** Gunicorn (2 instancias)  
**Database:** MariaDB  
**DNS:** No-IP (proximidad.serveirc.com)  

**Puertos:**
- 80: HTTP (Nginx)
- 8000: Django App 1
- 8001: Django App 2
- 3306: MariaDB

**IPs:**
- Local: 192.168.1.50
- Pública: 181.135.64.177
- DNS: proximidad.serveirc.com

---

## 🎉 Conclusión

Este sistema de deployment está diseñado para ser:
- **Robusto:** Backups automáticos y rollback
- **Fácil:** Scripts automatizados
- **Confiable:** Verificación completa
- **Mantenible:** Logs centralizados
- **Documentado:** Guías completas

¡Todo listo para desplegar ProXimidad V3! 🚀

---

**Última actualización:** Enero 2024  
**Versión:** 3.0  
**Autor:** Sistema de Deployment ProXimidad
