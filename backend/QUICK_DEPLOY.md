# 🚀 Guía Rápida - Transferencia con SCP y Deploy

## 📦 Paso 1: Transferir archivos desde Windows a Raspberry Pi

### Desde PowerShell en Windows:
```powershell
# Navega al directorio del backend
cd "C:\Users\Angel David Palacios\Documents\GitHub\ProXimidad\ProXimidad\proximidad-v2"

# Transferir todo el backend (ajusta la IP y usuario de tu Raspberry)
scp -r backend pi@192.168.1.100:/home/pi/proximidad-v2/

# O si prefieres comprimir primero (más rápido):
tar -czf backend.tar.gz backend
scp backend.tar.gz pi@192.168.1.100:/home/pi/
```

### En la Raspberry Pi (si usaste tar):
```bash
cd /home/pi
tar -xzf backend.tar.gz
mv backend proximidad-v2/backend
cd proximidad-v2/backend
```

---

## ⚡ Paso 2: Setup Rápido en Raspberry Pi

### 1. Instalar dependencias del sistema (una sola vez):
```bash
sudo apt update && sudo apt upgrade -y
sudo apt install python3 python3-pip python3-venv mariadb-server nginx git -y
sudo apt install libmariadb-dev libmariadb-dev-compat -y
```

### 2. Configurar MySQL:
```bash
# Iniciar MySQL
sudo systemctl start mariadb
sudo systemctl enable mariadb

# Crear base de datos (sin password en root)
sudo mysql -u root <<EOF
CREATE DATABASE proxima CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
FLUSH PRIVILEGES;
EXIT;
EOF
```

### 3. Setup del proyecto:
```bash
cd /home/pi/proximidad-v2/backend

# Crear entorno virtual
python3 -m venv venv
source venv/bin/activate

# Instalar dependencias
pip install --upgrade pip
pip install -r requirements.txt

# Configurar .env (copiar y editar)
cp .env.production .env
nano .env  # Ajusta ALLOWED_HOSTS con tu IP
```

### 4. Configurar permisos y directorios:
```bash
# Hacer ejecutables los scripts
chmod +x setup_media_permissions.sh verify_setup.sh start_gunicorn.sh

# Configurar permisos de media
./setup_media_permissions.sh
```

### 5. Inicializar Django:
```bash
source venv/bin/activate

# Migrar base de datos
python manage.py migrate

# Recolectar archivos estáticos
python manage.py collectstatic --noinput

# Crear superusuario (opcional)
python manage.py createsuperuser
```

### 6. Probar Gunicorn manualmente:
```bash
# Probar que funciona (Ctrl+C para detener)
gunicorn core.wsgi:application --config gunicorn_config.py --bind 0.0.0.0:8000
```

Abre `http://IP_RASPBERRY:8000/admin/` en tu navegador para verificar.

---

## 🔧 Paso 3: Configurar Servicios

### 1. Instalar servicio Gunicorn:
```bash
cd /home/pi/proximidad-v2/backend

# Editar rutas en proximidad.service (si es necesario)
nano proximidad.service

# Copiar e iniciar servicio
sudo cp proximidad.service /etc/systemd/system/
sudo systemctl daemon-reload
sudo systemctl enable proximidad.service
sudo systemctl start proximidad.service

# Verificar estado
sudo systemctl status proximidad.service
```

### 2. Configurar Nginx:
```bash
cd /home/pi/proximidad-v2/backend

# Editar configuración (ajusta IP/dominio y rutas)
nano nginx_config.conf

# Copiar configuración
sudo cp nginx_config.conf /etc/nginx/sites-available/proximidad
sudo ln -s /etc/nginx/sites-available/proximidad /etc/nginx/sites-enabled/

# Opcional: Eliminar sitio por defecto
sudo rm /etc/nginx/sites-enabled/default

# Verificar y reiniciar
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl enable nginx
```

---

## 🧪 Paso 4: Verificar Todo

