# 🚀 Guía Completa de Despliegue - ProXimidad V3

![ProXimidad Logo](https://via.placeholder.com/200x80?text=ProXimidad)

**Sistema de Servicios Locales con Geolocalización**

*Desplegado en Raspberry Pi 3 con acceso público a través de IP dinámica*

[![Made with React](https://img.shields.io/badge/Frontend-React%20+%20Vite-61DAFB?style=for-the-badge&logo=react)](https://reactjs.org/)
[![Made with Django](https://img.shields.io/badge/Backend-Django%20REST-092E20?style=for-the-badge&logo=django)](https://www.djangoproject.com/)
[![Deployed on Raspberry Pi](https://img.shields.io/badge/Server-Raspberry%20Pi%203-C51A4A?style=for-the-badge&logo=raspberry-pi)](https://www.raspberrypi.org/)

---

## 📋 Tabla de Contenidos

1. [Introducción](#-introducción)
2. [Arquitectura del Sistema](#-arquitectura-del-sistema)
3. [Requisitos Previos](#-requisitos-previos)
4. [Configuración del Router - Port Forwarding](#-configuración-del-router---port-forwarding)
5. [Configuración de DNS Dinámico (No-IP)](#-configuración-de-dns-dinámico-no-ip)
6. [Despliegue del Frontend con Vite + Nginx](#-despliegue-del-frontend-con-vite--nginx)
7. [Despliegue del Backend con Gunicorn](#-despliegue-del-backend-con-gunicorn)
8. [Configuración de Servicios Systemd](#-configuración-de-servicios-systemd)
9. [Herramientas de Desarrollo y Mantenimiento](#-herramientas-de-desarrollo-y-mantenimiento)
10. [Ejecutables de Escritorio para Administración](#-ejecutables-de-escritorio-para-administración)
11. [Troubleshooting y Lecciones Aprendidas](#-troubleshooting-y-lecciones-aprendidas)
12. [Comandos Útiles](#-comandos-útiles)
13. [¿Por qué HTTP y no HTTPS?](#-por-qué-http-y-no-https)
14. [Conclusiones](#-conclusiones)

---

## 🎯 Introducción

Este documento detalla el proceso completo de despliegue de **ProXimidad V3**, una aplicación web full-stack que conecta usuarios con proveedores de servicios locales.

### ¿Por qué este despliegue es especial?

- **🏠 Self-hosted**: Toda la infraestructura corre en una Raspberry Pi 3 Model B v1.3 en casa
- **🌐 Acceso público**: Disponible desde cualquier lugar del mundo vía HTTP
- **💰 Costo cero**: Sin gastos mensuales de hosting en la nube
- **📚 Educativo**: Aprendizaje profundo de redes, servidores y DevOps

### Stack Tecnológico

| Componente | Tecnología | Propósito |
|------------|------------|-----------|
| **Frontend** | React 18 + Vite | Interfaz de usuario moderna y rápida |
| **Backend API 1** | Django REST Framework | API pública (autenticación, servicios, usuarios) |
| **Backend API 2** | Django REST Framework | API privada (solicitudes, proveedores) |
| **Servidor Web** | Nginx | Reverse proxy, archivos estáticos |
| **App Server** | Gunicorn | Servidor WSGI para Django |
| **Base de Datos** | MariaDB 10.11 | Almacenamiento de datos |
| **Hardware** | Raspberry Pi 3 Model B v1.3 | Servidor físico |

---

## 🏗 Arquitectura del Sistema

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                                   INTERNET                                   │
│                                      │                                       │
│                        [IP Pública Dinámica]                                │
│                          181.135.xxx.xxx                                     │
│                                      │                                       │
│                         ┌────────────▼────────────┐                         │
│                         │   Router CGA2121        │                         │
│                         │   (Tigo/UNE)            │                         │
│                         │   Port Forwarding       │                         │
│                         │   80 → 192.168.1.50:80  │                         │
│                         └────────────┬────────────┘                         │
│                                      │                                       │
│                        [Red Local 192.168.1.0/24]                           │
│                                      │                                       │
├──────────────────────────────────────┼───────────────────────────────────────┤
│              RASPBERRY PI 3 MODEL B v1.3 (192.168.1.50)                     │
│                                      │                                       │
│                         ┌────────────▼────────────┐                         │
│                         │        NGINX            │                         │
│                         │      (Puerto 80)        │                         │
│                         └────────────┬────────────┘                         │
│                                      │                                       │
│                   ┌──────────────────┼──────────────────┐                   │
│                   │                  │                  │                   │
│                   ▼                  ▼                  ▼                   │
│          ┌─────────────┐    ┌─────────────┐    ┌─────────────┐            │
│          │  Frontend   │    │  Gunicorn   │    │  Gunicorn   │            │
│          │ (Estático)  │    │   App 1     │    │   App 2     │            │
│          │  /var/www/  │    │  :8000 API  │    │  :8001 API  │            │
│          │ proximidad  │    │   Pública   │    │   Privada   │            │
│          └─────────────┘    └──────┬──────┘    └──────┬──────┘            │
│                                    │                   │                    │
│                                    └─────────┬─────────┘                    │
│                                              │                              │
│                                   ┌──────────▼──────────┐                   │
│                                   │      MARIADB        │                   │
│                                   │    (Puerto 3306)    │                   │
│                                   └─────────────────────┘                   │
│                                                                              │
└──────────────────────────────────────────────────────────────────────────────┘
```

### Flujo de una Solicitud HTTP

1. **Usuario** accede a `http://181.135.64.177` o al dominio No-IP
2. **Router** recibe la petición y hace port forwarding al puerto 80 de la Raspberry
3. **Nginx** recibe la petición y decide:
   - Si es `/api/` → Proxy a Gunicorn (backend)
   - Si es `/media/` → Sirve archivos estáticos
   - Si es cualquier otra cosa → Sirve el frontend (React)
4. **Gunicorn** procesa la lógica de Django y consulta MariaDB
5. **Nginx** devuelve la respuesta al usuario

---

## 📦 Requisitos Previos

### Hardware

| Componente | Especificación |
|------------|----------------|
| Raspberry Pi | Modelo 3 Model B v1.3 (1GB RAM, Quad-core 1.2GHz) |
| Almacenamiento | MicroSD 16GB+ |
| Alimentación | Fuente USB-B 5V 2.5A (recomendado fuente de calidad) |
| Red | Cable Ethernet (recomendado) o WiFi |
| Router | Con soporte para Port Forwarding e IP pública |

### Software en Raspberry Pi

```bash
# Sistema operativo
Raspberry Pi OS (64-bit) Lite o Desktop

# Paquetes necesarios
sudo apt update && sudo apt install -y \
  python3 python3-pip python3-venv \
  mariadb-server mariadb-client \
  nginx \
  git \
  curl \
  htop \
  net-tools
```

### Acceso desde PC de Desarrollo

- **WinSCP**: Para transferir archivos gráficamente
- **Terminal SSH**: Para comandos remotos  
- **Node.js + npm**: Para compilar el frontend

---

## 🌐 Configuración del Router - Port Forwarding

### ¿Qué es Port Forwarding?

El **Port Forwarding** (reenvío de puertos) permite que las peticiones que llegan a tu IP pública sean redirigidas a un dispositivo específico dentro de tu red local.

```
Sin Port Forwarding:
Internet → Router → ❌ (No sabe a dónde enviar)

Con Port Forwarding:
Internet → Router → Puerto 80 → 192.168.1.50:80 ✅
```

### Router CGA2121 (Tigo/UNE Colombia)

Este router es proporcionado por el operador **Tigo** y tiene una característica especial: **IP pública directa** en lugar de CG-NAT, lo cual es fundamental para poder hacer port forwarding.

> ⚠️ **Nota importante**: Muchos operadores en Latinoamérica usan CG-NAT (Carrier-Grade NAT), lo que impide hacer port forwarding. Contacta a tu operador para solicitar una IP pública si es necesario.

### Pasos de Configuración

1. **Acceder al router**
   ```
   URL: http://192.168.1.1 (o la gateway de tu red)
   Usuario: admin
   Contraseña: (la de tu router o la que viene en la etiqueta)
   ```

2. **Buscar la sección de Port Forwarding**
   - Generalmente en: `Advanced` → `NAT` → `Port Forwarding`
   - O en: `Firewall` → `Port Forwarding`

3. **Crear reglas de reenvío**

   | Nombre | Puerto Externo | IP Interna | Puerto Interno | Protocolo |
   |--------|---------------|------------|----------------|-----------|
   | HTTP | 80 | 192.168.1.50 | 80 | TCP |
   | SSH (opcional) | 22 | 192.168.1.50 | 22 | TCP |

4. **Asignar IP estática a la Raspberry Pi**

   Para evitar que la IP de la Raspberry cambie:

   **Opción A: Desde el router (DHCP Reservation)**
   - Busca la sección DHCP
   - Agrega una reservación para la MAC de la Raspberry
   - Asigna siempre 192.168.1.50

   **Opción B: Desde la Raspberry Pi**
   ```bash
   sudo nano /etc/dhcpcd.conf
   ```
   
   Agregar al final:
   ```
   interface eth0
   static ip_address=192.168.1.50/24
   static routers=192.168.1.1
   static domain_name_servers=8.8.8.8 8.8.4.4
   ```

5. **Verificar configuración**

   Desde tu celular (con datos móviles, no WiFi):
   ```
   http://[TU_IP_PUBLICA]
   ```
   
   Para conocer tu IP pública:
   ```bash
   curl ifconfig.me
   ```

---

## 🔄 Configuración de DNS Dinámico (No-IP)

### El Problema: IP Dinámica

La mayoría de conexiones residenciales tienen **IP dinámica**, lo que significa que tu IP pública puede cambiar cada cierto tiempo (reinicio del router, cada 24 horas, etc.).

### La Solución: DNS Dinámico

Servicios como **No-IP** proporcionan un dominio gratuito (ej: `proximidad.ddns.net`) que siempre apunta a tu IP actual, aunque esta cambie.

### Configuración de No-IP

1. **Crear cuenta en No-IP**
   - Ir a [noip.com](https://www.noip.com)
   - Registrarse con email
   - Crear un hostname gratuito (ej: `proximidad.ddns.net`)

2. **Instalar cliente DUC en Raspberry Pi**

   ```bash
   # Descargar el cliente
   cd /usr/local/src
   sudo wget https://www.noip.com/client/linux/noip-duc-linux.tar.gz
   sudo tar xzf noip-duc-linux.tar.gz
   cd noip-2.1.9-1
   
   # Compilar e instalar
   sudo make
   sudo make install
   
   # Configurar (te pedirá usuario y contraseña de No-IP)
   sudo /usr/local/bin/noip2 -C
   
   # Iniciar el servicio
   sudo /usr/local/bin/noip2
   ```

3. **Configurar inicio automático**

   ```bash
   sudo nano /etc/systemd/system/noip2.service
   ```
   
   Contenido:
   ```ini
   [Unit]
   Description=No-IP Dynamic DNS Update Client
   After=network.target
   
   [Service]
   Type=forking
   ExecStart=/usr/local/bin/noip2
   Restart=always
   
   [Install]
   WantedBy=multi-user.target
   ```
   
   Activar:
   ```bash
   sudo systemctl enable noip2
   sudo systemctl start noip2
   ```

4. **Verificar funcionamiento**

   ```bash
   # Ver si está actualizando
   sudo noip2 -S
   
   # Probar resolución DNS
   nslookup tudominio.ddns.net
   ```

---

## 🎨 Despliegue del Frontend con Vite + Nginx

### ¿Qué es Vite?

**Vite** es un build tool moderno para aplicaciones web que ofrece:
- ⚡ **Hot Module Replacement (HMR)** ultra-rápido en desarrollo
- 📦 **Build optimizado** con Rollup para producción
- 🔧 **Configuración mínima** out-of-the-box
- 🚀 **Tiempos de compilación** muy rápidos

### ¿Qué es Nginx?

**Nginx** (pronunciado "engine-x") es un servidor web de alto rendimiento que usamos para:
1. **Servir archivos estáticos** (HTML, CSS, JS del frontend)
2. **Reverse Proxy** (redirigir peticiones `/api/` al backend)
3. **Load Balancing** (distribuir carga entre múltiples backends)

### Compilación del Frontend

El frontend se compila en tu PC de desarrollo y luego se transfiere a la Raspberry Pi.

**Paso 1: Configurar variables de entorno**

```bash
# frontend/.env.production
VITE_API_URL=http://181.135.64.177
VITE_ENVIRONMENT=production
```

**Paso 2: Compilar**

```powershell
# En Windows (PowerShell)
cd proximidad-v3\frontend
npm install
npm run build
```

Esto genera la carpeta `dist/` con todos los archivos optimizados:
```
dist/
├── index.html
├── assets/
│   ├── index-[hash].js    # JavaScript bundleado y minificado
│   ├── index-[hash].css   # CSS bundleado y minificado
│   └── vendor-[hash].js   # Dependencias de terceros
└── favicon.ico
```

**Paso 3: Crear archivo comprimido**

```powershell
# Comprimir para transferir
cd dist
tar -czvf ../dist.tar.gz *
```

**Paso 4: Transferir a Raspberry Pi**

```powershell
scp dist.tar.gz proximidad@192.168.1.50:/tmp/
```

**Paso 5: Desplegar en Raspberry Pi**

```bash
ssh proximidad@192.168.1.50

# Limpiar y extraer
sudo rm -rf /var/www/proximidad/frontend_build/*
sudo tar -xzf /tmp/dist.tar.gz -C /var/www/proximidad/frontend_build/
sudo chown -R www-data:www-data /var/www/proximidad/frontend_build/

# Reiniciar Nginx
sudo systemctl restart nginx
```

### Configuración de Nginx

```nginx
# /etc/nginx/sites-available/proximidad
server {
    listen 80;
    server_name 181.135.64.177 proximidad.ddns.net;
    
    # Tamaño máximo de subida (para imágenes)
    client_max_body_size 10M;
    
    # Frontend - Archivos estáticos de React/Vite
    root /var/www/proximidad/frontend_build;
    index index.html;
    
    # SPA: Todas las rutas que no existan van a index.html
    location / {
        try_files $uri $uri/ /index.html;
    }
    
    # API Pública (App 1) - Autenticación, Servicios, Usuarios
    location /api/ {
        proxy_pass http://127.0.0.1:8000;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    # API Privada (App 2) - Solicitudes, Proveedores
    location /api/solicitudes/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
    
    location /api/proveedor/ {
        proxy_pass http://127.0.0.1:8001;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
    }
    
    # Archivos multimedia subidos por usuarios
    location /media/ {
        alias /home/proximidad/backend/media/;
        expires 30d;
        add_header Cache-Control "public, immutable";
    }
    
    # Archivos estáticos de Django Admin
    location /static/ {
        alias /home/proximidad/backend/staticfiles/;
        expires 30d;
    }
    
    # Logs
    access_log /var/log/nginx/proximidad_access.log;
    error_log /var/log/nginx/proximidad_error.log;
}
```

---

## 🐍 Despliegue del Backend con Gunicorn

### ¿Qué es Gunicorn?

**Gunicorn** (Green Unicorn) es un servidor HTTP WSGI para Python. Es el puente entre Nginx y Django:
- **Nginx** maneja las conexiones HTTP, archivos estáticos
- **Gunicorn** ejecuta el código Python de Django
- **Django** procesa la lógica de negocio y consulta MariaDB

### Configuración de MariaDB

```bash
# Instalar MariaDB
sudo apt install mariadb-server mariadb-client

# Configuración segura
sudo mysql_secure_installation

# Crear base de datos y usuario
sudo mysql -u root -p
```

```sql
CREATE DATABASE proximidad_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
CREATE USER 'proximidad'@'localhost' IDENTIFIED BY 'tu_contraseña_segura';
GRANT ALL PRIVILEGES ON proximidad_db.* TO 'proximidad'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

### Configuración de Django para MariaDB

```python
# backend/core/settings.py
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.mysql',
        'NAME': 'proximidad_db',
        'USER': 'proximidad',
        'PASSWORD': os.environ.get('DB_PASSWORD'),
        'HOST': 'localhost',
        'PORT': '3306',
        'OPTIONS': {
            'charset': 'utf8mb4',
            'init_command': "SET sql_mode='STRICT_TRANS_TABLES'",
        }
    }
}
```

### Instalación de dependencias MySQL

```bash
cd ~/backend
source venv/bin/activate
pip install mysqlclient
pip install gunicorn
```

### Arquitectura de Doble API

ProXimidad V3 usa dos aplicaciones Django separadas por seguridad:

| App | Puerto | Propósito | Endpoints |
|-----|--------|-----------|-----------|
| **App 1** | 8000 | API Pública | `/api/auth/`, `/api/servicios/`, `/api/usuarios/` |
| **App 2** | 8001 | API Privada | `/api/solicitudes/`, `/api/proveedor/` |

### Comandos de Gunicorn

```bash
# Iniciar App 1 (API Pública)
gunicorn \
  --name proximidad_app1 \
  --workers 2 \
  --bind 127.0.0.1:8000 \
  --timeout 60 \
  --access-logfile /home/proximidad/logs/app1_access.log \
  --error-logfile /home/proximidad/logs/app1_error.log \
  core.wsgi_app1:application

# Iniciar App 2 (API Privada)
gunicorn \
  --name proximidad_app2 \
  --workers 2 \
  --bind 127.0.0.1:8001 \
  --timeout 60 \
  --access-logfile /home/proximidad/logs/app2_access.log \
  --error-logfile /home/proximidad/logs/app2_error.log \
  core.wsgi_app2:application
```

> **Nota**: Para Raspberry Pi 3 con 1GB RAM, usamos solo 2 workers en lugar de 3 para evitar problemas de memoria.

---

## ⚙️ Configuración de Servicios Systemd

### ¿Qué es Systemd?

**Systemd** es el sistema de inicio de Linux que gestiona servicios. Usamos systemd para:
- 🚀 Iniciar Gunicorn automáticamente al encender
- 🔄 Reiniciar automáticamente si falla
- 📊 Ver logs con `journalctl`
- 🎛️ Controlar servicios con `systemctl`

### Servicio para App 1

**`/etc/systemd/system/proximidad_app1.service`**

```ini
[Unit]
Description=ProXimidad Django App 1 - Public API (Gunicorn)
After=network.target mariadb.service
Wants=mariadb.service

[Service]
User=proximidad
Group=www-data
WorkingDirectory=/home/proximidad/backend
Environment="PATH=/home/proximidad/backend/venv/bin"
EnvironmentFile=/home/proximidad/backend/.env
ExecStart=/home/proximidad/backend/venv/bin/gunicorn \
  --name proximidad_app1 \
  --workers 2 \
  --worker-class sync \
  --bind 127.0.0.1:8000 \
  --timeout 60 \
  --max-requests 1000 \
  --max-requests-jitter 50 \
  --access-logfile /home/proximidad/logs/app1_access.log \
  --error-logfile /home/proximidad/logs/app1_error.log \
  --log-level info \
  --capture-output \
  --enable-stdio-inheritance \
  core.wsgi_app1:application

Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### Servicio para App 2

**`/etc/systemd/system/proximidad_app2.service`**

```ini
[Unit]
Description=ProXimidad Django App 2 - Private API (Gunicorn)
After=network.target mariadb.service
Wants=mariadb.service

[Service]
User=proximidad
Group=www-data
WorkingDirectory=/home/proximidad/backend
Environment="PATH=/home/proximidad/backend/venv/bin"
EnvironmentFile=/home/proximidad/backend/.env
ExecStart=/home/proximidad/backend/venv/bin/gunicorn \
  --name proximidad_app2 \
  --workers 2 \
  --worker-class sync \
  --bind 127.0.0.1:8001 \
  --timeout 60 \
  --max-requests 1000 \
  --max-requests-jitter 50 \
  --access-logfile /home/proximidad/logs/app2_access.log \
  --error-logfile /home/proximidad/logs/app2_error.log \
  --log-level info \
  --capture-output \
  --enable-stdio-inheritance \
  core.wsgi_app2:application

Restart=always
RestartSec=3

[Install]
WantedBy=multi-user.target
```

### Comandos de Gestión

```bash
# Recargar configuración de systemd
sudo systemctl daemon-reload

# Habilitar inicio automático
sudo systemctl enable proximidad_app1.service
sudo systemctl enable proximidad_app2.service
sudo systemctl enable nginx

# Iniciar servicios
sudo systemctl start proximidad_app1.service
sudo systemctl start proximidad_app2.service

# Ver estado
sudo systemctl status proximidad_app1.service
sudo systemctl status proximidad_app2.service

# Ver logs en tiempo real
sudo journalctl -u proximidad_app2.service -f

# Reiniciar todo
sudo systemctl restart proximidad_app1.service proximidad_app2.service nginx
```

---

## 🛠 Herramientas de Desarrollo y Mantenimiento

### WinSCP - Transferencia de Archivos

**WinSCP** fue fundamental para el desarrollo, permitiendo:
- 📁 Navegación visual del sistema de archivos remoto
- 🔄 Arrastrar y soltar archivos
- ✏️ Edición de archivos remotos con doble clic
- 🔃 Sincronización de directorios

**Configuración de conexión:**
```
Protocolo: SFTP
Host: 192.168.1.50
Puerto: 22
Usuario: proximidad
```

### SSH - Acceso por Terminal

```powershell
# Conectar desde Windows
ssh proximidad@192.168.1.50

# Ejecutar comando directo
ssh proximidad@192.168.1.50 "sudo systemctl status nginx"

# Copiar archivos con SCP
scp archivo.txt proximidad@192.168.1.50:/home/proximidad/
scp -r carpeta/ proximidad@192.168.1.50:/home/proximidad/
```

### Raspberry Pi Connect

**Raspberry Pi Connect** permite acceso remoto desde cualquier lugar sin configurar port forwarding para SSH. Útil para:
- 🔧 Mantenimiento remoto
- 🖥️ Acceso al escritorio gráfico
- 📱 Acceso desde dispositivos móviles

---

## 🖥️ Ejecutables de Escritorio para Administración

Para facilitar la administración del servidor, creamos scripts ejecutables en el escritorio de la Raspberry Pi.

### 1. Script de Inicio del Servidor

**`~/Desktop/start_server_v3.sh`**

```bash
#!/bin/bash

echo "🚀 Iniciando ProXimidad V3..."
echo "================================"

# Reiniciar servicios
echo "📦 Reiniciando App 1 (API Pública)..."
sudo systemctl restart proximidad_app1.service
sleep 2

echo "📦 Reiniciando App 2 (API Privada)..."
sudo systemctl restart proximidad_app2.service
sleep 2

echo "🌐 Reiniciando Nginx..."
sudo systemctl restart nginx
sleep 2

# Verificar estado
echo ""
echo "📊 Estado de los servicios:"
echo "================================"

echo ""
echo "🔹 App 1 (API Pública):"
sudo systemctl status proximidad_app1.service --no-pager -l | head -5

echo ""
echo "🔹 App 2 (API Privada):"
sudo systemctl status proximidad_app2.service --no-pager -l | head -5

echo ""
echo "🔹 Nginx:"
sudo systemctl status nginx --no-pager -l | head -5

echo ""
echo "================================"
echo "✅ ProXimidad V3 iniciado correctamente!"
echo ""
echo "🌐 IP Local: http://192.168.1.50"
echo "🌐 IP Pública: http://$(curl -s ifconfig.me)"
echo ""
echo "Presiona Enter para cerrar..."
read
```

### 2. Script de Verificación de Estado

**`~/Desktop/check_status.sh`**

```bash
#!/bin/bash

echo "📊 Estado de ProXimidad V3"
echo "================================"
echo ""

# Estado de servicios
echo "🔹 App 1 (Puerto 8000):"
sudo systemctl is-active proximidad_app1.service
ps aux | grep "gunicorn.*8000" | grep -v grep | head -1

echo ""
echo "🔹 App 2 (Puerto 8001):"
sudo systemctl is-active proximidad_app2.service
ps aux | grep "gunicorn.*8001" | grep -v grep | head -1

echo ""
echo "🔹 Nginx (Puerto 80):"
sudo systemctl is-active nginx
ps aux | grep nginx | grep -v grep | head -1

echo ""
echo "================================"
echo "🌐 Información de Red:"
echo "================================"
echo "IP Local: $(hostname -I | awk '{print $1}')"
echo "IP Pública: $(curl -s ifconfig.me)"

echo ""
echo "================================"
echo "💾 Uso de Recursos:"
echo "================================"
free -h | head -2
echo ""
df -h / | tail -1

echo ""
echo "Presiona Enter para cerrar..."
read
```

### 3. Script de Ver Logs

**`~/Desktop/view_logs.sh`**

```bash
#!/bin/bash

echo "📋 Logs de ProXimidad V3"
echo "================================"
echo ""
echo "Selecciona qué logs ver:"
echo "1) App 1 - Últimos 50 logs"
echo "2) App 2 - Últimos 50 logs"
echo "3) Nginx - Errores"
echo "4) App 1 - En tiempo real"
echo "5) App 2 - En tiempo real"
echo "6) Todos los servicios"
echo ""
read -p "Opción [1-6]: " opcion

case $opcion in
    1)
        echo "📄 App 1 - Últimos 50 logs:"
        sudo journalctl -u proximidad_app1.service -n 50 --no-pager
        ;;
    2)
        echo "📄 App 2 - Últimos 50 logs:"
        sudo journalctl -u proximidad_app2.service -n 50 --no-pager
        ;;
    3)
        echo "📄 Nginx - Errores:"
        sudo tail -50 /var/log/nginx/proximidad_error.log
        ;;
    4)
        echo "📄 App 1 - En tiempo real (Ctrl+C para salir):"
        sudo journalctl -u proximidad_app1.service -f
        ;;
    5)
        echo "📄 App 2 - En tiempo real (Ctrl+C para salir):"
        sudo journalctl -u proximidad_app2.service -f
        ;;
    6)
        echo "📄 Estado de todos los servicios:"
        sudo systemctl status proximidad_app1.service --no-pager
        echo ""
        sudo systemctl status proximidad_app2.service --no-pager
        echo ""
        sudo systemctl status nginx --no-pager
        ;;
    *)
        echo "❌ Opción inválida"
        ;;
esac

echo ""
echo "Presiona Enter para cerrar..."
read
```

### 4. Script de Reinicio Rápido

**`~/Desktop/quick_restart.sh`**

```bash
#!/bin/bash

echo "🔄 Reinicio Rápido de ProXimidad V3"
echo "================================"
echo ""
echo "¿Qué deseas reiniciar?"
echo "1) App 1 (API Pública)"
echo "2) App 2 (API Privada)"
echo "3) Nginx"
echo "4) Todo"
echo ""
read -p "Opción [1-4]: " opcion

case $opcion in
    1)
        echo "🔄 Reiniciando App 1..."
        sudo systemctl restart proximidad_app1.service
        echo "✅ App 1 reiniciada"
        ;;
    2)
        echo "🔄 Reiniciando App 2..."
        sudo systemctl restart proximidad_app2.service
        echo "✅ App 2 reiniciada"
        ;;
    3)
        echo "🔄 Reiniciando Nginx..."
        sudo systemctl restart nginx
        echo "✅ Nginx reiniciado"
        ;;
    4)
        echo "🔄 Reiniciando todos los servicios..."
        sudo systemctl restart proximidad_app1.service proximidad_app2.service nginx
        echo "✅ Todos los servicios reiniciados"
        ;;
    *)
        echo "❌ Opción inválida"
        ;;
esac

echo ""
echo "Presiona Enter para cerrar..."
read
```

### 5. Crear Archivos .desktop para Doble Clic

Para poder ejecutar estos scripts con doble clic desde el escritorio:

**`~/Desktop/Iniciar_ProXimidad.desktop`**

```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Iniciar ProXimidad V3
Comment=Inicia todos los servicios de ProXimidad
Exec=lxterminal -e /home/proximidad/Desktop/start_server_v3.sh
Icon=utilities-terminal
Terminal=true
Categories=System;
```

**`~/Desktop/Estado_ProXimidad.desktop`**

```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Estado del Servidor
Comment=Verifica el estado de ProXimidad V3
Exec=lxterminal -e /home/proximidad/Desktop/check_status.sh
Icon=utilities-system-monitor
Terminal=true
Categories=System;
```

**`~/Desktop/Ver_Logs.desktop`**

```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Ver Logs
Comment=Visualiza los logs del servidor
Exec=lxterminal -e /home/proximidad/Desktop/view_logs.sh
Icon=utilities-log-viewer
Terminal=true
Categories=System;
```

**`~/Desktop/Reinicio_Rapido.desktop`**

```ini
[Desktop Entry]
Version=1.0
Type=Application
Name=Reinicio Rápido
Comment=Reinicia servicios específicos
Exec=lxterminal -e /home/proximidad/Desktop/quick_restart.sh
Icon=system-restart
Terminal=true
Categories=System;
```

### Dar permisos de ejecución

```bash
# Scripts
chmod +x ~/Desktop/start_server_v3.sh
chmod +x ~/Desktop/check_status.sh
chmod +x ~/Desktop/view_logs.sh
chmod +x ~/Desktop/quick_restart.sh

# Archivos .desktop
chmod +x ~/Desktop/Iniciar_ProXimidad.desktop
chmod +x ~/Desktop/Estado_ProXimidad.desktop
chmod +x ~/Desktop/Ver_Logs.desktop
chmod +x ~/Desktop/Reinicio_Rapido.desktop
```

---

## 🔧 Troubleshooting y Lecciones Aprendidas

### Errores Comunes y Soluciones

#### 1. Bad Request en Solicitudes

**Síntoma:** Error 400 al crear solicitudes desde el frontend

**Causa:**
- Nombres de propiedades diferentes entre frontend y backend
- Usuario inactivo en la base de datos

**Solución:**
```python
# Backend: Agregar validación detallada con logs
logger.info(f"🔍 Recibiendo solicitud: {request.data}")

# Verificar usuario activo
if not usuario.activo:
    return Response({'error': 'Usuario inactivo'}, status=400)
```

```javascript
// Frontend: Usar nombres correctos
service.nombre_servicio  // ✅ Correcto
service.nombre           // ❌ Incorrecto
```

#### 2. Imágenes no cargan (404)

**Síntoma:** `GET /media/imagen.jpg 404 Not Found`

**Causa:** Permisos incorrectos o ruta mal configurada en Nginx

**Solución:**
```bash
# Verificar permisos
sudo chown -R www-data:www-data /home/proximidad/backend/media/
sudo chmod -R 755 /home/proximidad/backend/media/

# Verificar configuración Nginx
location /media/ {
    alias /home/proximidad/backend/media/;  # Nota el / al final
}
```

#### 3. Gunicorn no inicia

**Síntoma:** Servicio falla al iniciar

**Diagnóstico:**
```bash
sudo journalctl -u proximidad_app2.service -n 50 --no-pager
```

**Causas comunes:**
- Entorno virtual no encontrado
- Dependencias faltantes (mysqlclient)
- Error de sintaxis en código Python
- MariaDB no está corriendo

#### 4. Error de conexión a MariaDB

**Síntoma:** `django.db.utils.OperationalError: (2002, "Can't connect to MySQL server")`

**Solución:**
```bash
# Verificar que MariaDB esté corriendo
sudo systemctl status mariadb

# Probar conexión manual
mysql -u proximidad -p proximidad_db

# Verificar credenciales en .env
DB_PASSWORD=tu_contraseña_correcta
```

#### 5. Cambios no se reflejan

**Síntoma:** Después de actualizar código, sigue mostrando versión anterior

**Solución:**
```bash
# Frontend: Limpiar cache del navegador (Ctrl+Shift+R)

# Backend: Reiniciar Gunicorn
sudo systemctl restart proximidad_app1.service proximidad_app2.service

# Verificar que el archivo se actualizó
cat archivo.py | head -20
```

#### 6. Problemas de memoria en Raspberry Pi 3

**Síntoma:** Sistema se vuelve lento o servicios mueren

**Solución:**
- Reducir workers de Gunicorn a 2 (en lugar de 3)
- Monitorear uso de memoria:
```bash
free -h
htop
```

### Lecciones Aprendidas

1. **📝 Siempre usar logs detallados**
   - Los emojis en logs ayudan a identificar rápidamente el flujo
   - Loggear datos de entrada facilita el debugging

2. **🔄 Crear scripts de automatización**
   - Scripts de despliegue ahorran tiempo y evitan errores
   - Ejecutables de escritorio facilitan operaciones comunes

3. **💾 Hacer backups antes de actualizar**
   ```bash
   tar -czvf backup_$(date +%Y%m%d).tar.gz archivo_a_modificar
   ```

4. **🧪 Probar localmente antes de desplegar**
   - Compilar frontend y verificar que funcione
   - Revisar errores de sintaxis en Python

5. **📊 Monitorear logs en tiempo real**
   ```bash
   sudo journalctl -f -u proximidad_app2.service
   ```

6. **⚡ Optimizar para hardware limitado**
   - Raspberry Pi 3 tiene solo 1GB RAM
   - Usar menos workers, optimizar queries SQL
   - Considerar usar swap si es necesario

---

## 📋 Comandos Útiles

### Gestión de Servicios

```bash
# Ver estado de todos los servicios de ProXimidad
sudo systemctl status proximidad_app1.service proximidad_app2.service nginx

# Reiniciar todo
sudo systemctl restart proximidad_app1.service proximidad_app2.service nginx

# Ver logs en tiempo real
sudo journalctl -u proximidad_app2.service -f

# Ver últimos 100 logs
sudo journalctl -u proximidad_app2.service -n 100 --no-pager
```

### Gestión de Nginx

```bash
# Verificar configuración
sudo nginx -t

# Recargar configuración sin reiniciar
sudo nginx -s reload

# Ver logs
sudo tail -f /var/log/nginx/proximidad_error.log
```

### Base de Datos MariaDB

```bash
# Acceder a MariaDB
mysql -u proximidad -p proximidad_db

# Backup de base de datos
mysqldump -u proximidad -p proximidad_db > backup_$(date +%Y%m%d).sql

# Restaurar backup
mysql -u proximidad -p proximidad_db < backup.sql

# Ver tablas
mysql -u proximidad -p -e "SHOW TABLES;" proximidad_db
```

### Django Management

```bash
# Acceder a Django shell
cd ~/backend && source venv/bin/activate
python manage.py shell

# Crear migraciones
python manage.py makemigrations
python manage.py migrate

# Crear superusuario
python manage.py createsuperuser

# Recolectar archivos estáticos
python manage.py collectstatic --noinput
```

### Transferencia de Archivos

```powershell
# Desde Windows PowerShell

# Subir archivo
scp archivo.txt proximidad@192.168.1.50:/home/proximidad/

# Subir carpeta
scp -r carpeta/ proximidad@192.168.1.50:/home/proximidad/

# Descargar archivo
scp proximidad@192.168.1.50:/home/proximidad/archivo.txt .

# Comando todo-en-uno para actualizar frontend
scp dist.tar.gz proximidad@192.168.1.50:/tmp/ ; ssh proximidad@192.168.1.50 "sudo rm -rf /var/www/proximidad/frontend_build/* && sudo tar -xzf /tmp/dist.tar.gz -C /var/www/proximidad/frontend_build/ && sudo systemctl restart nginx"
```

### Monitoreo del Sistema

```bash
# Ver uso de recursos
htop

# Ver uso de disco
df -h

# Ver procesos de Gunicorn
ps aux | grep gunicorn

# Ver puertos en uso
sudo netstat -tulpn | grep LISTEN

# Ver IP pública actual
curl ifconfig.me

# Monitorear temperatura de la Raspberry Pi
vcgencmd measure_temp

# Ver uso de memoria
free -h
```

---

## ⚠️ ¿Por qué HTTP y no HTTPS?

### La Situación Actual

ProXimidad V3 actualmente funciona sobre **HTTP** (puerto 80) sin cifrado SSL/TLS. Esto significa que:
- ❌ Las comunicaciones no están cifradas
- ❌ Los navegadores muestran advertencia "No seguro"
- ❌ No cumple con estándares modernos de seguridad web

### Intentos de Implementar HTTPS con Let's Encrypt

Se intentó configurar HTTPS usando **Let's Encrypt** con Certbot, pero se enfrentaron múltiples obstáculos:

#### 1. Problema con Dominios Gratuitos de No-IP

Let's Encrypt tiene políticas estrictas sobre dominios:
- ❌ No emite certificados para subdominios de servicios DNS dinámicos gratuitos como `.ddns.net`
- ❌ Requiere un dominio de primer nivel propio (ej: `proximidad.com`)

```bash
# Error común al intentar con No-IP
Failed to verify domain ownership
Domain validation failed for proximidad.ddns.net
```

#### 2. Desafíos de Validación HTTP-01

Let's Encrypt usa varios métodos de validación:

**HTTP-01 Challenge:**
- Let's Encrypt intenta acceder a `http://tudominio/.well-known/acme-challenge/[token]`
- Problemas encontrados:
  - IP dinámica cambia frecuentemente
  - Latencia en actualización DNS
  - Firewall del ISP puede bloquear ciertos tipos de tráfico

#### 3. Limitaciones de Hardware

La Raspberry Pi 3 tiene recursos limitados:
- Renovación automática de certificados cada 90 días consume recursos
- El proceso de validación puede ser lento
- Certbot requiere dependencias adicionales

### Soluciones Alternativas Consideradas

#### Opción 1: Certificado Autofirmado
```bash
# Crear certificado autofirmado
sudo openssl req -x509 -nodes -days 365 -newkey rsa:2048 \
  -keyout /etc/ssl/private/proximidad.key \
  -out /etc/ssl/certs/proximidad.crt
```
**Problema:** Los navegadores muestran advertencia aún más grande que con HTTP simple.

#### Opción 2: Cloudflare Tunnel
- Usar Cloudflare como proxy inverso
- Cloudflare proporciona HTTPS automáticamente
- **Problema:** Requiere cambiar toda la arquitectura de red

#### Opción 3: Comprar Dominio Propio
- Comprar dominio (ej: `proximidad.com`) ~$12/año
- Usar con Let's Encrypt sin problemas
- **Limitación:** Costo adicional para proyecto educativo

### Mitigaciones de Seguridad Implementadas

Aunque no tenemos HTTPS, implementamos otras medidas:

1. **Tokens JWT con expiración corta**
   ```python
   SIMPLE_JWT = {
       'ACCESS_TOKEN_LIFETIME': timedelta(hours=1),
       'REFRESH_TOKEN_LIFETIME': timedelta(days=1),
   }
   ```

2. **CORS configurado estrictamente**
   ```python
   CORS_ALLOWED_ORIGINS = [
       "http://181.135.64.177",
       "http://192.168.1.50",
   ]
   ```

3. **Validación exhaustiva en el backend**
   - Sanitización de inputs
   - Protección contra SQL injection con ORM
   - Rate limiting en endpoints sensibles

4. **No almacenar datos extremadamente sensibles**
   - Sin datos de tarjetas de crédito
   - Contraseñas hasheadas con bcrypt
   - Información personal mínima

### Recomendaciones para Producción Real

Si este proyecto fuera a producción real, **HTTPS sería obligatorio**:

1. **Comprar dominio propio** (~$12/año)
2. **Usar Let's Encrypt** (gratuito) con dominio propio
3. **Configurar renovación automática:**
   ```bash
   sudo certbot --nginx -d proximidad.com -d www.proximidad.com
   sudo certbot renew --dry-run
   ```

4. **Configuración Nginx con HTTPS:**
   ```nginx
   server {
       listen 443 ssl http2;
       ssl_certificate /etc/letsencrypt/live/proximidad.com/fullchain.pem;
       ssl_certificate_key /etc/letsencrypt/live/proximidad.com/privkey.pem;
       
       ssl_protocols TLSv1.2 TLSv1.3;
       ssl_ciphers HIGH:!aNULL:!MD5;
       # ... resto de configuración
   }
   
   server {
       listen 80;
       return 301 https://$host$request_uri;
   }
   ```

### Conclusión sobre HTTPS

Para este proyecto **educativo y de aprendizaje**:
- ✅ HTTP es aceptable para entender conceptos
- ✅ Permite enfocarse en arquitectura y funcionalidad
- ⚠️ No usar para datos sensibles reales

Para un proyecto **en producción real**:
- ❌ HTTP nunca es aceptable
- ✅ HTTPS es obligatorio
- ✅ Invertir en dominio propio ($12/año) vale totalmente la pena

---

## 🎓 Conclusiones

### Lo que Aprendimos

Este proyecto de despliegue nos permitió aprender:

1. **Redes y Networking**
   - Funcionamiento de NAT y Port Forwarding
   - Diferencia entre IP pública y privada
   - DNS dinámico para IPs residenciales
   - Por qué HTTPS es importante pero complejo sin dominio propio

2. **Servidores Web**
   - Nginx como reverse proxy
   - Configuración de virtual hosts
   - Manejo de archivos estáticos vs dinámicos
   - Limitaciones de HTTP vs HTTPS

3. **Bases de Datos**
   - MariaDB vs PostgreSQL (decidimos MariaDB por menor consumo de memoria)
   - Optimización de queries para hardware limitado
   - Backup y restauración de datos

4. **Aplicaciones Python en Producción**
   - Diferencia entre servidor de desarrollo y producción
   - Gunicorn como servidor WSGI
   - Gestión de workers según recursos disponibles (2 workers para 1GB RAM)

5. **Administración de Sistemas**
   - Systemd para gestión de servicios
   - Logs y troubleshooting
   - Automatización con scripts y ejecutables de escritorio

6. **DevOps y CI/CD Manual**
   - Flujo de desarrollo → compilación → despliegue
   - Transferencia segura de archivos con SCP
   - Versionamiento y backups

7. **Optimización para Hardware Limitado**
   - Raspberry Pi 3 con 1GB RAM requiere optimizaciones
   - Reducir workers, optimizar queries, monitorear recursos
   - Balance entre funcionalidad y rendimiento

### Mejoras Futuras

- [ ] **Implementar HTTPS** comprando dominio propio + Let's Encrypt
- [ ] **Migrar a Raspberry Pi 4** (más RAM, mejor rendimiento)
- [ ] **Configurar CI/CD** con GitHub Actions
- [ ] **Agregar monitoreo** con Prometheus/Grafana
- [ ] **Implementar backups automáticos** con cron
- [ ] **Configurar fail2ban** para seguridad adicional
- [ ] **Agregar Redis** para caching y mejorar rendimiento
- [ ] **Implementar rate limiting** más robusto
- [ ] **Crear sistema de notificaciones** por email

### Métricas del Proyecto

| Métrica | Valor |
|---------|-------|
| **Tiempo de desarrollo** | ~3 meses |
| **Costo total** | $0 (usando hardware existente) |
| **Uptime** | ~98% (limitado por cortes de luz) |
| **Usuarios concurrentes** | Hasta 10 (limitado por hardware) |
| **Tiempo de respuesta API** | <500ms promedio |
| **Almacenamiento usado** | ~2GB de 16GB disponibles |

### Recursos Adicionales

- [Documentación de Nginx](https://nginx.org/en/docs/)
- [Documentación de Gunicorn](https://docs.gunicorn.org/)
- [Django Deployment Checklist](https://docs.djangoproject.com/en/4.2/howto/deployment/checklist/)
- [Raspberry Pi Documentation](https://www.raspberrypi.com/documentation/)
- [MariaDB Documentation](https://mariadb.org/documentation/)
- [Let's Encrypt](https://letsencrypt.org/)

### Palabras Finales

Este proyecto demuestra que es posible crear y desplegar aplicaciones web profesionales desde casa, sin gastar en servicios cloud costosos. Aunque tiene limitaciones (hardware, falta de HTTPS, dependencia de electricidad e internet), es una excelente forma de aprender sobre:

- Arquitectura de aplicaciones web
- Administración de servidores Linux
- Redes y protocolos
- Optimización de recursos
- Troubleshooting y resolución de problemas