# 📋 Guía de Despliegue ProXimidad V3

> **Versión:** 3.0  
> **Fecha:** 2024  
> **Plataforma:** Raspberry Pi con Raspberry Pi OS  
> **Arquitectura:** Django (2 Apps) + React + Nginx + Gunicorn + MariaDB

---

## 📑 Tabla de Contenidos

1. [Requisitos Previos](#-requisitos-previos)
2. [Estructura del Deploy](#-estructura-del-deploy)
3. [Instalación Paso a Paso](#-instalación-paso-a-paso)
4. [Configuración de Servicios](#-configuración-de-servicios)
5. [Despliegue del Backend](#-despliegue-del-backend)
6. [Despliegue del Frontend](#-despliegue-del-frontend)
7. [Verificación](#-verificación)
8. [Mantenimiento](#-mantenimiento)
9. [Troubleshooting](#-troubleshooting)
10. [Rollback](#-rollback)

---

## 🔧 Requisitos Previos

### Software Necesario

```bash
# Sistema operativo
Raspberry Pi OS (Debian based)

# Dependencias del sistema
sudo apt update
sudo apt install -y \
    python3 \
    python3-pip \
    python3-venv \
    mariadb-server \
    nginx \
    git \
    curl \
    net-tools
```

### Servicios Requeridos

- **MariaDB/MySQL**: Base de datos
- **Nginx**: Servidor web
- **Gunicorn**: Servidor WSGI para Django
- **No-IP**: Cliente DNS dinámico (ya instalado en v2)

### Puertos Necesarios

- **80**: Nginx (HTTP)
- **8000**: Django App 1 (API Pública)
- **8001**: Django App 2 (API Privada)
- **3306**: MariaDB

---

## 📁 Estructura del Deploy

```
/home/proximidad/
├── backend/                          # Código Django V3
│   ├── core/                         # Configuración Django
│   ├── proximidad_app/               # App 1: API Pública
│   ├── proximidad_app2/              # App 2: API Privada
│   ├── media/                        # Archivos subidos
│   ├── staticfiles/                  # Archivos estáticos
│   ├── manage.py
│   └── requirements.txt
│
├── Desktop/
│   ├── start_server_v3.sh           # Script de inicio automático
│   └── restart_all.sh               # Script de reinicio
│
├── logs/                             # Logs del sistema
│   ├── startup_*.log
│   ├── app1_access.log
│   ├── app1_error.log
│   ├── app2_access.log
│   └── app2_error.log
│
├── backups/                          # Backups automáticos
│   ├── backend_backup_*.tar.gz
│   └── frontend_backup_*.tar.gz
│
└── noip/                             # Cliente No-IP DNS
    └── noip-duc

/var/www/proximidad/
└── frontend_build/                   # Build de React
    ├── index.html
    └── assets/

/etc/nginx/sites-available/
└── proximidad_v3.conf               # Configuración Nginx

/etc/systemd/system/
├── proximidad_app1.service          # Servicio Django App 1
└── proximidad_app2.service          # Servicio Django App 2

/home/proximidad/.config/autostart/
└── proximidad.desktop               # Auto-inicio en boot
```

---

## 🚀 Instalación Paso a Paso

### Paso 1: Preparar el Entorno

```bash
# Conectarse a la Raspberry Pi
ssh proximidad@192.168.1.50

# Crear directorios necesarios
sudo mkdir -p /home/proximidad/backups
sudo mkdir -p /home/proximidad/logs
sudo mkdir -p /var/www/proximidad
sudo chown -R proximidad:proximidad /home/proximidad
sudo chown -R www-data:www-data /var/www/proximidad
```

### Paso 2: Copiar Archivos del Proyecto

```bash
# Desde tu máquina local, copia el backend
scp -r proximidad-v3/backend/* proximidad@192.168.1.50:/home/proximidad/backend/

# Copia los archivos de deployment
scp -r proximidad-v3/deployment/* proximidad@192.168.1.50:/tmp/deployment/
```

### Paso 3: Instalar Dependencias de Python

```bash
cd /home/proximidad/backend

# Instalar dependencias
pip3 install --upgrade pip
pip3 install -r requirements.txt

# Verificar instalación de Gunicorn
which gunicorn  # Debe mostrar: /usr/local/bin/gunicorn
```

---

## ⚙️ Configuración de Servicios

### 1. Configurar Nginx

```bash
# Copiar configuración
sudo cp /tmp/deployment/nginx/proximidad_v3.conf /etc/nginx/sites-available/

# Crear symlink
sudo ln -s /etc/nginx/sites-available/proximidad_v3.conf /etc/nginx/sites-enabled/

# Desactivar configuración V2 (si existe)
sudo rm /etc/nginx/sites-enabled/proximidad

# Verificar configuración
sudo nginx -t

# Si hay errores, revisar el archivo
sudo nano /etc/nginx/sites-available/proximidad_v3.conf
```

### 2. Configurar Servicios Systemd

```bash
# Copiar archivos de servicio
sudo cp /tmp/deployment/systemd/proximidad_app1.service /etc/systemd/system/
sudo cp /tmp/deployment/systemd/proximidad_app2.service /etc/systemd/system/

# Recargar systemd
sudo systemctl daemon-reload

# Habilitar servicios para auto-inicio
sudo systemctl enable proximidad_app1
sudo systemctl enable proximidad_app2
```

### 3. Configurar Auto-Inicio

```bash
# Copiar script de inicio
sudo cp /tmp/deployment/scripts/start_server_v3.sh /home/proximidad/Desktop/
sudo chmod +x /home/proximidad/Desktop/start_server_v3.sh

# Configurar auto-inicio en boot
mkdir -p /home/proximidad/.config/autostart
cp /tmp/deployment/autostart/proximidad.desktop /home/proximidad/.config/autostart/
```

---

## 🗄️ Despliegue del Backend

### Opción A: Script Automático (Recomendado)

```bash
# Copiar script de deploy
sudo cp /tmp/deployment/scripts/deploy_backend.sh /home/proximidad/
sudo chmod +x /home/proximidad/deploy_backend.sh

# Ejecutar deploy
sudo bash /home/proximidad/deploy_backend.sh
```

### Opción B: Manual

```bash
cd /home/proximidad/backend

# 1. Migrar base de datos
python3 manage.py migrate --noinput

# 2. Recolectar archivos estáticos
python3 manage.py collectstatic --noinput

# 3. Crear directorios de media
mkdir -p media/servicios/imagenes
mkdir -p media/usuarios
chmod -R 755 media/

# 4. Crear directorio de logs
mkdir -p /home/proximidad/logs
chmod -R 755 /home/proximidad/logs

# 5. Iniciar servicios
sudo systemctl start proximidad_app1
sudo systemctl start proximidad_app2

# 6. Verificar estado
sudo systemctl status proximidad_app1
sudo systemctl status proximidad_app2
```

---

## 🎨 Despliegue del Frontend

### Paso 1: Compilar en Máquina Local

```powershell
# En Windows (tu máquina de desarrollo)
cd proximidad-v3

# Ejecutar script de build
.\scripts\build_frontend.ps1

# Resultado: dist.tar.gz en la raíz del proyecto
```

### Paso 2: Copiar a Raspberry Pi

```powershell
# Desde Windows
scp dist.tar.gz proximidad@192.168.1.50:/home/proximidad/
```

### Paso 3: Desplegar

```bash
# En Raspberry Pi
cd /home/proximidad

# Opción A: Script Automático
sudo bash /tmp/deployment/scripts/deploy_frontend.sh

# Opción B: Manual
sudo mkdir -p /var/www/proximidad/frontend_build
sudo tar -xzf dist.tar.gz -C /var/www/proximidad/frontend_build/
sudo chown -R www-data:www-data /var/www/proximidad/frontend_build
sudo systemctl restart nginx
```

---

## ✅ Verificación

### 1. Verificar Servicios

```bash
# Estado de todos los servicios
sudo systemctl status mariadb
sudo systemctl status proximidad_app1
sudo systemctl status proximidad_app2
sudo systemctl status nginx

# Verificar puertos
netstat -tuln | grep -E ':80|:8000|:8001|:3306'
```

### 2. Verificar APIs

```bash
# API Pública (App 1)
curl http://localhost:8000/api/servicios/
curl http://localhost:8000/api/categorias/

# API Privada (App 2)
curl -X POST http://localhost:8001/api/contacto/ \
  -H "Content-Type: application/json" \
  -d '{"nombre":"Test","email":"test@test.com","mensaje":"Test","tipo":"sugerencia"}'

# A través de Nginx
curl http://localhost/api/servicios/
curl http://localhost/health
```

### 3. Verificar Frontend

```bash
# Acceso local
curl -I http://localhost/

# Verificar archivos
ls -lh /var/www/proximidad/frontend_build/
```

### 4. Verificar Logs

```bash
# Logs de las aplicaciones
sudo tail -f /home/proximidad/logs/app1_error.log
sudo tail -f /home/proximidad/logs/app2_error.log

# Logs de systemd
sudo journalctl -u proximidad_app1 -f
sudo journalctl -u proximidad_app2 -f

# Logs de Nginx
sudo tail -f /var/log/nginx/proximidad_access.log
sudo tail -f /var/log/nginx/proximidad_error.log
```

---

## 🔄 Mantenimiento

### Reiniciar Servicios

```bash
# Reiniciar todo el sistema
sudo bash /home/proximidad/Desktop/start_server_v3.sh

# Reiniciar solo backend
sudo systemctl restart proximidad_app1
sudo systemctl restart proximidad_app2

# Reiniciar solo frontend
sudo systemctl restart nginx

# Reiniciar base de datos
sudo systemctl restart mariadb
```

### Actualizar Backend

```bash
# Detener servicios
sudo systemctl stop proximidad_app1
sudo systemctl stop proximidad_app2

# Actualizar código
cd /home/proximidad/backend
git pull  # o copiar archivos manualmente

# Instalar nuevas dependencias
pip3 install -r requirements.txt

# Migrar base de datos
python3 manage.py migrate

# Recolectar estáticos
python3 manage.py collectstatic --noinput

# Reiniciar servicios
sudo systemctl start proximidad_app1
sudo systemctl start proximidad_app2
```

### Actualizar Frontend

```bash
# Compilar nuevo build localmente
# Copiar dist.tar.gz a Raspberry
# Ejecutar script de deploy
sudo bash /home/proximidad/deploy_frontend.sh
```

### Crear Backups

```bash
# Backup manual del backend
cd /home/proximidad
tar -czf backups/backend_manual_$(date +%Y%m%d).tar.gz backend/

# Backup manual de la base de datos
mysqldump -u root -p proximidad_db > backups/db_backup_$(date +%Y%m%d).sql

# Backup manual del frontend
tar -czf backups/frontend_manual_$(date +%Y%m%d).tar.gz /var/www/proximidad/frontend_build/
```

---

## 🔍 Troubleshooting

### Problema: App no inicia

```bash
# Ver logs detallados
sudo journalctl -u proximidad_app1 -n 50
sudo journalctl -u proximidad_app2 -n 50

# Verificar archivo de servicio
sudo systemctl cat proximidad_app1

# Verificar que Gunicorn existe
which gunicorn

# Probar manualmente
cd /home/proximidad/backend
gunicorn --bind 127.0.0.1:8000 core.wsgi:application
```

### Problema: Error de base de datos

```bash
# Verificar que MariaDB está corriendo
sudo systemctl status mariadb

# Verificar conexión
mysql -u root -p

# Verificar permisos
SHOW GRANTS FOR 'proximidad_user'@'localhost';

# Verificar configuración Django
cd /home/proximidad/backend
python3 manage.py check --database default
```

### Problema: Nginx no sirve archivos

```bash
# Verificar configuración
sudo nginx -t

# Ver logs de error
sudo tail -f /var/log/nginx/error.log

# Verificar permisos
ls -la /var/www/proximidad/frontend_build/

# Verificar symlink
ls -la /etc/nginx/sites-enabled/
```

### Problema: API no responde

```bash
# Verificar puertos
netstat -tuln | grep 8000
netstat -tuln | grep 8001

# Verificar procesos
ps aux | grep gunicorn

# Test directo al backend
curl http://localhost:8000/api/servicios/
curl http://localhost:8001/api/contacto/

# Ver configuración de nginx
cat /etc/nginx/sites-available/proximidad_v3.conf
```

### Problema: Frontend muestra página en blanco

```bash
# Verificar que index.html existe
ls -la /var/www/proximidad/frontend_build/index.html

# Verificar carpeta assets
ls -la /var/www/proximidad/frontend_build/assets/

# Verificar consola del navegador (F12)
# Buscar errores de CORS o rutas incorrectas

# Verificar variable de entorno en build
cat /var/www/proximidad/frontend_build/assets/*.js | grep -i "api"
```

---

## ⏮️ Rollback

### Rollback del Backend

```bash
# Listar backups disponibles
ls -lh /home/proximidad/backups/backend_*

# Detener servicios
sudo systemctl stop proximidad_app1
sudo systemctl stop proximidad_app2

# Restaurar backup
cd /home/proximidad
tar -xzf backups/backend_backup_YYYYMMDD_HHMMSS.tar.gz

# Reiniciar servicios
sudo systemctl start proximidad_app1
sudo systemctl start proximidad_app2
```

### Rollback del Frontend

```bash
# Listar backups disponibles
ls -lh /home/proximidad/backups/frontend_*

# Detener nginx
sudo systemctl stop nginx

# Limpiar directorio actual
sudo rm -rf /var/www/proximidad/frontend_build/*

# Restaurar backup
sudo tar -xzf /home/proximidad/backups/frontend_backup_YYYYMMDD_HHMMSS.tar.gz \
    -C /var/www/proximidad/

# Reiniciar nginx
sudo systemctl start nginx
```

### Rollback de Base de Datos

```bash
# Restaurar desde SQL dump
mysql -u root -p proximidad_db < /home/proximidad/backups/db_backup_YYYYMMDD.sql
```

---

## 📊 Monitoreo

### Ver Estado en Tiempo Real

```bash
# CPU y memoria
htop

# Logs combinados
sudo tail -f \
    /home/proximidad/logs/app1_error.log \
    /home/proximidad/logs/app2_error.log \
    /var/log/nginx/proximidad_error.log

# Tráfico de red
sudo iftop

# Conexiones activas
watch -n 2 'netstat -tuln | grep -E ":80|:8000|:8001"'
```

### Métricas Importantes

```bash
# Espacio en disco
df -h

# Tamaño de logs
du -sh /home/proximidad/logs/*
du -sh /var/log/nginx/*

# Procesos de Gunicorn
ps aux | grep gunicorn | wc -l

# Conexiones a base de datos
mysql -u root -p -e "SHOW PROCESSLIST;"
```

---

## 📞 Información de Contacto

**DNS:** proximidad.serveirc.com  
**IP Local:** 192.168.1.50  
**IP Pública:** 181.135.64.177  

**Puertos:**
- HTTP: 80
- App 1: 8000
- App 2: 8001
- MySQL: 3306

**Rutas Importantes:**
- Backend: `/home/proximidad/backend`
- Frontend: `/var/www/proximidad/frontend_build`
- Logs: `/home/proximidad/logs`
- Backups: `/home/proximidad/backups`

---

## ✅ Checklist de Deploy

### Pre-Deploy
- [ ] Backup de V2 creado
- [ ] Base de datos respaldada
- [ ] Código V3 compilado y testeado
- [ ] Variables de entorno configuradas
- [ ] DNS No-IP funcionando

### Deploy Backend
- [ ] Dependencias instaladas
- [ ] Migraciones ejecutadas
- [ ] Archivos estáticos recolectados
- [ ] Permisos configurados
- [ ] Servicios systemd creados
- [ ] App 1 iniciada y respondiendo
- [ ] App 2 iniciada y respondiendo

### Deploy Frontend
- [ ] Build generado sin errores
- [ ] Archivos copiados a Raspberry
- [ ] Extraídos en ubicación correcta
- [ ] Permisos configurados
- [ ] Nginx configurado
- [ ] Frontend accesible

### Post-Deploy
- [ ] Todas las APIs responden
- [ ] Frontend carga correctamente
- [ ] Emails funcionan
- [ ] Subida de imágenes funciona
- [ ] Auto-inicio configurado
- [ ] Logs rotando correctamente
- [ ] Monitoreo activo

---

## 🎉 ¡Despliegue Exitoso!

Si llegaste hasta aquí y todas las verificaciones pasaron, ¡felicitaciones! 🚀

Tu aplicación ProXimidad V3 está corriendo en producción.

**Próximos pasos:**
1. Monitorear logs durante las primeras 24 horas
2. Verificar que los emails llegan correctamente
3. Probar flujo completo de usuarios
4. Configurar backups automáticos
5. Documentar cualquier problema encontrado

---

**Última actualización:** Enero 2024  
**Versión del documento:** 1.0