```bash
cd /home/pi/proximidad-v2/backend

# Ejecutar script de verificación
./verify_setup.sh

# Ver logs si hay problemas
sudo journalctl -u proximidad.service -f
sudo tail -f /var/log/nginx/proximidad_error.log
```

### Probar desde el navegador:
- Backend Admin: `http://192.168.1.100/admin/`
- API: `http://192.168.1.100/api/`
- Media: `http://192.168.1.100/media/`

---

## 📸 Probar Subida de Imágenes

1. Accede al admin: `http://IP_RASPBERRY/admin/`
2. Crea un servicio con imagen
3. Verifica que se guardó en: `/home/pi/proximidad-v2/backend/media/servicios/imagenes/`
4. Accede a la imagen desde: `http://IP_RASPBERRY/media/servicios/imagenes/nombre-imagen.jpg`

---

## 🔄 Actualizar Backend (Después de cambios)

```bash
# 1. Transferir cambios desde Windows
scp -r backend pi@192.168.1.100:/home/pi/proximidad-v2/

# 2. En Raspberry Pi
cd /home/pi/proximidad-v2/backend
source venv/bin/activate

# 3. Actualizar
pip install -r requirements.txt  # Si hay nuevas dependencias
python manage.py migrate
python manage.py collectstatic --noinput

# 4. Reiniciar
sudo systemctl restart proximidad.service

# 5. Verificar
sudo systemctl status proximidad.service
```

---

## 📋 Configuración Importante en `.env`

```bash
# Edita estos valores en .env:
nano .env
```

```env
# CRÍTICO: Ajusta estos valores
SECRET_KEY=genera-una-clave-nueva-aqui
DEBUG=False  # True solo para desarrollo
ALLOWED_HOSTS=192.168.1.100,localhost,tudominio.com

# Base de datos (root sin password)
DATABASE_NAME=proxima
DATABASE_USER=root
DATABASE_PASSWORD=
DATABASE_HOST=localhost
```

---

## ⚠️ Solución Rápida de Problemas

### Gunicorn no inicia:
```bash
sudo journalctl -u proximidad.service -xe
cd /home/pi/proximidad-v2/backend
source venv/bin/activate
gunicorn core.wsgi:application --bind 0.0.0.0:8000
```

### Imágenes no se suben:
```bash
./setup_media_permissions.sh
sudo systemctl restart proximidad.service
```

### 502 Bad Gateway:
```bash
sudo systemctl status proximidad.service
sudo netstat -tulpn | grep :8000
sudo systemctl restart proximidad.service nginx
```

### Base de datos no conecta:
```bash
mysql -u root proxima  # Sin password
# Verifica .env
cat .env | grep DATABASE
```

---

## 🎯 Checklist Rápido

- [ ] Backend transferido con SCP
- [ ] Dependencias del sistema instaladas
- [ ] MySQL creado (base de datos `proxima`)
- [ ] Entorno virtual creado
- [ ] Dependencias Python instaladas
- [ ] `.env` configurado
- [ ] Permisos de media configurados
- [ ] Migraciones ejecutadas
- [ ] Estáticos recolectados
- [ ] Gunicorn funciona manualmente
- [ ] Servicio systemd instalado y activo
- [ ] Nginx configurado y corriendo
- [ ] Backend accesible desde navegador
- [ ] Imágenes se suben y se ven correctamente

---

## 📞 Comandos Útiles

```bash
# Ver logs en tiempo real
sudo journalctl -u proximidad.service -f

# Reiniciar servicios
sudo systemctl restart proximidad.service
sudo systemctl restart nginx

# Ver estado
sudo systemctl status proximidad.service nginx mariadb

# Ver puertos abiertos
sudo netstat -tulpn | grep -E ':(80|8000)'

# Verificar permisos
ls -la media/
```

---

¡Listo! 🎉 Tu backend estará funcionando con Gunicorn + Nginx en tu Raspberry Pi con soporte completo para subida de imágenes.
